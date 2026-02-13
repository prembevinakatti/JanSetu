const express = require("express");
const {
  adminregister,
  adminlogin,
  addMetamask,
} = require("../controllers/admin.controller");
const isAdminAuthenticated = require("../middleware/isAdminAuthenticated");

const router = express.Router();

router.route("/register").post(adminregister);
router.route("/login").post(adminlogin);
router.route("/addAdminWallet").post(isAdminAuthenticated, addMetamask);

module.exports = router;
