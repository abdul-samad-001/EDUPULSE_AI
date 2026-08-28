const mongoose = require("mongoose");
const UserXP = require("../models/UserXP");
require("../models/User"); // Ensure User model is registered for populate

const maskEmail = (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
};

/**
 * Get Top Users (Leaderboard)
 */
const getLeaderboard = async () => {
  if (mongoose.connection.readyState !== 1) {
    return [
      { rank: 1, userId: "mock1", name: "EduPulse Learner", email: "st***t@edupulse.ai", totalXP: 1200, level: 5 },
      { rank: 2, userId: "mock2", name: "Code Master", email: "ma***r@edupulse.ai", totalXP: 950, level: 4 },
    ];
  }

  const leaderboard = await UserXP.find()
    .populate("user", "name email")
    .sort({ totalXP: -1, createdAt: 1 })
    .limit(100);

  // Filter out any orphaned records where user document no longer exists
  const validLeaderboard = leaderboard.filter(
    (item) => item && item.user && item.user._id
  );

  return validLeaderboard.map((item, index) => ({
    rank: index + 1,
    userId: item.user._id,
    name: item.user.name || "EduPulse Learner",
    email: maskEmail(item.user.email),
    totalXP: item.totalXP || 0,
    level: item.level || 1,
  }));
};

/**
 * Get Current User Rank
 */
const getUserRank = async (userId) => {
  if (mongoose.connection.readyState !== 1) {
    return {
      userId,
      rank: 1,
      totalXP: 1200,
      level: 5,
      currentLevelXP: 200,
      nextLevelXP: 1500,
    };
  }

  const allLeaderboard = await UserXP.find()
    .populate("user", "name email")
    .sort({ totalXP: -1, createdAt: 1 });

  const validLeaderboard = allLeaderboard.filter(
    (item) => item && item.user && item.user._id
  );

  const rankIndex = validLeaderboard.findIndex(
    (item) => item.user._id.toString() === userId.toString()
  );

  const rank = rankIndex !== -1 ? rankIndex + 1 : validLeaderboard.length + 1;

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
    userId,
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