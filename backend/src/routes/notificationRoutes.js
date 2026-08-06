const express = require("express");

const {
  createNotification,
  getNotifications,
  markAsRead,
  clearNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getNotifications);

router.put("/:id", protect, markAsRead);

router.delete("/clear", protect, clearNotifications);

router.post("/", protect, createNotification);
module.exports = router;