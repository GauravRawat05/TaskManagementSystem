import { model, Schema } from "mongoose";

const teamSchema = new Schema(
  {
    project : {
      type : Schema.Types.ObjectId,
        ref : "Project"
    },
    teamName : {
      type: String,
      required : true
    },
    team : [
        {
              type : Schema.Types.ObjectId,
              ref : "Intern"
        },
    ],
    teamLeader : {
        type : Schema.Types.ObjectId,
        ref : "Intern"
    }
  }, { timestamps : true }
)

const Team = model("Team", teamSchema)
export default Team
