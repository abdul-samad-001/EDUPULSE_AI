const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["password_reset", "email_verification"],
      default: "password_reset",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document automatically expires & deletes after 10 minutes (600s)
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup
otpSchema.index({ email: 1, type: 1 });

module.exports = mongoose.model("OTP", otpSchema);
