const express = require("express");
const isUserAuthenticated = require("../middleware/isUserAuthenticated");
const {
  createIssue,
  getAllIssues,
  getUserIssues,
} = require("../controllers/issue.controller");
const { default: upload } = require("../middleware/upload");

const router = express.Router();

router
  .route("/createIssue")
  .post(isUserAuthenticated, upload.array("images"), createIssue);
router.route("/getAllIssues").get(isUserAuthenticated, getAllIssues);
router.route("/getUsersIssues").get(isUserAuthenticated, getUserIssues);

module.exports = router;
