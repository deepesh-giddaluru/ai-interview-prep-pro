# 🔧 MongoDB Atlas Connection - Complete Setup Guide

## 📋 Table of Contents
1. [Quick Fix for "querySrv ENOTFOUND" Error](#quick-fix)
2. [Step-by-Step MongoDB Atlas Setup](#step-by-step-setup)
3. [Connection String Configuration](#connection-string-configuration)
4. [Common Errors and Solutions](#common-errors-and-solutions)
5. [Testing Your Connection](#testing-your-connection)

---

## 🚨 Quick Fix for "querySrv ENOTFOUND" Error

This error means your MongoDB connection string is invalid or contains placeholder values.

### Immediate Steps:

1. **Check your `.env` file** - Open it and look at `MONGODB_URI`
2. **If it looks like this, it's WRONG:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...
   ```
3. **You need to replace it with YOUR actual MongoDB Atlas credentials**

---

## 📝 Step-by-Step MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Try Free"** or **"Sign In"**
3. Create account with:
   - Email and password, OR
   - Sign in with Google
4. Verify your email address

### Step 2: Create a New Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (no credit card required)
3. Select:
   - **Cloud Provider**: AWS, Google Cloud, or Azure (any works)
   - **Region**: Choose closest to your location
4. **Cluster Name**: Leave default or customize (e.g., `Cluster0`)
5. Click **"Create Cluster"**
6. ⏳ Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter:
   - **Username**: `aiinterviewuser` (or your choice)
   - **Password**: Click **"Autogenerate Secure Password"** 
   - ⚠️ **IMPORTANT**: Copy and save this password immediately!
5. Set **Database User Privileges** to:
   - **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Configure Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**
5. ⏳ Wait 1-2 minutes for changes to apply

### Step 5: Get Your Connection String

1. In left sidebar, click **"Database"**
2. Find your cluster and click **"Connect"**
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Configure Your Connection String

1. Take the connection string you copied
2. Replace `<username>` with your database username (e.g., `aiinterviewuser`)
3. Replace `<password>` with your database password
4. Add database name after `.net/` (e.g., `ai-interview-prep`)

**Example:**
```
Original:
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

After replacement:
mongodb+srv://aiinterviewuser:MySecurePass123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

---

## 🔐 Connection String Configuration

### Basic Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/DATABASE_NAME?retryWrites=true&w=majority
```

### Components Explained

| Component | Description | Example |
|-----------|-------------|---------|
| `mongodb+srv://` | Protocol (always the same) | `mongodb+srv://` |
| `USERNAME` | Database user you created | `aiinterviewuser` |
| `PASSWORD` | User's password (URL encoded) | `MyPass123` or `MyP%40ss` |
| `CLUSTER_URL` | Your cluster hostname | `cluster0.abc123.mongodb.net` |
| `DATABASE_NAME` | Your database name | `ai-interview-prep` |
| `?retryWrites=true&w=majority` | Connection options | (keep as is) |

### 🚨 Special Characters in Password

If your password contains special characters, you **MUST** URL encode them:

| Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|
| `@` | `%40` | `#` | `%23` |
| `:` | `%3A` | `$` | `%24` |
| `/` | `%2F` | `%` | `%25` |
| `?` | `%3F` | `&` | `%26` |
| `=` | `%3D` | `+` | `%2B` |
| `[` | `%5B` | `]` | `%5D` |

**Example with special characters:**

```
Original password: MyP@ss:w0rd#123
Encoded password:  MyP%40ss%3Aw0rd%23123

Full URI:
mongodb+srv://user:MyP%40ss%3Aw0rd%23123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

### 🛠️ URL Encoding Tool

Use this Node.js command to encode your password:

```bash
node -e "console.log(encodeURIComponent('YourPasswordHere'))"
```

---

## 🔧 Update Your .env File

1. Open your `.env` file in the project root
2. Find the line starting with `MONGODB_URI=`
3. Replace the entire line with your connection string:

```env
MONGODB_URI=mongodb+srv://aiinterviewuser:MySecurePass123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

4. Save the file
5. Restart your server

---

## ❌ Common Errors and Solutions

### Error: `querySrv ENOTFOUND`

**Cause**: Invalid cluster URL or DNS resolution failure

**Solutions**:
1. ✅ Verify cluster URL is correct (check MongoDB Atlas)
2. ✅ Ensure cluster is running (not paused)
3. ✅ Check your internet connection
4. ✅ Remove `<` and `>` brackets from connection string
5. ✅ Verify you're using `mongodb+srv://` (not `mongodb://`)

### Error: `Authentication failed`

**Cause**: Invalid username or password

**Solutions**:
1. ✅ Verify username matches database user in MongoDB Atlas
2. ✅ Check password is correct
3. ✅ URL encode special characters in password
4. ✅ Ensure database user exists (check "Database Access")
5. ✅ Verify user has "Read and write" privileges

### Error: `ECONNREFUSED` or `connection timeout`

**Cause**: Network access not configured

**Solutions**:
1. ✅ Add `0.0.0.0/0` to Network Access in MongoDB Atlas
2. ✅ Wait 1-2 minutes after adding IP address
3. ✅ Check firewall settings
4. ✅ Verify cluster is not paused

### Error: `MongoServerError: bad auth`

**Cause**: Incorrect credentials or user doesn't exist

**Solutions**:
1. ✅ Recreate database user in MongoDB Atlas
2. ✅ Use autogenerated password
3. ✅ Copy password immediately and save it
4. ✅ Update .env with new credentials

---

## ✅ Testing Your Connection

### Method 1: Start the Server

```bash
npm run dev
```

**Look for these messages:**
```
✅ MongoDB URI validation passed
🔄 Attempting MongoDB connection (Attempt 1/5)...
✅ MongoDB Connection Successful!
📊 Connected to: cluster0.abc123.mongodb.net
📁 Database: ai-interview-prep
🔌 Connection State: Connected
```

### Method 2: Test Script

Create `test-mongo.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');
    console.log('Database:', mongoose.connection.name);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node test-mongo.js
```

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Use strong, unique password for database user
- [ ] Restrict Network Access to specific IP addresses (not 0.0.0.0/0)
- [ ] Enable MongoDB Atlas backup
- [ ] Set up monitoring and alerts
- [ ] Use environment-specific database names
- [ ] Rotate credentials regularly
- [ ] Enable audit logs
- [ ] Set up connection pooling limits
- [ ] Configure proper indexes for performance

---

## 📞 Need More Help?

### MongoDB Atlas Resources
- [Official Documentation](https://docs.atlas.mongodb.com/)
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)
- [Security Best Practices](https://docs.atlas.mongodb.com/security/)

### Project Resources
- Check `src/backend/config/database.ts` for connection code
- Review server logs for detailed error messages
- See `.env.example` for configuration template

---

## 🎉 Success Indicators

You'll know everything is working when you see:

1. ✅ Server starts without errors
2. ✅ "MongoDB Connection Successful!" in console
3. ✅ Database name displayed in logs
4. ✅ No connection errors in terminal
5. ✅ Application can read/write to database

---

**Made with ❤️ by Bob**