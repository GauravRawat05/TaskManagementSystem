import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { model, Schema } from "mongoose"

const userSchema = new Schema(
  {
      name : {
        type : String,
        required : true
      },
      email : {
        type : String,
        required: true,
        unique : true,
        lowercase : true,
         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email format is incorrect. Use a valid format such as name@example.com (e.g., jane.smith@gmail.com) .']
      },
      password : {
        type : String,
        required: true
      },
      phone : {
        type : String,
        default : ""
      },
       isEmailVerified: {
          type : Boolean,
          default : false
      },
      refreshToken : {
        type : String
      },
      role : {
          type : String,
          required : true
      }
  },
  { timestamps : true }
)



userSchema.pre("save" , async function() {
    if(!this.isModified("password")) return;
    this.password = await hash( this.password, 10)
})


userSchema.methods.isPasswordCorrect = function (password) {
    return compare(password, this.password)
}


userSchema.methods.generateAccessToken = function () {
  const payload = {
      _id : this._id,
      name : this.name,
      email : this.email,
      role : this.role
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "15m"
  })
}



userSchema.methods.generateRefreshToken = function () {
  const payload = {
      _id : this._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY || "15m"
  })
}

const User = model("User", userSchema)

export default User;
