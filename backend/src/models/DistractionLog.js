const mongoose = require("mongoose");

const distractionLogSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      date: {
        type: Date,
        required: true,
      },

      totalDistractionSeconds: {
        type: Number,
        default: 0,
        min: 0,
      },

      distractionVisits: {
        type: Number,
        default: 0,
        min: 0,
      },

      productiveSeconds: {
        type: Number,
        default: 0,
        min: 0,
      },

      neutralSeconds: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalTrackedSeconds: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

distractionLogSchema.index(
  {
    user: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "DistractionLog",
  distractionLogSchema
);