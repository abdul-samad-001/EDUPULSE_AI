const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("========== AUTH DEBUG ==========");
      console.log("Token:", token);
      console.log("Decoded:", decoded);
      const user = await User.findById(decoded.id);
      req.user = user || { _id: decoded.id, id: decoded.id };
      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };