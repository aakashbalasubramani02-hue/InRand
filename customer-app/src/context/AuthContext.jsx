import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('inrand_customer');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const { data } = await api.post('/auth/login', { identifier, password, role: 'customer' });
    setUser(data);
    localStorage.setItem('inrand_customer', JSON.stringify(data));
    return data;
  };

  const signup = async (userData) => {
    const { data } = await api.post('/auth/signup', { ...userData, role: 'customer' });
    return data;
  };

  const verifyOtp = async (identifier, otp) => {
    const { data } = await api.post('/auth/verify-otp', { identifier, otp });
    setUser(data);
    localStorage.setItem('inrand_customer', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inrand_customer');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
