const express = require("express");
const {
  registerOfficer,
  loginOfficer,
  getAllOfficers,
  getAssignedIssues,
  updateIssueStatus
} = require("../controllers/officer.controller");

const isOfficerAuthenticated = require("../middleware/isOfficerAuthenticated");

const router = express.Router();

router.post("/register", registerOfficer);
router.post("/login", loginOfficer);

router.get("/all", getAllOfficers);

/* PROTECTED ROUTES */

router.get("/assignedIssues", isOfficerAuthenticated, getAssignedIssues);

router.put("/updateIssue/:id", isOfficerAuthenticated, updateIssueStatus);

module.exports = router;