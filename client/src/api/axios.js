import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const createAxiosInstance = (logout) => {
  const instance = axios.create({
    baseURL: 'http://your-server-url/api', // replace with your API base URL
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        logout();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;
