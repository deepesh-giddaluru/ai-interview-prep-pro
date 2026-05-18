# 🚀 Quick Login Guide - AI Interview Platform

## 🎯 Quick Start (3 Steps)

### Step 1: Start Backend
```bash
npm run dev
```

### Step 2: Open Browser
Navigate to: `http://localhost:5173` (or your Vite port)

### Step 3: Login
**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin@123`

**Or create a new user account via signup!**

---

## 🔐 Login Features

### ✅ What Works Now

1. **MongoDB Authentication** - No more Firebase dependency
2. **JWT Tokens** - Secure token-based authentication
3. **Role-Based Access** - Admin and user roles
4. **Auto-Redirect** - Redirects based on user role
5. **Loading Spinner** - Visual feedback during login
6. **Error Handling** - Clear error messages
7. **Session Persistence** - Stay logged in after refresh
8. **Protected Routes** - Secure dashboard and admin panel

### 🎨 User Experience

- **Loading State:** Animated spinner while processing
- **Success Toast:** Green notification on successful login
- **Error Toast:** Red notification with error details
- **Auto-Redirect:** 
  - Admin → `/admin`
  - User → `/dashboard`
- **Already Logged In:** Auto-redirect to dashboard

---

## 📋 Login Flow

```
1. Enter email & password
2. Click "Login & Continue"
3. See loading spinner
4. Backend validates credentials
5. JWT token generated & stored
6. Success toast appears
7. Redirect to dashboard/admin
```

---

## 🔑 Test Accounts

### Admin Account
```
Email: admin@example.com
Password: Admin@123
Access: Full admin panel + all features
```

### Create New User
1. Click "Sign up" on login page
2. Enter your details
3. Click "Create Account"
4. Automatically logged in!

---

## 🛠️ Troubleshooting

### "Cannot connect to server"
**Fix:** Make sure backend is running
```bash
npm run dev
```

### "Invalid credentials"
**Fix:** Check if admin account exists
```bash
node scripts/createAdmin.js
```

### "Token expired"
**Fix:** Just login again (tokens expire after 7 days)

### "MongoDB connection failed"
**Fix:** Check your `.env` file has correct `MONGODB_URI`

---

## 🔒 Security

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ HttpOnly cookies
- ✅ Token expiration (7 days)
- ✅ Protected API routes
- ✅ Role-based access control

---

## 📱 Features After Login

### For All Users:
- Dashboard with analytics
- Mock interviews
- AI Mock Interview
- Resume analyzer
- Skill gap analyzer
- Career roadmap
- Coding arena
- Profile settings

### For Admin Only:
- Admin dashboard
- User management
- System analytics
- Platform settings

---

## 💡 Tips

1. **Stay Logged In:** Your session persists across page refreshes
2. **Multiple Tabs:** Login state syncs across browser tabs
3. **Logout:** Click "Sign Out" in sidebar to logout
4. **Security:** Never share your admin credentials

---

## 🎉 Success Indicators

When login is successful, you'll see:
1. ✅ Green success toast notification
2. 🔄 Smooth redirect animation
3. 📊 Dashboard loads with your data
4. 👤 Your email shown in sidebar

---

## 📞 Need Help?

If login doesn't work:
1. Check browser console (F12)
2. Verify backend is running
3. Check MongoDB connection
4. Clear localStorage and try again
5. Restart both frontend and backend

---

**Status:** ✅ WORKING  
**Authentication:** MongoDB + JWT  
**Last Updated:** 2026-05-17