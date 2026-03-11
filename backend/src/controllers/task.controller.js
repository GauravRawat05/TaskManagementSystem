import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Task from '../models/task.model.js';
import ApiError from '../utils/ApiError.js';
import Project from '../models/project.model.js';
import Intern from '../models/intern.model.js';
import Team from '../models/team.model.js';


const createNewTask = asyncHandler(async(req,res)=>{

    const { projectId, teamId, memberId, date, description, status, remark } = req.body


    if([projectId, teamId, memberId, date, description, status, remark].some((field)=>  String(field).trim() === "")) {
      throw new ApiError(400, "All fields required")
    }

        const project = await Project.findById(projectId).select("_id")
        const intern = await Intern.findById(memberId).select("_id")
        const team = await Team.findById(teamId).select("_id")


     await Task.create({
          teamId: team._id,
          projectId : project._id,
          memberId : intern._id,
          date,
          remark,
          status,
          description
     })

    return res.status(200).json(new ApiResponse(200, {}, "Create New Task Successfully"))
})

const getAllTask = asyncHandler(async(req,res)=>{

        const allTask = await Task.find()
          .populate("projectId", "projectName description startDate deadline")
          .populate("memberId", "name email role domain")
          .populate({
            path: "teamId",
            select: "name email role",
            populate: {
              path: "team",
              select: "name email role domain"
            }
          })
          .lean();

  return res.status(200).json(new ApiResponse(200 ,   allTask, "fetch all task Successfully"))
})



export {
  createNewTask,
  getAllTask
}
