# 🔧 Environment Configuration Complete Guide

## ✅ What Has Been Fixed

### 1. JWT_SECRET - COMPLETED ✓
**Status:** ✅ **FIXED**
- Generated secure 64-character random string
- Updated in `.env` file
- No action required from you

---

## ⚠️ What You Need To Configure

### 2. VITE_GEMINI_API_KEY - ACTION REQUIRED

**Current Status:** ❌ Placeholder value detected

**How to Get Your Gemini API Key:**

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Select "Create API key in new project" or use existing project
   - Copy the generated API key (starts with `AIza...`)

3. **Update .env File**
   - Open `.env` file
   - Find line 46: `VITE_GEMINI_API_KEY=your-gemini-api-key-here`
   - Replace with: `VITE_GEMINI_API_KEY=AIzaSy...` (your actual key)
   - Save the file

**Example:**
```env
# Before
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# After
VITE_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

---

### 3. Firebase Configuration - ACTION REQUIRED

**Current Status:** ❌ All Firebase values are empty

**How to Set Up Firebase:**

#### Step 1: Create Firebase Project

1. Go to Firebase Console: https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enter project name (e.g., "AI Interview Prep Pro")
4. Follow the setup wizard (disable Google Analytics if not needed)
5. Click "Create project"

#### Step 2: Add Web App

1. In Firebase Console, click the Web icon `</>`
2. Register app with nickname (e.g., "AI Interview Web App")
3. **DO NOT** check "Also set up Firebase Hosting"
4. Click "Register app"
5. You'll see a config object - **KEEP THIS PAGE OPEN**

#### Step 3: Enable Authentication

1. In left sidebar, go to "Build" → "Authentication"
2. Click "Get started"
3. Click "Email/Password" sign-in method
4. Toggle "Enable" switch
5. Click "Save"
6. (Optional) Enable "Google" sign-in method for social login

#### Step 4: Copy Configuration Values

From the Firebase config object you saw in Step 2, copy each value:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // Copy this
  authDomain: "project.firebaseapp.com",  // Copy this
  projectId: "project-id",        // Copy this
  storageBucket: "project.appspot.com",   // Copy this
  messagingSenderId: "123456789", // Copy this
  appId: "1:123:web:abc123",      // Copy this
  measurementId: "G-ABC123"       // Copy this (optional)
};
```

#### Step 5: Update .env File

Open `.env` and update lines 54-60:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
VITE_FIREBASE_AUTH_DOMAIN=ai-interview-prep-pro.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-interview-prep-pro
VITE_FIREBASE_STORAGE_BUCKET=ai-interview-prep-pro.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:a1b2c3d4e5f6g7h8
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ
```

**Important Notes:**
- Replace ALL placeholder values with your actual Firebase config
- Keep the quotes in the config but NOT in the .env file
- Each value should be on its own line
- No spaces around the `=` sign

---

## 📋 MongoDB Configuration Status

**Current Status:** ✅ **CONFIGURED**

Your MongoDB URI is already set:
```
mongodb+srv://deepeshgv07_db_user:IjhgcoKULqsw60rn@cluster0.acwurub.mongodb.net/ai-interview?retryWrites=true&w=majorityCluster0
```

**Note:** There appears to be a typo at the end (`majorityCluster0` instead of `majority`). 

**To fix (optional but recommended):**
1. Open `.env`
2. Find line 28
3. Change from: `...w=majorityCluster0`
4. Change to: `...w=majority`

**Corrected URI:**
```env
MONGODB_URI=mongodb+srv://deepeshgv07_db_user:IjhgcoKULqsw60rn@cluster0.acwurub.mongodb.net/ai-interview?retryWrites=true&w=majority
```

---

## 🚀 Quick Setup Checklist

Use this checklist to track your progress:

- [x] **JWT_SECRET** - ✅ Already configured (secure random key generated)
- [x] **MONGODB_URI** - ✅ Already configured (minor typo to fix)
- [ ] **VITE_GEMINI_API_KEY** - ⚠️ Get from https://aistudio.google.com/app/apikey
- [ ] **VITE_FIREBASE_API_KEY** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_AUTH_DOMAIN** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_PROJECT_ID** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_STORAGE_BUCKET** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_MESSAGING_SENDER_ID** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_APP_ID** - ⚠️ Get from Firebase Console
- [ ] **VITE_FIREBASE_MEASUREMENT_ID** - ⚠️ Get from Firebase Console (optional)

---

## 🔍 Verification Steps

After completing all configurations:

### 1. Verify .env File
```bash
# Check that .env exists and has all values
cat .env
```

### 2. Test MongoDB Connection
```bash
# Run the test script
node test-mongodb-connection.js
```

Expected output:
```
✅ MongoDB Connection Successful!
```

### 3. Start Development Server
```bash
# Install dependencies (if not done)
npm install

# Start the server
npm run dev
```

### 4. Check Console Output

Look for these success messages:
- ✅ MongoDB Connection Successful!
- ✅ Firebase initialized successfully
- ✅ Server running on port 3000

### 5. Test Authentication

1. Open browser to `http://localhost:5173`
2. Try to sign up with email/password
3. Check if authentication works

---

## 🆘 Troubleshooting

### Error: "VITE_GEMINI_API_KEY is not defined"
**Solution:** Get API key from https://aistudio.google.com/app/apikey and add to `.env`

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution:** Check that `VITE_FIREBASE_API_KEY` is correct in `.env`

### Error: "Firebase: Error (auth/project-not-found)"
**Solution:** Verify `VITE_FIREBASE_PROJECT_ID` matches your Firebase project

### Error: "MongoDB connection failed"
**Solution:** 
1. Check MongoDB URI is correct
2. Verify network access in MongoDB Atlas (0.0.0.0/0)
3. Ensure cluster is not paused

### Changes Not Reflecting
**Solution:** 
1. Save `.env` file
2. Stop the server (Ctrl+C)
3. Restart: `npm run dev`

---

## 📖 Additional Resources

- **MongoDB Setup:** See `MONGODB_SETUP_GUIDE.md`
- **Firebase Setup:** See `FIREBASE_COMPLETE_SETUP_GUIDE.md`
- **Quick Start:** See `QUICK_SETUP_GUIDE.md`
- **General README:** See `README.md`

---

## 🎯 Summary

**What's Done:**
- ✅ JWT_SECRET generated and configured
- ✅ MongoDB URI already set (minor fix recommended)

**What You Need To Do:**
1. Get Gemini API key (5 minutes)
2. Set up Firebase project (10 minutes)
3. Copy Firebase config to .env (2 minutes)
4. Save .env and restart server
5. Test the application

**Total Time Required:** ~20 minutes

---

## 💡 Pro Tips

1. **Keep .env Secure:** Never commit `.env` to Git (already in `.gitignore`)
2. **Backup Your Keys:** Save your API keys in a secure password manager
3. **Environment Variables:** Changes to `.env` require server restart
4. **Firebase Quotas:** Free tier has limits; monitor usage in Firebase Console
5. **Gemini API:** Free tier has rate limits; check quota at https://aistudio.google.com/

---

**Need Help?** Check the detailed guides in the project root or create an issue on GitHub.