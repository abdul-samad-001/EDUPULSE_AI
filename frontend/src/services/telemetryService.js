import api from "./axiosInstance";

export const getTelemetryStats = async () => {
  const response = await api.get("/telemetry/stats");
  return response.data;
};
export const getTopWebsites = async () => {
  const response = await api.get("/telemetry/top-websites");
  return response.data;
};
export const getWeeklyTrend = async () => {
  const response = await api.get("/telemetry/weekly-trend");
  return response.data;
};
export const getHourlyProductivity = async () => {
  const response = await api.get("/telemetry/hourly-productivity");
  return response.data;
};
export const getStudyVsDistract = async () => {
  const response = await api.get(
    "/telemetry/study-vs-distract"
  );

  return response.data;
};
export const getAIInsights = async () => {
  const response = await api.get(
    "/telemetry/ai-insights"
  );

  return response.data;
};