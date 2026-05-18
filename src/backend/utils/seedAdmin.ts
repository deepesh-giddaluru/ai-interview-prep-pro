import User from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * Seed Admin Account
 * Automatically creates default admin account if it doesn't exist
 * Runs on server startup
 */
export const seedAdminAccount = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('✅ Admin account already exists');
      return;
    }

    // Create admin account
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123', // Will be hashed by pre-save hook
      role: 'admin',
      isEmailVerified: true,
      activeStatus: true,
    });

    console.log('✅ Admin account created successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  Please change the password after first login!');
  } catch (error: any) {
    console.error('❌ Error creating admin account:', error.message);
  }
};

// Made with Bob