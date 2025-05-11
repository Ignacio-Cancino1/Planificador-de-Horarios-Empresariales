// src/services/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const login = async (loginData) => {
  const response = await api.post('/login', loginData); // loginData = { login, password }
  return response.data;
};
