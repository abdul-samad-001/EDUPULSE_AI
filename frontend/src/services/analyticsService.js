import axiosInstance from "./axiosInstance";

const analyticsService = {
  getProductivity: async () => {
    const res = await axiosInstance.get("/analytics/productivity");
    return res.data;
  },

  getFocus: async () => {
    const res = await axiosInstance.get("/analytics/focus");
    return res.data;
  },

  getSkills: async () => {
    const res = await axiosInstance.get("/analytics/skills");
    return res.data;
  },

  getSummary: async () => {
    const res = await axiosInstance.get("/analytics/summary");
    return res.data;
  },

  getGoals: async () => {
    const res = await axiosInstance.get("/analytics/goals");
    return res.data;
  },
};

export default analyticsService;
