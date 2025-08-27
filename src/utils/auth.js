// src/utils/auth.js
export const getToken = () => {
  return localStorage.getItem("token"); // token saved on login
};
