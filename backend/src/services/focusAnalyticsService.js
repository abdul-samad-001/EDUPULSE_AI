const FocusSession = require("../models/FocusSession");

/**
 * Calculate weekly focus stats (Monday to Sunday)
 */
const getWeeklyData = async (userId) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMon = (currentDay + 6) % 7;

  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMon);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const sessions = await FocusSession.find({
    user: userId,
    startedAt: { $gte: monday, $lte: sunday },
    status: "completed",
  });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMinutesMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  sessions.forEach((s) => {
    const d = new Date(s.startedAt);
    const dayIndex = (d.getDay() + 6) % 7;
    const name = dayNames[dayIndex];
    dayMinutesMap[name] += s.actualDurationMinutes || 0;
  });

  const weeklyList = dayNames.map((day) => ({
    day,
    minutes: dayMinutesMap[day],
  }));

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDurationMinutes || 0), 0);
  const average = sessions.length > 0 ? Math.round(totalMinutes / 7) : 0;

  return {
    weekly: weeklyList,
    average,
    sessions: sessions.length,
    totalMinutes,
  };
};

/**
 * Calculate overall focus statistics
 */
const getStatistics = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  const distanceToMon = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - distanceToMon);
  weekStart.setHours(0, 0, 0, 0);

  const allSessions = await FocusSession.find({
    user: userId,
    status: "completed",
  });

  let todayMinutes = 0;
  let weekMinutes = 0;
  let totalMinutes = 0;
  let longestSession = 0;

  allSessions.forEach((s) => {
    const mins = s.actualDurationMinutes || 0;
    totalMinutes += mins;
    if (mins > longestSession) longestSession = mins;

    const sDate = new Date(s.startedAt);
    if (sDate >= todayStart) todayMinutes += mins;
    if (sDate >= weekStart) weekMinutes += mins;
  });

  const totalSessions = allSessions.length;
  const averageSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const focusScore = totalSessions > 0 ? Math.min(100, Math.max(70, Math.round(80 + (averageSession > 25 ? 10 : 0)))) : 85;

  return {
    todayMinutes,
    weekMinutes,
    averageSession,
    longestSession,
    totalSessions,
    focusScore,
  };
};

/**
 * Calculate focus insights (best study time, most studied skill, etc.)
 */
const getInsights = async (userId) => {
  const sessions = await FocusSession.find({
    user: userId,
    status: "completed",
  }).populate("skill", "skillName");

  if (sessions.length === 0) {
    return {
      bestStudyTime: "Morning (9 AM - 12 PM)",
      mostStudiedSkill: "General Learning",
      averageFocus: "25 min / session",
      longestSession: "0 min",
    };
  }

  // Calculate most studied skill
  const skillMap = {};
  const timeBlockCount = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  let longestSession = 0;
  let totalMinutes = 0;

  sessions.forEach((s) => {
    const mins = s.actualDurationMinutes || 0;
    totalMinutes += mins;
    if (mins > longestSession) longestSession = mins;

    if (s.skill && s.skill.skillName) {
      const name = s.skill.skillName;
      skillMap[name] = (skillMap[name] || 0) + mins;
    }

    const hour = new Date(s.startedAt).getHours();
    if (hour >= 6 && hour < 12) timeBlockCount.Morning += 1;
    else if (hour >= 12 && hour < 17) timeBlockCount.Afternoon += 1;
    else if (hour >= 17 && hour < 22) timeBlockCount.Evening += 1;
    else timeBlockCount.Night += 1;
  });

  // Find peak time block
  let bestTime = "Morning (9 AM - 12 PM)";
  let maxCount = -1;
  Object.keys(timeBlockCount).forEach((block) => {
    if (timeBlockCount[block] > maxCount) {
      maxCount = timeBlockCount[block];
      if (block === "Morning") bestTime = "Morning (6 AM - 12 PM)";
      else if (block === "Afternoon") bestTime = "Afternoon (12 PM - 5 PM)";
      else if (block === "Evening") bestTime = "Evening (5 PM - 10 PM)";
      else bestTime = "Night (10 PM - 6 AM)";
    }
  });

  // Find top skill
  let mostStudiedSkill = "General Learning";
  let maxSkillMins = -1;
  Object.keys(skillMap).forEach((name) => {
    if (skillMap[name] > maxSkillMins) {
      maxSkillMins = skillMap[name];
      mostStudiedSkill = name;
    }
  });

  const avgFocusMins = Math.round(totalMinutes / sessions.length);

  return {
    bestStudyTime: bestTime,
    mostStudiedSkill,
    averageFocus: `${avgFocusMins} min / session`,
    longestSession: `${longestSession} min`,
  };
};

module.exports = {
  getWeeklyData,
  getStatistics,
  getInsights,
};
