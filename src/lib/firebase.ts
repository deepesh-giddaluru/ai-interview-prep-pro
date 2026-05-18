/**
 * Firebase Library - Legacy Compatibility Layer
 * 
 * This file maintains backward compatibility with existing code
 * while using the new organized Firebase structure.
 * 
 * RECOMMENDED: Use the new services directly:
 * - import { auth } from '@/src/config/firebase'
 * - import * as authService from '@/src/services/auth.service'
 * - import { useFirebaseAuth } from '@/src/hooks/useFirebaseAuth'
 */

// Re-export auth instance from new config
export { auth } from '../config/firebase';

// Re-export all auth service functions for backward compatibility
export {
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

// Re-export types
export type { AuthResult, OperationResult } from '../services/auth.service';

/**
 * @deprecated Use auth service functions directly
 * This file is maintained for backward compatibility only
 */
console.warn(
  '⚠️ Using legacy firebase.ts import. ' +
  'Consider migrating to:\n' +
  '  - import { auth } from "@/src/config/firebase"\n' +
  '  - import * as authService from "@/src/services/auth.service"\n' +
  '  - import { useFirebaseAuth } from "@/src/hooks/useFirebaseAuth"'
);

// Made with ❤️ by Bob

// Made with Bob
