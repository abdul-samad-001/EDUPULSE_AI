const express = require("express");

const {
  startFocusSession,
  stopFocusSession,
  getActiveSession,
  getSessionHistory,
} = require("../controllers/focusSessionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Start a focus session
router.post("/start", protect, startFocusSession);
router.post("/stop", protect, stopFocusSession);
router.get("/active", protect, getActiveSession);
router.get("/history", protect, getSessionHistory);

module.exports = router;