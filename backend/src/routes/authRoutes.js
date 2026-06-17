const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  getStats,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/stats",protect,getStats)

module.exports = router;