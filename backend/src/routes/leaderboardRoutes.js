const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getLeaderboardData,
  getMyRank,
} = require("../controllers/leaderboardController");

router.get("/", protect, getLeaderboardData);

router.get("/me", protect, getMyRank);

module.exports = router;