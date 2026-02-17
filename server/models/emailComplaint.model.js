const mongoose = require("mongoose");

const emailComplaintSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    from: {
      type: String,
    },
    source: {
      type: String,
      default: "email",
    },
    isCivic: {
      type: Boolean,
      default: false,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
    aiCategory: String,
    aiSentiment: Object,
    aiPriorityScore: Number,
    aiPriorityLevel: String,
    aiClusterId: String,
    isEmergency: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailComplaint", emailComplaintSchema);
