import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzU2NTkyMDUzLCJleHAiOjIwODE1Nzc2MDB9.KjLYDG826zqcmxDIXIdnUvn-T_RVoSWyUFB-bA_Wm1E';
const SERVICE_ROLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTY1OTIwNTMsImV4cCI6MjA4MTU3NzYwMH0.X7wnXSrSCsXmDXz2nh-hvmprxYUxAKjtEP-PWxvAeAM';

// Create axios instance for uploads
const axiosAdmin = axios.create({
  baseURL: 'https://supabase.wemear.com',
  headers: {
    'Content-Type': 'application/json',
    'apikey': API_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_TOKEN}`,
    'x-upsert': 'true',
  },
});

// Add response interceptor to handle errors
axiosAdmin.interceptors.response.use(
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

export default axiosAdmin;
