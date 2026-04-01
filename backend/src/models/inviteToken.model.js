import { model, Schema } from "mongoose";

const inviteTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "MEMBER", "TEAM_LEAD", "TEAM_MEMBER", "INTERN"],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const InviteToken = model("InviteToken", inviteTokenSchema);
export default InviteToken;
