# 🚀 Firebase Authentication - Quick Start Guide

Get Firebase Authentication up and running in **5 minutes**!

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Create Firebase Project (2 min)
1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it: `ai-interview-prep-pro`
4. Click **"Create project"**

### Step 2: Register Web App (1 min)
1. Click the **Web icon** (`</>`)
2. Name it: `AI Interview Prep Web`
3. Click **"Register app"**
4. **COPY** the config values shown

### Step 3: Enable Authentication (1 min)
1. Go to **"Build" → "Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"**
4. Enable **"Google"** (select your email)

### Step 4: Configure Environment (1 min)
1. Open `.env` file in your project root
2. Paste your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Step 5: Start Development Server
```bash
npm run dev
```

**✅ Done!** Open http://localhost:5173/login and test authentication.

---

## 🎯 What You Get

### ✨ Features Enabled
- ✅ Email/Password signup & login
- ✅ Google Sign-In
- ✅ Password reset via email
- ✅ Session persistence (stay logged in)
- ✅ Email verification
- ✅ Secure token-based auth
- ✅ User profile management

### 🔐 Security Features
- ✅ Firebase Authentication (industry-standard)
- ✅ Encrypted passwords
- ✅ Secure token storage
- ✅ HTTPS-only in production
- ✅ Rate limiting
- ✅ Brute force protection

---

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase initialization
├── services/
│   └── auth.service.ts      # Authentication operations
├── hooks/
│   └── useFirebaseAuth.ts   # React hook for auth
├── components/
│   └── LoginPage.tsx        # Login/Signup UI
└── lib/
    └── firebase.ts          # Legacy compatibility
```

---

## 💻 Usage Examples

### Using the Hook (Recommended)
```typescript
import { useFirebaseAuth } from '@/src/hooks/useFirebaseAuth';

function MyComponent() {
  const { user, loading, login, logout } = useFirebaseAuth();

  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <LoginForm />;
}
```

### Using the Service Directly
```typescript
import * as authService from '@/src/services/auth.service';

// Register user
const { user, error } = await authService.registerUser(
  'user@example.com',
  'password123',
  'John Doe'
);

// Login user
const { user, error } = await authService.loginUser(
  'user@example.com',
  'password123'
);

// Google Sign-In
const { user, error } = await authService.loginWithGoogle();

// Logout
await authService.logoutUser();
```

---

## 🧪 Testing Authentication

### Test Email/Password Signup
1. Go to http://localhost:5173/login
2. Click **"Sign up"**
3. Enter email, password, and name
4. Click **"Create Account"**
5. Check Firebase Console → Authentication → Users

### Test Google Sign-In
1. Go to http://localhost:5173/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. Verify redirect to dashboard

### Test Password Reset
1. Go to http://localhost:5173/login
2. Click **"Forgot password?"**
3. Enter your email
4. Check your email inbox
5. Click reset link

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Can create new account with email/password
- [ ] Can login with email/password
- [ ] Can login with Google
- [ ] Can reset password
- [ ] Stay logged in after page refresh
- [ ] Can logout successfully
- [ ] See user info in Firebase Console
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Issue: "auth/api-key-not-valid"
**Fix**: 
```bash
# 1. Check .env file has correct API key
# 2. Restart dev server
npm run dev
```

### Issue: "Environment variables not loading"
**Fix**:
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### Issue: "Google Sign-In popup blocked"
**Fix**: Allow popups in browser settings

### Issue: "Unauthorized domain"
**Fix**: Add domain in Firebase Console → Authentication → Settings → Authorized domains

---

## 📚 Next Steps

### Production Deployment
1. Add production domain to Firebase authorized domains
2. Set environment variables in hosting platform
3. Enable HTTPS
4. Test all auth flows in production

### Additional Features
- Add email verification requirement
- Implement password strength meter
- Add social login (Facebook, Twitter, etc.)
- Add two-factor authentication
- Implement user roles and permissions

### Documentation
- See `FIREBASE_COMPLETE_SETUP_GUIDE.md` for detailed setup
- See `src/services/auth.service.ts` for all available methods
- See `src/hooks/useFirebaseAuth.ts` for hook documentation

---

## 🆘 Need Help?

### Resources
- 📖 [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- 🎥 [Video Tutorial](https://www.youtube.com/watch?v=rQvOAnNvcNQ)
- 💬 [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase-authentication)
- 🐛 [GitHub Issues](https://github.com/firebase/firebase-js-sdk/issues)

### Support
- Check browser console for errors
- Verify all environment variables are set
- Ensure Firebase services are enabled
- Review Firebase Console for user activity

---

## 🎉 Success!

Your Firebase Authentication is now fully configured and ready to use!

**What's Working:**
- ✅ Secure user authentication
- ✅ Multiple sign-in methods
- ✅ Session management
- ✅ Password recovery
- ✅ Production-ready setup

**Start building your app!** 🚀

---

*Made with ❤️ by Bob*
*Last Updated: 2026-05-17*