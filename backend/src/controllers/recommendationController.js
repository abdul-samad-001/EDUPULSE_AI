const RecommendationEvent = require("../models/RecommendationEvent");

// Configurable Cooldown & Ignore Durations
const getCooldownMinutes = () =>
  parseInt(process.env.RECOMMENDATION_COOLDOWN_MINUTES || "30", 10);
const getIgnoreMinutes = () =>
  parseInt(process.env.RECOMMENDATION_IGNORE_AFTER_MINUTES || "60", 10);

/**
 * Lazy helper to mark expired 'shown' recommendations as 'ignored'
 */
const updateIgnoredRecommendations = async (userId) => {
  const ignoreMs = getIgnoreMinutes() * 60 * 1000;
  const cutoffDate = new Date(Date.now() - ignoreMs);

  await RecommendationEvent.updateMany(
    {
      user: userId,
      status: "shown",
      shownAt: { $lt: cutoffDate },
    },
    {
      $set: { status: "ignored" },
    }
  );
};

/**
 * Internal helper to mark active recommendation as complete
 */
const markRecommendationComplete = async (userId, recommendationClass) => {
  try {
    const query = { user: userId, status: { $in: ["shown", "accepted"] } };
    if (recommendationClass !== undefined) {
      query.recommendationClass = recommendationClass;
    }
    const event = await RecommendationEvent.findOne(query).sort({ shownAt: -1 });
    if (event) {
      event.status = "completed";
      event.completedAt = new Date();
      await event.save();
    }
    return event;
  } catch (err) {
    console.warn("markRecommendationComplete error:", err.message);
    return null;
  }
};

/**
 * Create or deduplicate a recommendation event
 */
const createRecommendationEvent = async (userId, recommendationData, context = {}) => {
  const {
    recommendation_class,
    recommendation,
    confidence,
    model_type,
    model_version,
  } = recommendationData;

  const recClass = recommendation_class ?? 6;
  const cooldownMs = getCooldownMinutes() * 60 * 1000;
  const cooldownCutoff = new Date(Date.now() - cooldownMs);

  // Check for recent duplicate recommendation within cooldown period
  const existingEvent = await RecommendationEvent.findOne({
    user: userId,
    recommendationClass: recClass,
    shownAt: { $gte: cooldownCutoff },
  }).sort({ shownAt: -1 });

  if (existingEvent) {
    return existingEvent;
  }

  // Create new recommendation event
  const newEvent = await RecommendationEvent.create({
    user: userId,
    recommendationClass: recClass,
    recommendation: recommendation || "Complete Pending Tasks",
    confidence: confidence ?? 0.75,
    modelType: model_type || "Random Forest",
    modelVersion: model_version || "v2",
    status: "shown",
    shownAt: new Date(),
    context,
  });

  return newEvent;
};

/**
 * Express Controller: Handle creating event via API
 */
const recordEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recommendationData, context } = req.body;

    if (!recommendationData) {
      return res.status(400).json({
        success: false,
        message: "Missing recommendationData in request payload",
      });
    }

    const event = await createRecommendationEvent(userId, recommendationData, context);

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error creating recommendation event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record recommendation event",
    });
  }
};

/**
 * Respond to recommendation (Accept / Dismiss)
 */
const respondToRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { status, actionType, actionTarget } = req.body;

    if (!["accepted", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status response. Must be 'accepted' or 'dismissed'",
      });
    }

    let event = null;
    if (id && id !== "latest") {
      event = await RecommendationEvent.findOne({ _id: id, user: userId });
    } else {
      event = await RecommendationEvent.findOne({
        user: userId,
        status: "shown",
      }).sort({ shownAt: -1 });
    }

    if (!event) {
      event = await RecommendationEvent.findOne({ user: userId }).sort({ shownAt: -1 });
    }

    if (!event) {
      event = await RecommendationEvent.create({
        user: userId,
        recommendationClass: 6,
        recommendation: "Complete Pending Tasks",
        confidence: 0.75,
        status,
        shownAt: new Date(),
        respondedAt: new Date(),
        actionType: actionType || "user_action",
        actionTarget,
      });
      return res.status(200).json({
        success: true,
        data: event,
      });
    }

    event.status = status;
    event.respondedAt = new Date();
    if (actionType) event.actionType = actionType;
    if (actionTarget) event.actionTarget = actionTarget;

    await event.save();

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error responding to recommendation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update recommendation status",
    });
  }
};

/**
 * Complete a recommendation (Mark status as completed)
 */
const completeRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { actionTarget, recommendationClass } = req.body;

    let event = null;
    if (id && id !== "latest") {
      event = await RecommendationEvent.findOne({ _id: id, user: userId });
    } else if (recommendationClass !== undefined) {
      event = await RecommendationEvent.findOne({
        user: userId,
        recommendationClass,
        status: { $in: ["shown", "accepted"] },
      }).sort({ shownAt: -1 });
    } else {
      event = await RecommendationEvent.findOne({
        user: userId,
        status: { $in: ["shown", "accepted"] },
      }).sort({ shownAt: -1 });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No active or accepted recommendation event found to complete",
      });
    }

    if (event.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Recommendation already completed",
        data: event,
      });
    }

    event.status = "completed";
    event.completedAt = new Date();
    if (actionTarget) event.actionTarget = actionTarget;

    await event.save();

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error completing recommendation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark recommendation as completed",
    });
  }
};

/**
 * Get recommendation history for authenticated user
 */
const getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await updateIgnoredRecommendations(userId);

    const limit = parseInt(req.query.limit || "50", 10);
    const history = await RecommendationEvent.find({ user: userId })
      .sort({ shownAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching recommendation history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation history",
    });
  }
};

/**
 * Get recommendation statistics for authenticated user
 */
const getRecommendationStats = async (req, res) => {
  try {
    const userId = req.user._id;
    await updateIgnoredRecommendations(userId);

    const events = await RecommendationEvent.find({ user: userId });

    const totalRecommendations = events.length;
    let acceptedCount = 0;
    let dismissedCount = 0;
    let ignoredCount = 0;
    let completedCount = 0;
    let totalConfidence = 0;

    const acceptedByText = {};
    const completedByText = {};

    events.forEach((e) => {
      totalConfidence += e.confidence || 0;

      if (e.status === "accepted") acceptedCount++;
      else if (e.status === "dismissed") dismissedCount++;
      else if (e.status === "ignored") ignoredCount++;
      else if (e.status === "completed") {
        completedCount++;
        acceptedCount++; // Completed implies accepted/followed
      }

      if (["accepted", "completed"].includes(e.status)) {
        acceptedByText[e.recommendation] = (acceptedByText[e.recommendation] || 0) + 1;
      }
      if (e.status === "completed") {
        completedByText[e.recommendation] = (completedByText[e.recommendation] || 0) + 1;
      }
    });

    const averageConfidence =
      totalRecommendations > 0
        ? parseFloat((totalConfidence / totalRecommendations).toFixed(2))
        : 0;

    const acceptanceRate =
      totalRecommendations > 0
        ? Math.round((acceptedCount / totalRecommendations) * 100)
        : 0;

    const completionRate =
      acceptedCount > 0
        ? Math.round((completedCount / acceptedCount) * 100)
        : 0;

    const getMostFrequent = (obj) => {
      let maxKey = "N/A";
      let maxVal = 0;
      Object.entries(obj).forEach(([k, v]) => {
        if (v > maxVal) {
          maxVal = v;
          maxKey = k;
        }
      });
      return maxKey;
    };

    const latestEvent = events.length > 0
      ? events.sort((a, b) => b.shownAt - a.shownAt)[0]
      : null;

    return res.status(200).json({
      success: true,
      data: {
        totalRecommendations,
        acceptedRecommendations: acceptedCount,
        dismissedRecommendations: dismissedCount,
        ignoredRecommendations: ignoredCount,
        completedRecommendations: completedCount,
        acceptanceRate,
        completionRate,
        averageConfidence,
        mostAcceptedRecommendation: getMostFrequent(acceptedByText),
        mostCompletedRecommendation: getMostFrequent(completedByText),
        recentAction: latestEvent ? latestEvent.recommendation : "N/A",
      },
    });
  } catch (error) {
    console.error("Error fetching recommendation stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation statistics",
    });
  }
};

/**
 * Export recommendation outcome data (PII-free) for research
 */
const exportRecommendationData = async (req, res) => {
  try {
    const userId = req.user._id;
    await updateIgnoredRecommendations(userId);

    const events = await RecommendationEvent.find({ user: userId })
      .sort({ shownAt: -1 })
      .lean();

    const exportedData = events.map((e) => ({
      eventId: e._id.toString(),
      recommendationClass: e.recommendationClass,
      recommendation: e.recommendation,
      confidence: e.confidence,
      modelType: e.modelType,
      modelVersion: e.modelVersion,
      status: e.status,
      shownAt: e.shownAt,
      respondedAt: e.respondedAt || null,
      completedAt: e.completedAt || null,
      actionType: e.actionType || null,
    }));

    return res.status(200).json({
      success: true,
      count: exportedData.length,
      data: exportedData,
    });
  } catch (error) {
    console.error("Error exporting recommendation data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export recommendation data",
    });
  }
};

module.exports = {
  createRecommendationEvent,
  markRecommendationComplete,
  recordEvent,
  respondToRecommendation,
  completeRecommendation,
  getRecommendationHistory,
  getRecommendationStats,
  exportRecommendationData,
};
