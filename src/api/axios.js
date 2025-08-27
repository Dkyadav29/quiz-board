import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // ✅ backend server
  withCredentials: true, // allow cookies if backend needs
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
