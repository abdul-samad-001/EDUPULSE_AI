import axiosInstance from "./axiosInstance";

const profileService = {
  getProfile: async () => {
    // Falls back or uses existing /api/auth/me to fetch fresh user details
    const res = await axiosInstance.get("/api/auth/me");
    return res.data.user || res.data;
  },

  updateProfile: async (profileData) => {
    // Sends updated fields to your user document profile endpoint
    const res = await axiosInstance.put("/api/auth/me", profileData);
    return res.data.user || res.data;
  }
};

export default profileService;