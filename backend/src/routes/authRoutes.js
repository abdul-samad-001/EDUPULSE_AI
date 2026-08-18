const express = require("express");
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

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/stats", protect, getStats);

// OTP & Password Reset Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp-reset-password", verifyOTPAndResetPassword);
router.post("/verify-email-otp", verifyEmailOTP);

module.exports = router;