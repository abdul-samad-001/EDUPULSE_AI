const Skill = require("../models/Skill");
const Task = require("../models/Task");

const {
  predictProcrastination,
} = require("../services/mlService");

// ==========================================================
// PREDICT PROCRASTINATION RISK
// ==========================================================

const predictRisk = async (req, res) => {
  try {
    const { skillId } = req.body;

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!skillId) {
      return res.status(400).json({
        success: false,
        message: "skillId is required",
      });
    }

    // ======================================================
    // FETCH SKILL
    // ======================================================

    const skill = await Skill.findOne({
      _id: skillId,
      user: userId,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // ======================================================
    // FETCH TASKS
    // ======================================================

    const tasks = await Task.find({
      skill: skill._id,
    });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.completed
    ).length;

    const completionRate =
      totalTasks > 0
        ? (completedTasks / totalTasks) * 100
        : 0;

    // ======================================================
    // BUILD ML FEATURES
    // ======================================================

    const features = {
      // Temporary fallback until real study telemetry exists
      study_hours_per_day: 4,

      // Browser extension telemetry will replace this
      app_usage_minutes: 120,

      // Focus session telemetry will replace this
      idle_time_minutes: 30,

      // LMS integration not implemented yet
      lms_logins_per_week: 7,

      // Task deadline field not implemented yet
      submission_offset_hours: 24,

      // REAL DATA
      completion_rate_percent: Number(
        completionRate.toFixed(2)
      ),

      // No deadline schema currently exists
      deadline_misses_30d: 0,

      // REAL DATA
      streak_days: skill.streakCount || 0,

      // Focus session telemetry will replace this
      avg_session_length_min: 40,

      // Browser extension telemetry will replace this
      distraction_visits_per_day: 5,

      // Sleep tracking not implemented
      sleep_hours: 7,
    };

    // ======================================================
    // CALL FLASK ML SERVICE
    // ======================================================

    const prediction =
      await predictProcrastination(features);

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,

      skill: {
        id: skill._id,
        skillName: skill.skillName,
      },

      taskStats: {
        totalTasks,
        completedTasks,
        completionRate: Number(
          completionRate.toFixed(2)
        ),
      },

      prediction,

      telemetryStatus: {
        realFeatures: [
          "completion_rate_percent",
          "streak_days",
        ],

        fallbackFeatures: [
          "study_hours_per_day",
          "app_usage_minutes",
          "idle_time_minutes",
          "lms_logins_per_week",
          "submission_offset_hours",
          "deadline_misses_30d",
          "avg_session_length_min",
          "distraction_visits_per_day",
          "sleep_hours",
        ],
      },
    });
  } catch (error) {
    console.error(
      "Procrastination Prediction Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to predict procrastination risk",
    });
  }
};

module.exports = {
  predictRisk,
};