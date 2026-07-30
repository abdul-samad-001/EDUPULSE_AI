import api from "./axiosInstance";

export const getTelemetryStats = async () => {
  const response = await api.get("/telemetry/stats");
  return response.data;
};