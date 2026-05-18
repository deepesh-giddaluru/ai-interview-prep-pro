import { useState, useEffect } from 'react';
import { authAPI } from '../lib/authApi';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  streak?: number;
  totalInterviews?: number;
  averageScore?: number;
  profileCompletion?: number;
  isProfileComplete?: boolean;
  college?: string;
  branch?: string;
  year?: string;
  bio?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  profileImage?: string;
}

interface UseMongoAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useMongoAuth = (): UseMongoAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getMe();
        const userData = response.data.data;
        setUser(userData);
        
        // Store user info in localStorage for App.tsx compatibility
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userRole', userData.role);
      
      setUser(userData);
      toast.success('✅ Login successful!');
      setLoading(false);
      return true;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.register({ name: displayName, email, password });
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userRole', userData.role);
      
      setUser(userData);
      toast.success('🎉 Account created successfully!');
      setLoading(false);
      return true;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      setUser(null);
      setLoading(false);
      toast.success('👋 Logged out successfully');
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userRole', userData.role);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };
};

// Made with Bob
