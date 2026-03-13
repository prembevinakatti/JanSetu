const jwt = require("jsonwebtoken");

const isOfficerAuthenticated = (req, res, next) => {

  try {

    const token = req.cookies.officerToken;

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, "secretkey");

    req.officerId = decoded.officerId;

    next();

  } catch (error) {

    console.log(error);

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = isOfficerAuthenticated;