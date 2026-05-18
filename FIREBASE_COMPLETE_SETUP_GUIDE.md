# 🔥 Firebase Authentication - Complete Setup Guide

## 📋 Overview
This guide will help you set up Firebase Authentication for the AI Interview Prep Pro platform with Email/Password and Google Sign-In.

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Click **"Add project"** or **"Create a project"**

### 1.2 Configure Your Project
1. **Project Name**: Enter `ai-interview-prep-pro` (or your preferred name)
2. **Google Analytics**: Enable or disable (optional)
3. Click **"Create project"**
4. Wait for project creation to complete

---

## 🔧 Step 2: Register Your Web App

### 2.1 Add Web App
1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. **App nickname**: Enter `AI Interview Prep Web`
3. **Firebase Hosting**: Leave unchecked (optional)
4. Click **"Register app"**

### 2.2 Copy Configuration
You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**⚠️ IMPORTANT**: Keep this window open or copy these values immediately!

---

## 🔐 Step 3: Enable Authentication Methods

### 3.1 Enable Email/Password Authentication
1. In Firebase Console, go to **"Build" → "Authentication"**
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. Click **"Save"**

### 3.2 Enable Google Sign-In
1. Still in **"Sign-in method"** tab
2. Click on **"Google"**
3. **Enable** the toggle
4. **Project support email**: Select your email from dropdown
5. Click **"Save"**

### 3.3 Configure Authorized Domains (Important!)
1. In **"Sign-in method"** tab, scroll to **"Authorized domains"**
2. By default, `localhost` is already authorized
3. For production, add your domain:
   - Click **"Add domain"**
   - Enter your domain (e.g., `yourdomain.com`)
   - Click **"Add"**

---

## 📝 Step 4: Configure Environment Variables

### 4.1 Create .env File
In your project root, create a `.env` file:

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 4.2 Add Firebase Configuration
Open `.env` and add your Firebase values:

```env
# ==============================================
# FIREBASE CONFIGURATION
# ==============================================
# Get these from Firebase Console: https://console.firebase.google.com/
# Project Settings > General > Your apps > Web app

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4.3 Replace Placeholder Values
Replace each value with your actual Firebase configuration:

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Config → apiKey | `AIzaSyXXX...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Config → authDomain | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Config → projectId | `project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Config → storageBucket | `project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Config → messagingSenderId | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase Config → appId | `1:123456789012:web:xxx` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Config → measurementId | `G-XXXXXXXXXX` (optional) |

---

## 🔒 Step 5: Security Best Practices

### 5.1 Protect Your .env File
Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 5.2 Never Commit Credentials
- ✅ DO: Use `.env.example` with placeholder values
- ❌ DON'T: Commit `.env` with real credentials
- ❌ DON'T: Share your API keys publicly

### 5.3 Configure Firebase Security Rules
In Firebase Console → Firestore/Storage → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ✅ Step 6: Verify Setup

### 6.1 Check Environment Variables
Run this command to verify:
```bash
npm run dev
```

Check browser console for:
```
✅ Firebase initialized successfully
```

### 6.2 Test Authentication
1. Go to `http://localhost:5173/login`
2. Try creating an account with email/password
3. Try signing in with Google
4. Check Firebase Console → Authentication → Users

### 6.3 Common Issues & Solutions

#### Issue: "auth/api-key-not-valid"
**Solution**: 
- Verify API key is correct in `.env`
- Ensure no extra spaces or quotes
- Restart dev server after changing `.env`

#### Issue: "auth/unauthorized-domain"
**Solution**:
- Add domain to Firebase Console → Authentication → Settings → Authorized domains
- For localhost: Should be pre-authorized
- For production: Add your domain

#### Issue: Google Sign-In popup blocked
**Solution**:
- Allow popups in browser settings
- Check if Google Sign-In is enabled in Firebase Console

#### Issue: Environment variables not loading
**Solution**:
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

---

## 🎯 Step 7: Production Deployment

### 7.1 Add Production Domain
1. Firebase Console → Authentication → Settings
2. Add your production domain to **Authorized domains**
3. Example: `yourdomain.com`, `www.yourdomain.com`

### 7.2 Set Production Environment Variables
For Vercel/Netlify/etc:
1. Go to project settings
2. Add environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 7.3 Update CORS Settings
If using custom domain, update Firebase CORS:
```bash
firebase deploy --only hosting
```

---

## 📚 Additional Resources

### Firebase Documentation
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Email/Password Auth](https://firebase.google.com/docs/auth/web/password-auth)
- [Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)

### Troubleshooting
- [Common Errors](https://firebase.google.com/docs/auth/admin/errors)
- [Security Rules](https://firebase.google.com/docs/rules)

---

## 🆘 Need Help?

### Quick Checklist
- [ ] Firebase project created
- [ ] Web app registered
- [ ] Email/Password authentication enabled
- [ ] Google Sign-In enabled
- [ ] `.env` file created with correct values
- [ ] Dev server restarted
- [ ] No console errors
- [ ] Can create account
- [ ] Can sign in
- [ ] Can sign out

### Still Having Issues?
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Firebase services are enabled
4. Check Firebase Console → Authentication → Users
5. Review Firebase Console → Authentication → Settings

---

## 🎉 Success!

Once setup is complete, you should be able to:
- ✅ Create accounts with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google
- ✅ Reset password via email
- ✅ Stay logged in after page refresh
- ✅ Sign out successfully

**Your Firebase Authentication is now fully configured!** 🚀

---

*Last Updated: 2026-05-17*
*Made with ❤️ by Bob*