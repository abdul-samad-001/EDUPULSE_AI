const mongoose = require("mongoose");
const {
  getTelemetryStats,
  getTopVisitedWebsites,
  getWeeklyTrend,
  getAIInsights,
} = require("./telemetryService");

const Skill = require("../models/Skill");
const Task = require("../models/Task");
const FocusSession = require("../models/FocusSession");
const UserXP = require("../models/UserXP");

const getReportSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const stats = await getTelemetryStats(userId);
  const websites = await getTopVisitedWebsites(userId);
  const weeklyTrend = await getWeeklyTrend(userId);
  const insights = await getAIInsights(userId);

  const [topSkills, userSkills, xpDoc, userDoc, focusSessions] = await Promise.all([
    Skill.find({ user: userObjectId })
      .sort({ progress: -1 })
      .limit(5)
      .select("skillName category progress"),
    Skill.find({ user: userObjectId }),
    UserXP.findOne({ user: userObjectId }),
    mongoose.model("User").findById(userObjectId).select("streak").lean(),
    FocusSession.find({ user: userObjectId }),
  ]);

  const skillIds = userSkills.map((s) => s._id);
  const [totalTasks, completedTasks] = await Promise.all([
    Task.countDocuments({ skill: { $in: skillIds } }),
    Task.countDocuments({ skill: { $in: skillIds }, completed: true }),
  ]);

  const taskCompletionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : (userSkills.length > 0 ? Math.round((userSkills.filter((s) => s.progress === 100).length / userSkills.length) * 100) : 0);

  const completedSessions = focusSessions.filter((s) => s.status === "completed");
  const focusScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / completedSessions.length)
    : Math.round(stats.productivePercentage || 0);

  const consistency = userDoc?.streak
    ? `${userDoc.streak} Day Streak`
    : (stats.productiveTime > 0 ? "Active" : "No sessions");

  const performance = {
    productivity: Math.round(stats.productivePercentage || 0),
    focusScore: focusScore || Math.round(stats.productivePercentage || 0),
    completionRate: taskCompletionRate,
    consistency: consistency,
    trend: weeklyTrend,
  };

  return {
    stats,
    websites,
    weeklyTrend,
    insights,
    topSkills,
    performance,
    userMetrics: {
      studyHours: Number(((stats.productiveTime || 0) / 3600).toFixed(1)),
      sessions: stats.totalSessions || focusSessions.length || 0,
      tasks: completedTasks,
      totalTasks,
      skills: userSkills.length,
      xp: xpDoc?.totalXP || xpDoc?.xp || 0,
      streak: userDoc?.streak || 0,
    },
  };
};

// Get weekly report
const getWeeklyReport = async (userId) => {
  const stats = await getTelemetryStats(userId, "week");
  const weeklyTrend = await getWeeklyTrend(userId);
  const insights = await getAIInsights(userId);

  const userSkills = await Skill.find({ user: userId });
  const xpDoc = await UserXP.findOne({ user: userId });
  const completedSkills = userSkills.filter((s) => s.progress === 100).length;

  return {
    stats,
    weeklyTrend,
    insights,
    studyHours: Number(((stats.productiveTime || 0) / 3600).toFixed(1)),
    productivity: Math.round(stats.productivePercentage || 0),
    xp: xpDoc?.totalXP || xpDoc?.xp || 0,
    achievements: 0,
    challenges: 0,
    skillsCompleted: completedSkills,
  };
};

// Get monthly report
const getMonthlyReport = async (userId) => {
  const stats = await getTelemetryStats(userId, "month");
  const websites = await getTopVisitedWebsites(userId, "month");

  const topSkills = await Skill.find({
    user: userId,
  })
    .sort({ progress: -1 })
    .limit(10)
    .select("skillName category progress");

  const mostImproved = topSkills.length > 0
    ? `${topSkills[0].skillName} (${topSkills[0].progress}% complete)`
    : "No skills created yet";

  return {
    stats,
    websites,
    topSkills,
    growth: stats.productiveTime > 0 ? "+100%" : "0%",
    productivity: Math.round(stats.productivePercentage || 0),
    learningHours: Number(((stats.productiveTime || 0) / 3600).toFixed(1)),
    consistency: stats.productiveTime > 0 ? "Active" : "0%",
    completionRate: `${topSkills.length > 0 ? Math.round((topSkills.filter(s => s.progress === 100).length / topSkills.length) * 100) : 0}%`,
    mostImprovedSkill: mostImproved,
  };
};

// Get skill progress
const getSkillProgressReport = async (userId) => {
  return await Skill.find({
    user: userId,
  }).select(
    "skillName category progress completed streakCount currentDay"
  );
};

// Get AI report
const getAIReport = async (userId) => {
  const insights = await getAIInsights(userId);
  const stats = await getTelemetryStats(userId);

  const score = Math.round(stats.productivePercentage || 0);

  let recommendation = "Start logging focus sessions to receive personalized AI recommendations.";
  if (stats.totalTrackedTime > 0) {
    recommendation = score >= 70
      ? "Excellent work! Keep your study routine consistent."
      : "Increase focus sessions and reduce distractions to improve productivity.";
  }

  return {
    productivityScore: score,
    insights,
    recommendation,
  };
};

// Get learning timeline strictly for this user
const getTimelineData = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const sessions = await FocusSession.find({ user: userObjectId })
    .populate("skill", "skillName")
    .sort({ startedAt: -1 })
    .limit(10);

  const skills = await Skill.find({ user: userObjectId })
    .sort({ createdAt: -1 })
    .limit(10);

  const skillIds = skills.map((s) => s._id);
  const tasks = await Task.find({ skill: { $in: skillIds }, completed: true })
    .sort({ updatedAt: -1 })
    .limit(10);

  const events = [];

  sessions.forEach((s) => {
    events.push({
      id: s._id.toString(),
      type: "Focus Session",
      title: `Completed ${s.actualDurationMinutes || s.plannedDurationMinutes || 0}m focus interval`,
      subtitle: s.skill?.skillName ? `Skill Track: ${s.skill.skillName}` : "General Study",
      timestamp: s.startedAt || s.createdAt,
      icon: "Timer",
    });
  });

  skills.forEach((sk) => {
    events.push({
      id: sk._id.toString(),
      type: "Skill Added",
      title: `Started learning ${sk.skillName}`,
      subtitle: `Category: ${sk.category || "General"}`,
      timestamp: sk.createdAt,
      icon: "BookOpen",
    });
  });

  tasks.forEach((t) => {
    events.push({
      id: t._id.toString(),
      type: "Task Completed",
      title: `Finished milestone: ${t.taskName}`,
      subtitle: `Assigned Day ${t.assignedDay || 1}`,
      timestamp: t.updatedAt || t.createdAt,
      icon: "CheckCircle2",
    });
  });

  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return events;
};

// Get user report archive / download history
const getReportsHistoryData = async (userId) => {
  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return [
    {
      id: `rep-wk-${userId ? userId.toString().slice(-4) : "01"}`,
      title: "Weekly Learning Intelligence Report",
      date: todayStr,
      type: "Weekly",
      format: "PDF / CSV",
    },
    {
      id: `rep-mo-${userId ? userId.toString().slice(-4) : "02"}`,
      title: "Monthly Productivity & Focus Audit",
      date: todayStr,
      type: "Monthly",
      format: "PDF / JSON",
    },
    {
      id: `rep-sk-${userId ? userId.toString().slice(-4) : "03"}`,
      title: "Skill Mastery Progress Summary",
      date: todayStr,
      type: "Skill Audit",
      format: "CSV",
    },
  ];
};

module.exports = {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgressReport,
  getAIReport,
  getTimelineData,
  getReportsHistoryData,
};