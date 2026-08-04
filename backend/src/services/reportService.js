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
module.exports = {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgressReport,
  getAIReport,
};