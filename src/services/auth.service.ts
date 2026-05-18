/**
 * Firebase Authentication Service
 * 
 * This service provides a clean API for all authentication operations
 * including email/password auth, Google sign-in, password reset, and more.
 * 
 * All methods return a consistent result format with user data or error messages.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Google Auth Provider configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always show account selection
});

/**
 * Authentication result interface
 */
export interface AuthResult {
  user: User | null;
  error: string | null;
}

/**
 * Simple result interface for operations without user data
 */
export interface OperationResult {
  success: boolean;
  error: string | null;
}

/**
 * Maps Firebase error codes to user-friendly messages
 * @param errorCode - Firebase error code
 * @returns User-friendly error message
 */
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // API Key errors
    'auth/api-key-not-valid-please-pass-a-valid-api-key':
      '🔑 Invalid Firebase API key. Please check your environment configuration.',
    'auth/invalid-api-key':
      '🔑 Invalid Firebase API key. Please check your environment configuration.',
    
    // Email/Password errors
    'auth/email-already-in-use':
      '📧 This email is already registered. Please login instead.',
    'auth/invalid-email':
      '📧 Invalid email address. Please check and try again.',
    'auth/weak-password':
      '🔒 Password is too weak. Please use at least 6 characters.',
    'auth/user-not-found':
      '👤 No account found with this email. Please sign up first.',
    'auth/wrong-password':
      '🔒 Incorrect password. Please try again.',
    'auth/invalid-credential':
      '❌ Invalid email or password. Please check your credentials.',
    
    // Account status errors
    'auth/user-disabled':
      '🚫 This account has been disabled. Please contact support.',
    'auth/operation-not-allowed':
      '⚠️ This operation is not allowed. Please contact support.',
    
    // Rate limiting
    'auth/too-many-requests':
      '⏱️ Too many failed attempts. Please try again later.',
    
    // Network errors
    'auth/network-request-failed':
      '🌐 Network error. Please check your internet connection.',
    
    // Popup errors (Google Sign-In)
    'auth/popup-closed-by-user':
      '❌ Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request':
      '❌ Sign-in was cancelled. Please try again.',
    'auth/popup-blocked':
      '🚫 Popup was blocked by browser. Please allow popups and try again.',
    
    // Token errors
    'auth/invalid-user-token':
      '🔐 Your session has expired. Please login again.',
    'auth/user-token-expired':
      '⏰ Your session has expired. Please login again.',
    
    // Other errors
    'auth/requires-recent-login':
      '🔐 This operation requires recent authentication. Please login again.'
  };

  return errorMessages[errorCode] || '❌ An unexpected error occurred. Please try again.';
};

/**
 * Register a new user with email and password
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @param displayName - Optional display name
 * @returns Promise with user data or error
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { user: null, error: '📧 Email and password are required.' };
    }

    if (password.length < 6) {
      return { user: null, error: '🔒 Password must be at least 6 characters long.' };
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    
    console.log('✅ User registered successfully:', userCredential.user.email);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('❌ Registration error:', error.code, error.message);
    const errorMessage = getErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

/**
 * Login user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with user data or error
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { user: null, error: '📧 Email and password are required.' };
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in successfully:', userCredential.user.email);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('❌ Login error:', error.code, error.message);
    const errorMessage = getErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

/**
 * Login with Google account
 * @returns Promise with user data or error
 */
export const loginWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Google sign-in successful:', result.user.email);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('❌ Google sign-in error:', error.code, error.message);
    const errorMessage = getErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

/**
 * Logout current user
 * @returns Promise with success status or error
 */
export const logoutUser = async (): Promise<OperationResult> => {
  try {
    await signOut(auth);
    console.log('✅ User logged out successfully');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Logout error:', error.code, error.message);
    return { success: false, error: 'Failed to logout. Please try again.' };
  }
};

/**
 * Send password reset email
 * @param email - User's email address
 * @returns Promise with success status or error
 */
export const resetPassword = async (email: string): Promise<OperationResult> => {
  try {
    if (!email) {
      return { success: false, error: '📧 Email is required.' };
    }

    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent to:', email);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Password reset error:', error.code, error.message);
    const errorMessage = getErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

/**
 * Update user's display name
 * @param displayName - New display name
 * @returns Promise with success status or error
 */
export const updateUserProfile = async (displayName: string): Promise<OperationResult> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: '❌ No user is currently logged in.' };
    }

    await updateProfile(user, { displayName });
    console.log('✅ Profile updated successfully');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Profile update error:', error.code, error.message);
    return { success: false, error: 'Failed to update profile. Please try again.' };
  }
};

/**
 * Change user's password
 * @param currentPassword - Current password for verification
 * @param newPassword - New password
 * @returns Promise with success status or error
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<OperationResult> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: '❌ No user is currently logged in.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: '🔒 New password must be at least 6 characters long.' };
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    console.log('✅ Password changed successfully');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Password change error:', error.code, error.message);
    const errorMessage = getErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

/**
 * Send email verification to current user
 * @returns Promise with success status or error
 */
export const sendVerificationEmail = async (): Promise<OperationResult> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: '❌ No user is currently logged in.' };
    }

    await sendEmailVerification(user);
    console.log('✅ Verification email sent');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Verification email error:', error.code, error.message);
    return { success: false, error: 'Failed to send verification email. Please try again.' };
  }
};

/**
 * Get current authenticated user
 * @returns Current user or null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 * @returns True if user is logged in
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

/**
 * Get user's ID token for API requests
 * @returns Promise with token or null
 */
export const getUserToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user token:', error);
    return null;
  }
};

/**
 * Subscribe to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user's email is verified
 * @returns True if email is verified
 */
export const isEmailVerified = (): boolean => {
  const user = auth.currentUser;
  return user?.emailVerified || false;
};

// Made with ❤️ by Bob

// Made with Bob
