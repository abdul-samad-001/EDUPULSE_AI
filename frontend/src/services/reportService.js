import api from "./axiosInstance";
import { toast } from "../utils/toast";

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

export const getTimeline = async () => {
  const { data } = await api.get("/reports/timeline");
  return data.data;
};

export const getReportHistory = async () => {
  const { data } = await api.get("/reports/history");
  return data.data;
};

export const downloadPDF = async () => {
  try {
    const response = await api.get("/reports/download", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "EduPulse_Report.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("PDF Downloaded", {
      description: "EduPulse_Report.pdf has been saved to your downloads.",
    });
  } catch (error) {
    console.error("PDF Download Error:", error);
    toast.error("Download Failed", {
      description: "Failed to download PDF report. Please try again.",
    });
  }
};

export const exportReportCSV = async () => {
  try {
    const response = await api.post("/reports/export/csv", {}, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "EduPulse_Report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("CSV Exported", {
      description: "EduPulse_Report.csv spreadsheet ready.",
    });
  } catch (error) {
    console.error("CSV Download Error:", error);
    toast.error("Export Failed", {
      description: "Failed to export CSV report.",
    });
  }
};

export const exportReportJSON = async () => {
  try {
    const response = await api.post("/reports/export/json");
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "EduPulse_Report.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("JSON Exported", {
      description: "EduPulse_Report.json schema data downloaded.",
    });
  } catch (error) {
    console.error("JSON Download Error:", error);
    toast.error("Export Failed", {
      description: "Failed to export JSON report.",
    });
  }
};

export default {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgress,
  getAIReport,
  getTimeline,
  getReportHistory,
  downloadPDF,
  exportReportCSV,
  exportReportJSON,
};