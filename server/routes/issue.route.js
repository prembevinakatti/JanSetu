const express = require("express");
const isUserAuthenticated = require("../middleware/isUserAuthenticated");
const {
  createIssue,
  getAllIssues,
  getUserIssues,
  getIssueByFilters,
  assignIssue,
} = require("../controllers/issue.controller");
const { default: upload } = require("../middleware/upload");

const router = express.Router();

router
  .route("/createIssue")
  .post(isUserAuthenticated, upload.array("images"), createIssue);
router.route("/getAllIssues").get(isUserAuthenticated, getAllIssues);
router.route("/getUsersIssues").get(isUserAuthenticated, getUserIssues);
router.route("/getIssueByFilter").get(isUserAuthenticated, getIssueByFilters);
router.route("/assignIssue").post(assignIssue);

module.exports = router;
