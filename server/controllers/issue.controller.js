const loadContract = async () => {
  const module = await import("../../blockchain/contract.js");
  return module.default;
};
const { default: contract } = require("../../blockchain/contract.js");
const issueModel = require("../models/issue.model");
const issueHistoryModel = require("../models/issueHistory.model.js");
const userProfileModel = require("../models/userProfile.model");
const { analyzeComplaint } = require("../services/ai.service.js");
const { uploadToPinata } = require("../utils/pinataUpload");
const crypto = require("crypto");
const { calculatePriority } = require("../utils/priorityCalculator.js");

module.exports.createIssue = async (req, res) => {
  try {
    const userId = req.userId;
    const contract = await loadContract();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, category, description, latitude, longitude, address } =
      req.body;

    if (
      !title ||
      !category ||
      !latitude ||
      !longitude ||
      !description ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ================= IMAGE UPLOAD =================
    let imageUrls = [];

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const { url } = await uploadToPinata(file);
        imageUrls.push(url);
      }
    }

    // ================= AI ANALYSIS =================
    const aiData = await analyzeComplaint(description, latitude, longitude);
    console.log(aiData);

    /*
    Expected AI Response:
    {
      sentiment,
      embedding,
      similarComplaint,
      priorityScore,
      priorityLevel,
      isEmergency,
      clusterId
    }
    */

    // Extract properly
    const {
      sentiment,
      embedding,
      priorityScore,
      priorityLevel,
      isEmergency,
      clusterId,
      aiCategory,
    } = aiData;

    // ================= CREATE ISSUE =================
    const newIssue = await issueModel.create({
      title,
      category,
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      description,
      image: imageUrls,
      createdBy: userId,

      aiCategory,
      sentiment,
      priorityScore,
      priorityLevel,
      isEmergency,
      embedding,
      clusterId,
    });

    // ================= ISSUE HISTORY =================
    await issueHistoryModel.create({
      issueId: newIssue._id,
      status: "Reported",
      updatedBy: userId,
      remarks: "Issue reported by user",
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    // ================= USER PROFILE UPDATE =================
    let userProfile = await userProfileModel.findOne({ userId });

    if (!userProfile) {
      userProfile = await userProfileModel.create({
        userId,
        issuesReported: 1,
        issues: [newIssue._id],
      });
    } else {
      userProfile.issuesReported += 1;
      userProfile.issues.push(newIssue._id);
      await userProfile.save();
    }

    // ================= BLOCKCHAIN HASH =================
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

    // ================= BLOCKCHAIN TX =================
    const tx = await contract.createIssue(issueHash);
    const receipt = await tx.wait();

    const event = receipt.logs.find(
      (log) => log.fragment?.name === "IssueCreated",
    );

    const blockchainIssueId = Number(event.args.issueId);

    newIssue.chainIssueId = blockchainIssueId;
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

    const issues = await issueModel
      .find()
      .populate("createdBy")
      .sort({ createdAt: -1 });

    const verifiedIssues = [];

    for (const issue of issues) {
      let verificationStatus = "NotOnChain";

      if (issue.chainIssueId) {
        try {
          const chainData = await contract.getIssue(issue.chainIssueId);

          const chainHash = chainData.issueHash;

          if (chainHash === issue.issueHash) {
            verificationStatus = "Verified";
          } else {
            verificationStatus = "Altered";
          }
        } catch (err) {
          verificationStatus = "ChainError";
        }
      }

      verifiedIssues.push({
        ...issue.toObject(),
        verificationStatus,
      });
    }

    return res.status(200).json({
      success: true,
      issues: verifiedIssues,
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

    const userIssues = await issueModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 });

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

module.exports.getIssueByFilters = async (req, res) => {
  try {
    const { category, status, priority, search } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (priority && priority !== "All") {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const issues = await issueModel
      .find(filter)
      .populate("createdBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Filter error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filtered issues",
    });
  }
};

module.exports.assignIssue = async (req, res) => {
  try {
    const { issueId, workerId } = req.body;

    const adminId = req.adminId;

    const issue = await issueModel.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    issue.assignedTo = workerId;
    issue.assignedBy = adminId;
    issue.assignedAt = new Date();
    issue.status = "InProgress";

    await issue.save();

    // Save history
    await issueHistoryModel.create({
      issueId,
      status: "InProgress",
      updatedBy: adminId,
      remarks: "Issue assigned to worker",
    });

    res.json({
      success: true,
      message: "Issue assigned successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
