import path from 'path';
import Intern from '../models/intern.model.js';
import Team from '../models/team.model.js';
import parseFileToJson from '../parser/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const options = {
    httpOnly : true,
    secure : true
}

// generate access and refresh tokens
const generateAccessRefreshToken = async(internId) =>{

  const intern = await Intern.findById(internId)

  const refreshToken = await intern.generateRefreshToken()
  const accessToken = await intern.generateAccessToken()

  console.log("accessToken",accessToken);
  console.log("refreshToken",refreshToken);


  intern.refreshToken = refreshToken

  intern.save({validateBeforeSave : true})

  return {
      accessToken,
      refreshToken
  }
}

//  bulk add interns
const addBulkIntern = asyncHandler(async(req,res)=>{

  const file =  req.files?.bulkIntern[0]

  if(!file) {
    throw new ApiError(400, "file is required to upload")
  }

  console.log("path.extname(file.originalName)", path.extname(file.originalname));
  const extension = path.extname(file.originalname)


   const data = await parseFileToJson(extension, file.path)

   const internAlreadyExistOnServer = []
   const newInternsFromClient = []
   const notValidData = []

      const allInternsId = data.map(i => i.intern_id)
      const existedInterns = await Intern.find({internId : {$in : allInternsId}}).select('internId')
      const existedInternsIdSet = new Set(existedInterns.map(i => i.internId.toString()))

      for(const newIntern of data) {

          const  {
            intern_id  = "",
            name  =  "",
            email = "",
            joinDate = "",
            domain = "",
            role = ""
          } = newIntern


          const emptyFiled = [intern_id,name,email,joinDate,domain,role].filter(field => String(field).trim() === "" ||  field === undefined || field === null)

          if(emptyFiled.length > 0) {
            notValidData.push({Intern : newIntern, missingFiled : emptyFiled})
            continue;
          }

          if(existedInternsIdSet.has(intern_id)){
            internAlreadyExistOnServer.push(newIntern)
            continue;
          }



          const [year, month, day] = joinDate.split("-")
         const dateOfJoining =  new Date(year, month-1, day)

            newInternsFromClient.push({
              internId : intern_id,
              name,
              email,
              joiningDate : dateOfJoining,
              domain,
              role
            })

      }



     let insertedInterns = [];

      try {

        insertedInterns = await Intern.insertMany(newInternsFromClient, { ordered:false })

        console.log("Inserted interns:", insertedInterns.length)

      } catch(err){

        console.log("Insert error:", err)

      }



  return res.status(200).json(new ApiResponse(200, {
    newInternsFromClient,
    internAlreadyExistOnServer,
    insertedInterns
  } ,"add bulk interns successfully"))
})

//  get all interns
const getAllInterns = asyncHandler(async(req,res)=>{

  const interns = await Intern.find().select("-refreshToken").lean()

  return res.status(200).json(new ApiResponse(200, interns, "interns fetch successfully"))
})

// availableIntern for creating new Team without teamLeader
const availableIntern = asyncHandler(async(req,res)=>{

      const teams = await Team.find();

      const allIds = teams.flatMap(t => t.team);
      const teamLeader = teams.map(t => t.teamLeader._id);

       const usedIds = [...allIds, ...teamLeader];

        const freeInterns = await Intern.aggregate([
          {
            $match: {
              _id: { $nin: usedIds }
            }
          }
        ]);

          return res.status(200).json(new ApiResponse(200, freeInterns, "free interns from all intern"))
})

//intern login
const internLogin = asyncHandler(async(req,res)=>{

    const { internId } = req.body

    if(String(internId).trim() === "") {
      throw new ApiError(400, "Intern Id required")
    }

    const internLogin = await Intern.findOne({ internId : internId })

    if(!internLogin) {
      throw new ApiError(400, "Intern not exist")
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(internLogin._id)

    const intern = await Intern.findById(internLogin._id).select("-refreshToken")

    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken" , refreshToken ,options)
    .json(new ApiResponse(200 , {}, `${intern.role} login Successfully`))
})

// intern logout
const internLogout = asyncHandler(async(req,res)=>{

    await Intern.findByIdAndUpdate(req.intern._id, {
        $set : {
          refreshToken : ""
        }
    }, { save : true })

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "intern logout successfully"))
})




export {
  addBulkIntern,
  availableIntern,
  getAllInterns,
  internLogin,
  internLogout
};
