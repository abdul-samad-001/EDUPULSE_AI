const {
  getAchievements,
} = require("../services/achievementService");

// Get all achievements for logged-in user
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await getAchievements(req.user._id);

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements.",
    });
  }
};

module.exports = {
  getAllAchievements,
};