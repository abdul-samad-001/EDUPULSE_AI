const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getUserXP,
} = require("../controllers/xpController");

router.get("/", protect, getUserXP);

module.exports = router;