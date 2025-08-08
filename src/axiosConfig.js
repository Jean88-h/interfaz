// src/axiosConfig.js
import axios from 'axios';
import { refreshToken } from './api/authApi';

const setupAxiosInterceptors = () => {
  // Interceptor para añadir token a las peticiones
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  // Interceptor para manejar respuestas
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const { token: newToken, refreshToken: newRefreshToken } = await refreshToken();
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiamos todo y redirigimos
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
          
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
          
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;