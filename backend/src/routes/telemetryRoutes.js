const express = require("express");

const {
  uploadSessions,
  getTodayTelemetry,
  getMySessions,
  getStats,
} = require("../controllers/telemetryController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sessions", protect, uploadSessions);
router.get("/today", protect, getTodayTelemetry);
router.get("/my-sessions", protect, getMySessions);
router.get("/stats", protect, getStats);
router.get("/test", (req, res) => {
  res.json({ message: "Telemetry route is working" });
});
module.exports = router;