import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (roll: string, pass: string) => Promise<void>;
  register: (roll: string, pass: string, batch: string) => Promise<void>;
  updateProfile: (updates: { phoneNumber?: string; profileImageUrl?: string; batch?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('btec_session_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('btec_session_user');
      }
    }
  }, []);

  const login = async (roll: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await api.login(roll, pass);
      setUser(loggedInUser);
      localStorage.setItem('btec_session_user', JSON.stringify(loggedInUser));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (roll: string, pass: string, batch: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const registeredUser = await api.register(roll, pass, batch);
      setUser(registeredUser);
      localStorage.setItem('btec_session_user', JSON.stringify(registeredUser));
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { phoneNumber?: string; profileImageUrl?: string; batch?: string }) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await api.updateProfile(user.rollNumber, updates);
      setUser(updatedUser);
      localStorage.setItem('btec_session_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('btec_session_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};