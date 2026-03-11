import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// options of login/logout security and http
 const options = {
    httpOnly : true,
    secure : true
 }


//  generate Access token And RefreshToken
 const generateAccessAndRefreshToken = async(userId) => {
      const user = await  User.findById(userId)

      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()

      user.refreshToken = refreshToken


      user.save({validateBeforeSave : false})

      return {
        accessToken,
        refreshToken
      }
}


//  Signup User
const registerUser = asyncHandler(async(req,res)=>{

    const { name, email, password, role, phone } = req.body;

      const emailAleadyExist = await User.findOne({
          email
      })

      if(emailAleadyExist) {
        throw new ApiError(400, "User alreay exist with their email")
      }

    if([name,email,password,role,phone].some((item)=> item.trim() === "")) {
      throw new ApiError(400, "All fields are required")
    }

        const register = await User.create(
            {
                  name : name,
                  email : email,
                  password : password,
                  role : role || "manager",
                  phone : phone
            }
        )

  return res.status(200).json(new ApiResponse(200, {}, `${register.role} register successfully`))
})


//  SingIn User
const userLoggedIn = asyncHandler(async(req,res)=>{

      const {name, email, password } = req.body


      if([email,password].some(item => item.trim() === "")) {
        throw new ApiError(400, "both fields required")
      }

     const user = await User.findOne({ email });


      if(!user) {
         throw new ApiError(400, "user not found")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)


      if(!isPasswordValid) {
        throw new ApiError(400, "Credentials failed")
      }


      const {
         accessToken,
         refreshToken
        } = await generateAccessAndRefreshToken(user._id)


        const loginUser = await User.findById(user._id).select("-password  -refreshToken");

      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, loginUser, "user logged successfully"))
})


//  Singout User
const userLoggedOut = asyncHandler(async(req,res)=>{

       await User.findByIdAndUpdate(req.user._id,{
          $set : {
            refreshTokne : ""
          },
      },{ new : true })


  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "user logged out successfully"))
})


//  Fetch User
const userFetch = asyncHandler(async(req,res)=>{
      return res.status(200).json(new ApiResponse(200, req.user, "user fetch successfully"))
})


export {
  registerUser, userFetch, userLoggedIn, userLoggedOut
}
