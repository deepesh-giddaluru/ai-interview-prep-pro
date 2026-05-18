/**
 * useFirebaseAuth Hook
 * 
 * Custom React hook for Firebase Authentication
 * Provides easy access to auth state and operations throughout the app
 * 
 * Features:
 * - Real-time auth state tracking
 * - Loading states
 * - Error handling
 * - Session persistence
 * - Toast notifications
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  resetPassword,
  updateUserProfile,
  changePassword,
  sendVerificationEmail,
  getCurrentUser,
  isAuthenticated,
  getUserToken,
  onAuthStateChange,
  isEmailVerified
} from '../services/auth.service';

/**
 * Auth hook return type
 */
interface UseFirebaseAuthReturn {
  // State
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  
  // Auth operations
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Password operations
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // Profile operations
  updateProfile: (displayName: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  
  // Utility
  getToken: () => Promise<string | null>;
  refreshUser: () => void;
}

/**
 * Custom hook for Firebase Authentication
 * @returns Auth state and operations
 */
export const useFirebaseAuth = (): UseFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      
      if (authUser) {
        console.log('👤 User authenticated:', authUser.email);
        // Store user info in localStorage for quick access
        localStorage.setItem('userEmail', authUser.email || '');
        localStorage.setItem('userId', authUser.uid);
      } else {
        console.log('👤 User logged out');
        // Clear localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Register new user
   */
  const register = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<boolean> => {
    setLoading(true);
    const { user: newUser, error } = await registerUser(email, password, displayName);
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (newUser) {
      toast.success('🎉 Account created successfully!');
      return true;
    }

    return false;
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { user: loggedInUser, error } = await loginUser(email, password);
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (loggedInUser) {
      toast.success('✅ Login successful!');
      return true;
    }

    return false;
  };

  /**
   * Login with Google
   */
  const loginWithGoogleHandler = async (): Promise<boolean> => {
    setLoading(true);
    const { user: googleUser, error } = await loginWithGoogle();
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (googleUser) {
      toast.success('✅ Google sign-in successful!');
      return true;
    }

    return false;
  };

  /**
   * Logout current user
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    const { error } = await logoutUser();
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('👋 Logged out successfully');
  };

  /**
   * Send password reset email
   */
  const resetPasswordHandler = async (email: string): Promise<boolean> => {
    setLoading(true);
    const { success, error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (success) {
      toast.success('📧 Password reset email sent! Check your inbox.');
      return true;
    }

    return false;
  };

  /**
   * Change user password
   */
  const changePasswordHandler = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    const { success, error } = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (success) {
      toast.success('🔒 Password changed successfully!');
      return true;
    }

    return false;
  };

  /**
   * Update user profile
   */
  const updateProfileHandler = async (displayName: string): Promise<boolean> => {
    setLoading(true);
    const { success, error } = await updateUserProfile(displayName);
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (success) {
      toast.success('✅ Profile updated successfully!');
      // Refresh user data
      refreshUser();
      return true;
    }

    return false;
  };

  /**
   * Send email verification
   */
  const sendVerificationEmailHandler = async (): Promise<boolean> => {
    setLoading(true);
    const { success, error } = await sendVerificationEmail();
    setLoading(false);

    if (error) {
      toast.error(error);
      return false;
    }

    if (success) {
      toast.success('📧 Verification email sent! Check your inbox.');
      return true;
    }

    return false;
  };

  /**
   * Get user authentication token
   */
  const getToken = async (): Promise<string | null> => {
    return await getUserToken();
  };

  /**
   * Refresh user data
   */
  const refreshUser = (): void => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  return {
    // State
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isEmailVerified: isEmailVerified(),
    
    // Auth operations
    register,
    login,
    loginWithGoogle: loginWithGoogleHandler,
    logout,
    
    // Password operations
    resetPassword: resetPasswordHandler,
    changePassword: changePasswordHandler,
    
    // Profile operations
    updateProfile: updateProfileHandler,
    sendVerificationEmail: sendVerificationEmailHandler,
    
    // Utility
    getToken,
    refreshUser
  };
};

/**
 * Hook for checking if user is authenticated (without full auth state)
 * Useful for route guards and conditional rendering
 */
export const useAuthStatus = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuth(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated: isAuth, loading };
};

/**
 * Hook for getting current user without subscribing to changes
 * Useful for one-time checks
 */
export const useCurrentUser = () => {
  return getCurrentUser();
};

// Made with ❤️ by Bob

// Made with Bob
