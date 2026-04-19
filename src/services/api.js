import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:2222/api',
// });

const api = axios.create({
  baseURL: 'https://neuralplay-backend.onrender.com/api',
});


// Add a request interceptor to include the JWT token
api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle generic errors like 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // We can trigger a custom event or let the current component handle the redirect
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default api;
