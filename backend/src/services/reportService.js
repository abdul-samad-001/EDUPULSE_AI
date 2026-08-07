const {
  getTelemetryStats,
  getTopVisitedWebsites,
  getWeeklyTrend,
  getAIInsights,
} = require("./telemetryService");

const Skill = require("../models/Skill");

const getReportSummary = async (userId) => {
  const stats = await getTelemetryStats(userId);

  const websites = await getTopVisitedWebsites(userId);

  const weeklyTrend =
    await getWeeklyTrend(userId);

  const insights = await getAIInsights(userId);

  const topSkills = await Skill.find({
    user: userId,
  })
    .sort({ progress: -1 })
    .limit(5)
    .select("skillName category progress");

  return {
    stats,
    websites,
    weeklyTrend,
    insights,
    topSkills,
  };
};
//get weekly report
const getWeeklyReport = async (userId) => {
  const stats = await getTelemetryStats(userId);

  const weeklyTrend = await getWeeklyTrend(userId);

  const insights = await getAIInsights(userId);

  return {
    stats,
    weeklyTrend,
    insights,
  };
};
//get monthly report
const getMonthlyReport = async (userId) => {
  const stats = await getTelemetryStats(userId);

  const websites = await getTopVisitedWebsites(userId);

  const topSkills = await Skill.find({
    user: userId,
  })
    .sort({ progress: -1 })
    .limit(10)
    .select("skillName category progress");

  return {
    stats,
    websites,
    topSkills,
  };
};

//get skill progress
const getSkillProgressReport = async (userId) => {
  return await Skill.find({
    user: userId,
  }).select(
    "skillName category progress completed streakCount currentDay"
  );
};


//getAi report
const getAIReport = async (userId) => {
  const insights = await getAIInsights(userId);

  const stats = await getTelemetryStats(userId);

  return {
    productivityScore:
      Math.round(stats.productivePercentage),

    insights,

    recommendation:
      stats.productivePercentage >= 70
        ? "Excellent work! Keep your study routine consistent."
        : "Increase focus sessions and reduce distractions to improve productivity.",
  };
};
// get learning timeline
const getTimelineData = async (userId) => {
  const FocusSession = require("../models/FocusSession");
  const Skill = require("../models/Skill");
  const Task = require("../models/Task");

  const sessions = await FocusSession.find({ user: userId }).populate("skill", "skillName").sort({ startedAt: -1 }).limit(10);
  const skills = await Skill.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
  const tasks = await Task.find({ user: userId, completed: true }).sort({ updatedAt: -1 }).limit(10);

  const events = [];

  sessions.forEach((s) => {
    events.push({
      id: s._id.toString(),
      type: "Focus Session",
      title: `Completed ${s.actualDurationMinutes || s.plannedDurationMinutes}m focus interval`,
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

  if (events.length === 0) {
    events.push(
      {
        id: "demo-1",
        type: "Skill Added",
        title: "Started learning React.js & Web Development",
        subtitle: "Category: Web Development",
        timestamp: new Date(Date.now() - 3600000 * 24),
        icon: "BookOpen",
      },
      {
        id: "demo-2",
        type: "Focus Session",
        title: "Completed 45m Pomodoro interval",
        subtitle: "Skill Track: React.js",
        timestamp: new Date(Date.now() - 3600000 * 48),
        icon: "Timer",
      }
    );
  }

  return events;
};

// get reports history
const getReportsHistoryData = async () => {
  return [
    {
      id: "rep-101",
      title: "Weekly Learning Intelligence Report",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: "Weekly",
      format: "PDF / CSV",
    },
    {
      id: "rep-102",
      title: "Monthly Productivity & Focus Audit",
      date: new Date(Date.now() - 3600000 * 24 * 7).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: "Monthly",
      format: "PDF / JSON",
    },
    {
      id: "rep-103",
      title: "Skill Mastery Progress Summary",
      date: new Date(Date.now() - 3600000 * 24 * 14).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
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