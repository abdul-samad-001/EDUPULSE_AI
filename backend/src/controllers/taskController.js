const { generateRoadmapTasks } = require("../services/geminiService");
const Task = require("../models/Task");
const Skill = require("../models/Skill");
const User = require("../models/User"); // Imported to handle user updates
const { checkStreakDeadline, advanceDayIfComplete } = require("../utils/streakEngine");
const { setAchievementProgress } = require("../services/achievementService");
const { addXP, XP_REWARDS } = require("../services/xpService");
const { updateChallengeProgress } = require("../services/dailyChallengeService");
const { triggerUserMLRefresh } = require("../services/mlRefreshService");

const getTasksBySkill = async (req, res) => {
  try {
    const skill = await Skill.findById(
      req.params.skillId
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    // Evaluate per-skill streak deadline
    await checkStreakDeadline(skill);

    const tasks = await Task.find({
      skill: req.params.skillId,
    }).sort("order");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName, assignedDay } = req.body;
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }
    const task = await Task.create({
      skill: req.params.skillId,
      taskName,
      assignedDay: assignedDay || skill.currentDay || 1,
    });

    if (req.user && req.user._id) {
      triggerUserMLRefresh(req.user._id, "task_created").catch(() => {});
    }

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = completed;
    await task.save();
    // Award XP only when a task is completed
    if (completed === true) {
      await addXP(req.user._id, XP_REWARDS.COMPLETE_TASK);
    }
    // Recalculate progress for the linked skill
    const tasks = await Task.find({
      skill: task.skill,
    });

    const completedTasks = tasks.filter((t) => t.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    await Skill.findByIdAndUpdate(task.skill, {
      progress,
      completed: progress === 100,
    });
    const skillDoc = await Skill.findById(task.skill);
    if (skillDoc) {
      await advanceDayIfComplete(skillDoc);
      await checkStreakDeadline(skillDoc);
    }
    // ==========================================
    // DAY 19 STREAK SYSTEM HOOK
    // ==========================================
    if (completed === true && req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        const now = new Date();
        if (!user.lastActive) {
          // First task ever completed by this user
          user.streak = 1;
        } else {
          // Normalize dates to midnights for pure calendar-day tracking
          const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastActiveMidnight = new Date(user.lastActive.getFullYear(), user.lastActive.getMonth(), user.lastActive.getDate());
          const timeDifference = todayMidnight - lastActiveMidnight;
          const calendarDaysDelta = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          if (calendarDaysDelta === 1) {
            // Task checked off on the very next consecutive day
            user.streak += 1;
          } else if (calendarDaysDelta > 1) {
            // A gap of more than 24 hours / missed a day -> reset back to 1
            user.streak = 1;
          }
          // If calendarDaysDelta is 0, they already checked a task today, keeping the streak same
        }

        user.lastActive = now; // Update timestamp
        await user.save();
        // ================================
        // Achievement Integration
        // ================================

        const userSkills = await Skill.find({
          user: req.user._id,
        }).select("_id");
        const skillIds = userSkills.map((skill) => skill._id);

        const totalCompletedTasks = await Task.countDocuments({
          skill: { $in: skillIds },
          completed: true,
        });
        await updateChallengeProgress(req.user._id, "task", totalCompletedTasks);
        await setAchievementProgress(req.user._id, "task_master", totalCompletedTasks);
      }
    }
    // ==========================================

    // Automatic Telemetry ML Refresh Trigger (Sprint 10 Step 3)
    if (req.user && req.user._id) {
      triggerUserMLRefresh(req.user._id, completed ? "task_completed" : "task_status_changed").catch(() => {});
    }

    res.status(200).json({
      success: true,
      task,
      skill: skillDoc || null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const generateAIRoadmap = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    // Ownership check — same pattern as deleteSkill in skillController.js
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const aiTasks = await generateRoadmapTasks(skill.skillName, skill.category);

    // Clear old AI-generated tasks before inserting the fresh batch
    await Task.deleteMany({ skill: skill._id });

    const taskDocuments = aiTasks.map((task, index) => ({
      skill: skill._id,
      taskName: task.taskName,
      difficulty: task.difficulty,
      assignedDay: task.assignedDay || 1,
      order: index,
      completed: false,
    }));

    const createdTasks = await Task.insertMany(taskDocuments);

    // Reset progress since the task list changed entirely —
    // reuses the exact same recalculation shape as updateTask
    await Skill.findByIdAndUpdate(skill._id, {
      progress: 0,
      completed: false,
      currentDay: 1,
      streakCount: 0,
      lastCompletedAt: null,
    });

    if (req.user && req.user._id) {
      triggerUserMLRefresh(req.user._id, "ai_roadmap_generated").catch(() => {});
    }

    res.status(201).json({
      success: true,
      count: createdTasks.length,
      tasks: createdTasks,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Failed to generate AI roadmap. Gemini may be temporarily unavailable.",
    });
  }
};

module.exports = {
  getTasksBySkill,
  createTask,
  updateTask,
  generateAIRoadmap,
};