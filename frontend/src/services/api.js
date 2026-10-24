
import axios from 'axios';

// Docker üzerinde çalışan ASP.NET Core Web API adresi
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Genel hata yakalayıcı
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Hatası:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
