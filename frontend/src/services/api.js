import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: `${BASE}`, 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("buddy_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
