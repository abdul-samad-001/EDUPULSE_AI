import axiosInstance from "./axiosInstance";

const profileService = {
  // Get logged-in user's profile
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data.user || response.data;
  },

  // Update logged-in user's profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(
      "/auth/me",
      profileData
    );

    return response.data.user || response.data;
  },
};

export default profileService;