import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = auth?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Skip 401 redirect ONLY for the login endpoint
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error?.config?.url || '';
    const isLoginCall = url === '/auth/login';
    if (error.response?.status === 401 && !isLoginCall && typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
