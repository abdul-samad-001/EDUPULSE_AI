const TabSession = require("../models/TabSession");
const DistractionLog = require("../models/DistractionLog");

/**
 * Aggregate today's telemetry for a user
 */
const aggregateTodayTelemetry = async (userId) => {
  // Beginning of today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Beginning of tomorrow
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Get today's sessions
  const sessions = await TabSession.find({
    user: userId,
    startedAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  let productiveSeconds = 0;
  let totalDistractionSeconds = 0;
  let neutralSeconds = 0;
  let distractionVisits = 0;

  for (const session of sessions) {
    switch (session.category) {
      case "productive":
        productiveSeconds += session.durationSeconds;
        break;

      case "distraction":
        totalDistractionSeconds += session.durationSeconds;
        distractionVisits++;
        break;

      default:
        neutralSeconds += session.durationSeconds;
    }
  }

  const totalTrackedSeconds =
    productiveSeconds +
    totalDistractionSeconds +
    neutralSeconds;

  const log = await DistractionLog.findOneAndUpdate(
    {
      user: userId,
      date: startOfDay,
    },
    {
      user: userId,
      date: startOfDay,
      productiveSeconds,
      totalDistractionSeconds,
      neutralSeconds,
      distractionVisits,
      totalTrackedSeconds,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};
/**
 * Get all telemetry sessions for a user
 */
const getUserSessions = async (userId) => {
  return await TabSession.find({
    user: userId,
  })
    .sort({ startedAt: -1 })
    .lean();
};
/**
 * Get telemetry statistics for a user
 */
const getTelemetryStats = async (userId) => {
  const sessions = await TabSession.find({ user: userId }).lean();

  let productiveTime = 0;
  let distractionTime = 0;
  let neutralTime = 0;

  for (const session of sessions) {
    switch (session.category) {
      case "productive":
        productiveTime += session.durationSeconds;
        break;

      case "distraction":
        distractionTime += session.durationSeconds;
        break;

      default:
        neutralTime += session.durationSeconds;
    }
  }

  const totalSessions = sessions.length;

  const totalTrackedTime =
    productiveTime +
    distractionTime +
    neutralTime;

  const averageSessionDuration =
    totalSessions === 0
      ? 0
      : Math.round(totalTrackedTime / totalSessions);

  const productivePercentage =
    totalTrackedTime === 0
      ? 0
      : Number(
          ((productiveTime / totalTrackedTime) * 100).toFixed(2)
        );

  return {
    totalSessions,
    totalTrackedTime,
    productiveTime,
    distractionTime,
    neutralTime,
    averageSessionDuration,
    productivePercentage,
  };
};
const getTopVisitedWebsites = async (userId) => {
  return await TabSession.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$domain",
        totalDuration: {
          $sum: "$durationSeconds",
        },
        sessions: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalDuration: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        domain: "$_id",
        totalDuration: 1,
        sessions: 1,
      },
    },
  ]);
};
const getWeeklyTrend = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return await TabSession.aggregate([
    {
      $match: {
        user: userId,
        category: "productive",
        startedAt: {
          $gte: sevenDaysAgo,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startedAt",
          },
        },
        productiveMinutes: {
          $sum: {
            $divide: ["$durationSeconds", 60],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        productiveMinutes: {
          $round: ["$productiveMinutes", 0],
        },
      },
    },
  ]);
};
const getHourlyProductivity = async (userId) => {
  const hourlyData = await TabSession.aggregate([
    {
      $match: {
        user: userId,
        category: "productive",
      },
    },
    {
      $group: {
        _id: {
          $hour: "$startedAt",
        },
        productiveMinutes: {
          $sum: {
            $divide: ["$durationSeconds", 60],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        productiveMinutes: {
          $round: ["$productiveMinutes", 0],
        },
      },
    },
    {
      $sort: {
        hour: 1,
      },
    },
  ]);

  const fullDay = [];

  for (let hour = 0; hour < 24; hour++) {
    const existing = hourlyData.find(
      (item) => item.hour === hour
    );

    fullDay.push({
      hour,
      productiveMinutes: existing
        ? existing.productiveMinutes
        : 0,
    });
  }

  return fullDay;
};
const getStudyVsDistract = async (userId) => {
  const result = await TabSession.aggregate([
    {
      $match: {
        user: userId,
        category: {
          $in: ["productive", "distraction"],
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalMinutes: {
          $sum: {
            $divide: ["$durationSeconds", 60],
          },
        },
      },
    },
  ]);

  let productiveMinutes = 0;
  let distractingMinutes = 0;

  result.forEach((item) => {
    if (item._id === "productive") {
      productiveMinutes = Math.round(item.totalMinutes);
    }

    if (item._id === "distraction") {
      distractingMinutes = Math.round(item.totalMinutes);
    }
  });

  return {
    productiveMinutes,
    distractingMinutes,
  };
};
const getAIInsights = async (userId) => {
  const stats = await getTelemetryStats(userId);
  const hourly = await getHourlyProductivity(userId);

  const insights = [];

  // Best productive hour
  const bestHour = hourly.reduce(
    (best, current) =>
      current.productiveMinutes > best.productiveMinutes
        ? current
        : best,
    hourly[0]
  );

  if (bestHour.productiveMinutes > 0) {
    insights.push({
      type: "success",
      title: "Best Productivity Hour",
      message: `You are most productive at ${bestHour.hour}:00.`,
    });
  }

  // High distraction
  if (stats.distractionTime > 30) {
    insights.push({
      type: "warning",
      title: "High Distraction",
      message: `You spent ${Math.round(
        stats.distractionTime
      )} minutes on distracting websites.`,
    });
  }

  // Productivity score
  if (stats.productivePercentage >= 70) {
    insights.push({
      type: "success",
      title: "Excellent Productivity",
      message: `Your productivity score is ${Math.round(
        stats.productivePercentage
      )}%.`,
    });
  } else {
    insights.push({
      type: "info",
      title: "Recommendation",
      message:
        "Try scheduling more focus sessions to improve your productivity.",
    });
  }

  return insights;
};
const getProcrastinationScore = async (userId) => {
  const stats = await getTelemetryStats(userId);

  const tracked = stats.totalTrackedTime || 0;
  const distraction = stats.distractionTime || 0;
  const productive = stats.productiveTime || 0;

  let score = 0;

  if (tracked > 0) {
    score = Math.round((distraction / tracked) * 100);
  }

  let level = "Low";
  let message = "Excellent focus! Keep it up.";

  if (score > 20) {
    level = "Medium";
    message =
      "You're spending noticeable time on distracting websites.";
  }

  if (score > 50) {
    level = "High";
    message =
      "High procrastination detected. Consider starting a focus session.";
  }

  return {
    score,
    level,
    productiveMinutes: Math.round(productive),
    distractingMinutes: Math.round(distraction),
    distractionPercentage: score,
    message,
  };
};

module.exports = {
  aggregateTodayTelemetry,
  getUserSessions,
  getTelemetryStats,
  getTopVisitedWebsites,
  getWeeklyTrend,
  getHourlyProductivity,
  getStudyVsDistract,
  getAIInsights,
  getProcrastinationScore,
};