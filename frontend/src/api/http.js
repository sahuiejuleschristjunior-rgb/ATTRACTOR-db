import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('dba_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dba_token');
      localStorage.removeItem('dba_user');
    }
    return Promise.reject(error);
  }
);

export default http;
