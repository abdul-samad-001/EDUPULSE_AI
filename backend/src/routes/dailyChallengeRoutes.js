const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getChallenge,
  completeTodayChallenge,
} = require("../controllers/dailyChallengeController");

router.get("/", protect, getChallenge);

router.put("/complete", protect, completeTodayChallenge);

module.exports = router;