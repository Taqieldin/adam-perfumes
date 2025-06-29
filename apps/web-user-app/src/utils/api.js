import axios from 'axios';
import Cookies from 'js-cookie';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors like 401 Unauthorized, etc.
    return Promise.reject(error);
  }
);

export default Api;
