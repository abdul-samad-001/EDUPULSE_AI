const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["focus", "task", "skill"],
      required: true,
    },

    target: {
      type: Number,
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    rewardXP: {
      type: Number,
      default: 100,
    },

    challengeDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DailyChallenge",
  dailyChallengeSchema
);