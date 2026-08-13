const mlService = require("./mlService");
const mlFeatureService = require("./mlFeatureService");
const { createRecommendationEvent } = require("../controllers/recommendationController");

/**
 * Executes a near-real-time telemetry-triggered ML intelligence refresh for a specific user.
 * Strictly scopes feature extraction and prediction output to req.user._id.
 */
const refreshUserMLIntelligence = async (userId, triggerSource = "manual_refresh", overridePayload = {}) => {
  const startTime = Date.now();
  const refreshedAt = new Date().toISOString();

  // 1. Feature Extraction & Timing
  const fStart = Date.now();
  const [procFeatures, prodFeatures, recFeatures] = await Promise.all([
    mlFeatureService.buildProcrastinationFeatures(userId, overridePayload),
    mlFeatureService.buildProductivityFeatures(userId, overridePayload),
    mlFeatureService.buildRecommendationFeatures(userId, overridePayload),
  ]);
  const featureExtractionMs = Date.now() - fStart;

  // 2. Model 1 Prediction (Procrastination Risk)
  const m1Start = Date.now();
  const procResult = await mlService.predictProcrastination(procFeatures);
  const model1Ms = Date.now() - m1Start;

  // 3. Model 2 Prediction (Productivity Score)
  const m2Start = Date.now();
  const prodResult = await mlService.predictProductivity(prodFeatures);
  const model2Ms = Date.now() - m2Start;

  // 4. Model 3 V2 Prediction (Recommendation Engine)
  const m3Start = Date.now();
  const recResult = await mlService.predictRecommendation(recFeatures);
  const model3Ms = Date.now() - m3Start;

  // 5. Cooldown-Protected Recommendation Event Recording
  let eventRecord = null;
  try {
    eventRecord = await createRecommendationEvent(userId, recResult, {
      source: triggerSource,
      refreshedAt,
    });
  } catch (evtErr) {
    console.warn("[ML Refresh] Recommendation event recording warning:", evtErr.message);
  }

  const totalMs = Date.now() - startTime;

  const recommendationPayload = {
    ...recResult,
    event_id: eventRecord ? eventRecord._id : null,
  };

  return {
    success: true,
    refreshedAt,
    triggerSource,
    procrastination: procResult,
    productivity: prodResult,
    recommendation: recommendationPayload,
    predictions: {
      procrastination: procResult,
      productivity: prodResult,
      recommendation: recommendationPayload,
    },
    performance: {
      featureExtractionMs,
      model1Ms,
      model2Ms,
      model3Ms,
      totalMs,
    },
  };
};

module.exports = {
  refreshUserMLIntelligence,
};
