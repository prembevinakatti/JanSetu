const emailComplaintModel = require("../models/emailComplaint.model");

module.exports.getEmailComplaints = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    let filter = {};

    // Status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // Priority filter
    if (priority && priority !== "All") {
      filter.priorityLevel = priority;
    }

    // Search filter (search in title OR description OR sender email)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { senderEmail: { $regex: search, $options: "i" } },
      ];
    }

    const allMails = await emailComplaintModel
      .find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Email complaints fetched successfully",
      success: true,
      emails: allMails, // ⚠ changed key to emails (better naming)
    });

  } catch (error) {
    console.error("Get Email Complaints Error:", error);
    res.status(500).json({ error: "Failed to fetch email complaints" });
  }
};