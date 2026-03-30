import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Task from '../models/task.model.js';
import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import Workspace from '../models/workspace.model.js';
import { checkWorkspaceRole } from '../utils/checkWorkspaceRole.js';

// Helper: get user's workspace role
const getWorkspaceRole = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return null;
  const member = workspace.members.find(m => m.user.toString() === userId.toString());
  return member ? member.role : null;
};

// Team Leader (or Admin/Manager) creates/assigns a task to a team member
const createNewTask = asyncHandler(async (req, res) => {
  const { title, projectId, teamId, assignedTo, dueDate, description, remark } = req.body;
  const user = req.user;

  if (!title || !projectId || !teamId || !assignedTo || !dueDate) {
    throw new ApiError(400, 'title, projectId, teamId, assignedTo, dueDate are required');
  }

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, 'Team not found');

  // Authorization: Admin/Manager OR Team Leader of this specific team
  let isAuthorized = false;
  try {
    isAuthorized = await checkWorkspaceRole(req, project.workspaceId);
  } catch (e) {}

  if (!isAuthorized) {
    // Must be the team leader AND member must be in their team
    const isLeaderOfTeam = String(team.teamLeader) === String(user._id);
    const isTeamMember = team.team.some(id => String(id) === String(assignedTo));
    if (isLeaderOfTeam && isTeamMember) isAuthorized = true;
  }

  if (!isAuthorized) {
    throw new ApiError(403, 'Only the Team Leader of this team (or Admin/Manager) can assign tasks');
  }

  const task = await Task.create({
    title: title.trim(),
    projectId: project._id,
    teamId: team._id,
    assignedTo,
    assignedBy: user._id,
    dueDate: new Date(dueDate),
    description: description || '',
    remark: remark || '',
    status: 'todo'
  });

  return res.status(201).json(new ApiResponse(201, task, 'Task created successfully'));
});

// Get tasks — scoped by role
const getAllTask = asyncHandler(async (req, res) => {
  const { projectId, teamId, status, assignedTo } = req.query;
  const user = req.user;

  let query = {};
  if (projectId) query.projectId = projectId;
  if (teamId) query.teamId = teamId;
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;

  // If no workspace-level role, scope to tasks assigned to or by the user
  const workspaceId = req.header('x-workspace-id') || req.body?.workspaceId;
  if (workspaceId) {
    const role = await getWorkspaceRole(workspaceId, user._id);
    if (role === 'MEMBER') {
      // Members only see tasks assigned to them
      query.assignedTo = user._id;
    } else if (role === 'TEAM_LEADER') {
      // Team leaders see tasks for teams they lead
      const ledTeams = await Team.find({ teamLeader: user._id }).select('_id');
      const ledTeamIds = ledTeams.map(t => t._id);
      if (!teamId) query.teamId = { $in: ledTeamIds };
    }
    // ADMIN/MANAGER see all (no extra filter)
  }

  const tasks = await Task.find(query)
    .populate('projectId', 'projectName description startDate deadline')
    .populate('teamId', 'teamName')
    .populate('assignedTo', 'name email avatar')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched successfully'));
});

// Team Member updates their task status. Team Leader/Admin/Manager can update anything.
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, remark, dueDate } = req.body;
  const user = req.user;

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  let isAdminOrManager = false;
  try {
    isAdminOrManager = await checkWorkspaceRole(req, project.workspaceId);
  } catch (e) {}

  const isAssignedMember = String(task.assignedTo) === String(user._id);
  const team = await Team.findById(task.teamId);
  const isTeamLeader = team && String(team.teamLeader) === String(user._id);

  if (!isAdminOrManager && !isAssignedMember && !isTeamLeader) {
    throw new ApiError(403, 'Not authorized to update this task');
  }

  // Members can only update status
  if (isAssignedMember && !isAdminOrManager && !isTeamLeader) {
    if (status) task.status = status;
  } else {
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (remark !== undefined) task.remark = remark;
    if (dueDate) task.dueDate = new Date(dueDate);
  }

  await task.save();
  return res.status(200).json(new ApiResponse(200, task, 'Task updated successfully'));
});

// Delete task — Admin/Manager or Team Leader of that team
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  const project = await Project.findById(task.projectId);
  let isAuthorized = false;
  try {
    isAuthorized = await checkWorkspaceRole(req, project.workspaceId);
  } catch (e) {}

  if (!isAuthorized) {
    const team = await Team.findById(task.teamId);
    if (team && String(team.teamLeader) === String(user._id)) isAuthorized = true;
  }

  if (!isAuthorized) throw new ApiError(403, 'Not authorized to delete this task');

  await Task.findByIdAndDelete(taskId);
  return res.status(200).json(new ApiResponse(200, {}, 'Task deleted successfully'));
});

export { createNewTask, getAllTask, updateTask, deleteTask };





