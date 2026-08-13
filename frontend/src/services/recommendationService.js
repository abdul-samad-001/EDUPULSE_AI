import axiosInstance from "./axiosInstance";

/**
 * Frontend Service for Adaptive Recommendation Feedback & Outcome Tracking
 * Base URL: /api/recommendations/*
 */

export const recordRecommendation = async (recommendationData, context = {}) => {
  const response = await axiosInstance.post("/recommendations", {
    recommendationData,
    context,
  });
  return response.data;
};

export const respondToRecommendation = async (
  eventId,
  status,
  actionType = null,
  actionTarget = null
) => {
  const response = await axiosInstance.post(
    `/recommendations/${eventId || "latest"}/respond`,
    {
      status,
      actionType,
      actionTarget,
    }
  );
  return response.data;
};

export const completeRecommendation = async (
  eventId = "latest",
  actionTarget = null,
  recommendationClass = null
) => {
  const response = await axiosInstance.post(
    `/recommendations/${eventId || "latest"}/complete`,
    {
      actionTarget,
      recommendationClass,
    }
  );
  return response.data;
};

export const getRecommendationHistory = async (limit = 50) => {
  const response = await axiosInstance.get(
    `/recommendations/history?limit=${limit}`
  );
  return response.data;
};

export const getRecommendationStats = async () => {
  const response = await axiosInstance.get("/recommendations/stats");
  return response.data;
};

export const exportRecommendationData = async () => {
  const response = await axiosInstance.get("/recommendations/export");
  return response.data;
};

const recommendationService = {
  recordRecommendation,
  respondToRecommendation,
  completeRecommendation,
  getRecommendationHistory,
  getRecommendationStats,
  exportRecommendationData,
};

export default recommendationService;
