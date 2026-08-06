import axiosInstance from "./axiosInstance";

const notificationService = {
  getNotifications: async () => {
    const res = await axiosInstance.get("/notifications");
    return res.data.data || [];
  },

  markAsRead: async (id) => {
    const res = await axiosInstance.put(`/notifications/${id}`);
    return res.data;
  },

  clearNotifications: async () => {
    const res = await axiosInstance.delete("/notifications/clear");
    return res.data;
  },
};

export default notificationService;