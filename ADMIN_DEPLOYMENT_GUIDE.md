# Admin Dashboard Deployment Guide

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create or update `.env` file:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-interview-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com

# Admin Credentials (for first-time setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=Admin User
```

### Step 3: Create First Admin User
```bash
node scripts/createAdmin.js
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
✅ Admin user created successfully!
📧 Email: admin@yourdomain.com
🔑 Password: SecurePassword123!
👤 Role: admin
⚠️  IMPORTANT: Change the password after first login!
```

### Step 4: Build and Start
```bash
# Build the application
npm run build

# Start the server
npm start
```

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Update ADMIN_PASSWORD to a secure password
- [ ] Configure CORS for your production domain
- [ ] Enable HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Review and update rate limiting settings

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (or 0.0.0.0/0 for all)
- [ ] Connection string tested
- [ ] Indexes created for performance

### Environment
- [ ] All environment variables set
- [ ] CLIENT_URL points to production domain
- [ ] MongoDB URI is production database
- [ ] JWT settings configured

## 🗄️ MongoDB Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (Free tier available)

### 2. Configure Database Access
```
Database Access → Add New Database User
- Username: your-username
- Password: generate-secure-password
- Role: Atlas Admin or Read/Write
```

### 3. Configure Network Access
```
Network Access → Add IP Address
- Allow access from anywhere: 0.0.0.0/0
- Or add specific IPs for better security
```

### 4. Get Connection String
```
Clusters → Connect → Connect your application
- Copy the connection string
- Replace <password> with your database password
- Replace <dbname> with your database name
```

### 5. Create Indexes (Optional but Recommended)
```javascript
// Connect to MongoDB and run:
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ lastLogin: -1 })
db.analytics.createIndex({ userId: 1, timestamp: -1 })
db.analytics.createIndex({ eventType: 1, timestamp: -1 })
db.interviews.createIndex({ userId: 1, createdAt: -1 })
```

## 🔐 Security Configuration

### 1. JWT Secret Generation
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Password Requirements
Enforce strong passwords:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 3. CORS Configuration
Update `src/backend/app.ts`:
```typescript
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com',
    process.env.CLIENT_URL
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### 4. Rate Limiting (Recommended)
Install and configure:
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure Environment Variables**
- Go to Vercel Dashboard
- Project Settings → Environment Variables
- Add all variables from `.env`

### Option 2: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CLIENT_URL=https://your-frontend-url.com
```

4. **Deploy**
```bash
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub Repository**
2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Add Environment Variables**
4. **Deploy**

### Option 4: AWS EC2

1. **Launch EC2 Instance**
2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone Repository**
```bash
git clone your-repo-url
cd your-repo
npm install
```

4. **Configure PM2**
```bash
npm install -g pm2
pm2 start dist/server.esm.mjs --name "ai-interview-platform"
pm2 startup
pm2 save
```

5. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 Socket.IO Production Configuration

### For Multiple Servers (Load Balancing)
Install Redis adapter:
```bash
npm install @socket.io/redis-adapter redis
```

Configure in `src/backend/app.ts`:
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### Sticky Sessions (Required for Socket.IO)
If using load balancer, enable sticky sessions:

**Nginx:**
```nginx
upstream backend {
    ip_hash;
    server backend1:5000;
    server backend2:5000;
}
```

**AWS ALB:**
- Enable stickiness in target group settings
- Duration: 1 hour

## 📊 Monitoring & Logging

### 1. Application Monitoring
```bash
npm install winston
```

Configure logging:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 2. Database Monitoring
- Enable MongoDB Atlas monitoring
- Set up alerts for:
  - High CPU usage
  - Low storage
  - Connection spikes

### 3. Error Tracking
Consider integrating:
- Sentry
- LogRocket
- Datadog

## 🧪 Testing Before Deployment

### 1. Test Admin Creation
```bash
node scripts/createAdmin.js
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get analytics (with token)
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test Socket.IO
Open browser console:
```javascript
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected!'));
socket.on('online-users-count', (count) => console.log('Online:', count));
```

## 🔧 Post-Deployment Tasks

### 1. Change Admin Password
1. Login with default credentials
2. Go to Profile/Settings
3. Change password immediately

### 2. Create Additional Admins
Use the admin dashboard to promote users to admin role

### 3. Monitor Initial Usage
- Check error logs
- Monitor database performance
- Verify Socket.IO connections
- Test all admin features

### 4. Set Up Backups
```bash
# MongoDB Atlas automatic backups
# Or manual backup script:
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

## 🚨 Troubleshooting

### Admin Can't Access Dashboard
```bash
# Check user role in MongoDB
db.users.findOne({ email: "admin@example.com" })

# Update role if needed
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Socket.IO Not Connecting
- Check CORS configuration
- Verify WebSocket support on hosting platform
- Enable sticky sessions if using load balancer
- Check firewall rules

### Charts Not Loading
- Verify data exists in database
- Check browser console for errors
- Ensure recharts is installed
- Verify API responses

### High Memory Usage
- Implement pagination for large datasets
- Add database indexes
- Use aggregation pipelines efficiently
- Consider caching frequently accessed data

## 📈 Performance Optimization

### 1. Database Indexes
Already created in setup, verify with:
```javascript
db.users.getIndexes()
db.analytics.getIndexes()
```

### 2. Caching
Implement Redis caching for:
- Analytics data (refresh every 5 minutes)
- User counts
- Active users list

### 3. CDN
Use CDN for static assets:
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### 4. Compression
Enable gzip compression:
```typescript
import compression from 'compression';
app.use(compression());
```

## 🎯 Success Metrics

After deployment, monitor:
- ✅ Admin dashboard loads in < 2 seconds
- ✅ API response time < 500ms
- ✅ Socket.IO latency < 100ms
- ✅ Database queries < 100ms
- ✅ Zero authentication errors
- ✅ All charts render correctly

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs` or hosting platform logs
2. Verify environment variables
3. Test database connection
4. Review CORS settings
5. Check Socket.IO configuration

## 🎉 Deployment Complete!

Your Admin Analytics Dashboard is now live! 🚀

Access it at:
- **Frontend**: https://your-domain.com
- **Admin Dashboard**: https://your-domain.com/admin
- **API Health**: https://your-domain.com/api/health

---

**Made with ❤️ by Bob**