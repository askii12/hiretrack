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

export const getApplications = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.order) params.append("order", filters.order);

  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get(url, getAuthConfig());
  return response.data;
};

export const getApplicationStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
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
