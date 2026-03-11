import jwt from 'jsonwebtoken';
import ApiError from "../utils/ApiError.js"
import Intern from "../models/intern.model.js"


const verifyJWTInter = async(req,_,next) => {

      try {
          const token =  req?.cookies?.accessToken

          if(!token) {
            throw new ApiError(400, "token not found")
          }

          console.log("token",process.env
            .ACCESS_TOKEN_SECRET);

          const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

          if(!decodedToken) {
            throw new ApiError(400, "Please check token first")
          }

          console.log("decodedToken :" ,decodedToken);


          const intern = await Intern.findById(decodedToken?._id)

          if(!intern) {
            throw new ApiError(400, "Token used or invalid")
          }

          req.intern = intern
          next()

      } catch (error) {
          throw new ApiError(400, error.message || "Token invalid or used")
      }
}


export default verifyJWTInter;
