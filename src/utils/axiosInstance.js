// services/axiosInstance.js
import axios from 'axios';

// Create an instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = sessionStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning']='true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//TODO SHOW TOAST ON ERROR also using interceptors on response
//LOGOUT ON 401
export default axiosInstance;
