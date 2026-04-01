import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import Workspace from '../models/workspace.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// create a project
const createProject = asyncHandler(async (req, res) => {
    const { workspaceId, projectName, description, startDate, deadline } = req.body;
    const user = req.user;

    if (!workspaceId || !projectName || !startDate || !deadline) {
        throw new ApiError(400, "workspaceId, projectName, startDate, and deadline are required");
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Verify Authorization: Must be SUPERUSER or a MANAGER/ADMIN in that workspace
    let isAuthorized = user.isSuperuser;
    if (!isAuthorized) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === user._id.toString()
        );
        if (memberRecord && (memberRecord.role === "MANAGER" || memberRecord.role === "ADMIN")) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to create a project in this workspace");
    }




    const newProject = await Project.create({
        workspaceId,
        projectName,
        description,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        createdBy: req.user,
    });



    return res.status(201).json(new ApiResponse(201, newProject, "Project created successfully"));
});

const getAllProjectsByWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const isWorkspaceAdmin =
    workspace.createdBy.toString() === userId.toString();

  const isWorkspaceManager = workspace.members?.some(
    (member) =>
      member.user.toString() === userId.toString() &&
      member.role === "MANAGER"
  );

  const isWorkspaceMember = workspace.members?.some(
    (member) =>
      member.user.toString() === userId.toString() &&
      member.role === "MEMBER"
  );

  const isWorkspaceManegar = workspace.members?.some(
    (member) =>
      member.user.toString() === userId.toString() &&
      member.role === "ADMIN"
  );


  const isPrivileged =
    req.user.isSuperuser || isWorkspaceAdmin || isWorkspaceManager || isWorkspaceManegar;

  const isAnyMember = workspace.members?.some((member) => member.user.toString() === userId.toString());
  if (!isPrivileged && !isAnyMember) {
    throw new ApiError(403, "You are not authorized to access this workspace");
  }

  let projects;

  if (isPrivileged) {
    projects = await Project.find({ workspaceId })
      .populate("createdBy", "name email _id");
  } else {
    const teams = await Team.find({
      workspaceId,
      $or: [
        { team: { $in: [userId] } },
        { teamLeader: userId }
      ]
    }).select("projectId");

    const projectIds = teams.map((t) => t.projectId);

    projects = await Project.find({
      _id: { $in: projectIds },
      workspaceId
    }).populate("createdBy", "name email _id");
  }

  return res.status(200).json(
    new ApiResponse(200, projects, "Projects fetched successfully")
  );
});

// get project using req.user
// const getProjectUsingUser = asyncHandler(async(req,res)=>{

// //
//   return res.status(200).json(new ApiResponse(200, projects, "projects fetch successfully"))
// })


// update project deadline
const updateDeadline = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { newDeadline } = req.body;

    const [day, month, year] = newDeadline.split("-");
    const postponedDate = new Date(year, month - 1, day);

    if (isNaN(postponedDate)) {
        throw new ApiError(400, "Invalid date format");
    }

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const workspace = await Workspace.findById(project.workspaceId);
    let isAuthorized = req.user.isSuperuser;
    if (!isAuthorized && workspace) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === req.user._id.toString()
        );
        if (memberRecord && (memberRecord.role === "MANAGER" || memberRecord.role === "ADMIN")) {
            isAuthorized = true;
        }
    }
    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to modify this project's deadline");
    }

    project.deadline = postponedDate;
    await project.save();

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(new ApiResponse(200, project, "Project deadline postponed successfully"));
});

// update full project
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { projectName, description, startDate, deadline } = req.body;

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const workspace = await Workspace.findById(project.workspaceId);
    let isAuthorized = req.user.isSuperuser;
    if (!isAuthorized && workspace) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === req.user._id.toString()
        );
        if (memberRecord && (memberRecord.role === "MANAGER" || memberRecord.role === "ADMIN")) {
            isAuthorized = true;
        }
    }
    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to modify this project");
    }

    project.projectName = projectName;
    project.description = description;
    if (startDate) project.startDate = new Date(startDate);
    if (deadline) project.deadline = new Date(deadline);
    await project.save();

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});


// delete project
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const workspace = await Workspace.findById(project.workspaceId);
    let isAuthorized = req.user.isSuperuser;
    if (!isAuthorized && workspace) {
        const memberRecord = workspace.members.find(
            m => m.user.toString() === req.user._id.toString()
        );
        if (memberRecord && (memberRecord.role === "MANAGER" || memberRecord.role === "ADMIN")) {
            isAuthorized = true;
        }
    }
    if (!isAuthorized) {
        throw new ApiError(403, "Not authorized to delete this project");
    }

    // Delete associated teams
    await Team.deleteMany({ projectId: project._id });
    
    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json(new ApiResponse(200, {}, "Project and its teams deleted successfully"));
});


export {
  createProject,
  getAllProjectsByWorkspace,
  updateDeadline,
  updateProject,
  deleteProject
};
