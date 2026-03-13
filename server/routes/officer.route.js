const express = require("express");
const { registerOfficer, loginOfficer, getAllOfficers, getAssignedIssues } = require("../controllers/officer.controller");


const router = express.Router();

router.post("/register", registerOfficer);

router.post("/login", loginOfficer);

router.get("/all", getAllOfficers);

router.get("/assignedIssues", getAssignedIssues);

module.exports = router;