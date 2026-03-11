import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'

const verifyJWT = asyncHandler(async(req,_,next)=>{

      try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")


        if(!token) {
          throw new ApiError(400, "unAuthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

      if(!user) {
        throw new ApiError(400, "Invalid access token")
      }


      req.user = user
        next()

      } catch (error) {
          throw new ApiError(400,  error.message ||"token is used or expired")
      }
})


export default verifyJWT
