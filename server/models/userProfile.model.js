const { default: mongoose } = require("mongoose");

const userProfile = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  issuesReported: {
    type: Number,
    default: 0,
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issues",
    },
  ],
});

module.exports = mongoose.model("UserProfile", userProfile);
