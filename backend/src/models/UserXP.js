const mongoose = require("mongoose");

const userXPSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    totalXP: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    currentLevelXP: {
      type: Number,
      default: 0,
    },

    nextLevelXP: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserXP", userXPSchema);