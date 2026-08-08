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
export const getStudyVsDistractStats = getStudyVsDistract;
export const getAIInsights = async () => {
  const response = await api.get(
    "/telemetry/ai-insights"
  );

  return response.data;
};
export const getProcrastinationScore = async () => {
  const response = await api.get(
    "/telemetry/procrastination"
  );

  return response.data;
};
export const getProcrastinationAnalytics = getProcrastinationScore;

export const getTelemetryStatus = async () => {
  const response = await api.get("/telemetry/status");
  return response.data;
};

export const getTelemetrySummary = async () => {
  const response = await api.get("/telemetry/summary");
  return response.data;
};
export const getAnalyticsDashboard = async () => {
  const [
    stats,
    topWebsites,
    weeklyTrend,
    hourly,
    studyVsDistract,
    aiInsights,
    procrastination,
  ] = await Promise.all([
    getTelemetryStats(),
    getTopWebsites(),
    getWeeklyTrend(),
    getHourlyProductivity(),
    getStudyVsDistract(),
    getAIInsights(),
    getProcrastinationScore(),
  ]);

  return {
    stats: stats.stats,
    topWebsites: topWebsites.data,
    weeklyTrend: weeklyTrend.data,
    hourly: hourly.data,
    studyVsDistract: studyVsDistract.data,
    aiInsights: aiInsights.data,
    procrastination: procrastination.data,
  };
};