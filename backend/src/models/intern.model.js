import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'

const internSchema = new Schema(
  {
    internId : {
      type  : String,
      required : true,
      unique : true
    },
    name : {
      type : String,
      required: true
    },
     email : {
        type : String,
        required: true,
        unique : true,
        lowercase : true,
         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email format is incorrect. Use a valid format such as name@example.com (e.g., jane.smith@gmail.com) .']
      },
      domain : {
        type : String,
        required : true,
      },
      role : {
        type : String,
        default : "intern"
      },
      joiningDate : {
          type : Date,
          default :  Date.now(),
      },
      isActive : {
        type : Boolean,
        default : true
      },
      isEmailVerified: {
          type : Boolean,
          default : false
      },
      refreshToken : {
        type : String,
        default : "",
      }
  },{ timestamps : true }
)


internSchema.methods.generateAccessToken = function () {
  const payload = {
      _id : this._id,
      name : this.name,
      email : this.email
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "15m"
  })
}


internSchema.methods.generateRefreshToken = function () {
  const payload = {
      _id : this._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY || "15m"
  })
}


const Intern = model("Intern", internSchema)
export default Intern
