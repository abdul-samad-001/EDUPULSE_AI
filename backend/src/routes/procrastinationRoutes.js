const express = require("express");

const {
  predictRisk,
} = require("../controllers/procrastinationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/predict", protect, predictRisk);

module.exports = router;