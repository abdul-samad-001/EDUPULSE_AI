const Skill = require("../models/Skill");

const { checkStreakDeadline } = require("../utils/streakEngine");
const {incrementAchievement,setAchievementProgress,} = require("../services/achievementService");

const addSkill = async (req, res) => {
  try {
    const { skillName, category } = req.body;

    const skill = await Skill.create({
      user: req.user._id,
      skillName,
      category,
    });

    // Achievement Integration
    const totalSkills = await Skill.countDocuments({
      user: req.user._id,
    });

    // Unlock "Getting Started"
    if (totalSkills === 1) {
      await incrementAchievement(
        req.user._id,
        "first_skill"
      );
    }

    // Update "PolyMath"
    await setAchievementProgress(
      req.user._id,
      "polymath",
      totalSkills
    );

    res.status(201).json({
      success: true,
      skill,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    });
    await Promise.all(skills.map((skill) => checkStreakDeadline(skill)));

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await Skill.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateSkill = async (req, res) => {
  try {
    const { progress, completed } = req.body;
    const skill = await Skill.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (progress !== undefined) {
      skill.progress = progress;
    }

    if (completed !== undefined) {
      skill.completed = completed;
    }

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  addSkill,
  getSkills,
  deleteSkill,
  updateSkill,
};