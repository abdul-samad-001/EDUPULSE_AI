const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  recordEvent,
  respondToRecommendation,
  completeRecommendation,
  getRecommendationHistory,
  getRecommendationStats,
  exportRecommendationData,
} = require("../controllers/recommendationController");

// All routes require JWT Authentication
router.use(protect);

router.post("/", recordEvent);
router.post("/:id/respond", respondToRecommendation);
router.post("/:id/complete", completeRecommendation);
router.get("/history", getRecommendationHistory);
router.get("/stats", getRecommendationStats);
router.get("/export", exportRecommendationData);

module.exports = router;
