const mongoose = require("mongoose");

const tabSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      enum: [
        "productive",
        "distraction",
        "neutral",
      ],
      required: true,
      default: "neutral",
    },

    startedAt: {
      type: Date,
      required: true,
    },

    endedAt: {
      type: Date,
      required: true,
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 1,
    },

    source: {
      type: String,
      enum: ["extension"],
      default: "extension",
    },
  },
  {
    timestamps: true,
  }
);

tabSessionSchema.index({
  user: 1,
  startedAt: -1,
});

tabSessionSchema.index({
  user: 1,
  category: 1,
  startedAt: -1,
});

module.exports = mongoose.model(
  "TabSession",
  tabSessionSchema
);