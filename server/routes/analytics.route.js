const express = require("express");
const isAdminAuthenticated = require("../middleware/isAdminAuthenticated");
const {
  getDashboardStats,
  getAISummary,
  getDepartmentPerformance,
  getHotspots,
  getFilteredIssues,
  getRecentIssues,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.route("/stats").get(isAdminAuthenticated, getDashboardStats);
router.route("/ai-summary").get(isAdminAuthenticated, getAISummary);
router.route("/department").get(isAdminAuthenticated, getDepartmentPerformance);
router.route("/hotspots").get(isAdminAuthenticated, getHotspots);
router.route("/issues").get(isAdminAuthenticated, getFilteredIssues);
router.route("/recent").get(isAdminAuthenticated, getRecentIssues);


module.exports = router;
