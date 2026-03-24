import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('dba_token');
    const savedUser = localStorage.getItem('dba_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const persistAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('dba_token', nextToken);
    localStorage.setItem('dba_user', JSON.stringify(nextUser));
  };

  const login = async (payload) => {
    try {
      const response = await loginApi(payload);
      const nextToken = response.data?.token || response.token;
      const nextUser = response.data?.user || response.user || { email: payload.email, name: 'User' };
      persistAuth(nextUser, nextToken);
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        const fallbackToken = btoa(`${payload.email}:demo-token`);
        persistAuth({ email: payload.email, name: 'Demo User' }, fallbackToken);
        return { fallback: true };
      }
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const response = await registerApi(payload);
      const nextToken = response.data?.token || response.token;
      const nextUser = response.data?.user || response.user || { email: payload.email, name: payload.name };
      persistAuth(nextUser, nextToken);
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        const fallbackToken = btoa(`${payload.email}:demo-token`);
        persistAuth({ email: payload.email, name: payload.name }, fallbackToken);
        return { fallback: true };
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dba_token');
    localStorage.removeItem('dba_user');
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, register, logout, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
