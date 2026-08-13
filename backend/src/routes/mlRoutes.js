const express = require("express");
const router = express.Router();
const mlController = require("../controllers/mlController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/ml/health — ML Service Health Status
router.get("/health", mlController.getMLHealth);

// POST /api/ml/procrastination — Model 1 Procrastination Prediction (Protected)
router.post("/procrastination", protect, mlController.predictProcrastination);

// POST /api/ml/productivity — Model 2 Productivity Prediction (Protected)
router.post("/productivity", protect, mlController.predictProductivity);

// POST /api/ml/recommendation — Model 3 V2 Recommendation Prediction (Protected)
router.post("/recommendation", protect, mlController.predictRecommendation);

module.exports = router;
