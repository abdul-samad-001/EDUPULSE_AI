const mlService = require("../services/mlService");
const mlFeatureService = require("../services/mlFeatureService");
const mlRefreshService = require("../services/mlRefreshService");
const { createRecommendationEvent } = require("./recommendationController");

/**
 * Helper: Validate payload for non-numeric, NaN, or Infinity values.
 */
const validateNumericPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      if (typeof value === "string" && value.trim() === "") {
        return `Feature '${key}' cannot be an empty string`;
      }
      const num = Number(value);
      if (isNaN(num)) {
        return `Feature '${key}' must be a valid numeric value`;
      }
      if (!isFinite(num)) {
        return `Feature '${key}' cannot be Infinity or -Infinity`;
      }
    }
  }
  return null;
};

/**
 * POST /api/ml/procrastination
 * Procrastination Risk Prediction (Model 1)
 */
const predictProcrastination = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const validationError = validateNumericPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const features = await mlFeatureService.buildProcrastinationFeatures(
      userId,
      req.body
    );

    const mlResponse = await mlService.predictProcrastination(features);

    return res.status(200).json({
      success: true,
      data: mlResponse,
    });
  } catch (error) {
    console.error("[ML Controller Error - Procrastination]:", error.message);
    const isServiceError = error.message.includes("unavailable") || error.message.includes("failed");
    return res.status(isServiceError ? 503 : 500).json({
      success: false,
      message: isServiceError ? "ML service unavailable" : "Procrastination prediction failed",
    });
  }
};

/**
 * POST /api/ml/productivity
 * Productivity Score Prediction (Model 2)
 */
const predictProductivity = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const validationError = validateNumericPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const features = await mlFeatureService.buildProductivityFeatures(
      userId,
      req.body
    );

    const mlResponse = await mlService.predictProductivity(features);

    return res.status(200).json({
      success: true,
      data: mlResponse,
    });
  } catch (error) {
    console.error("[ML Controller Error - Productivity]:", error.message);
    const isServiceError = error.message.includes("unavailable") || error.message.includes("failed");
    return res.status(isServiceError ? 503 : 500).json({
      success: false,
      message: isServiceError ? "ML service unavailable" : "Productivity prediction failed",
    });
  }
};

/**
 * POST /api/ml/recommendation
 * Recommendation Engine Prediction (Model 3 V2)
 */
const predictRecommendation = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const validationError = validateNumericPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const features = await mlFeatureService.buildRecommendationFeatures(
      userId,
      req.body
    );

    const mlResponse = await mlService.predictRecommendation(features);

    let recEvent = null;
    try {
      recEvent = await createRecommendationEvent(userId, mlResponse, {
        source: "api_prediction",
      });
    } catch (evtErr) {
      console.warn("Recommendation event record warning:", evtErr.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        event_id: recEvent ? recEvent._id : null,
        recommendation_class: mlResponse.recommendation_class,
        recommendation: mlResponse.recommendation,
        confidence: mlResponse.confidence,
        model_type: mlResponse.model_type || "Random Forest",
        model_version: mlResponse.model_version || "v2",
      },
    });
  } catch (error) {
    console.error("[ML Controller Error - Recommendation]:", error.message);
    const isServiceError = error.message.includes("unavailable") || error.message.includes("failed");
    return res.status(isServiceError ? 503 : 500).json({
      success: false,
      message: isServiceError ? "ML service unavailable" : "Recommendation prediction failed",
    });
  }
};

/**
 * POST /api/ml/refresh
 * Real-Time Telemetry-Triggered ML Intelligence Refresh (All 3 Models)
 */
const refreshMLIntelligence = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const triggerSource = req.body.triggerSource || "telemetry_event";

    const validationError = validateNumericPayload(req.body.overridePayload);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await mlRefreshService.refreshUserMLIntelligence(
      userId,
      triggerSource,
      req.body.overridePayload || {}
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[ML Controller Error - Refresh]:", error.message);
    const isServiceError = error.message.includes("unavailable") || error.message.includes("failed");
    return res.status(isServiceError ? 503 : 500).json({
      success: false,
      message: isServiceError ? "ML service unavailable" : "ML intelligence refresh failed",
    });
  }
};

/**
 * GET /api/ml/health
 * Get ML Service Health & Model Status
 */
const getMLHealth = async (req, res) => {
  try {
    const health = await mlService.checkMLHealth();
    const isHealthy = health.status === "healthy";

    return res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: health,
    });
  } catch (error) {
    console.error("[ML Controller Error - Health]:", error.message);
    return res.status(503).json({
      success: false,
      message: "ML service unavailable",
    });
  }
};

module.exports = {
  predictProcrastination,
  predictProductivity,
  predictRecommendation,
  refreshMLIntelligence,
  getMLHealth,
};
