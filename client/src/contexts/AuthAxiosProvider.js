import axios from 'axios';
import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';
import { API_URL } from '../services/api';

const AxiosContext = createContext();

export function AxiosProvider({ children }) {
  const { auth, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Request interceptor
    instance.interceptors.request.use(
      config => {
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      response => response,
      error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          enqueueSnackbar('Session expired. Please log in again.', {
            variant: 'warning',
            autoHideDuration: 3000
          });
          
          logout();
          return Promise.reject(error);
        }
        
        // Handle other errors
        if (error.response) {
          const message = error.response.data?.message || 'Request failed';
          enqueueSnackbar(message, { 
            variant: 'error',
            autoHideDuration: 5000
          });
        }
        
        return Promise.reject(error);
      }
    );

    return instance;
  }, [auth?.token, logout, enqueueSnackbar]); // Only depend on token

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios() {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within AxiosProvider');
  }
  return context;
}