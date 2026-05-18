# 🚀 How to Run Your AI Interview Prep Pro Website

## Quick Start Commands

### 1️⃣ Start the Development Server

Open your terminal in the project directory and run:

```bash
npm run dev
```

**What this does:**
- Starts the Vite development server
- Compiles your React/TypeScript code
- Opens your website on localhost

### 2️⃣ Open in Browser

After running `npm run dev`, you'll see output like:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open your browser and go to:**
```
http://localhost:5173/
```

Or click the link in the terminal (Ctrl+Click or Cmd+Click)

---

## 📍 Available Pages

Once the server is running, visit these URLs:

### Main Pages
- **Home/Landing**: `http://localhost:5173/`
- **Login/Signup**: `http://localhost:5173/login`
- **Dashboard**: `http://localhost:5173/dashboard` (after login)

### Feature Pages (after login)
- **AI Mock Interview**: `http://localhost:5173/interview`
- **Resume Analyzer**: `http://localhost:5173/resume-analyzer`
- **Coding Arena**: `http://localhost:5173/coding-arena`
- **Career Roadmap**: `http://localhost:5173/career-roadmap`
- **Skill Gap Analyzer**: `http://localhost:5173/skill-gap`
- **Analytics**: `http://localhost:5173/analytics`
- **Profile**: `http://localhost:5173/profile`
- **Settings**: `http://localhost:5173/settings`

---

## 🔧 Before First Run

### Step 1: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 2: Setup Environment Variables

1. **Copy the example file:**
```bash
cp .env.example .env
```

2. **Add your Firebase credentials to `.env`:**
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
```

**Get Firebase credentials from:**
https://console.firebase.google.com/
(See `FIREBASE_QUICK_START.md` for detailed instructions)

### Step 3: Start Development Server
```bash
npm run dev
```

---

## 🎯 Common Commands

### Development
```bash
# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3000

# Start and open browser automatically
npm run dev -- --open
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Backend Server (if needed)
```bash
# Start backend server (in separate terminal)
npm run server

# Or use nodemon for auto-restart
npx nodemon server.ts
```

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 5173 already in use"
**Solution:** 
```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

### Issue: "Cannot find module"
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase errors
**Solution:**
1. Check `.env` file has correct Firebase credentials
2. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
3. See `FIREBASE_QUICK_START.md` for setup help

### Issue: White screen or errors
**Solution:**
1. Check browser console (F12) for errors
2. Check terminal for error messages
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart dev server

---

## 📱 Testing on Mobile/Other Devices

### 1. Find Your Local IP
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Look for your local IP (e.g., `192.168.1.100`)

### 2. Start Server with Host Flag
```bash
npm run dev -- --host
```

### 3. Access from Other Devices
On your phone/tablet, open browser and go to:
```
http://YOUR_LOCAL_IP:5173
```
Example: `http://192.168.1.100:5173`

**Note:** Make sure devices are on the same WiFi network!

---

## 🔄 Stopping the Server

To stop the development server:
- Press `Ctrl + C` in the terminal
- Or close the terminal window

---

## 📊 What You Should See

### Terminal Output (Success)
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help

✅ Firebase initialized successfully
📱 Project ID: your-project-id
🔐 Auth Domain: your-project.firebaseapp.com
```

### Browser (Success)
- Landing page loads with animations
- No console errors (F12 to check)
- Can navigate to login page
- Can create account/login

### Common Console Messages (Normal)
```
✅ Firebase initialized successfully
👤 User authenticated: user@example.com
✅ Login successful!
```

---

## 🎉 Quick Test Checklist

After starting the server, verify:

- [ ] Server starts without errors
- [ ] Can access `http://localhost:5173/`
- [ ] Landing page loads correctly
- [ ] Can navigate to `/login`
- [ ] No console errors (F12)
- [ ] Firebase initialized message appears
- [ ] Can create account
- [ ] Can login
- [ ] Redirects to dashboard after login

---

## 💡 Pro Tips

### Hot Reload
Changes to your code will automatically reload the browser - no need to restart the server!

### Multiple Terminals
You can run multiple commands simultaneously:
- **Terminal 1**: `npm run dev` (frontend)
- **Terminal 2**: `npm run server` (backend, if needed)

### VS Code Integration
- Use VS Code's integrated terminal (Ctrl+`)
- Install "Live Server" extension for additional features
- Use "Thunder Client" for API testing

### Browser DevTools
- Press `F12` to open developer tools
- Check Console tab for errors
- Check Network tab for API calls
- Check Application tab for localStorage/cookies

---

## 📞 Need Help?

### Check These First
1. Terminal output for error messages
2. Browser console (F12) for JavaScript errors
3. `.env` file has correct values
4. Node.js and npm are installed: `node --version` && `npm --version`

### Documentation
- `FIREBASE_QUICK_START.md` - Firebase setup
- `FIREBASE_COMPLETE_SETUP_GUIDE.md` - Detailed Firebase guide
- `README.md` - Project overview

### Common Solutions
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev

# Check Node version (should be 16+)
node --version

# Update npm
npm install -g npm@latest
```

---

## 🎊 You're All Set!

Your AI Interview Prep Pro platform should now be running at:
**http://localhost:5173/**

Enjoy building and testing your application! 🚀

---

*Made with ❤️ by Bob*