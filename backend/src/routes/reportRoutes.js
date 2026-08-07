const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getSummary,
  getWeekly,
  getMonthly,
  getSkillProgress,
  getAI,
  downloadPDF,
  getTimeline,
  getHistory,
  exportCSV,
  exportJSON,
} = require("../controllers/reportController");

router.get("/summary", protect, getSummary);
router.get("/weekly", protect, getWeekly);
router.get("/monthly", protect, getMonthly);
router.get("/skills", protect, getSkillProgress);
router.get("/ai", protect, getAI);
router.get("/download", protect, downloadPDF);

// Additive Sprint 6 Routes
router.get("/timeline", protect, getTimeline);
router.get("/history", protect, getHistory);
router.post("/export/pdf", protect, downloadPDF);
router.post("/export/csv", protect, exportCSV);
router.post("/export/json", protect, exportJSON);

module.exports = router;