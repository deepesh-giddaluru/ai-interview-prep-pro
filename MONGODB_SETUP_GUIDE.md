# 🗄️ MongoDB Atlas Setup Guide

Complete guide to setting up MongoDB Atlas for AI Interview Prep Pro.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create MongoDB Atlas Account](#step-1-create-mongodb-atlas-account)
3. [Create a Cluster](#step-2-create-a-cluster)
4. [Create Database User](#step-3-create-database-user)
5. [Configure Network Access](#step-4-configure-network-access)
6. [Get Connection String](#step-5-get-connection-string)
7. [Configure Environment Variables](#step-6-configure-environment-variables)
8. [URL Encode Password](#step-7-url-encode-password)
9. [Verify Connection](#step-8-verify-connection)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Email address for MongoDB Atlas account
- Internet connection
- No credit card required (Free tier available)

---

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Try Free"** or **"Sign Up"**
3. Choose sign-up method:
   - Google account (recommended)
   - Email and password
4. Complete registration
5. Verify your email address

### 1.2 Initial Setup

1. Select your goal: **"Learn MongoDB"** or **"Build a new application"**
2. Choose programming language: **JavaScript**
3. Click **"Finish"**

---

## Step 2: Create a Cluster

### 2.1 Choose Deployment Type

1. Click **"Build a Database"** or **"Create"**
2. Select **"M0 FREE"** tier
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ No credit card required
   - ✅ Perfect for development

### 2.2 Configure Cluster

1. **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure)
2. **Region**: Select closest to your location for better performance
   - Recommended: Same region as your users
3. **Cluster Name**: Leave default or customize (e.g., `ai-interview-cluster`)
4. Click **"Create Cluster"**

### 2.3 Wait for Cluster Creation

- Takes 3-5 minutes
- You'll see a progress indicator
- Don't close the browser tab

---

## Step 3: Create Database User

### 3.1 Navigate to Database Access

1. In left sidebar, click **"Database Access"** (under Security)
2. Click **"Add New Database User"**

### 3.2 Configure User

1. **Authentication Method**: Select **"Password"**
2. **Username**: Enter a username (e.g., `aiinterviewuser`)
   - ⚠️ Remember this - you'll need it for connection string
3. **Password**: 
   - Click **"Autogenerate Secure Password"** (recommended)
   - Or create your own strong password
   - ⚠️ **SAVE THIS PASSWORD** - you won't see it again!
   - Copy it to a secure location

### 3.3 Set Privileges

1. **Database User Privileges**: Select **"Read and write to any database"**
2. **Temporary User**: Leave unchecked
3. Click **"Add User"**

### 3.4 Important Notes

- ✅ Username: No special characters recommended
- ✅ Password: Can contain special characters (will be URL encoded later)
- ⚠️ Save credentials securely - you'll need them for `.env` file

---

## Step 4: Configure Network Access

### 4.1 Navigate to Network Access

1. In left sidebar, click **"Network Access"** (under Security)
2. Click **"Add IP Address"**

### 4.2 Allow Access

**For Development:**
1. Click **"Allow Access from Anywhere"**
2. This adds `0.0.0.0/0` (all IP addresses)
3. Click **"Confirm"**

**For Production:**
1. Click **"Add Current IP Address"** for your server
2. Or manually enter specific IP addresses
3. Click **"Confirm"**

### 4.3 Verify

- You should see `0.0.0.0/0` in the IP Access List
- Status should be **"Active"**

---

## Step 5: Get Connection String

### 5.1 Navigate to Database

1. In left sidebar, click **"Database"** (under Deployment)
2. Find your cluster
3. Click **"Connect"** button

### 5.2 Choose Connection Method

1. Select **"Connect your application"**
2. **Driver**: Select **"Node.js"**
3. **Version**: Select **"5.5 or later"**

### 5.3 Copy Connection String

You'll see a connection string like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Important parts:**
- `<username>`: Your database username
- `<password>`: Your database password
- `cluster0.xxxxx.mongodb.net`: Your cluster URL
- `?retryWrites=true&w=majority`: Connection options

---

## Step 6: Configure Environment Variables

### 6.1 Prepare Connection String

1. Copy the connection string from Step 5
2. Replace `<username>` with your actual username
3. Replace `<password>` with your actual password
4. Add database name after cluster URL

**Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/DATABASE_NAME?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://aiinterviewuser:MySecurePass123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

### 6.2 Update .env File

1. Open `.env` file in your project root
2. Find the `MONGODB_URI` line
3. Replace the entire line with your connection string

```env
MONGODB_URI=mongodb+srv://aiinterviewuser:MySecurePass123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

---

## Step 7: URL Encode Password

### 7.1 Why URL Encode?

If your password contains special characters, they must be URL encoded to work in the connection string.

### 7.2 Special Characters to Encode

| Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|
| `@`       | `%40`   | `:`       | `%3A`   |
| `/`       | `%2F`   | `?`       | `%3F`   |
| `#`       | `%23`   | `[`       | `%5B`   |
| `]`       | `%5D`   | `$`       | `%24`   |
| `&`       | `%26`   | `+`       | `%2B`   |
| `,`       | `%2C`   | `;`       | `%3B`   |
| `=`       | `%3D`   | `%`       | `%25`   |
| ` ` (space) | `%20` | `!`       | `%21`   |

### 7.3 Example

**Original Password:**
```
MyP@ss:w0rd#123
```

**URL Encoded Password:**
```
MyP%40ss%3Aw0rd%23123
```

**Full Connection String:**
```
mongodb+srv://aiinterviewuser:MyP%40ss%3Aw0rd%23123@cluster0.abc123.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
```

### 7.4 Online Tools

You can use online URL encoders:
- [URL Encoder/Decoder](https://www.urlencoder.org/)
- Or use JavaScript: `encodeURIComponent('your-password')`

---

## Step 8: Verify Connection

### 8.1 Start Your Server

```bash
npm run dev
```

### 8.2 Check Console Output

**Success:**
```
🔍 Validating environment variables...
✅ All required environment variables are set

🚀 Initializing MongoDB connection...
✅ MongoDB URI validation passed
🔄 Attempting MongoDB connection (Attempt 1/5)...
✅ MongoDB Connection Successful!
📊 Connected to: cluster0.abc123.mongodb.net
📁 Database: ai-interview-prep
🔌 Connection State: Connected

🚀 Server running on http://localhost:3000
```

**Failure:**
- See [Troubleshooting](#troubleshooting) section below

---

## Troubleshooting

### Error: "querySrv ENOTFOUND"

**Cause:** Cannot resolve MongoDB cluster hostname

**Solutions:**
1. ✅ Verify cluster URL is correct in `.env`
2. ✅ Check cluster is running (not paused) in MongoDB Atlas
3. ✅ Verify internet connection
4. ✅ Check DNS settings
5. ✅ Try different network (mobile hotspot)

**Example Fix:**
```env
# ❌ Wrong
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/db

# ✅ Correct (replace xxxxx with actual cluster ID)
MONGODB_URI=mongodb+srv://user:pass@cluster0.abc123.mongodb.net/db
```

---

### Error: "Authentication failed"

**Cause:** Invalid username or password

**Solutions:**
1. ✅ Verify username is correct
2. ✅ Verify password is correct
3. ✅ Check password special characters are URL encoded
4. ✅ Ensure database user exists in MongoDB Atlas
5. ✅ Check user has correct privileges

**Example Fix:**
```env
# ❌ Wrong (special characters not encoded)
MONGODB_URI=mongodb+srv://user:P@ss:w0rd@cluster0.abc123.mongodb.net/db

# ✅ Correct (special characters encoded)
MONGODB_URI=mongodb+srv://user:P%40ss%3Aw0rd@cluster0.abc123.mongodb.net/db
```

---

### Error: "ECONNREFUSED" or "Connection timeout"

**Cause:** Network access not configured or blocked

**Solutions:**
1. ✅ Add `0.0.0.0/0` to Network Access in MongoDB Atlas
2. ✅ Check firewall settings
3. ✅ Verify cluster is not paused
4. ✅ Try different network
5. ✅ Check VPN/proxy settings

**Steps:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Confirm and wait 1-2 minutes

---

### Error: "Missing MONGODB_URI environment variable"

**Cause:** `.env` file not configured or not loaded

**Solutions:**
1. ✅ Ensure `.env` file exists in project root
2. ✅ Verify `MONGODB_URI` is set in `.env`
3. ✅ Check for typos in variable name
4. ✅ Restart server after updating `.env`

**Example Fix:**
```bash
# Create .env from example
cp .env.example .env

# Edit .env and add your MongoDB URI
# Then restart server
npm run dev
```

---

### Error: "MONGODB_URI contains placeholder values"

**Cause:** Using example/placeholder values instead of real credentials

**Solutions:**
1. ✅ Replace `username` with your actual username
2. ✅ Replace `password` with your actual password
3. ✅ Replace `cluster0.xxxxx` with your actual cluster URL
4. ✅ Remove angle brackets `<` and `>`

**Example Fix:**
```env
# ❌ Wrong (placeholder values)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/db

# ✅ Correct (real values)
MONGODB_URI=mongodb+srv://myuser:MyPass123@cluster0.abc123.mongodb.net/ai-interview-prep
```

---

### Cluster Paused

**Cause:** Free tier clusters pause after inactivity

**Solutions:**
1. Go to MongoDB Atlas
2. Find your cluster
3. Click "Resume" if paused
4. Wait 1-2 minutes for cluster to start
5. Try connecting again

---

### Connection Slow or Timing Out

**Cause:** Network latency or cluster location

**Solutions:**
1. ✅ Choose cluster region closer to your location
2. ✅ Check internet connection speed
3. ✅ Increase timeout in connection options
4. ✅ Try different network

---

## Best Practices

### Security

1. ✅ Never commit `.env` file to version control
2. ✅ Use strong passwords for database users
3. ✅ Restrict IP access in production
4. ✅ Rotate credentials regularly
5. ✅ Use different credentials for dev/prod

### Performance

1. ✅ Choose cluster region close to users
2. ✅ Use connection pooling (already configured)
3. ✅ Monitor cluster metrics in MongoDB Atlas
4. ✅ Upgrade to paid tier for production

### Monitoring

1. ✅ Check MongoDB Atlas dashboard regularly
2. ✅ Set up alerts for cluster issues
3. ✅ Monitor connection logs
4. ✅ Track database size and usage

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

---

## Quick Reference

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/DATABASE_NAME?retryWrites=true&w=majority
```

### Required Steps Checklist
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user with password
- [ ] Configure network access (0.0.0.0/0)
- [ ] Get connection string
- [ ] URL encode password if needed
- [ ] Update MONGODB_URI in .env
- [ ] Restart server
- [ ] Verify connection successful

---

## Support

If you're still having issues:

1. Check server console for detailed error messages
2. Review this guide step-by-step
3. Verify all credentials are correct
4. Check MongoDB Atlas cluster status
5. Try creating a new cluster and user

---

**Last Updated:** 2026-05-17

**Need Help?** Check the troubleshooting section or create an issue on GitHub.