import mongoose from 'mongoose';

// MongoDB Connection Configuration
const MONGODB_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  family: 4, // Use IPv4, skip trying IPv6
};

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Validates MongoDB URI format and required environment variables
 */
const validateMongoDBConfig = (): string => {
  const mongoURI = process.env.MONGODB_URI;

  // Check if MONGODB_URI exists
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.error('📝 Please add MONGODB_URI to your .env file');
    console.error('📖 See MONGODB_SETUP_GUIDE.md for setup instructions');
    throw new Error('Missing MONGODB_URI environment variable');
  }

  // Check if it's still the placeholder value
  if (mongoURI.includes('username:password') || mongoURI.includes('cluster0.xxxxx')) {
    console.error('❌ MONGODB_URI contains placeholder values');
    console.error('📝 Please replace with your actual MongoDB Atlas credentials:');
    console.error('   1. Go to https://cloud.mongodb.com/');
    console.error('   2. Create a cluster or use existing one');
    console.error('   3. Click "Connect" → "Connect your application"');
    console.error('   4. Copy the connection string');
    console.error('   5. Replace <username>, <password>, and cluster URL in .env');
    console.error('   6. Ensure special characters in password are URL encoded');
    throw new Error('MONGODB_URI contains placeholder values - please update with real credentials');
  }

  // Validate URI format
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MONGODB_URI format');
    console.error('📝 URI must start with mongodb:// or mongodb+srv://');
    throw new Error('Invalid MongoDB URI format');
  }

  // Check for common issues
  if (mongoURI.includes('<') || mongoURI.includes('>')) {
    console.error('❌ MONGODB_URI contains angle brackets - please remove them');
    console.error('📝 Replace <username> and <password> with actual values (without brackets)');
    throw new Error('MONGODB_URI contains placeholder brackets');
  }

  console.log('✅ MongoDB URI validation passed');
  return mongoURI;
};

/**
 * URL encodes special characters in password
 */
export const encodeMongoPassword = (password: string): string => {
  return encodeURIComponent(password);
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Attempts to connect to MongoDB with retry logic
 */
const attemptConnection = async (mongoURI: string, attempt: number = 1): Promise<typeof mongoose> => {
  try {
    console.log(`🔄 Attempting MongoDB connection (Attempt ${attempt}/${MAX_RETRIES})...`);
    
    const conn = await mongoose.connect(mongoURI, MONGODB_OPTIONS);
    
    console.log('✅ MongoDB Connection Successful!');
    console.log(`📊 Connected to: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);
    
    return conn;
  } catch (error: any) {
    console.error(`❌ MongoDB connection attempt ${attempt} failed`);
    
    // Provide specific error guidance
    if (error.message.includes('querySrv ENOTFOUND')) {
      console.error('🔍 DNS Error: Cannot resolve MongoDB cluster hostname');
      console.error('   Possible causes:');
      console.error('   1. Invalid cluster URL in MONGODB_URI');
      console.error('   2. Network/DNS issues');
      console.error('   3. Cluster may not exist or was deleted');
      console.error('   ✅ Solution: Verify cluster URL in MongoDB Atlas');
    } else if (error.message.includes('Authentication failed')) {
      console.error('🔐 Authentication Error: Invalid credentials');
      console.error('   Possible causes:');
      console.error('   1. Incorrect username or password');
      console.error('   2. Database user not created in MongoDB Atlas');
      console.error('   3. Special characters in password not URL encoded');
      console.error('   ✅ Solution: Check credentials and URL encode special characters');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('🚫 Connection Refused: Cannot reach MongoDB server');
      console.error('   Possible causes:');
      console.error('   1. Network access not configured in MongoDB Atlas');
      console.error('   2. IP address not whitelisted');
      console.error('   3. Firewall blocking connection');
      console.error('   ✅ Solution: Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️  Timeout Error: Connection took too long');
      console.error('   Possible causes:');
      console.error('   1. Slow network connection');
      console.error('   2. MongoDB Atlas cluster paused or slow');
      console.error('   3. Network firewall blocking connection');
      console.error('   ✅ Solution: Check network and MongoDB Atlas cluster status');
    } else {
      console.error(`❌ Error: ${error.message}`);
    }

    // Retry logic
    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await sleep(RETRY_DELAY);
      return attemptConnection(mongoURI, attempt + 1);
    }

    // Max retries reached
    console.error(`❌ Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
    console.error('📖 Please check MONGODB_SETUP_GUIDE.md for detailed setup instructions');
    throw error;
  }
};

/**
 * Main database connection function
 */
const connectDB = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing MongoDB connection...');
    
    // Validate configuration
    const mongoURI = validateMongoDBConfig();
    
    // Attempt connection with retry logic
    await attemptConnection(mongoURI);

    // Setup connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('close', () => {
      console.log('🔌 MongoDB connection closed');
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📴 ${signal} received. Closing MongoDB connection...`);
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed gracefully');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during MongoDB shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

  } catch (error: any) {
    console.error('❌ Fatal error during MongoDB initialization');
    console.error('💡 Common solutions:');
    console.error('   1. Verify MONGODB_URI in .env file');
    console.error('   2. Check MongoDB Atlas cluster is running');
    console.error('   3. Verify network access (whitelist 0.0.0.0/0)');
    console.error('   4. Ensure database user exists with correct password');
    console.error('   5. URL encode special characters in password');
    console.error('\n📖 See MONGODB_SETUP_GUIDE.md for detailed instructions\n');
    
    // Exit process - cannot run without database
    process.exit(1);
  }
};

/**
 * Check if MongoDB is connected
 */
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get connection status string
 */
export const getConnectionStatus = (): string => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

export default connectDB;

// Made with Bob
