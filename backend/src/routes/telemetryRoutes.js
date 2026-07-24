const express = require("express");

const {
  uploadSessions,
  getTodayTelemetry,
} = require("../controllers/telemetryController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sessions", protect, uploadSessions);
router.get("/today", protect, getTodayTelemetry);
router.get("/test", (req, res) => {
  res.json({ message: "Telemetry route is working" });
});
module.exports = router;