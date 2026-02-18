const issueModel = require("../models/issue.model");
const emailComplaintModel = require("../models/emailComplaint.model");

/* =========================================================
   1️⃣ DASHBOARD STATS (COMBINED DATA)
========================================================= */

module.exports.getDashboardStats = async (req, res) => {
  try {
    // App Issues
    const totalIssues = await issueModel.countDocuments();
    const highPriorityIssues = await issueModel.countDocuments({
      priorityLevel: "High",
    });

    // Email Issues
    const totalEmails = await emailComplaintModel.countDocuments();
    const highPriorityEmails = await emailComplaintModel.countDocuments({
      aiPriorityLevel: "High",
    });

    // Cluster count (unique across both)
    const issueClusters = await issueModel.distinct("clusterId", {
      clusterId: { $ne: null },
    });

    const emailClusters = await emailComplaintModel.distinct("aiClusterId", {
      aiClusterId: { $ne: null },
    });

    const activeClusters = new Set([
      ...issueClusters,
      ...emailClusters,
    ]).size;

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      success: true,
      data: {
        totalComplaints: totalIssues + totalEmails,
        totalIssues,
        totalEmails,
        activeClusters,
        highPriority: highPriorityIssues + highPriorityEmails,
      },
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   2️⃣ AI SUMMARY (COMBINED)
========================================================= */

module.exports.getAISummary = async (req, res) => {
  try {
    // Duplicate clusters (only app issues)
    const duplicateClusters = await issueModel.aggregate([
      { $group: { _id: "$clusterId", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    ]);

    const duplicateReports = duplicateClusters.length;

    const negativeIssues = await issueModel.countDocuments({
      "sentiment.label": { $regex: /^NEGATIVE$/i },
    });

    const negativeEmails = await emailComplaintModel.countDocuments({
      "aiSentiment.label": { $regex: /^NEGATIVE$/i },
    });

    const escalatedIssues = await issueModel.countDocuments({
      priorityLevel: "High",
    });

    const escalatedEmails = await emailComplaintModel.countDocuments({
      aiPriorityLevel: "High",
    });

    return res.status(200).json({
      message: "AI summary fetched successfully",
      success: true,
      data: {
        duplicateReports,
        negativeSentiments: negativeIssues + negativeEmails,
        escalatedCount: escalatedIssues + escalatedEmails,
      },
    });
  } catch (error) {
    console.log("AI Summary Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   3️⃣ DEPARTMENT PERFORMANCE (APP ISSUES ONLY)
========================================================= */

module.exports.getDepartmentPerformance = async (req, res) => {
  try {
    const data = await issueModel.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const formatted = data.map((dept) => ({
      department: dept._id,
      resolutionRate: dept.total
        ? ((dept.resolved / dept.total) * 100).toFixed(2)
        : 0,
    }));

    return res.status(200).json({
      message: "Department performance fetched successfully",
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.log("Department Performance Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   4️⃣ HOTSPOTS (APP ONLY - GEO BASED)
========================================================= */

module.exports.getHotspots = async (req, res) => {
  try {
    const hotspots = await issueModel.aggregate([
      {
        $group: {
          _id: "$clusterId",
          count: { $sum: 1 },
          location: { $first: "$location" },
        },
      },
      {
        $match: {
          _id: { $ne: null },
          count: { $gt: 2 }, // threshold
        },
      },
    ]);

    return res.status(200).json({
      message: "Hotspots fetched successfully",
      success: true,
      data: hotspots,
    });
  } catch (error) {
    console.log("Hotspots Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   5️⃣ FILTERED ISSUES (APP ONLY)
========================================================= */

module.exports.getFilteredIssues = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        message: "Type query parameter is required",
      });
    }

    let query = {};

    if (type === "duplicate") {
      query = { clusterId: { $ne: null } };
    }

    if (type === "negative") {
      query = { "sentiment.label": { $regex: /^NEGATIVE$/i } };
    }

    if (type === "high") {
      query = { priorityLevel: "High" };
    }

    if (type === "emergency") {
      query = { isEmergency: true };
    }

    const issues = await issueModel.find(query).limit(50);

    return res.status(200).json({
      message: "Filtered issues fetched successfully",
      success: true,
      data: issues,
    });
  } catch (error) {
    console.log("Filtered Issues Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================================================
   6️⃣ RECENT COMPLAINTS (COMBINED APP + EMAIL)
========================================================= */

module.exports.getRecentIssues = async (req, res) => {
  try {
    const issues = await issueModel.find().lean();
    const emails = await emailComplaintModel.find().lean();

    const formattedEmails = emails.map((mail) => ({
      _id: mail._id,
      title: mail.subject,
      category: "Email",
      priorityLevel: mail.aiPriorityLevel,
      clusterId: mail.aiClusterId,
      createdAt: mail.createdAt,
      source: "email",
    }));

    const formattedIssues = issues.map((issue) => ({
      _id: issue._id,
      title: issue.title,
      category: issue.category,
      priorityLevel: issue.priorityLevel,
      clusterId: issue.clusterId,
      createdAt: issue.createdAt,
      source: "app",
    }));

    const combined = [...formattedIssues, ...formattedEmails]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    return res.status(200).json({
      message: "Recent complaints fetched successfully",
      success: true,
      data: combined,
    });
  } catch (error) {
    console.log("Recent Issues Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
