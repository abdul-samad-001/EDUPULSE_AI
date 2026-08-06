const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearNotifications = async (
  req,
  res
) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Notifications cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getNotifications,
  markAsRead,
  clearNotifications,
  createNotification,
};