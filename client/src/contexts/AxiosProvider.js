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
      headers: { 'Content-Type': 'application/json' }
    });

    instance.interceptors.request.use(config => {
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          enqueueSnackbar('Session expired. Please log in again.', {
            variant: 'warning',
            autoHideDuration: 3000
          });
          logout();
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [auth?.token, logout, enqueueSnackbar]);

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