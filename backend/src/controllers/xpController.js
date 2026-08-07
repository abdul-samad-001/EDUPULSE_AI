const {
  getXP,
} = require("../services/xpService");

const getUserXP = async (req, res) => {
  try {
    const xp = await getXP(req.user._id);

    res.status(200).json({
      success: true,
      data: xp,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch XP.",
    });
  }
};

module.exports = {
  getUserXP,
};