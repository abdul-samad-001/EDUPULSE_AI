const Skill = require("../models/Skill");

const getDashboardStats = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    });

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
              (sum, skill) => sum + skill.progress,
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
    });
  } catch (error) {
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