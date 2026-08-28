const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getStats,
  sendOTP,
  verifyOTPAndResetPassword,
  verifyEmailOTP,
} = require("../controllers/authController");
const router = express.Router();

// General Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 : 30,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter OTP Rate Limiter (Defense against OTP brute force & SMS/Email flooding)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: {
    success: false,
    message: "Too many verification code attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/stats", protect, getStats);

// OTP & Password Reset Routes
router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp-reset-password", otpLimiter, verifyOTPAndResetPassword);
router.post("/verify-email-otp", otpLimiter, verifyEmailOTP);

module.exports = router;