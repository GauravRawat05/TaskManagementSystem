import { model, Schema } from "mongoose"

const projectSchema = new Schema(
  {
      projectName : {
        type : String,
        required : true
      },
      description : {
        type : String
      },
      startDate : {
        type : Date,
        required : true
      },
      deadline : {
        type : Date,
        required : true
      },
      createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
      },
      status : {
        type : String,
        default : "pending"
      }

  },{timestamps : true}
)

const Project = model("Project", projectSchema)
export default Project
