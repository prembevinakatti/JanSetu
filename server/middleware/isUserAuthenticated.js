const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  try {
    const userToken = req.cookies.userToken;

    if (!userToken) {
      return res.status(401).json({ message: "Token Not Found" });
    }

    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isUserAuthenticated;
