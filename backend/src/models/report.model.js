import { model, Schema } from "mongoose";

const reportSchema = new Schema(
  {
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
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    reportText: {
      type: String,
      required: true,
      trim: true
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    }
  },
  { timestamps: true }
);

// One report per member per project per day
reportSchema.index({ memberId: 1, projectId: 1, date: 1 }, { unique: true });

const Report = model("Report", reportSchema);
export default Report;

