/**
 * Firebase Configuration
 * 
 * This file initializes Firebase with environment variables and exports
 * the auth instance for use throughout the application.
 * 
 * Environment variables are loaded from .env file using Vite's import.meta.env
 * All Firebase config values must be prefixed with VITE_ to be accessible
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Validates that all required Firebase environment variables are present
 * @throws {Error} If any required environment variable is missing
 * @returns {FirebaseConfig} Validated Firebase configuration object
 */
const validateFirebaseConfig = (): FirebaseConfig => {
  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  // Define required fields (measurementId is optional)
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  // Check for missing required fields
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    const envVarNames = missingFields.map(field => {
      // Convert camelCase to SCREAMING_SNAKE_CASE
      const snakeCase = field.replace(/([A-Z])/g, '_$1').toUpperCase();
      return `VITE_FIREBASE${snakeCase}`;
    });

    throw new Error(
      `❌ Firebase Configuration Error\n\n` +
      `Missing required environment variables:\n` +
      `${envVarNames.map(name => `  - ${name}`).join('\n')}\n\n` +
      `Please check your .env file and ensure all Firebase variables are set.\n` +
      `See FIREBASE_COMPLETE_SETUP_GUIDE.md for setup instructions.`
    );
  }

  return config;
};

// Initialize Firebase app and auth
let app: FirebaseApp;
let auth: Auth;

try {
  const firebaseConfig = validateFirebaseConfig();
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  
  // Enable persistence (keeps user logged in after page refresh)
  auth.setPersistence({
    type: 'LOCAL' as any
  });
  
  console.log('✅ Firebase initialized successfully');
  console.log('📱 Project ID:', firebaseConfig.projectId);
  console.log('🔐 Auth Domain:', firebaseConfig.authDomain);
} catch (error: any) {
  console.error('❌ Firebase initialization failed:', error.message);
  
  // Provide helpful error message
  if (error.message.includes('Missing required environment variables')) {
    console.error('\n📝 Setup Instructions:');
    console.error('1. Copy .env.example to .env');
    console.error('2. Fill in your Firebase credentials');
    console.error('3. Restart the development server');
    console.error('4. See FIREBASE_COMPLETE_SETUP_GUIDE.md for detailed help\n');
  }
  
  throw error;
}

/**
 * Firebase Auth instance
 * Use this throughout the app for authentication operations
 */
export { auth };

/**
 * Firebase App instance
 * Use this if you need to access other Firebase services
 */
export { app };

/**
 * Check if Firebase is properly initialized
 * @returns {boolean} True if Firebase is initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return !!app && !!auth;
};

/**
 * Get Firebase configuration (without sensitive data)
 * Useful for debugging
 * @returns {object} Safe configuration object
 */
export const getFirebaseInfo = () => {
  return {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    initialized: isFirebaseInitialized()
  };
};

// Made with ❤️ by Bob

// Made with Bob
