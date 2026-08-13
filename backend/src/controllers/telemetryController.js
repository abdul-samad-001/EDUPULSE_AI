const {
  aggregateTodayTelemetry,
  getUserSessions,
  getTelemetryStats,
  getTopVisitedWebsites,
  getWeeklyTrend,
  getHourlyProductivity,
  getStudyVsDistract,
  getAIInsights,
  getProcrastinationScore,
} = require("../services/telemetryService");
const TabSession = require("../models/TabSession");
const { triggerUserMLRefresh } = require("../services/mlRefreshService");

/**
 * POST /api/telemetry/sessions
 * Receives browser telemetry sessions from the Chrome extension.
 */
const uploadSessions = async (req, res) => {
  try {
    const { sessions } = req.body;

    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No telemetry sessions received.",
      });
    }

    const documents = [];
    for (const session of sessions) {
      if (!session.domain || !session.durationSeconds || session.durationSeconds <= 0) continue;

      const startedDate = new Date(session.startedAt);
      const existing = await TabSession.findOne({
        user: req.user._id,
        domain: session.domain,
        startedAt: startedDate,
      });

      if (!existing) {
        documents.push({
          user: req.user._id,
          domain: session.domain,
          category: session.category || "neutral",
          startedAt: startedDate,
          endedAt: new Date(session.endedAt),
          durationSeconds: session.durationSeconds,
          focusSession: !!session.focusSession,
          source: "extension",
        });
      }
    }

    if (documents.length > 0) {
      await TabSession.insertMany(documents);
      // Automatic Telemetry ML Refresh Trigger (Sprint 10 Step 3)
      triggerUserMLRefresh(req.user._id, "telemetry_sync").catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: "Telemetry uploaded successfully.",
      sessionsStored: documents.length,
    });
  } catch (error) {
    console.error("Telemetry Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to store telemetry.",
      error: error.message,
    });
  }
};

/**
 * GET /api/telemetry/today
 */
const getTodayTelemetry = async (req, res) => {
  try {
    const summary = await aggregateTodayTelemetry(req.user._id);
    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("Telemetry Today Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/telemetry/stats
 */
const getStats = async (req, res) => {
  try {
    const stats = await getTelemetryStats(req.user._id);
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Telemetry Stats Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};

/**
 * GET /api/telemetry/my-sessions
 */
const getMySessions = async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user._id);
    return res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    console.error("Get My Sessions Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch sessions." });
  }
};

const getTopWebsites = async (req, res) => {
  try {
    const websites = await getTopVisitedWebsites(req.user._id);
    return res.status(200).json({ success: true, data: websites });
  } catch (error) {
    console.error("Top Websites Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch top websites." });
  }
};

const getWeeklyProductivityTrend = async (req, res) => {
  try {
    const trend = await getWeeklyTrend(req.user._id);
    return res.status(200).json({ success: true, data: trend });
  } catch (error) {
    console.error("Weekly Trend Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch weekly trend." });
  }
};

const getHourlyHeatmap = async (req, res) => {
  try {
    const data = await getHourlyProductivity(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Hourly Heatmap Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch hourly heatmap." });
  }
};

const getStudyVsDistractStats = async (req, res) => {
  try {
    const data = await getStudyVsDistract(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Study vs Distract Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch study vs distract." });
  }
};

const getAIProductivityInsights = async (req, res) => {
  try {
    const insights = await getAIInsights(req.user._id);
    return res.status(200).json({ success: true, data: insights });
  } catch (error) {
    console.error("AI Insights Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch AI insights." });
  }
};

const getProcrastinationAnalytics = async (req, res) => {
  try {
    const data = await getProcrastinationScore(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Procrastination Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch procrastination score." });
  }
};

/**
 * GET /api/telemetry/status
 */
const getTelemetryStatus = async (req, res) => {
  try {
    const latestSession = await TabSession.findOne({ user: req.user._id }).sort({ endedAt: -1 });
    const todaySummary = (await aggregateTodayTelemetry(req.user._id)) || {};

    return res.status(200).json({
      success: true,
      connected: true,
      user: { name: req.user.name, email: req.user.email },
      lastSync: latestSession ? latestSession.endedAt : new Date(),
      todayTracking: `${Math.round((todaySummary.totalSeconds || 0) / 60)} mins`,
      currentWebsite: latestSession ? latestSession.domain : "edupulse.ai",
    });
  } catch (error) {
    console.error("Telemetry Status Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch telemetry status." });
  }
};

/**
 * GET /api/telemetry/summary
 */
const getTelemetrySummary = async (req, res) => {
  try {
    const todaySummary = (await aggregateTodayTelemetry(req.user._id)) || {};
    const topSites = await getTopVisitedWebsites(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        productiveTime: Math.round((todaySummary.productiveSeconds || 0) / 60),
        distractionTime: Math.round((todaySummary.totalDistractionSeconds || 0) / 60),
        neutralTime: Math.round((todaySummary.neutralSeconds || 0) / 60),
        topSites: topSites || [],
        categoryBreakdown: {
          productive: todaySummary.productiveSeconds || 0,
          distraction: todaySummary.totalDistractionSeconds || 0,
          neutral: todaySummary.neutralSeconds || 0,
        },
      },
    });
  } catch (error) {
    console.error("Telemetry Summary Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch telemetry summary." });
  }
};

module.exports = {
  uploadSessions,
  getTodayTelemetry,
  getMySessions,
  getStats,
  getTopWebsites,
  getWeeklyProductivityTrend,
  getHourlyHeatmap,
  getStudyVsDistractStats,
  getAIProductivityInsights,
  getProcrastinationAnalytics,
  getTelemetryStatus,
  getTelemetrySummary,
};