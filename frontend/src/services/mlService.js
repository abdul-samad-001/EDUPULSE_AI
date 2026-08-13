import axiosInstance from "./axiosInstance";

/**
 * ML Intelligence Service API Client (React Frontend → Express Backend)
 * Base URL: /api/ml/*
 */

export const getMLHealth = async () => {
  const response = await axiosInstance.get("/ml/health");
  return response.data;
};

export const getProcrastinationPrediction = async (payload = {}) => {
  const response = await axiosInstance.post("/ml/procrastination", payload);
  return response.data;
};

export const getProductivityPrediction = async (payload = {}) => {
  const response = await axiosInstance.post("/ml/productivity", payload);
  return response.data;
};

export const getRecommendationPrediction = async (payload = {}) => {
  const response = await axiosInstance.post("/ml/recommendation", payload);
  return response.data;
};

export const refreshMLIntelligence = async (payload = {}) => {
  const response = await axiosInstance.post("/ml/refresh", payload);
  return response.data;
};

const mlService = {
  getMLHealth,
  getProcrastinationPrediction,
  getProductivityPrediction,
  getRecommendationPrediction,
  refreshMLIntelligence,
};

export default mlService;
