import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const data = await authService.getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    const user = await authService.register(email, password, displayName);
    setUser(user);
    const data = await authService.getUserData(user.uid);
    setUserData(data);
    return user;
  };

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
    const data = await authService.getUserData(user.uid);
    setUserData(data);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserData(null);
  };

  const resetPassword = async (email) => {
    await authService.resetPassword(email);
  };

  const isAdmin = userData?.role === 'admin';

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    logout,
    resetPassword,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};