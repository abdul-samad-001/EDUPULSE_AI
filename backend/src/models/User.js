const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    graduationYear: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Day 19 Streak System Additions (PRD Phase 3)
    streak: {
      type: Number,
      default: 0,
    },

    lastActive: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);