import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, getStoredUser, setStoredToken, setStoredUser, removeStoredToken, removeStoredUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const existingToken = getStoredToken();
      if (existingToken) {
        try {
          const me = await api.getMe();
          setUser(me);
          setStoredUser(me);
        } catch (err) {
          console.warn('Session expired, auto-logging in with default user');
          await autoLogin();
        }
      } else {
        // Auto-login single user for seamless out-of-the-box experience
        await autoLogin();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const autoLogin = async () => {
    try {
      const res = await api.login('focus@user.com', 'focus123');
      setToken(res.token);
      setUser({ id: res.id, email: res.email, name: res.name });
      setStoredToken(res.token);
      setStoredUser({ id: res.id, email: res.email, name: res.name });
    } catch (err) {
      console.error('Failed to auto-login seeded user:', err);
    }
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser({ id: res.id, email: res.email, name: res.name });
    setStoredToken(res.token);
    setStoredUser({ id: res.id, email: res.email, name: res.name });
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
