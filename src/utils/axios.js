import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzU2NTkyMDUzLCJleHAiOjIwODE1Nzc2MDB9.KjLYDG826zqcmxDIXIdnUvn-T_RVoSWyUFB-bA_Wm1E';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'https://supabase.wemear.com',
  headers: {
    'Content-Type': 'application/json',
    'apikey': API_KEY,
  },
});

// Add request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear all localStorage data
      localStorage.clear();

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
