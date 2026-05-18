# 🔥 Firebase Authentication Setup Guide

Complete guide to configure Firebase Authentication for the AI Interview Prep Platform.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Enable Authentication Methods](#enable-authentication-methods)
5. [Testing Authentication](#testing-authentication)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Google Account
- Node.js installed
- Project cloned and dependencies installed

---

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `ai-interview-prep` (or your preferred name)
4. Click **Continue**
5. (Optional) Enable Google Analytics
6. Click **Create project**
7. Wait for project creation to complete

### Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `AI Interview Prep Web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **Register app**
5. Copy the Firebase configuration object (you'll need these values)

### Step 3: Get Configuration Values

You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Environment Configuration

### Step 1: Update .env File

1. Open your `.env` file in the project root
2. Add the following Firebase configuration variables:

```env
# ==============================================
# FIREBASE CONFIGURATION
# ==============================================
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Replace the placeholder values with your actual Firebase config values
4. Save the file

### Step 2: Verify Configuration

The application will automatically validate your Firebase configuration on startup. If any required fields are missing, you'll see an error message in the console.

**Required Fields:**
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_APP_ID`

**Optional Fields:**
- `VITE_FIREBASE_MEASUREMENT_ID` (for Analytics)

---

## Enable Authentication Methods

### Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Toggle **Enable** switch
4. Click **Save**

### Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable** switch
4. Select a **Project support email** from dropdown
5. Click **Save**

### Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourdomain.com`)
3. Click **Add domain** for each

---

## Testing Authentication

### Test Email/Password Sign Up

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click **"Sign up"**
4. Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
5. Click **"Create Account"**
6. Check for success message and redirect to dashboard

### Test Email/Password Login

1. On login page, enter:
   - Email
   - Password
2. Click **"Login & Continue"**
3. Verify successful login and redirect

### Test Google Sign-In

1. On login page, click **"Sign in with Google"**
2. Select your Google account
3. Grant permissions
4. Verify successful login and redirect

### Test Password Reset

1. On login page, click **"Forgot password?"**
2. Enter your email
3. Click **"Send Reset Link"**
4. Check your email for reset link
5. Follow link to reset password

---

## Features Implemented

### ✅ Authentication Methods
- Email/Password registration
- Email/Password login
- Google OAuth sign-in
- Password reset via email
- Session persistence

### ✅ Error Handling
- Invalid API key detection
- User-friendly error messages
- Network error handling
- Validation errors
- Rate limiting errors

### ✅ User Experience
- Loading states during authentication
- Toast notifications for feedback
- Form validation
- Automatic redirects after success
- Session persistence across page reloads

### ✅ Security Features
- Secure password requirements (min 6 chars)
- Email validation
- Protected routes
- Token-based authentication
- Automatic session management

---

## Troubleshooting

### Error: "Invalid API key"

**Problem:** Firebase API key is not valid or missing.

**Solution:**
1. Check `.env` file has correct `VITE_FIREBASE_API_KEY`
2. Verify the API key from Firebase Console
3. Ensure no extra spaces or quotes
4. Restart development server after changes

### Error: "Email already in use"

**Problem:** Trying to register with an existing email.

**Solution:**
- Use the login form instead
- Or use password reset if you forgot password

### Error: "Popup blocked"

**Problem:** Browser blocked Google sign-in popup.

**Solution:**
1. Allow popups for localhost in browser settings
2. Try again
3. Or use email/password authentication

### Error: "Network request failed"

**Problem:** No internet connection or Firebase is unreachable.

**Solution:**
1. Check internet connection
2. Verify Firebase project is active
3. Check Firebase status page

### Error: "Too many requests"

**Problem:** Too many failed login attempts.

**Solution:**
- Wait a few minutes before trying again
- Use password reset if needed

### Configuration Not Loading

**Problem:** Environment variables not being read.

**Solution:**
1. Ensure `.env` file is in project root
2. Restart development server: `npm run dev`
3. Clear browser cache
4. Check file is named exactly `.env` (not `.env.txt`)

---

## Firebase Console Quick Links

- **Authentication Dashboard:** `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication`
- **Users List:** `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/users`
- **Sign-in Methods:** `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/providers`
- **Project Settings:** `https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/general`

---

## Security Best Practices

### ✅ Do's
- Keep `.env` file in `.gitignore`
- Use environment variables for all config
- Enable only required auth methods
- Set up authorized domains
- Monitor authentication logs
- Use strong passwords
- Enable 2FA for Firebase Console

### ❌ Don'ts
- Never commit `.env` to version control
- Don't share API keys publicly
- Don't disable security rules
- Don't use weak passwords
- Don't ignore security warnings

---

## Production Deployment

### Before Deploying

1. **Update Environment Variables:**
   - Add production Firebase config to hosting platform
   - Use production domain in `VITE_FIREBASE_AUTH_DOMAIN`

2. **Configure Authorized Domains:**
   - Add production domain to Firebase Console
   - Remove localhost from production

3. **Test Authentication:**
   - Test all auth flows in production
   - Verify redirects work correctly
   - Check error handling

4. **Monitor Usage:**
   - Set up Firebase Analytics
   - Monitor authentication logs
   - Set up alerts for errors

---

## Support

### Need Help?

- **Firebase Documentation:** https://firebase.google.com/docs/auth
- **Firebase Support:** https://firebase.google.com/support
- **Stack Overflow:** Tag questions with `firebase-authentication`

### Common Resources

- [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)
- [Firebase Auth Error Codes](https://firebase.google.com/docs/auth/admin/errors)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

## Summary

You now have a fully configured Firebase Authentication system with:

✅ Email/Password authentication  
✅ Google OAuth sign-in  
✅ Password reset functionality  
✅ Comprehensive error handling  
✅ User-friendly notifications  
✅ Session persistence  
✅ Production-ready setup  

**Next Steps:**
1. Test all authentication flows
2. Customize error messages if needed
3. Add additional OAuth providers (optional)
4. Set up Firebase Analytics (optional)
5. Deploy to production

---

Made with ❤️ by Bob
