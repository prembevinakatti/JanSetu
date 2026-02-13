const adminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: contract } = require("../../blockchain/contract");

module.exports.adminregister = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await adminModel.findOne({ email });

    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await adminModel.create({
      fullName,
      email,
      phone,
      password,
    });

    if (!newAdmin) {
      return res.status(500).json({ message: "Failed to create admin" });
    }

    const adminToken = jwt.sign(
      { adminId: newAdmin._id },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("adminToken", adminToken);

    return res.status(201).json({
      message: "Admin registered successfully",
      success: true,
      admin: newAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in registering" });
  }
};

module.exports.adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const adminToken = jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("adminToken", adminToken);

    return res.status(200).json({
      message: "Admin logged in successfully",
      success: true,
      admin: admin,
    });
  } catch (error) {
    console.error("Failed to login");
    return res.status(500).json({ message: "Error in login" });
  }
};

module.exports.addMetamask = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    const admin = await adminModel.findByIdAndUpdate(
      adminId,
      { metamaskWallet: walletAddress },
      { new: true },
    );

    const tx = await contract.addAdmin(walletAddress);
    await tx.wait();

    return res.status(200).json({
      message: "Admin wallet added successfully",
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Failed to add admin wallet");
    return res.status(500).json({ message: "Error in adding admin wallet" });
  }
};
