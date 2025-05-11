import axios from 'axios';

// ✅ CRA usa process.env.REACT_APP_*
console.log("🔍 API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export default api;
