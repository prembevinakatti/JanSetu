const express = require("express");
const {
  updateIssue,
  getIssueHistory,
} = require("../controllers/issueHistory.controller");
const isAdminAuthenticated = require("../middleware/isAdminAuthenticated");
const { default: upload } = require("../middleware/upload");
const router = express.Router();

router
  .route("/updateHistory/:issueId")
  .put(isAdminAuthenticated, upload.single("proof"), updateIssue);

router.route("/getIssueHistory/:issueId").get(getIssueHistory);

module.exports = router;
