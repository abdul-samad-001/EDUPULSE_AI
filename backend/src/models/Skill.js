const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    currentDay: {
      type: Number,
      default: 1,
    },
    // Consecutive-day streak for THIS skill specifically (per-skill scope,
    // confirmed — not a shared user-level streak).
    streakCount: {
      type: Number,
      default: 0,
    },
    // Timestamp of the last time a full day-chunk was completed for this
    // skill. Used to evaluate the 24-hour deadline. null until the first
    // day is ever fully completed.
    lastCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Skill",
  skillSchema
);