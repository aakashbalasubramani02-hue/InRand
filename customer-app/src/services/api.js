import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://backend-beta-topaz-70.vercel.app/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('inrand_customer'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
