const express = require("express");
const {
  getEmailComplaints,
} = require("../controllers/emailComplaint.controller");

const router = express.Router();

router.route("/getAllEmailComplaints").get(getEmailComplaints);

module.exports = router;
