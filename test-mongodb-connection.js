/**
 * MongoDB Connection Test Script
 * 
 * This script tests your MongoDB Atlas connection
 * Run: node test-mongodb-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testMongoDBConnection() {
  console.log('\n' + '='.repeat(60));
  log('cyan', '🧪 MongoDB Connection Test');
  console.log('='.repeat(60) + '\n');

  // Step 1: Check if MONGODB_URI exists
  log('blue', '📋 Step 1: Checking environment variables...');
  
  if (!process.env.MONGODB_URI) {
    log('red', '❌ MONGODB_URI not found in environment variables');
    log('yellow', '💡 Solution: Add MONGODB_URI to your .env file');
    log('yellow', '📖 See: MONGODB_CONNECTION_COMPLETE_GUIDE.md');
    process.exit(1);
  }
  
  log('green', '✅ MONGODB_URI found');
  console.log();

  // Step 2: Validate URI format
  log('blue', '📋 Step 2: Validating connection string format...');
  
  const uri = process.env.MONGODB_URI;
  
  // Check for placeholder values
  if (uri.includes('username:password') || uri.includes('cluster0.xxxxx')) {
    log('red', '❌ Connection string contains placeholder values');
    log('yellow', '💡 Current URI: ' + uri.substring(0, 50) + '...');
    log('yellow', '💡 Solution: Replace with your actual MongoDB Atlas credentials');
    log('yellow', '📖 See: MONGODB_CONNECTION_COMPLETE_GUIDE.md');
    process.exit(1);
  }

  // Check URI format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    log('red', '❌ Invalid URI format');
    log('yellow', '💡 URI must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }

  // Check for angle brackets
  if (uri.includes('<') || uri.includes('>')) {
    log('red', '❌ URI contains angle brackets');
    log('yellow', '💡 Remove < and > from username and password');
    process.exit(1);
  }

  log('green', '✅ Connection string format is valid');
  
  // Display sanitized URI (hide password)
  const sanitizedUri = uri.replace(/:([^@]+)@/, ':****@');
  log('cyan', '🔗 Connection URI: ' + sanitizedUri);
  console.log();

  // Step 3: Attempt connection
  log('blue', '📋 Step 3: Attempting to connect to MongoDB...');
  log('yellow', '⏳ This may take a few seconds...');
  console.log();

  try {
    const startTime = Date.now();
    
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log('green', '✅ MongoDB Connection Successful!');
    console.log();
    log('cyan', '📊 Connection Details:');
    console.log(`   • Host: ${mongoose.connection.host}`);
    console.log(`   • Database: ${mongoose.connection.name}`);
    console.log(`   • Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);
    console.log(`   • Connection Time: ${duration}s`);
    console.log();

    // Test write operation
    log('blue', '📋 Step 4: Testing database operations...');
    
    const TestSchema = new mongoose.Schema({
      test: String,
      timestamp: Date,
    });
    
    const TestModel = mongoose.model('ConnectionTest', TestSchema);
    
    // Try to write
    const testDoc = await TestModel.create({
      test: 'Connection test successful',
      timestamp: new Date(),
    });
    
    log('green', '✅ Write operation successful');
    
    // Try to read
    const foundDoc = await TestModel.findById(testDoc._id);
    log('green', '✅ Read operation successful');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    log('green', '✅ Delete operation successful');
    
    console.log();
    log('green', '🎉 All tests passed! Your MongoDB connection is working perfectly.');
    console.log();

    // Close connection
    await mongoose.connection.close();
    log('cyan', '🔌 Connection closed gracefully');
    
    console.log('\n' + '='.repeat(60));
    log('green', '✅ TEST COMPLETE - MongoDB is ready to use!');
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);

  } catch (error) {
    console.log();
    log('red', '❌ Connection Failed!');
    console.log();
    log('red', '📛 Error: ' + error.message);
    console.log();

    // Provide specific guidance based on error
    log('yellow', '💡 Troubleshooting:');
    console.log();

    if (error.message.includes('querySrv ENOTFOUND')) {
      console.log('   🔍 DNS Error - Cannot resolve cluster hostname');
      console.log('   Possible causes:');
      console.log('   1. Invalid cluster URL in connection string');
      console.log('   2. Cluster doesn\'t exist or was deleted');
      console.log('   3. Network/DNS issues');
      console.log();
      console.log('   ✅ Solutions:');
      console.log('   • Go to MongoDB Atlas and verify cluster URL');
      console.log('   • Check if cluster is running (not paused)');
      console.log('   • Verify internet connection');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.log('   🔐 Authentication Error - Invalid credentials');
      console.log('   Possible causes:');
      console.log('   1. Incorrect username or password');
      console.log('   2. Database user doesn\'t exist');
      console.log('   3. Special characters not URL encoded');
      console.log();
      console.log('   ✅ Solutions:');
      console.log('   • Verify username and password in MongoDB Atlas');
      console.log('   • Check "Database Access" section');
      console.log('   • URL encode special characters in password');
      console.log('   • Use: node -e "console.log(encodeURIComponent(\'YourPassword\'))"');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.log('   🚫 Connection Refused/Timeout');
      console.log('   Possible causes:');
      console.log('   1. IP address not whitelisted');
      console.log('   2. Network firewall blocking connection');
      console.log('   3. Cluster paused or slow');
      console.log();
      console.log('   ✅ Solutions:');
      console.log('   • Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
      console.log('   • Wait 1-2 minutes after adding IP');
      console.log('   • Check firewall settings');
      console.log('   • Verify cluster is running');
    } else {
      console.log('   • Check your connection string format');
      console.log('   • Verify all credentials are correct');
      console.log('   • Ensure cluster is running in MongoDB Atlas');
      console.log('   • Check Network Access settings (0.0.0.0/0)');
    }

    console.log();
    log('cyan', '📖 For detailed setup instructions, see:');
    console.log('   • MONGODB_CONNECTION_COMPLETE_GUIDE.md');
    console.log('   • MONGODB_SETUP_GUIDE.md');
    console.log();
    console.log('='.repeat(60) + '\n');

    process.exit(1);
  }
}

// Run the test
testMongoDBConnection();

// Made with Bob
