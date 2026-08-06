const {
  getLeaderboard,
  getUserRank,
} = require("../services/leaderboardService");

/**
 * GET /api/leaderboard
 */
const getLeaderboardData = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard.",
    });
  }
};

/**
 * GET /api/leaderboard/me
 */
const getMyRank = async (req, res) => {
  try {
    const rank = await getUserRank(req.user._id);

    res.status(200).json({
      success: true,
      data: rank,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch rank.",
    });
  }
};

module.exports = {
  getLeaderboardData,
  getMyRank,
};