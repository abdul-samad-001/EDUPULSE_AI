import api from "./axiosInstance";

export const getXP = async () => {
  const { data } = await api.get("/xp");
  return data.data;
};

export default {
  getXP,
};