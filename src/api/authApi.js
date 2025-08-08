// authApi.js
import axios from 'axios';
const API_URL = 'https://www.authmicro.somee.com/api/Auth';

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  // Guardar tokens en localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response;
};

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const resetPassword = async (resetData) => {
  return await axios.post(`${API_URL}/reset-password`, resetData);
};

export const refreshToken = (data) => {
  return axios.post(
    'https://www.authmicro.somee.com/api/Auth/refresh-token',
    data,
    { headers: { 'Content-Type': 'application/json' } }
  ).then(res => res.data);
};
