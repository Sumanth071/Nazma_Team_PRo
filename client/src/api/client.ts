import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  // If running on Vercel, ensure requests go directly to Render backend
  if (typeof window !== 'undefined' && (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('vercel'))) {
    if (!config.baseURL || config.baseURL === '/api' || config.baseURL.includes('trycloudflare.com')) {
      config.baseURL = 'https://coloai-backend.onrender.com/api';
    }
  }

  const token = localStorage.getItem('coloai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If Vercel returns 405, 503, or service worker / network failure, transparently retry directly against Render backend
    const status = error.response?.status;
    const isOfflineOr503 = status === 503 || error.response?.data?.error?.includes('Offline');
    const isNetworkError = !error.response && error.message?.includes('Network');

    if ((status === 405 || isOfflineOr503 || isNetworkError) && error.config && !error.config._retry) {
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
