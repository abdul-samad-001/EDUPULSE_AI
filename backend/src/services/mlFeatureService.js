const FocusSession = require("../models/FocusSession");
const Skill = require("../models/Skill");
const Task = require("../models/Task");
const UserXP = require("../models/UserXP");
const TabSession = require("../models/TabSession");

/**
 * Extracts and aggregates raw user telemetry metrics from MongoDB collections.
 */
const getUserAggregatedMetrics = async (userId) => {
  // 1. Focus Sessions
  const sessions = await FocusSession.find({ user: userId, status: "completed" });
  const totalFocusSessions = sessions.length;
  const totalActualMinutes = sessions.reduce(
    (sum, s) => sum + (s.actualDurationMinutes || 0),
    0
  );
  const studyHours = Number((totalActualMinutes / 60).toFixed(2));
  const avgSessionMinutes =
    totalFocusSessions > 0
      ? Number((totalActualMinutes / totalFocusSessions).toFixed(1))
      : 30.0;

  const productiveMinutes = Number(
    (
      sessions.reduce((sum, s) => sum + (s.productiveSeconds || 0), 0) / 60 ||
      totalActualMinutes * 0.8
    ).toFixed(1)
  );

  const distractionMinutes = Number(
    (
      sessions.reduce((sum, s) => sum + (s.distractionSeconds || 0), 0) / 60 ||
      totalActualMinutes * 0.15
    ).toFixed(1)
  );

  const idleMinutes = Number(
    (
      sessions.reduce((sum, s) => sum + (s.pausedDuration || 0), 0) ||
      totalActualMinutes * 0.05
    ).toFixed(1)
  );

  const focusScoreSum = sessions.reduce((sum, s) => sum + (s.focusScore || 75), 0);
  const focusScore =
    totalFocusSessions > 0
      ? Number((focusScoreSum / totalFocusSessions).toFixed(1))
      : 75.0;

  // 2. Skills
  const skills = await Skill.find({ user: userId });
  const maxStreak =
    skills.length > 0
      ? Math.max(...skills.map((s) => s.streakCount || 0))
      : 0;
  const skillsCompleted = skills.filter(
    (s) => s.progress === 100 || s.completed
  ).length;
  const avgProgress =
    skills.length > 0
      ? Number(
          (
            skills.reduce((sum, s) => sum + (s.progress || 0), 0) / skills.length
          ).toFixed(1)
        )
      : 50.0;

  // 3. Tasks
  const tasks = await Task.find({ user: userId });
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const totalTasks = tasks.length;
  const deadlineCompletionRate =
    totalTasks > 0
      ? Number(((completedTasks / totalTasks) * 100).toFixed(1))
      : 80.0;

  // 4. UserXP
  const xpDoc = await UserXP.findOne({ user: userId });
  const xp = xpDoc ? xpDoc.totalXP : 0;
  const level = xpDoc ? xpDoc.level : 1;

  // 5. TabSessions & FocusSessions (Category-based domain breakdown)
  const tabSessions = await TabSession.find({ user: userId });
  let codingHours = 0;
  let readingHours = 0;
  let revisionHours = 0;

  // Include completed coding FocusSessions
  const codingSessions = sessions.filter(
    (s) => s.category === "coding" || (s.notes && s.notes.toLowerCase().includes("coding"))
  );
  const codingSessionMinutes = codingSessions.reduce(
    (sum, s) => sum + (s.actualDurationMinutes || 0),
    0
  );
  codingHours += codingSessionMinutes / 60;

  tabSessions.forEach((t) => {
    const hours = (t.durationSeconds || 0) / 3600;
    const cat = (t.category || "").toLowerCase();
    const dom = (t.domain || "").toLowerCase();

    if (
      dom.includes("github") ||
      dom.includes("leetcode") ||
      dom.includes("vscode") ||
      dom.includes("stackoverflow") ||
      cat === "productive"
    ) {
      codingHours += hours;
    } else if (dom.includes("medium") || dom.includes("docs") || dom.includes("read")) {
      readingHours += hours;
    } else {
      revisionHours += hours;
    }
  });

  return {
    productivity_score: focusScore,
    focus_score: focusScore,
    study_hours: studyHours > 0 ? studyHours : 4.0,
    study_hours_per_day: studyHours > 0 ? Number((studyHours / 7).toFixed(1)) : 3.5,
    xp: xp,
    xp_earned: xp,
    level: level,
    current_level: level,
    streak_days: maxStreak,
    completed_tasks: completedTasks,
    pending_tasks: pendingTasks,
    coding_hours: Number(codingHours.toFixed(1)),
    reading_hours: Number(readingHours.toFixed(1)),
    revision_hours: Number(revisionHours.toFixed(1)),
    quiz_score: 75.0,
    practice_questions: completedTasks * 3 || 20,
    productive_minutes: productiveMinutes || 180.0,
    distraction_minutes: distractionMinutes || 30.0,
    idle_minutes: idleMinutes || 20.0,
    idle_time_minutes: idleMinutes || 20.0,
    sleep_hours: 7.5,
    break_frequency: 2,
    skill_progress: avgProgress,
    skills_completed: skillsCompleted,
    deadline_completion_rate: deadlineCompletionRate,
    focus_sessions: totalFocusSessions,
    average_session_minutes: avgSessionMinutes,
    focus_session_minutes: avgSessionMinutes,
    app_usage_minutes: Number((totalActualMinutes * 1.2).toFixed(1)) || 120.0,
    lms_logins_per_week: 5,
    submission_offset_hours: 0.0,
    completion_rate_percent: deadlineCompletionRate,
    deadline_misses_30d: 0,
    avg_session_length_min: avgSessionMinutes,
    distraction_visits_per_day: 5,
  };
};

/**
 * Model 1 (Procrastination Risk) Feature Builder — 11 Features
 */
const buildProcrastinationFeatures = async (userId, overridePayload = {}) => {
  const base = await getUserAggregatedMetrics(userId);
  const merged = { ...base, ...overridePayload };

  const MODEL1_KEYS = [
    "study_hours_per_day",
    "app_usage_minutes",
    "idle_time_minutes",
    "lms_logins_per_week",
    "submission_offset_hours",
    "completion_rate_percent",
    "deadline_misses_30d",
    "streak_days",
    "avg_session_length_min",
    "distraction_visits_per_day",
    "sleep_hours",
  ];

  const result = {};
  for (const key of MODEL1_KEYS) {
    const val = Number(merged[key]);
    result[key] = isNaN(val) ? 0 : val;
  }
  return result;
};

/**
 * Model 2 (Productivity Score) Feature Builder — 20 Features
 */
const buildProductivityFeatures = async (userId, overridePayload = {}) => {
  const base = await getUserAggregatedMetrics(userId);
  const merged = { ...base, ...overridePayload };

  const MODEL2_KEYS = [
    "study_hours_per_day",
    "focus_session_minutes",
    "productive_minutes",
    "distraction_minutes",
    "idle_time_minutes",
    "completed_tasks",
    "pending_tasks",
    "deadline_completion_rate",
    "coding_hours",
    "reading_hours",
    "revision_hours",
    "quiz_score",
    "practice_questions",
    "sleep_hours",
    "break_frequency",
    "focus_score",
    "xp_earned",
    "current_level",
    "streak_days",
    "skills_completed",
  ];

  const result = {};
  for (const key of MODEL2_KEYS) {
    const val = Number(merged[key]);
    result[key] = isNaN(val) ? 0 : val;
  }
  return result;
};

/**
 * Model 3 V2 (Recommendation Engine) Feature Builder — 20 Features
 * Centralized feature contract matching V2 metadata order strictly.
 */
const buildRecommendationFeatures = async (userId, overridePayload = {}) => {
  const base = await getUserAggregatedMetrics(userId);
  const merged = { ...base, ...overridePayload };

  const MODEL3_V2_KEYS = [
    "productivity_score",
    "focus_score",
    "study_hours",
    "xp",
    "level",
    "streak_days",
    "completed_tasks",
    "pending_tasks",
    "coding_hours",
    "reading_hours",
    "revision_hours",
    "quiz_score",
    "productive_minutes",
    "distraction_minutes",
    "idle_minutes",
    "sleep_hours",
    "skill_progress",
    "deadline_completion_rate",
    "focus_sessions",
    "average_session_minutes",
  ];

  const result = {};
  for (const key of MODEL3_V2_KEYS) {
    const val = Number(merged[key]);
    result[key] = isNaN(val) ? 0 : val;
  }
  return result;
};

module.exports = {
  getUserAggregatedMetrics,
  buildProcrastinationFeatures,
  buildProductivityFeatures,
  buildRecommendationFeatures,
};
