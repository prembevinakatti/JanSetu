const authModel = require("../models/auth.model");
const userProfileModel = require("../models/userProfile.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
  try {
    const { username, email, password, metamaskId, phoneNumber } = req.body;

    if (!username || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await authModel.create({
      username,
      email,
      password,
      metamaskId,
      phoneNumber,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    const userToken = await jwt.sign(
      { userId: newUser._id },
      process.env.USER_JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("userToken", userToken);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userToken = await jwt.sign(
      { userId: user._id },
      process.env.USER_JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("userToken", userToken);

    return res
      .status(200)
      .json({ message: "Login successful", success: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userProfile = await userProfileModel
      .findOne({ userId })
      .populate("userId", "username email phoneNumber");

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getRewardsLeaderboard = async (req, res) => {
  try {
    const leaderboard = await userProfileModel
      .find()
      .populate("userId", "username email")
      .sort({ rewardPoints: -1 })
      .limit(100);

    const leaderboardData = leaderboard.map((profile, index) => ({
      rank: index + 1,
      userId: profile.userId._id,
      username: profile.userId.username,
      email: profile.userId.email,
      rewardPoints: profile.rewardPoints,
      issuesReported: profile.issuesReported,
    }));

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      success: true,
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
