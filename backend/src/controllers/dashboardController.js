const Skill = require("../models/Skill");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    });

    const user = await User.findById(req.user._id);

    let streak = 0;

    // ==========================================================
    // USER STREAK EXPIRY CHECK
    // ==========================================================

    if (user) {
      streak = user.streak || 0;

      if (user.lastActive && streak > 0) {
        const now = new Date();

        const todayMidnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const lastActiveMidnight = new Date(
          user.lastActive.getFullYear(),
          user.lastActive.getMonth(),
          user.lastActive.getDate()
        );

        const timeDifference =
          todayMidnight - lastActiveMidnight;

        const calendarDaysDelta = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );

        // More than one calendar day missed
        if (calendarDaysDelta > 1) {
          user.streak = 0;

          await user.save();

          streak = 0;
        }
      }
    }

    // ==========================================================
    // DASHBOARD STATISTICS
    // ==========================================================

    const totalSkills = skills.length;

    const completedSkills = skills.filter(
      (skill) => skill.completed
    ).length;

    const inProgressSkills =
      totalSkills - completedSkills;

    const overallProgress =
      totalSkills > 0
        ? Math.round(
            skills.reduce(
              (sum, skill) =>
                sum + skill.progress,
              0
            ) / totalSkills
          )
        : 0;

    res.status(200).json({
      success: true,
      totalSkills,
      completedSkills,
      inProgressSkills,
      overallProgress,
      streak,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    });

    const categories = {};

    skills.forEach((skill) => {
      categories[skill.category] =
        (categories[skill.category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentSkills,
  getCategoryStats,
};