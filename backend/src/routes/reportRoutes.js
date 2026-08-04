const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getSummary,
  getWeekly,
  getMonthly,
  getSkillProgress,
  getAI,
  downloadPDF
} = require("../controllers/reportController");

router.get("/summary", protect, getSummary);

router.get("/weekly", protect, getWeekly);

router.get("/monthly", protect, getMonthly);

router.get("/skills", protect, getSkillProgress);

router.get("/ai", protect, getAI);

router.get("/download", protect, downloadPDF);
module.exports = router;