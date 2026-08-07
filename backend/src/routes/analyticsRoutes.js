const express = require("express");
const {
  getProductivityAnalytics,
  getFocusAnalytics,
  getSkillAnalytics,
  getSummaryAnalytics,
  getGoalAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/productivity", protect, getProductivityAnalytics);
router.get("/focus", protect, getFocusAnalytics);
router.get("/skills", protect, getSkillAnalytics);
router.get("/summary", protect, getSummaryAnalytics);
router.get("/goals", protect, getGoalAnalytics);

module.exports = router;
