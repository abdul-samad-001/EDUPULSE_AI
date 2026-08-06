const UserXP = require("../models/UserXP");
const { createNotification } = require("./notificationService");
const XP_REWARDS = {
  CREATE_SKILL: 20,
  COMPLETE_TASK: 10,
  COMPLETE_FOCUS: 30,
  UNLOCK_ACHIEVEMENT: 50,
  DAILY_CHALLENGE: 100,
};

const calculateLevel = (totalXP) => {
  let level = 1;
  let nextLevelXP = 100;

  while (totalXP >= nextLevelXP) {
    level++;
    nextLevelXP += level * 100;
  }

  return {
    level,
    nextLevelXP,
  };
};

const initializeXP = async (userId) => {
  let xp = await UserXP.findOne({ user: userId });

  if (!xp) {
    xp = await UserXP.create({
      user: userId,
    });
  }

  return xp;
};

const addXP = async (userId, amount) => {
  let xp = await UserXP.findOne({ user: userId });

  if (!xp) {
    xp = await initializeXP(userId);
  }

  const previousLevel = xp.level;

  xp.totalXP += amount;

  const result = calculateLevel(xp.totalXP);

  xp.level = result.level;
  xp.nextLevelXP = result.nextLevelXP;

  const previousLevelXP =
    result.nextLevelXP - result.level * 100;

  xp.currentLevelXP =
    xp.totalXP - previousLevelXP;

  await xp.save();

  if (xp.level > previousLevel) {
    await createNotification({
      user: userId,
      title: "⭐ Level Up",
      message: `Congratulations! You reached Level ${xp.level}.`,
      type: "xp",
    });
  }

  return xp;
};

const getXP = async (userId) => {
  let xp = await UserXP.findOne({ user: userId });

  if (!xp) {
    xp = await initializeXP(userId);
  }

  return xp;
};

module.exports = {
  XP_REWARDS,
  initializeXP,
  addXP,
  getXP,
};