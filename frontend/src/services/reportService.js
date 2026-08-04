import api from "./axiosInstance";

export const getReportSummary = async () => {
  const { data } = await api.get("/reports/summary");
  return data.data;
};

export const getWeeklyReport = async () => {
  const { data } = await api.get("/reports/weekly");
  return data.data;
};

export const getMonthlyReport = async () => {
  const { data } = await api.get("/reports/monthly");
  return data.data;
};

export const getSkillProgress = async () => {
  const { data } = await api.get("/reports/skills");
  return data.data;
};

export const getAIReport = async () => {
  const { data } = await api.get("/reports/ai");
  return data.data;
};

export const downloadPDF = () => {
  window.open(
    "http://localhost:5000/api/reports/download",
    "_blank"
  );
};