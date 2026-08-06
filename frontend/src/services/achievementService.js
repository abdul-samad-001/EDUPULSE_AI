import axiosInstance from "./axiosInstance";

export const getAchievements = async () => {
  const res = await axiosInstance.get("/achievements");
  return res.data.data || [];
};

const achievementService = {
  getAchievements,
};

export default achievementService;