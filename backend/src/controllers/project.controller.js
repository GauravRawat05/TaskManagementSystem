import Project from '../models/project.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';


// create a project
const createProject = asyncHandler(async(req,res)=>{

    const { projectName, description, startDate, deadline } = req.body

    const user = req.user


    console.log("user", user);

    if(!user) {
      throw new ApiError(400, "unAuthorized requirest")
    }


      await Project.create({
        projectName,
        description,
        startDate : new Date(startDate),
        deadline : new Date(deadline),
        createdBy : req.user._id
    })

  return res.status(200).json(new ApiResponse(200, {}, "project create successfully"))
})

// get all project
const getAllProject = asyncHandler(async(req,res)=>{

      const allProject = await Project.find().populate("createdBy", "name email role").lean()

      return res.status(200).json(new ApiResponse(200,  allProject, "project fetch successfully"))
})

// update project deadline
const updateDeadline = asyncHandler(async(req,res)=>{

  const { projectId } = req.params

  const { newDeadline } = req.body

    const [day, month, year] = newDeadline.split("-")
    const postpondDate = new Date(year, month - 1, day)

      if(isNaN(postpondDate)) {
          throw new ApiError(400, "Invalid date formate")
    }

  await Project.findByIdAndUpdate(projectId, {
      $set : {
            deadline : postpondDate
      }
  },{ new : true })



  return res.status(200).json(new ApiResponse(200, {} , "project deadline postpond successfully"))
})





// =============================================================================

// // delete single project
// const deleteSingleProject = asyncHandler(async(req,res)=>{

//    const  { projectId } =  req.params

//    await Project.findByIdAndDelete(projectId)

//       return res.status(200).json(new ApiResponse(200, {}, "project delete successfully"))
// })

// // delete multiple project
// const deleteMultipleProject = asyncHandler(async(req,res)=>{

  //     const  { projectIds } =  req.body

  //     for(const projectId of projectIds) {
    //         await Project.findByIdAndDelete(projectId)
    //     }

    //    return res.status(200).json(new ApiResponse(200, {}, "project delete successfully"))
// })

// =============================================================================




export {
  createProject,
  getAllProject,
  updateDeadline
};
