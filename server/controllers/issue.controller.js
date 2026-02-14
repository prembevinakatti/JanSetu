const loadContract = async () => {
  const module = await import("../../blockchain/contract.js");
  return module.default;
};
const { default: contract } = require("../../blockchain/contract.js");
const issueModel = require("../models/issue.model");
const issueHistoryModel = require("../models/issueHistory.model.js");
const userProfileModel = require("../models/userProfile.model");
const { uploadToPinata } = require("../utils/pinataUpload");
const crypto = require("crypto");

module.exports.createIssue = async (req, res) => {
  try {
    const userId = req.userId;
    const contract = await loadContract();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, category, description, latitude, longitude, address } =
      req.body;

    let imageUrls = [];

    if (req.files?.length > 0) {
      for (const file of req.files) {
        console.log("Uploading:", file.originalname);

        const { url } = await uploadToPinata(file);

        console.log("Uploaded to:", url);

        imageUrls.push(url);
      }
    }

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
    });

    if (!newIssue) {
      return res.status(500).json({ message: "Failed to create issue" });
    }

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
