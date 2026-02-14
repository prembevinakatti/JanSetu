const issueModel = require("../models/issue.model");
const { uploadToPinata } = require("../utils/pinataUpload");
const crypto = require("crypto");
const issueHistoryModel = require("../models/issueHistory.model");
const { default: contract } = require("../../blockchain/contract");

module.exports.updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, remarks, latitude, longitude, address } = req.body;
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!issueId) {
      return res.status(400).json({ message: "Issue ID is required" });
    }

    if (!status || !["Reported", "InProgress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const issue = await issueModel.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    let proofUrl = "";
    let proofHash = "";

    if (req.file) {
      const { url } = await uploadToPinata(req.file);
      proofUrl = url;

      proofHash = crypto.createHash("sha256").update(url).digest("hex");
    }

    issue.status = status;
    if (latitude && longitude) {
      issue.location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };
    }

    if (address) {
      issue.address = address;
    }

    await issue.save();

    const issueUpdate = await issueHistoryModel.findOne({ issueId });

    const issueHistory = await issueHistoryModel.create({
      issueId: issue._id,
      status,
      updatedBy: adminId,
      remarks,
      proofImage: proofUrl,
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    const statusMap = {
      Reported: 0,
      InProgress: 1,
      Resolved: 2,
    };

    const statusEnum = statusMap[status];

    const tx = await contract.updateIssueStatus(
      issue.chainIssueId,
      statusEnum,
      proofHash,
    );
    await tx.wait();

    return res.status(200).json({
      message: "Issue updated successfully",
      success: true,
      issue,
      history: issueHistory,
    });
  } catch (error) {
    console.log("Error updating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getIssueHistory = async (req, res) => {
  try {
    const { issueId } = req.params;

    if (!issueId) {
      return res.status(400).json({ message: "Issue ID is required" });
    }

    const issueHistory = await issueHistoryModel
      .find({ issueId })
      .populate("updatedBy");

    if (!issueHistory) {
      return res
        .status(404)
        .json({ message: "No history found for this issue" });
    }

    return res.status(200).json({
      message: "Issue history fetched successfully",
      success: true,
      history: issueHistory,
    });
  } catch (error) {
    console.log("Error fetching issue history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
