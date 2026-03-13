const Officer = require("../models/officer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const issueModel = require("../models/issue.model");
const issueHistoryModel = require("../models/issueHistory.model");



module.exports.registerOfficer = async (req, res) => {

  try {

    const { name, email, password, department, phone } = req.body;

    const existing = await Officer.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Officer already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await Officer.create({
      name,
      email,
      password: hashedPassword,
      department,
      phone
    });

    res.json({
      success: true,
      message: "Officer registered successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



module.exports.loginOfficer = async (req, res) => {

  try {

    const { email, password } = req.body;

    const officer = await Officer.findOne({ email });

    if (!officer) {
      return res.status(404).json({
        message: "Officer not found"
      });
    }

    const isMatch = await bcrypt.compare(password, officer.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { officerId: officer._id },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.cookie("officerToken", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful",
      officer
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};



module.exports.getAllOfficers = async (req, res) => {

  try {

    const officers = await Officer.find().select("-password");

    res.json({
      success: true,
      officers
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};





module.exports.getAssignedIssues = async (req, res) => {

  try {

    const officerId = req.officerId;

    const officer = await Officer.findById(officerId)
      .populate({
        path: "assignedIssues",
      });

      console.log("Officer assigned issues:", officer.assignedIssues);

    res.json({
      success: true,
      issues: officer.assignedIssues
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
module.exports.updateIssueStatus = async (req, res) => {

  try {

    const officerId = req.officerId;
    const { id } = req.params;
    const { status, note } = req.body;

    const issue = await issueModel.findById(id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    if (issue.assignedTo.toString() !== officerId) {
      return res.status(403).json({
        message: "Not authorized to update this issue"
      });
    }

    issue.status = status;

    await issue.save();

    /* Save history */

    await issueHistoryModel.create({
      issueId: issue._id,
      status: status,
      updatedBy: officerId,
      remarks: note || "Updated by officer"
    });

    res.json({
      success: true,
      message: "Issue updated successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};