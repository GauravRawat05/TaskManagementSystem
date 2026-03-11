import { model, Schema } from "mongoose";


const taskSchema = new Schema(
  {
    projectId : {
      type : Schema.Types.ObjectId,
      ref : "Project"
    },
    teamId : {
      type : Schema.Types.ObjectId,
      ref : "Team"
    },
    memberId : {
        type : Schema.Types.ObjectId,
        ref : "Intern"
    },
    date : {
      type : Date,
      required : true
    },
    description : {
      type : String
    },
    status : {
      type : String,
      default : "pending",
      enum : ["pending", "complete"]
    },
    remark : {
      type : String
    },
    submittedBy : {
      type : Schema.Types.ObjectId,
      ref : "Intern"
    }
  }, { timestamps : true }
)


const Task = model("Task", taskSchema)
export default Task;
