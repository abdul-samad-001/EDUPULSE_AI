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

module.exports = {
  aggregateTodayTelemetry,
  getUserSessions,
  getTelemetryStats,
};