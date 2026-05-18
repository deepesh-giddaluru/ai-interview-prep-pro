# Complete Installation Instructions

## Quick Start Guide for MongoDB Integration

Follow these steps to set up the complete MongoDB-based authentication and data persistence system.

---

## Step 1: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- MongoDB and Mongoose
- JWT authentication packages
- bcryptjs for password hashing
- CORS and cookie-parser
- React Hot Toast for notifications
- Axios for API calls

---

## Step 2: Set Up MongoDB Atlas

### 2.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Verify your email

### 2.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider and region
4. Name your cluster: `ai-interview-prep`
5. Click "Create Cluster" (takes 3-5 minutes)

### 2.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin` (or your choice)
5. Generate a strong password
6. Set privileges: "Read and write to any database"
7. Click "Add User"

**⚠️ IMPORTANT: Save your username and password!**

### 2.4 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP
5. Click "Confirm"

### 2.5 Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace `<username>`, `<password>`, and add database name

Example:
```
mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

Copy the example file:
```bash
cp .env.example .env
```

### 3.2 Edit .env File

Open `.env` and configure:

```env
# MongoDB Configuration
MONGODB_URI="mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ai-interview-prep?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
JWT_EXPIRE="7d"
JWT_COOKIE_EXPIRE=7

# Application Configuration
NODE_ENV="development"
PORT=3000
APP_URL="http://localhost:3000"
CLIENT_URL="http://localhost:3000"

# AI API Keys
GEMINI_API_KEY="your-gemini-api-key"
# OR
OPENAI_API_KEY="your-openai-api-key"
AI_PROVIDER="gemini"
```

### 3.3 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

---

## Step 4: Test MongoDB Connection

Create a test file `test-connection.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.name);
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run the test:
```bash
node test-connection.js
```

Expected output:
```
Testing MongoDB connection...
✅ MongoDB connected successfully!
Database: ai-interview-prep
✅ Connection closed
```

---

## Step 5: Start the Application

### Development Mode

Start both frontend and backend:

```bash
npm run dev
```

This will:
- Start the Express server on port 3000
- Connect to MongoDB
- Enable Vite HMR for frontend
- Watch for file changes

### Production Build

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## Step 6: Verify Installation

### 6.1 Check Server Health

Open your browser or use curl:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "database": "MongoDB connected"
}
```

### 6.2 Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    ...
  }
}
```

### 6.3 Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 6.4 Access Frontend

Open your browser:
```
http://localhost:3000
```

You should see the login/registration page.

---

## Step 7: Database Structure

After successful setup, MongoDB will automatically create these collections:

1. **users** - User accounts and profiles
2. **interviews** - Interview history and results
3. **roadmaps** - Career roadmaps
4. **resumeanalyses** - Resume analysis reports
5. **progresses** - User progress tracking

You can view these in MongoDB Atlas:
1. Go to "Database" → "Browse Collections"
2. Select your database
3. View collections and documents

---

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"

**Solution:**
```bash
npm install
```

### Issue: "MongoNetworkError: failed to connect"

**Solutions:**
1. Check internet connection
2. Verify MongoDB Atlas IP whitelist
3. Confirm connection string is correct
4. Check if cluster is active

### Issue: "Authentication failed"

**Solutions:**
1. Verify database username and password
2. Check if user has correct permissions
3. URL-encode special characters in password

### Issue: "JWT_SECRET is not defined"

**Solutions:**
1. Ensure `.env` file exists in root directory
2. Verify `JWT_SECRET` is set
3. Restart the server

### Issue: "Port 3000 is already in use"

**Solutions:**
1. Kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```
2. Or change PORT in `.env`

### Issue: "CORS policy error"

**Solutions:**
1. Verify `CLIENT_URL` in `.env`
2. Check CORS configuration in `src/backend/app.ts`
3. Ensure `withCredentials: true` in API calls

---

## Next Steps

After successful installation:

1. **Read the Documentation**
   - `MONGODB_SETUP_GUIDE.md` - Complete MongoDB guide
   - `FEATURES_DOCUMENTATION.md` - Feature documentation
   - `API_DOCUMENTATION.md` - API reference

2. **Test All Features**
   - User registration and login
   - Interview saving and retrieval
   - Roadmap generation
   - Resume analysis
   - Progress tracking

3. **Customize**
   - Update branding
   - Modify UI components
   - Add custom features
   - Configure AI providers

4. **Deploy**
   - Follow deployment guide in `MONGODB_SETUP_GUIDE.md`
   - Set up production environment variables
   - Configure domain and SSL

---

## Support

If you encounter issues:

1. Check error logs in terminal
2. Review MongoDB Atlas logs
3. Verify all environment variables
4. Check network connectivity
5. Consult documentation

---

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Generate new JWT secret
- [ ] Restrict MongoDB IP access
- [ ] Enable HTTPS
- [ ] Set NODE_ENV to "production"
- [ ] Remove test accounts
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Review security headers

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Test MongoDB connection
node test-connection.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important Files

- `.env` - Environment variables
- `src/backend/app.ts` - Main application file
- `src/backend/config/database.ts` - MongoDB configuration
- `src/backend/models/` - Database models
- `src/backend/routes/` - API routes
- `src/backend/controllers/` - Business logic
- `src/backend/middleware/auth.ts` - Authentication middleware

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `POST /api/interviews` - Save interview
- `GET /api/interviews` - Get all interviews
- `GET /api/dashboard` - Get dashboard data
- `POST /api/roadmaps` - Save roadmap
- `GET /api/progress` - Get user progress

---

**Installation Complete! 🎉**

Your AI Interview Prep Pro application is now ready with MongoDB integration, JWT authentication, and complete data persistence.

For detailed information, refer to `MONGODB_SETUP_GUIDE.md`.