const express = require("express");

const {
  uploadSessions,
  getTodayTelemetry,
  getMySessions,
  getStats,
  getTopWebsites,
  getWeeklyProductivityTrend,
  getHourlyHeatmap,
  getStudyVsDistractStats,
  getAIProductivityInsights,
} = require("../controllers/telemetryController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sessions", protect, uploadSessions);
router.get("/today", protect, getTodayTelemetry);
router.get("/my-sessions", protect, getMySessions);
router.get("/stats", protect, getStats);
router.get("/top-websites", protect, getTopWebsites);
router.get("/weekly-trend", protect, getWeeklyProductivityTrend);
router.get("/hourly-productivity", protect, getHourlyHeatmap);
router.get("/study-vs-distract", protect, getStudyVsDistractStats);
router.get("/ai-insights", protect, getAIProductivityInsights);
router.get("/test", (req, res) => {
  res.json({ message: "Telemetry route is working" });
});
module.exports = router;