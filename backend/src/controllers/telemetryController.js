const {aggregateTodayTelemetry,
} = require("../services/telemetryService");
const TabSession = require("../models/TabSession");

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

    // Attach the logged-in user to every session
    const documents = sessions.map((session) => ({
      user: req.user._id,
      domain: session.domain,
      category: session.category,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationSeconds: session.durationSeconds,
      source: "extension",
    }));

    await TabSession.insertMany(documents);

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
 * Returns today's aggregated telemetry.
 */
const getTodayTelemetry = async (req, res) => {
  try {
    const summary = await aggregateTodayTelemetry(req.user._id);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Telemetry Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's telemetry.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSessions,
  getTodayTelemetry,
};