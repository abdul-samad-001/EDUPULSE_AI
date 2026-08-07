const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
    },

    plannedDurationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    actualDurationMinutes: {
      type: Number,
      default: 0,
    },

    productiveSeconds: {
      type: Number,
      default: 0,
    },

    distractionSeconds: {
      type: Number,
      default: 0,
    },

    focusScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    notes: {
      type: String,
      trim: true,
    },

    pauseCount: {
      type: Number,
      default: 0,
    },

    pausedDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

focusSessionSchema.index({
  user: 1,
  startedAt: -1,
});

module.exports = mongoose.model("FocusSession", focusSessionSchema);