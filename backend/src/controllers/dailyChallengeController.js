const {
  getTodayChallenge,
  completeChallenge,
} = require("../services/dailyChallengeService");

const getChallenge = async (req, res) => {
  try {
    const challenge = await getTodayChallenge(req.user._id);

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge.",
    });
  }
};

const completeTodayChallenge = async (req, res) => {
  try {
    const challenge = await completeChallenge(req.user._id);

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to complete challenge.",
    });
  }
};

module.exports = {
  getChallenge,
  completeTodayChallenge,
};