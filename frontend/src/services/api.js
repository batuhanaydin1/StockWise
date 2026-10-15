import axios from 'axios';

// ASP.NET Core Web API portumuz (launchSettings.json'daki http portu 5013)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5013/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Genel hata yakalayıcı (Interceptor)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Hatası:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
