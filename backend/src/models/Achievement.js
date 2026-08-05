const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    key: {
      type: String,
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

    icon: {
      type: String,
      default: "🏆",
    },

    category: {
      type: String,
      enum: [
        "focus",
        "skills",
        "tasks",
        "streak",
        "productivity",
        "study",
      ],
      default: "focus",
    },

    progress: {
      type: Number,
      default: 0,
    },

    target: {
      type: Number,
      required: true,
    },

    unlocked: {
      type: Boolean,
      default: false,
    },

    unlockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index(
  {
    user: 1,
    key: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Achievement",
  achievementSchema
);