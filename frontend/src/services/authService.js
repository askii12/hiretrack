import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

export const login = async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData);
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
