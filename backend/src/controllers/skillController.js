const Skill = require("../models/Skill");

const { checkStreakDeadline } = require("../utils/streakEngine");
const { createNotification } = require("../services/notificationService");
const { incrementAchievement, setAchievementProgress } = require("../services/achievementService");
const { addXP, XP_REWARDS } = require("../services/xpService");
const { updateChallengeProgress } = require("../services/dailyChallengeService");
const { triggerUserMLRefresh } = require("../services/mlRefreshService");

/**
 * Add Skill
 */
const addSkill = async (req, res) => {
  try {
    const { skillName, category } = req.body;

    const skill = await Skill.create({
      user: req.user._id,
      skillName,
      category,
    });
    await createNotification({
      user: req.user._id,
      title: "📚 New Skill Added",
      message: `${skill.skillName} has been added successfully.`,
      type: "skill",
    });
    // ===========================
    // Achievement Integration
    // ===========================

    const totalSkills = await Skill.countDocuments({
      user: req.user._id,
    });

    // First Skill Achievement
    if (totalSkills === 1) {
      await incrementAchievement(
        req.user._id,
        "first_skill"
      );
    }

    // PolyMath Achievement
    await setAchievementProgress(
      req.user._id,
      "polymath",
      totalSkills
    );

    // ===========================
    // XP Integration
    // ===========================

    await addXP(
      req.user._id,
      XP_REWARDS.CREATE_SKILL
    );
    await updateChallengeProgress(req.user._id, "skill", 1);

    // Automatic Telemetry ML Refresh Trigger (Sprint 10 Step 3)
    triggerUserMLRefresh(req.user._id, "skill_created").catch(() => {});

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

/**
 * Get All Skills
 */
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    });

    await Promise.all(
      skills.map((skill) =>
        checkStreakDeadline(skill)
      )
    );

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

/**
 * Delete Skill
 */
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (
      skill.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await Skill.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Update Skill
 */
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

    // Automatic Telemetry ML Refresh Trigger (Sprint 10 Step 3)
    triggerUserMLRefresh(req.user._id, "skill_progress_updated").catch(() => {});

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