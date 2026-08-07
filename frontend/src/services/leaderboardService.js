import api from "./axiosInstance";

export const getLeaderboard = async () => {
  const { data } = await api.get("/leaderboard");
  return data.data;
};

export const getMyRank = async () => {
  const { data } = await api.get("/leaderboard/me");
  return data.data;
};

export default {
  getLeaderboard,
  getMyRank,
};