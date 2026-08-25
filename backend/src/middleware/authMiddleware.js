const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
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
      let user = null;
      if (mongoose.connection.readyState === 1) {
        user = await User.findById(decoded.id).select("-password");
      }
      req.user = user || { _id: decoded.id, id: decoded.id, role: decoded.role || "student" };
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

/**
 * Role-Based Access Control (RBAC) middleware.
 * Restricts access to specified roles, returning 403 Forbidden if user role is unauthorized.
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next();
  };
};

const authorize = restrictTo;

module.exports = { protect, restrictTo, authorize };