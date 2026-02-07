const issueModel = require("../models/issue.model");

module.exports.createIssue = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, category, location, description, images } = req.body;

    if (!title || !category || !location || !description || !images) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIssue = await issueModel.create({
      title,
      category,
      location,
      description,
      images,
      createdBy: userId,
    });

    if (!newIssue) {
      return res.status(500).json({ message: "Failed to create issue" });
    }

    const hashPayload = JSON.stringify({
      title: newIssue.title,
      category: newIssue.category,
      location: newIssue.location,
      description: newIssue.description,
      createdBy: newIssue.createdBy,
    });

    const issueHash = crypto
      .createHash("sha256")
      .update(hashPayload)
      .digest("hex");

    newIssue.issueHash = issueHash;
    await newIssue.save();

    return res.status(201).json({
      message: "Issue created successfully",
      success: true,
      issue: newIssue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllIssues = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issues = await issueModel.find().populate("createdBy");

    if (!issues) {
      return res.status(404).json({ message: "No issues found" });
    }

    return res.status(200).json({
      message: "Issues fetched successfully",
      success: true,
      issues,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserIssues = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userIssues = await (
      await issueModel.find({ createdBy: userId })
    ).toSorted({ createdAt: -1 });

    if (!userIssues) {
      return res.status(404).json({ message: "No issues found for this user" });
    }

    return res.status(200).json({
      message: "User issues fetched successfully",
      success: true,
      issues: userIssues,
    });
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
