const express = require("express");
const { updateIssue } = require("../controllers/issueHistory.controller");
const isAdminAuthenticated = require("../middleware/isAdminAuthenticated");
const { default: upload } = require("../middleware/upload");
const router = express.Router();

router
  .route("/updateHistory/:issueId")
  .put(isAdminAuthenticated, upload.single("proof"), updateIssue);

module.exports = router;
