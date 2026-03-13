const Officer = require("../models/officer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const issueModel = require("../models/issue.model");



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

    res.json({
      success: true,
      token,
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

    const issues = await issueModel
      .find({ assignedTo: officerId })
      .populate("createdBy");

    res.json({
      success: true,
      issues
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};