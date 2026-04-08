const express = require("express");
const { login, register, getUserProfile, getRewardsLeaderboard } = require("../controllers/auth.controller");
const isUserAuthenticated = require("../middleware/isUserAuthenticated");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/user-profile").get(isUserAuthenticated, getUserProfile);
router.route("/leaderboard").get(isUserAuthenticated, getRewardsLeaderboard);

module.exports = router;
