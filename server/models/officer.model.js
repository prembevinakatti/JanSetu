const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    assignedIssues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Officer", officerSchema);