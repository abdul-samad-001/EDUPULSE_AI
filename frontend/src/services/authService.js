import axiosInstance from "./axiosInstance";

export const signupUser = async (userData) => {
  const response = await axiosInstance.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data;
};

export const sendOTP = async (email, type = "password_reset") => {
  const response = await axiosInstance.post("/auth/send-otp", { email, type });
  return response.data;
};

export const verifyOTPAndResetPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/verify-otp-reset-password", payload);
  return response.data;
};

export const verifyEmailOTP = async (payload) => {
  const response = await axiosInstance.post("/auth/verify-email-otp", payload);
  return response.data;
};

export default {
  signupUser,
  loginUser,
  sendOTP,
  verifyOTPAndResetPassword,
  verifyEmailOTP,
};