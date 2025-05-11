// src/services/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL // Asegúrate de tener esta variable en tu .env
});

export const login = async (loginData) => {
  const response = await api.post('/login', loginData); // loginData = { login, password }
  return response.data;
};
