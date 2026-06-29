import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;