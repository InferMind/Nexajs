'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, setAuthToken, removeAuthToken, isAuthenticated as checkAuth } from './api';
import { mockData, mockApi } from './mockData';

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  plan: string;
  credits: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; password: string; company?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're using mock data
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (useMockData) {
        // In mock mode, check if user was previously logged in
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } else {
        // Try to get current user from backend
        if (checkAuth()) {
          const response = await authAPI.getProfile();
          if (response.user) {
            setUser(response.user);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid token
      removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (useMockData) {
        // Use mock API
        const result = await mockApi.login(email, password);
        setUser(result.user);
        localStorage.setItem('mock_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        // Use real API
        const response = await authAPI.login({ email, password });
        if (response.token && response.user) {
          setAuthToken(response.token);
          setUser(response.user);
          return { success: true };
        } else {
          return { 
            success: false, 
            error: response.error || 'Login failed' 
          };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    company?: string 
  }) => {
    setIsLoading(true);
    try {
      if (useMockData) {
        // Use mock API
        const result = await mockApi.signup(userData);
        setUser(result.user);
        localStorage.setItem('mock_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        // Use real API
        const response = await authAPI.register({
          ...userData,
          plan: 'free' // Default plan
        });
        if (response.token && response.user) {
          setAuthToken(response.token);
          setUser(response.user);
          return { success: true };
        } else {
          return { 
            success: false, 
            error: response.error || 'Signup failed' 
          };
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!useMockData) {
        removeAuthToken();
      }
      setUser(null);
      localStorage.removeItem('mock_user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('mock_user');
      removeAuthToken();
    }
  };

  const refreshUser = async () => {
    try {
      if (useMockData) {
        // In mock mode, just refresh from localStorage
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } else {
        if (checkAuth()) {
          const response = await authAPI.getProfile();
          if (response.user) {
            setUser(response.user);
          }
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;