// backend/src/models/Task.js
// ONLY CHANGE: added the `difficulty` field. Everything else — skill ref,
// taskName, completed, order, timestamps — is exactly as it already was.
// This is additive: existing tasks without a difficulty just default to "Easy".

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    taskName: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    // NEW — used by the AI Roadmap Generator to tag each milestone.
    // Manually-added tasks (via the existing "New milestone..." input)
    // simply default to "Easy" and can be left as-is.
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    assignedDay: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
