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
    address: {
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
      ref: "Auth",
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
    chainIssueId: {
      type: Number,
    },
    aiCategory: {
      type: String,
    },

    sentiment: {
      type: Object,
    },

    priorityScore: {
      type: Number,
      default: 0,
    },

    priorityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issues", issueSchema);
