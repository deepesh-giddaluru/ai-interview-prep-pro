#!/usr/bin/env node

/**
 * Interactive MongoDB Setup Script
 * 
 * This script helps you configure MongoDB Atlas connection
 * Run: node setup-mongodb.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function encodePassword(password) {
  return encodeURIComponent(password);
}

async function main() {
  console.clear();
  console.log('\n' + '='.repeat(70));
  log('cyan', '🚀 MongoDB Atlas Connection Setup Wizard');
  console.log('='.repeat(70) + '\n');

  log('yellow', '📖 This wizard will help you configure MongoDB Atlas connection');
  log('yellow', '   Follow the prompts to set up your connection string\n');

  // Step 1: Check if .env exists
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('yellow', '⚠️  .env file not found');
    const create = await question('   Create .env file from .env.example? (y/n): ');
    
    if (create.toLowerCase() === 'y') {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        log('green', '✅ Created .env file\n');
      } else {
        log('red', '❌ .env.example not found. Creating new .env file...\n');
        fs.writeFileSync(envPath, '');
      }
    } else {
      log('red', '❌ Cannot proceed without .env file');
      rl.close();
      process.exit(1);
    }
  }

  console.log();
  log('blue', '📋 Step 1: MongoDB Atlas Account Setup');
  console.log('─'.repeat(70));
  console.log('   1. Go to: https://cloud.mongodb.com/');
  console.log('   2. Sign up or sign in');
  console.log('   3. Create a new cluster (M0 FREE tier)');
  console.log('   4. Wait for cluster to be created (3-5 minutes)\n');
  
  await question('   Press Enter when your cluster is ready...');

  console.log();
  log('blue', '📋 Step 2: Create Database User');
  console.log('─'.repeat(70));
  console.log('   1. Go to "Database Access" in MongoDB Atlas');
  console.log('   2. Click "Add New Database User"');
  console.log('   3. Choose "Password" authentication');
  console.log('   4. Set privileges to "Read and write to any database"\n');

  const username = await question('   Enter database username: ');
  
  if (!username) {
    log('red', '❌ Username is required');
    rl.close();
    process.exit(1);
  }

  const password = await question('   Enter database password: ');
  
  if (!password) {
    log('red', '❌ Password is required');
    rl.close();
    process.exit(1);
  }

  // Check for special characters
  const specialChars = /[@:/?#\[\]$&+,;=%]/;
  const hasSpecialChars = specialChars.test(password);
  
  if (hasSpecialChars) {
    log('yellow', '\n   ⚠️  Password contains special characters');
    const encodedPassword = encodePassword(password);
    log('cyan', `   📝 Encoded password: ${encodedPassword}`);
    log('green', '   ✅ Will use encoded password in connection string\n');
  }

  console.log();
  log('blue', '📋 Step 3: Configure Network Access');
  console.log('─'.repeat(70));
  console.log('   1. Go to "Network Access" in MongoDB Atlas');
  console.log('   2. Click "Add IP Address"');
  console.log('   3. Click "Allow Access from Anywhere" (0.0.0.0/0)');
  console.log('   4. Click "Confirm"\n');
  
  await question('   Press Enter when network access is configured...');

  console.log();
  log('blue', '📋 Step 4: Get Cluster URL');
  console.log('─'.repeat(70));
  console.log('   1. Go to "Database" in MongoDB Atlas');
  console.log('   2. Click "Connect" on your cluster');
  console.log('   3. Choose "Connect your application"');
  console.log('   4. Copy the cluster URL (e.g., cluster0.abc123.mongodb.net)\n');

  const clusterUrl = await question('   Enter cluster URL: ');
  
  if (!clusterUrl) {
    log('red', '❌ Cluster URL is required');
    rl.close();
    process.exit(1);
  }

  // Remove mongodb+srv:// if user included it
  const cleanClusterUrl = clusterUrl.replace(/^mongodb\+srv:\/\//, '').replace(/^mongodb:\/\//, '');

  console.log();
  log('blue', '📋 Step 5: Database Name');
  console.log('─'.repeat(70));
  
  const dbName = await question('   Enter database name (default: ai-interview-prep): ') || 'ai-interview-prep';

  // Build connection string
  const encodedPassword = hasSpecialChars ? encodePassword(password) : password;
  const connectionString = `mongodb+srv://${username}:${encodedPassword}@${cleanClusterUrl}/${dbName}?retryWrites=true&w=majority`;

  console.log();
  log('green', '✅ Connection String Generated!');
  console.log('─'.repeat(70));
  
  // Sanitized version for display
  const sanitizedString = connectionString.replace(/:([^@]+)@/, ':****@');
  log('cyan', `   ${sanitizedString}\n`);

  // Update .env file
  const updateEnv = await question('   Update .env file with this connection string? (y/n): ');
  
  if (updateEnv.toLowerCase() === 'y') {
    try {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace MONGODB_URI line
      if (envContent.includes('MONGODB_URI=')) {
        envContent = envContent.replace(
          /MONGODB_URI=.*/,
          `MONGODB_URI=${connectionString}`
        );
      } else {
        envContent += `\nMONGODB_URI=${connectionString}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      log('green', '\n✅ .env file updated successfully!\n');
    } catch (error) {
      log('red', `\n❌ Error updating .env file: ${error.message}\n`);
    }
  } else {
    console.log();
    log('yellow', '📝 Manual Setup:');
    console.log('   1. Open your .env file');
    console.log('   2. Find the line starting with MONGODB_URI=');
    console.log('   3. Replace it with:');
    log('cyan', `      MONGODB_URI=${connectionString}`);
    console.log();
  }

  // Test connection
  console.log();
  const testConnection = await question('   Test MongoDB connection now? (y/n): ');
  
  if (testConnection.toLowerCase() === 'y') {
    console.log();
    log('cyan', '🧪 Testing connection...\n');
    
    // Close readline before running test
    rl.close();
    
    // Run test script
    const { spawn } = require('child_process');
    const testProcess = spawn('node', ['test-mongodb-connection.js'], {
      stdio: 'inherit',
      env: { ...process.env, MONGODB_URI: connectionString }
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log();
        log('green', '🎉 Setup Complete! Your MongoDB connection is ready.');
        console.log();
        log('cyan', '📝 Next Steps:');
        console.log('   1. Start your server: npm run dev');
        console.log('   2. Check for "MongoDB Connection Successful!" message');
        console.log('   3. Begin using your application\n');
      } else {
        console.log();
        log('yellow', '⚠️  Connection test failed. Please check the error messages above.');
        log('cyan', '📖 See MONGODB_CONNECTION_COMPLETE_GUIDE.md for troubleshooting\n');
      }
      process.exit(code);
    });
  } else {
    rl.close();
    console.log();
    log('green', '✅ Setup Complete!');
    console.log();
    log('cyan', '📝 Next Steps:');
    console.log('   1. Restart your server: npm run dev');
    console.log('   2. Check for "MongoDB Connection Successful!" message');
    console.log('   3. Or run: node test-mongodb-connection.js');
    console.log();
    console.log('='.repeat(70) + '\n');
    process.exit(0);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

// Run the wizard
main().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});

// Made with Bob
