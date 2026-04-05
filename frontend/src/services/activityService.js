import axios from "axios";

const API_URL = "http://localhost:5000/api/activity";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getActivityLogs = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};
