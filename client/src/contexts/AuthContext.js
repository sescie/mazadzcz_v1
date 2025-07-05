import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');
    
    let user = null;
    if (rawUser && rawUser !== 'undefined') {
      try {
        user = JSON.parse(rawUser);
      } catch (e) {
        console.warn('Failed to parse user data:', e);
        localStorage.removeItem('user');
      }
    }

    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
        return { token, user };
      } catch (e) {
        console.warn('Invalid token:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  }, []);

  const contextValue = useMemo(() => ({
    auth,
    setAuth: (newAuth) => {
      if (newAuth) {
        localStorage.setItem('token', newAuth.token);
        localStorage.setItem('user', JSON.stringify(newAuth.user));
        setAuth(newAuth);
      } else {
        logout();
      }
    },
    logout
  }), [auth, logout]);

  useEffect(() => {
    const verifyAuth = async () => {
      if (auth?.token) {
        try {
          // Add token verification API call if needed
        } catch (err) {
          logout();
        }
      }
      setInitializing(false);
    };
    verifyAuth();
  }, [auth?.token, logout]);

  if (initializing) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}