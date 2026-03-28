import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    positionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Wishlist",
        "Applied",
        "HR Interview",
        "Technical Interview",
        "Test Task",
        "Final Interview",
        "Offer",
        "Rejected",
      ],
      default: "Wishlist",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    jobLink: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    appliedDate: {
      type: Date,
      default: null,
    },
    nextStepDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
