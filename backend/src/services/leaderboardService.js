const mongoose = require("mongoose");
const UserXP = require("../models/UserXP");
require("../models/User"); // Ensure User model is registered for populate

/**
 * Get Top Users (Leaderboard)
 */
const getLeaderboard = async () => {
  if (mongoose.connection.readyState !== 1) {
    return [
      { rank: 1, userId: "mock1", name: "EduPulse Learner", email: "student@edupulse.ai", totalXP: 1200, level: 5 },
      { rank: 2, userId: "mock2", name: "Code Master", email: "master@edupulse.ai", totalXP: 950, level: 4 },
    ];
  }

  const leaderboard = await UserXP.find()
    .populate("user", "name email")
    .sort({ totalXP: -1 })
    .limit(20);

  // Filter out any orphaned records where user document no longer exists
  const validLeaderboard = leaderboard.filter(
    (item) => item && item.user && item.user._id
  );

  return validLeaderboard.slice(0, 10).map((item, index) => ({
    rank: index + 1,
    userId: item.user._id,
    name: item.user.name || "EduPulse Learner",
    email: item.user.email || "",
    totalXP: item.totalXP || 0,
    level: item.level || 1,
  }));
};

/**
 * Get Current User Rank
 */
const getUserRank = async (userId) => {
  const allUsers = await UserXP.find().sort({ totalXP: -1 });

  const validUsers = allUsers.filter((item) => item && item.user);

  const rankIndex = validUsers.findIndex(
    (item) => item.user.toString() === userId.toString()
  );

  const rank = rankIndex !== -1 ? rankIndex + 1 : validUsers.length + 1;

  let current = await UserXP.findOne({ user: userId });

  if (!current) {
    current = {
      totalXP: 0,
      level: 1,
      currentLevelXP: 0,
      nextLevelXP: 100,
    };
  }

  return {
    rank,
    totalXP: current.totalXP || 0,
    level: current.level || 1,
    currentLevelXP: current.currentLevelXP || 0,
    nextLevelXP: current.nextLevelXP || 100,
  };
};

module.exports = {
  getLeaderboard,
  getUserRank,
};