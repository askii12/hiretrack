import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getApplications = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const createApplication = async (formData) => {
  const response = await axios.post(API_URL, formData, getAuthConfig());
  return response.data;
};

export const updateApplication = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    getAuthConfig(),
  );
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};
