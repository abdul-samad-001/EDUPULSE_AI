const FocusSession = require("../models/FocusSession");
const {incrementAchievement, setAchievementProgress,} = require("../services/achievementService");
const {addXP,XP_REWARDS,} = require("../services/xpService");
const { updateChallengeProgress } = require("../services/dailyChallengeService");


/**
 * POST /api/focus/start
 * Start a new focus session
 */
const startFocusSession = async (req, res) => {
  try {
    const { skill, plannedDurationMinutes, notes } = req.body;

    if (!skill || !plannedDurationMinutes) {
      return res.status(400).json({
        success: false,
        message: "Skill and planned duration are required.",
      });
    }

    // Prevent multiple active sessions
    const activeSession = await FocusSession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: "A focus session is already active.",
      });
    }

    const session = await FocusSession.create({
      user: req.user._id,
      skill,
      plannedDurationMinutes,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Focus session started.",
      data: session,
    });
  } catch (error) {
    console.error("Start Focus Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start focus session.",
      error: error.message,
    });
  }
};
/**
 * POST /api/focus/stop
 * Stop the currently active focus session
 */
const stopFocusSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active focus session found.",
      });
    }

    const endedAt = new Date();

    const actualDurationMinutes = Math.round(
      (endedAt - session.startedAt) / (1000 * 60)
    );

    session.endedAt = endedAt;
    session.actualDurationMinutes = actualDurationMinutes;
    session.status = "completed";

    await session.save();
    await addXP(req.user._id,XP_REWARDS.COMPLETE_FOCUS);
    await incrementAchievement(req.user._id,"first_focus");
    await updateChallengeProgress(req.user._id,"focus",actualDurationMinutes);
    const totalSessions = await FocusSession.countDocuments({
      user: req.user._id,
      status: "completed",
    });

    await setAchievementProgress(
      req.user._id,
      "focus_legend",
      totalSessions
    );

    res.status(200).json({
      success: true,
      message: "Focus session completed.",
      data: session,
    });
  } catch (error) {
    console.error("Stop Focus Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to stop focus session.",
      error: error.message,
    });
  }
};

/**
 * GET /api/focus/active
 * Get the user's active focus session
 */
const getActiveSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      user: req.user._id,
      status: "active",
    }).populate("skill", "skillName");

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get Active Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active session.",
      error: error.message,
    });
  }
};

/**
 * GET /api/focus/history
 * Get all completed focus sessions
 */
const getSessionHistory = async (req, res) => {
  try {
    const sessions = await FocusSession.find({
      user: req.user._id,
    })
      .populate("skill", "skillName")
      .sort({ startedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error("Get Session History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session history.",
      error: error.message,
    });
  }
};

module.exports = {
  startFocusSession,
  stopFocusSession,
  getActiveSession,
  getSessionHistory,
};