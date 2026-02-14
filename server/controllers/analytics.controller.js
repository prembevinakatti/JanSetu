const issueModel = require("../models/issue.model");

module.exports.getDashboardStats = async (req, res) => {
  try {
    const total = await issueModel.countDocuments();

    const highPriority = await issueModel.countDocuments({
      priorityLevel: "High",
    });

    const categoryStats = await issueModel.aggregate([
      {
        $group: {
          _id: "$aiCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalIssues: total,
      highPriority,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Analytics error" });
  }
};

module.exports.getHotspots = async (req, res) => {
  const hotspots = await issueModel.aggregate([
    {
      $group: {
        _id: "$address",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json(hotspots);
};
