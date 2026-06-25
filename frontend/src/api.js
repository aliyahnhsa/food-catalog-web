import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default API;