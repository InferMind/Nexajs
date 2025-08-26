'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from './api';
import { mockData, mockApi } from './mockData';
import { supabase } from './supabase';

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
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.access_token) {
        try {
          const profile = await authAPI.getProfile();
          if (profile?.user) setUser(profile.user);
        } catch {
          // ignore
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      if (useMockData) {
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const response = await authAPI.getProfile();
          if (response.user) {
            setUser(response.user);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (useMockData) {
        const result = await mockApi.login(email, password);
        setUser(result.user);
        localStorage.setItem('mock_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        const profile = await authAPI.getProfile();
        if (profile?.user) setUser(profile.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
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
        const result = await mockApi.signup(userData);
        setUser(result.user);
        localStorage.setItem('mock_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        const { error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: { data: { name: userData.name, company: userData.company } }
        });
        if (error) return { success: false, error: error.message };
        // After sign up, user may need to verify email depending on Supabase settings
        const profile = await authAPI.getProfile().catch(() => null);
        if (profile?.user) setUser(profile.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (useMockData) {
        setUser(null);
        localStorage.removeItem('mock_user');
      } else {
        await supabase.auth.signOut();
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
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