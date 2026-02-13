const jwt = require("jsonwebtoken");

const isAdminAuthenticated = (req, res, next) => {
  try {
    const adminToken = req.cookies.adminToken;

    if (!adminToken) {
      return res.status(401).json({ message: "Token Not Found" });
    }

    const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAdminAuthenticated;
