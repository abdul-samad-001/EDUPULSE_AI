const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const predictProcrastination = async (features) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      features
    );

    return response.data;
  } catch (error) {
    console.error(
      "ML Service Error:",
      error.response?.data || error.message
    );

    throw new Error("ML prediction service failed");
  }
};

module.exports = {
  predictProcrastination,
};