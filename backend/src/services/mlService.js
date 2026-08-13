const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Predict Procrastination Risk (Model 1)
 * Endpoint: POST /predict
 */
const predictProcrastination = async (features) => {
  try {
    const response = await mlClient.post("/predict", features);
    return response.data;
  } catch (error) {
    console.error(
      "[ML Client Error] Procrastination Prediction Failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "ML Procrastination prediction failed"
    );
  }
};

/**
 * Predict Productivity Score (Model 2)
 * Endpoint: POST /predict/productivity
 */
const predictProductivity = async (features) => {
  try {
    const response = await mlClient.post("/predict/productivity", features);
    return response.data;
  } catch (error) {
    console.error(
      "[ML Client Error] Productivity Prediction Failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "ML Productivity prediction failed"
    );
  }
};

/**
 * Predict Recommendation (Model 3 V2)
 * Endpoint: POST /predict/recommendation
 */
const predictRecommendation = async (features) => {
  try {
    const response = await mlClient.post("/predict/recommendation", features);
    return response.data;
  } catch (error) {
    console.error(
      "[ML Client Error] Recommendation Prediction Failed:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "ML Recommendation prediction failed"
    );
  }
};

/**
 * Check ML Microservice Health
 * Endpoint: GET /health
 */
const checkMLHealth = async () => {
  try {
    const response = await mlClient.get("/health");
    return response.data;
  } catch (error) {
    console.error(
      "[ML Client Error] Health Check Failed:",
      error.response?.data || error.message
    );
    return {
      status: "unhealthy",
      service: "EduPulse AI ML Service",
      message: "ML service unavailable",
    };
  }
};

module.exports = {
  predictProcrastination,
  predictProductivity,
  predictRecommendation,
  checkMLHealth,
};