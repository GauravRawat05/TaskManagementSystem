import { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "todo",
      enum: ["todo", "in_progress", "done"]
    },
    remark: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);
export default Task;

