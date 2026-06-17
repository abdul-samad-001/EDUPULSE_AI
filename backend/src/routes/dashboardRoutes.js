const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getRecentSkills,
  getCategoryStats,
} = require("../controllers/dashboardController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/stats",
  protect,
  getDashboardStats
);
router.get(
  "/recent-skills",
  protect,
  getRecentSkills
);
router.get(
  "/category-stats",
  protect,
  getCategoryStats
);

module.exports = router;