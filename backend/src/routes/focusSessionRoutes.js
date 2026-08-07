const express = require("express");

const {
  startFocusSession,
  stopFocusSession,
  getActiveSession,
  getSessionHistory,
  getStatistics,
  getWeekly,
  getInsights,
} = require("../controllers/focusSessionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Focus Session Endpoints
router.post("/start", protect, startFocusSession);
router.post("/stop", protect, stopFocusSession);
router.get("/active", protect, getActiveSession);
router.get("/history", protect, getSessionHistory);

// Additive Analytics Endpoints
router.get("/statistics", protect, getStatistics);
router.get("/weekly", protect, getWeekly);
router.get("/insights", protect, getInsights);

module.exports = router;