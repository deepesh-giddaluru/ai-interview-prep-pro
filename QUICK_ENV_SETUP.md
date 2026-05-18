# Quick Environment Setup Guide

## Step 1: Configure Your .env File

Your `.env` file has been created with placeholder values. Follow these steps to configure it:

### 1. MongoDB URI

**Get your MongoDB connection string:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up/Login
3. Create a free cluster (M0 Sandbox)
4. Create a database user with password
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<username>`, `<password>`, and add your database name

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

### 2. JWT Secret

**Generate a secure JWT secret:**

Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it:
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 3. API URL

**For development (default):**
```env
VITE_API_URL=http://localhost:3000/api
```

**For production:**
```env
VITE_API_URL=https://your-domain.com/api
```

### 4. Gemini API Key

**Get your Gemini API key:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

```env
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuv
```

---

## Complete .env Example

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:SecurePass123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Frontend API URL
VITE_API_URL=http://localhost:3000/api

# Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuv
```

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Test MongoDB Connection

Create a file `test-connection.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

Run:
```bash
node test-connection.js
```

---

## Step 4: Start the Application

```bash
npm run dev
```

Your app will be available at: http://localhost:3000

---

## Troubleshooting

### MongoDB Connection Error
- Check your internet connection
- Verify username and password in connection string
- Ensure IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)

### JWT Error
- Make sure JWT_SECRET is at least 32 characters long
- Restart the server after changing .env

### API Connection Error
- Verify VITE_API_URL is correct
- Check if backend server is running on port 3000

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to version control
- Use different secrets for development and production
- Keep your API keys secure
- Change default passwords

---

## Next Steps

1. ✅ Configure `.env` file
2. ✅ Install dependencies
3. ✅ Test MongoDB connection
4. ✅ Start the application
5. 📖 Read `MONGODB_SETUP_GUIDE.md` for detailed documentation

---

**Ready to go! 🚀**