const emailComplaintModel = require("../models/emailComplaint.model");

module.exports.getEmailComplaints = async (req, res) => {
  try {
    const allMails = await emailComplaintModel.find().sort({ createdAt: -1 });
    if (!allMails || allMails.length === 0) {
      return res.status(404).json({ message: "No email complaints found" });
    }

    return res.status(200).json({
      message: "Email complaints fetched successfully",
      success: true,
      allMails: allMails,
    });
  } catch (error) {
    console.error("Get Email Complaints Error:", error);
    res.status(500).json({ error: "Failed to fetch email complaints" });
  }
};
