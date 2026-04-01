import { model, Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        role: {
          type: String,
          enum: ["ADMIN", "MANAGER", "MEMBER", "TEAM_LEADER"],
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

const Workspace = model("Workspace", workspaceSchema);
export default Workspace;
