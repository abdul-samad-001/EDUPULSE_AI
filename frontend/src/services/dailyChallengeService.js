import api from "./axiosInstance";

export const getDailyChallenge = async () => {
  const { data } = await api.get("/daily-challenge");
  return data.data;
};

export const completeChallenge = async () => {
  const { data } = await api.put("/daily-challenge/complete");
  return data.data;
};

export default {
  getDailyChallenge,
  completeChallenge,
};