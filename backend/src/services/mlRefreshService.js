const mlService = require("./mlService");
const mlFeatureService = require("./mlFeatureService");
const { createRecommendationEvent } = require("../controllers/recommendationController");

const ML_REFRESH_DEBOUNCE_MS = parseInt(process.env.ML_REFRESH_DEBOUNCE_MS || "5000", 10);

// Per-user isolated debounce & cache state map (User A state != User B state)
const userDebounceState = new Map();

/**
 * Gets or initializes user debounce state container.
 */
const getUserState = (userId) => {
  const uid = userId.toString();
  if (!userDebounceState.has(uid)) {
    userDebounceState.set(uid, {
      timer: null,
      pendingTriggers: new Set(),
      lastRunTime: 0,
      lastResult: null,
      activePromise: null,
    });
  }
  return userDebounceState.get(uid);
};

/**
 * Executes a near-real-time telemetry-triggered ML intelligence refresh for a specific user.
 * Strictly scopes feature extraction and prediction output to req.user._id.
 */
const refreshUserMLIntelligence = async (userId, triggerSource = "manual_refresh", overridePayload = {}) => {
  const startTime = Date.now();
  const refreshedAt = new Date().toISOString();
  const state = getUserState(userId);

  try {
    // 1. Feature Extraction & Timing (skipTelemetry = true prevents telemetry loop)
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

    // 5. Cooldown-Protected Recommendation Event Recording (30-min cooldown preserved)
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

    const result = {
      success: true,
      refreshedAt,
      triggerSource,
      isStaleFallback: false,
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

    state.lastRunTime = Date.now();
    state.lastResult = result;
    return result;
  } catch (error) {
    console.error(`[ML Refresh Service Error] User ${userId}:`, error.message);
    // Cached Fallback (Phase 8): If ML refresh fails, return cached previous predictions
    if (state.lastResult) {
      return {
        ...state.lastResult,
        isStaleFallback: true,
        fallbackWarning: "Temporary ML refresh warning. Displaying cached intelligence.",
      };
    }
    throw error;
  }
};

/**
 * Central ML Refresh Trigger (Phase 3 & Phase 4)
 * Registers a telemetry event trigger, coalesces rapid events within ML_REFRESH_DEBOUNCE_MS (5s),
 * and executes a single debounced ML prediction refresh per user.
 */
const triggerUserMLRefresh = (userId, triggerSource, overridePayload = {}) => {
  const state = getUserState(userId);
  state.pendingTriggers.add(triggerSource);

  return new Promise((resolve) => {
    if (state.timer) {
      clearTimeout(state.timer);
    }

    state.timer = setTimeout(async () => {
      const combinedTriggers = Array.from(state.pendingTriggers).join("+");
      state.pendingTriggers.clear();
      state.timer = null;

      try {
        const res = await refreshUserMLIntelligence(userId, combinedTriggers, overridePayload);
        resolve(res);
      } catch (err) {
        resolve(state.lastResult || { success: false, error: err.message });
      }
    }, ML_REFRESH_DEBOUNCE_MS);
  });
};

/**
 * Returns cached or latest prediction state for a user.
 */
const getUserMLCache = (userId) => {
  const state = getUserState(userId);
  return state.lastResult;
};

module.exports = {
  refreshUserMLIntelligence,
  triggerUserMLRefresh,
  getUserMLCache,
  ML_REFRESH_DEBOUNCE_MS,
};
