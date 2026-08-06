const UserXP = require("../models/UserXP");
const User = require("../models/User");

/**
 * Get Top Users
 */
const getLeaderboard = async () => {
  const leaderboard = await UserXP.find()
    .populate("user", "name email")
    .sort({ totalXP: -1 })
    .limit(10);

  return leaderboard.map((item, index) => ({
    rank: index + 1,
    userId: item.user._id,
    name: item.user.name,
    email: item.user.email,
    totalXP: item.totalXP,
    level: item.level,
  }));
};

/**
 * Get Current User Rank
 */
const getUserRank = async (userId) => {
  const allUsers = await UserXP.find()
    .sort({ totalXP: -1 });

  const rank =
    allUsers.findIndex(
      (user) =>
        user.user.toString() === userId.toString()
    ) + 1;

  const current = await UserXP.findOne({
    user: userId,
  });

  return {
    rank,
    totalXP: current.totalXP,
    level: current.level,
    currentLevelXP: current.currentLevelXP,
    nextLevelXP: current.nextLevelXP,
  };
};

module.exports = {
  getLeaderboard,
  getUserRank,
};