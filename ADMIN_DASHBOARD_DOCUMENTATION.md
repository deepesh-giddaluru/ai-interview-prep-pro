# Admin Analytics Dashboard - Complete Documentation

## 🎯 Overview

A comprehensive Admin Analytics Dashboard for your AI Interview Platform with real-time monitoring, user management, and detailed analytics.

## ✨ Features Implemented

### 1. **Protected Admin Dashboard** ✅
- Route: `/admin`
- Role-based access control
- JWT authentication middleware
- Automatic redirect for non-admin users

### 2. **Admin Authentication & Authorization** ✅
- Role field in User model (`user` | `admin`)
- Protected routes using JWT middleware
- Authorization middleware for admin-only access
- Secure API endpoints

### 3. **User Activity Tracking** ✅
Permanently stored in MongoDB:
- ✅ User registrations
- ✅ Login timestamps
- ✅ Last login time
- ✅ Login count
- ✅ Session activity
- ✅ Completed interviews
- ✅ Average scores
- ✅ Generated roadmaps
- ✅ Resume analysis reports
- ✅ Daily streaks

### 4. **Enhanced User Schema** ✅
New fields added:
```typescript
{
  role: 'user' | 'admin',
  lastLogin: Date,
  loginCount: number,
  totalInterviews: number,
  averageScore: number,
  totalRoadmaps: number,
  totalResumeAnalyses: number,
  streak: number,
  activeStatus: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. **Analytics Dashboard Cards** ✅
Real-time metrics:
- 📊 Total users
- ✅ Active users (7 days)
- 🆕 New users today
- 💬 Total interviews completed
- 📈 Average interview score
- 🗺️ Total AI roadmaps generated
- 📄 Resume analyses completed
- 🔴 Currently online users

### 6. **Analytics Charts** ✅
Using Recharts library:
- 📈 **User Growth Chart** - Line chart showing 30-day user registration trend
- 💬 **Interview Activity** - Bar chart of daily interview completions
- 👥 **Daily Active Users** - Line chart of login activity
- 🎯 **Most Used Skills** - Pie chart of popular interview topics

### 7. **User Management Table** ✅
Features:
- ✅ Searchable by name/email
- ✅ Filter by role (user/admin)
- ✅ Pagination (10 users per page)
- ✅ Sort by various fields
- ✅ View user details
- ✅ Update user roles
- ✅ Delete users (non-admin only)

Columns displayed:
- Username & Email
- Role (editable dropdown)
- Joined date
- Last login
- Login count
- Interviews completed
- Average score
- Current streak

### 8. **Backend REST APIs** ✅

#### Admin Routes (`/api/admin/*`)
All routes require admin authentication.

```typescript
GET  /api/admin/users              // Get all users with pagination
GET  /api/admin/users/:id          // Get user details
DELETE /api/admin/users/:id        // Delete user
PATCH /api/admin/users/:id/role    // Update user role
GET  /api/admin/analytics          // Get dashboard analytics
GET  /api/admin/active-users       // Get currently active users
GET  /api/admin/interview-stats    // Get interview statistics
```

### 9. **Security Features** ✅
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ Protected middleware
- ✅ Request validation
- ✅ Secure API responses
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ HTTP-only cookies

### 10. **Real-Time Features** ✅
Using Socket.IO:
- 🔴 Live online user counter
- 📊 Real-time interview activity
- 🔄 Auto-updating dashboard
- 👥 Online users list

### 11. **Professional SaaS UI** ✅
Design features:
- 🎨 Glassmorphism design
- 🌙 Dark theme optimized
- ✨ Animated transitions
- 📱 Fully responsive
- 🎯 Modern card layouts
- 📊 Interactive charts
- 🔍 Search & filters
- 📄 Pagination controls

## 📁 File Structure

```
src/
├── backend/
│   ├── models/
│   │   ├── User.ts              # Enhanced with analytics fields
│   │   └── Analytics.ts         # New: Activity tracking model
│   ├── controllers/
│   │   ├── authController.ts    # Updated with analytics tracking
│   │   └── adminController.ts   # New: Admin operations
│   ├── routes/
│   │   └── admin.ts             # New: Admin routes
│   ├── middleware/
│   │   └── auth.ts              # Already has authorize middleware
│   └── app.ts                   # Updated with Socket.IO
├── components/
│   └── AdminDashboard.tsx       # New: Complete admin UI
├── lib/
│   └── adminApi.ts              # New: Admin API integration
└── App.tsx                      # Updated with admin route
```

## 🚀 Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Admin (Optional - for first admin user)
ADMIN_EMAIL=admin@example.com
```

### 2. Install Dependencies

Already installed:
```bash
npm install recharts socket.io socket.io-client
```

### 3. Create First Admin User

**Option 1: Via MongoDB Compass/Shell**
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Option 2: Via Code (One-time script)**
```typescript
// Create a temporary script: scripts/createAdmin.ts
import User from '../src/backend/models/User';
import connectDB from '../src/backend/config/database';

async function createAdmin() {
  await connectDB();
  
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });
  
  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin();
```

### 4. Start the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔐 Access Control

### Admin Access
1. Login with admin credentials
2. Navigate to `/admin` route
3. Admin Panel link appears in sidebar

### User Roles
- **user**: Regular platform access
- **admin**: Full platform + admin dashboard access

## 📊 API Usage Examples

### Get Analytics Data
```typescript
import { adminApiService } from './lib/adminApi';

// Get dashboard analytics
const analytics = await adminApiService.getAnalytics();

// Get users with pagination
const users = await adminApiService.getUsers({
  page: 1,
  limit: 10,
  search: 'john',
  role: 'user'
});

// Get active users
const activeUsers = await adminApiService.getActiveUsers();

// Get interview stats
const stats = await adminApiService.getInterviewStats('7d');
```

### Update User Role
```typescript
await adminApiService.updateUserRole(userId, 'admin');
```

### Delete User
```typescript
await adminApiService.deleteUser(userId);
```

## 🎨 UI Components

### Analytics Cards
```tsx
<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
  <div className="flex items-center justify-between mb-4">
    <Users className="w-8 h-8 text-purple-400" />
    <span className="text-2xl font-bold text-white">{totalUsers}</span>
  </div>
  <h3 className="text-gray-300 text-sm">Total Users</h3>
</div>
```

### Charts
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={userGrowthData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
    <XAxis dataKey="date" stroke="#ffffff60" />
    <YAxis stroke="#ffffff60" />
    <Tooltip />
    <Line type="monotone" dataKey="count" stroke="#8b5cf6" />
  </LineChart>
</ResponsiveContainer>
```

## 🔄 Real-Time Updates

### Socket.IO Events

**Client Side:**
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Emit user online
socket.emit('user-online', { email, role });

// Listen for online count
socket.on('online-users-count', (count) => {
  setOnlineCount(count);
});

// Listen for interview activity
socket.on('live-interview-activity', (data) => {
  console.log('New interview:', data);
});
```

**Server Side:**
```typescript
io.on('connection', (socket) => {
  socket.on('user-online', (userData) => {
    onlineUsers.set(socket.id, userData);
    io.emit('online-users-count', onlineUsers.size);
  });
});
```

## 📈 Analytics Tracking

### Automatic Tracking
The system automatically tracks:
- User registration
- Login/logout events
- Interview completions
- Roadmap generations
- Resume analyses

### Manual Tracking
```typescript
import Analytics from './models/Analytics';

await Analytics.create({
  userId: user._id,
  eventType: 'interview',
  eventData: { score: 85, duration: 1800 },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

## 🛡️ Security Best Practices

1. **JWT Tokens**: Stored in HTTP-only cookies
2. **Password Hashing**: bcrypt with salt rounds
3. **Role Validation**: Middleware checks on every request
4. **Input Validation**: Express-validator on all inputs
5. **CORS**: Configured for specific origins
6. **Rate Limiting**: Recommended for production

## 🎯 Key Features Summary

✅ **Complete Admin Dashboard**
✅ **Real-time Analytics**
✅ **User Management**
✅ **Role-based Access**
✅ **Interactive Charts**
✅ **Socket.IO Integration**
✅ **Secure APIs**
✅ **Professional UI**
✅ **MongoDB Integration**
✅ **Activity Tracking**

## 🚨 Important Notes

1. **First Admin**: Create manually via MongoDB or script
2. **Security**: Change default JWT secret in production
3. **CORS**: Update CLIENT_URL for production domain
4. **MongoDB**: Ensure indexes are created for performance
5. **Socket.IO**: Configure for production (Redis adapter recommended)

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full layout with sidebar
- **Tablet**: Optimized card layouts
- **Mobile**: Stacked components, touch-friendly

## 🔧 Customization

### Add New Analytics Card
```tsx
<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
  <div className="flex items-center justify-between mb-4">
    <YourIcon className="w-8 h-8 text-color-400" />
    <span className="text-2xl font-bold text-white">{yourMetric}</span>
  </div>
  <h3 className="text-gray-300 text-sm">Your Metric Name</h3>
</div>
```

### Add New Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={yourData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
    <XAxis dataKey="label" stroke="#ffffff60" />
    <YAxis stroke="#ffffff60" />
    <Tooltip />
    <Bar dataKey="value" fill="#ec4899" />
  </BarChart>
</ResponsiveContainer>
```

## 🎓 Usage Tips

1. **Monitor Daily**: Check dashboard daily for user activity
2. **User Management**: Regularly review and manage users
3. **Analytics**: Use charts to identify trends
4. **Performance**: Monitor average scores and completion rates
5. **Growth**: Track user growth and engagement metrics

## 🐛 Troubleshooting

### Admin Access Denied
- Verify user role is set to 'admin' in database
- Check JWT token is valid
- Ensure middleware is properly configured

### Charts Not Displaying
- Verify data format matches chart requirements
- Check console for errors
- Ensure recharts is installed

### Socket.IO Not Connecting
- Verify server URL is correct
- Check CORS configuration
- Ensure Socket.IO server is running

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [JWT Best Practices](https://jwt.io/introduction)

## 🎉 Success!

Your Admin Analytics Dashboard is now fully functional with:
- Real-time monitoring
- Comprehensive analytics
- User management
- Professional UI
- Secure access control

---

**Made with ❤️ by Bob**

For support or questions, refer to the main README.md or create an issue.