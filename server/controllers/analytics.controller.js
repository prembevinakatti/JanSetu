const issueModel = require("../models/issue.model");

module.exports.getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await issueModel.countDocuments();

    const activeClusters = await issueModel.distinct("clusterId", {
      clusterId: { $ne: null },
    });

    const highPriority = await issueModel.countDocuments({
      priorityLevel: "High",
    });

    const emergencyIssues = await issueModel.countDocuments({
      isEmergency: true,
    });

    const resolvedIssues = await issueModel.countDocuments({
      status: "Resolved",
    });

    let avgResolutionTime = 0;

    if (resolvedIssues > 0) {
      const totalTime = resolvedIssues.reduce((acc, issue) => {
        const diff = new Date(issue.updatedAt) - new Date(issue.createdAt);
        return acc + diff;
      }, 0);

      avgResolutionTime =
        totalTime / resolvedIssues.length / (1000 * 60 * 60 * 24);
    }

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      succcess: true,
      data: {
        totalComplaints,
        activeClusters: activeClusters.length,
        highPriority,
        emergencyIssues,
        avgResolutionTime: avgResolutionTime.toFixed(2),
      },
    });
  } catch (error) {
    console.log("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAISummary = async (req, res) => {
  try {
    const duplicateReports = await issueModel.countDocuments({
      clusterId: { $ne: null },
    });

    const negativeSentiments = await issueModel.countDocuments({
      "sentiment.label": "negative",
    });

    const escalatedCount = await issueModel.countDocuments({
      priorityLevel: "High",
    });

    return res.status(200).json({
      message: "AI summary fetched successfully",
      success: true,
      data: {
        duplicateReports,
        negativeSentiments,
        escalatedCount,
      },
    });
  } catch (error) {
    console.log("Error fetching AI summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      reolustionsRate: dept.total
        ? ((dept.resolved / dept.total) * 100).toFixed(2)
        : 0,
    }));

    return res.status(200).json({
      message: "Department performance fetched successfully",
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.log("Error fetching department performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      { $match: { _id: { $ne: null } } },
    ]);

    return res.status(200).json({
      message: "Hotspots fetched successfully",
      success: true,
      hotspots: hotspots,
    });
  } catch (error) {
    console.log("Error fetching hotspots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getFilteredIssues = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res
        .status(400)
        .json({ message: "Type query parameter is required" });
    }

    let query = {};

    if (type === "duplicate") {
      query = { clusterId: { $ne: null } };
    }

    if (type === "negative") {
      query = { "sentiment.label": "negative" };
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
    console.log("Error fetching filtered issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
