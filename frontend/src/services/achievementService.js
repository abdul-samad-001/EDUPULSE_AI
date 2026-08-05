import api from "./axiosInstance";

export const getAchievements = async () => {
  const { data } = await api.get("/achievements");
  return data.data;
};