const generateToken = require("../utils/generateToken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const { initializeXP } = require("../services/xpService");
const { initializeAchievements } = require("../services/achievementService");
const { sendOTPEmail } = require("../services/emailService");
// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await initializeAchievements(user._id);
    await initializeXP(user._id);

console.log("Achievements initialized for:", user.email);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Current Logged-in User
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const {
      name,
      email,
      college,
      branch,
      graduationYear,
      avatar,
      currentPassword,
      newPassword,
      password,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (avatar !== undefined) user.avatar = avatar;

    // Handle password change if requested
    const nextPassword = newPassword || password;
    if (nextPassword) {
      if (nextPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      if (currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
          });
        }
      }

      user.password = await bcrypt.hash(nextPassword, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile and settings updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        avatar: user.avatar,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getStats = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Send OTP Code to Email (For Password Reset or Verification)
const sendOTP = async (req, res) => {
  try {
    let email = req.body.email || (req.user && req.user.email);
    const type = req.body.type || "password_reset";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required to dispatch OTP",
      });
    }

    email = email.toLowerCase().trim();

    // Check user exists if password reset
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No registered account found with this email",
      });
    }

    // Generate 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTP for this email & type
    await OTP.deleteMany({ email, type });

    // Store new OTP
    await OTP.create({
      email,
      otp: otpCode,
      type,
    });

    // Send email
    await sendOTPEmail(email, otpCode, type);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${email}`,
      email,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("sendOTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to dispatch verification code",
    });
  }
};

// Verify OTP and Reset Password
const verifyOTPAndResetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!email && req.user) email = req.user.email;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP code, and new password are required",
      });
    }

    email = email.toLowerCase().trim();
    otp = otp.trim();

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Check OTP in database
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "password_reset",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new one.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete used OTP
    await OTP.deleteMany({ email, type: "password_reset" });

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now use your new password.",
    });
  } catch (error) {
    console.error("verifyOTPAndResetPassword Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

// Verify Email OTP
const verifyEmailOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email && req.user) email = req.user.email;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required",
      });
    }

    email = email.toLowerCase().trim();
    otp = otp.trim();

    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "email_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      user.isEmailVerified = true;
      await user.save();
    }

    await OTP.deleteMany({ email, type: "email_verification" });

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("verifyEmailOTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getStats,
  sendOTP,
  verifyOTPAndResetPassword,
  verifyEmailOTP,
};