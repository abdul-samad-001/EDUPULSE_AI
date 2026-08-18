const FocusSession = require("../models/FocusSession");
const Skill = require("../models/Skill");
const Task = require("../models/Task");
const UserXP = require("../models/UserXP");
const TabSession = require("../models/TabSession");

const getProductivityData = async (userId) => {
  const sessions = await FocusSession.find({ user: userId, status: "completed" });
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayScores = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };

  sessions.forEach((s) => {
    const d = new Date(s.startedAt);
    const day = dayNames[d.getDay()];
    const score = s.focusScore || Math.min(100, Math.max(0, (s.actualDurationMinutes || 0) * 3));
    if (dayScores[day]) dayScores[day].push(score);
  });

  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daily = orderedDays.map((day) => {
    const scores = dayScores[day];
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { day, score: avg, productivity: avg };
  });

  let bestDay = "No sessions logged";
  let worstDay = "No sessions logged";
  let maxScore = 0;
  let minScore = 101;
  let hasActiveDay = false;

  daily.forEach((item) => {
    if (item.score > maxScore) {
      maxScore = item.score;
      bestDay = `${item.day} (${item.score}% score)`;
      hasActiveDay = true;
    }
    if (item.score > 0 && item.score < minScore) {
      minScore = item.score;
      worstDay = `${item.day} (${item.score}% score)`;
      hasActiveDay = true;
    }
  });

  if (!hasActiveDay) {
    bestDay = "No sessions yet";
    worstDay = "No sessions yet";
  }

  const activeDays = daily.filter((item) => item.score > 0);
  const totalScore = activeDays.reduce((sum, item) => sum + item.score, 0);
  const average = activeDays.length > 0 ? Math.round(totalScore / activeDays.length) : 0;

  const weekly = [
    { week: "Wk 1", score: 0 },
    { week: "Wk 2", score: 0 },
    { week: "Wk 3", score: 0 },
    { week: "Wk 4", score: average },
  ];

  const monthly = [
    { month: "May", score: 0 },
    { month: "Jun", score: 0 },
    { month: "Jul", score: 0 },
    { month: "Aug", score: average },
  ];

  return {
    daily,
    weekly,
    monthly,
    average,
    bestDay,
    worstDay,
  };
};

const getFocusAnalyticsData = async (userId) => {
  const sessions = await FocusSession.find({ user: userId, status: "completed" }).populate("skill", "skillName");

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDurationMinutes || 0), 0);
  const totalFocusHours = Number((totalMinutes / 60).toFixed(1));
  const sessionsCompleted = sessions.length;

  let longestSession = 0;
  sessions.forEach((s) => {
    if ((s.actualDurationMinutes || 0) > longestSession) longestSession = s.actualDurationMinutes;
  });

  const averageSession = sessionsCompleted > 0 ? Math.round(totalMinutes / sessionsCompleted) : 0;

  // Weekly trend for area chart
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMinsMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  sessions.forEach((s) => {
    const d = new Date(s.startedAt);
    const idx = (d.getDay() + 6) % 7;
    const name = dayNames[idx];
    dayMinsMap[name] += s.actualDurationMinutes || 0;
  });

  const trend = dayNames.map((day) => ({
    day,
    minutes: dayMinsMap[day],
    hours: Number((dayMinsMap[day] / 60).toFixed(1)),
  }));

  const weeklyFocus = Number((trend.reduce((sum, item) => sum + item.hours, 0)).toFixed(1));

  return {
    totalFocusHours,
    weeklyFocus,
    averageSession,
    longestSession,
    sessionsCompleted,
    trend,
  };
};

const getSkillAnalyticsData = async (userId) => {
  const skills = await Skill.find({ user: userId });
  const tasks = await Task.find({ user: userId });

  const skillsStarted = skills.length;
  const skillsCompleted = skills.filter((s) => s.progress === 100).length;
  const tasksCompleted = tasks.filter((t) => t.completed).length;

  const totalProgress = skills.reduce((sum, s) => sum + (s.progress || 0), 0);
  const roadmapProgress = skillsStarted > 0 ? Math.round(totalProgress / skillsStarted) : 0;
  const skillCompletionPercentage = skillsStarted > 0 ? Math.round((skillsCompleted / skillsStarted) * 100) : 0;

  const hoursPerSkill = skills.slice(0, 6).map((s) => ({
    skillName: s.skillName,
    hours: Number(((s.progress || 0) * 0.15).toFixed(1)),
    progress: s.progress || 0,
  }));

  // Task completion grouped by category
  const categoryMap = {};
  skills.forEach((s) => {
    const cat = s.category || "General";
    categoryMap[cat] = categoryMap[cat] || { completed: 0, total: 0 };
    categoryMap[cat].total += 1;
    if (s.progress === 100) categoryMap[cat].completed += 1;
  });

  const taskCompletion = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    completed: categoryMap[cat].completed,
    total: categoryMap[cat].total,
  }));

  return {
    skillsStarted,
    skillsCompleted,
    tasksCompleted,
    roadmapProgress,
    skillCompletionPercentage,
    hoursPerSkill,
    taskCompletion,
  };
};

const getSummaryData = async (userId) => {
  const sessions = await FocusSession.find({ user: userId, status: "completed" });
  const skills = await Skill.find({ user: userId });
  const xpDoc = await UserXP.findOne({ user: userId });

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDurationMinutes || 0), 0);
  const studyHours = Number((totalMinutes / 60).toFixed(1));

  return {
    studyHours,
    focusSessions: sessions.length,
    xpEarned: xpDoc?.xp ?? 0,
    skillsImproved: skills.filter((s) => (s.progress || 0) > 0).length,
    challengesCompleted: 0,
  };
};

const getGoalData = async (userId) => {
  const summary = await getSummaryData(userId);

  return {
    weeklyGoal: { target: 12, current: Math.min(12, summary.studyHours), unit: "hours", progress: Math.min(100, Math.round((summary.studyHours / 12) * 100)) },
    monthlyGoal: { target: 50, current: Math.min(50, summary.studyHours * 2.5), unit: "hours", progress: Math.min(100, Math.round(((summary.studyHours * 2.5) / 50) * 100)) },
    xpGoal: { target: 1000, current: summary.xpEarned, unit: "XP", progress: Math.min(100, Math.round((summary.xpEarned / 1000) * 100)) },
    skillGoal: { target: 5, current: summary.skillsImproved, unit: "skills", progress: Math.min(100, Math.round((summary.skillsImproved / 5) * 100)) },
  };
};

module.exports = {
  getProductivityData,
  getFocusAnalyticsData,
  getSkillAnalyticsData,
  getSummaryData,
  getGoalData,
};
