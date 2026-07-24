import axiosInstance from "./axiosInstance";

const focusSessionService = {
  startSession: async (data) => {
    const res = await axiosInstance.post("/focus/start", data);
    return res.data;
  },

  stopSession: async () => {
    const res = await axiosInstance.post("/focus/stop");
    return res.data;
  },

  getActiveSession: async () => {
    const res = await axiosInstance.get("/focus/active");
    return res.data;
  },

  getHistory: async () => {
    const res = await axiosInstance.get("/focus/history");
    return res.data;
  },
};

export default focusSessionService;