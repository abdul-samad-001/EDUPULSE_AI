import axiosInstance from "./axiosInstance";

export const signupUser = async (userData) => {
  const response = await axiosInstance.post(
    "/auth/signup",
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post(
    "/auth/login",
    userData
  );

  return response.data;
};