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


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error Response:', error.response);

      // Example: Show toast
      // toast.error(error.response.data.message || "Something went wrong");

      if (error.response.status === 401) {
        sessionStorage.clear('token');
        window.location.href = '/login'; 
      }
    } else {
      console.error('Network or other error:', error.message);
      // toast.error("Network error, please check your connection.");
    }
    return Promise.reject(error);
  }
);





export default axiosInstance;
