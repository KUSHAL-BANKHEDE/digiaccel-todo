import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Please try again.';
    } else if (!error.response) {
      message = 'Unable to reach the server. Check your connection and try again.';
    }

    error.friendlyMessage = message;
    error.details = error.response?.data?.details;

    return Promise.reject(error);
  }
);

export default api;
