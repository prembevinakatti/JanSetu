const { default: mongoose } = require("mongoose");

const issueHistorySchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issues",
      required: true,
    },
    status: {
      type: String,
      enum: ["Reported", "InProgress", "Resolved"],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    remarks: {
      type: String,
    },
    proofImage: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    address: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IssueHistory", issueHistorySchema);
