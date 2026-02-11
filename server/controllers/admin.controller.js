const adminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.adminregister = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status();
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
    console.log("Failed to registrer");
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
