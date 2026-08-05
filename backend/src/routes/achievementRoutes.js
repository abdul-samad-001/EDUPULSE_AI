const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAllAchievements,
} = require("../controllers/achievementController");

// Get all achievements
router.get("/", protect, getAllAchievements);

module.exports = router;