const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  title,
  message,
  type = "system",
}) => {
  return await Notification.create({
    user,
    title,
    message,
    type,
  });
};

module.exports = {
  createNotification,
};