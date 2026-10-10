import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('coloai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If Vercel returns 405 (static rewrite collision), transparently retry directly against Render backend
    if (error.response?.status === 405 && error.config && !error.config._retry) {
      error.config._retry = true;
      const cleanPath = (error.config.url || '').startsWith('/') ? error.config.url : `/${error.config.url}`;
      error.config.baseURL = 'https://coloai-backend.onrender.com/api';
      error.config.url = cleanPath;
      return axios(error.config);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('coloai_token');
      localStorage.removeItem('coloai_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
