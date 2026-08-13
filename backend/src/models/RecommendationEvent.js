const mongoose = require("mongoose");

const recommendationEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recommendationClass: {
      type: Number,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    modelType: {
      type: String,
      default: "Random Forest",
    },
    modelVersion: {
      type: String,
      default: "v2",
    },
    status: {
      type: String,
      enum: ["shown", "accepted", "dismissed", "ignored", "completed"],
      default: "shown",
    },
    shownAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    actionType: {
      type: String,
    },
    actionTarget: {
      type: String,
    },
    context: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
recommendationEventSchema.index({ user: 1, shownAt: -1 });
recommendationEventSchema.index({ user: 1, status: 1 });
recommendationEventSchema.index({ user: 1, recommendationClass: 1 });

module.exports = mongoose.model(
  "RecommendationEvent",
  recommendationEventSchema
);
