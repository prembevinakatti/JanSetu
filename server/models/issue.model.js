const { default: mongoose } = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: {
      type: String,
      enum: ["Reported", "InProgress", "Resolved"],
      default: "Reported",
    },
    issueHash: {
      type: String,
      unique: true,
    },
    chianIssueId: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Issues", issueSchema);
