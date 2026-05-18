import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  loginCount: number;
  streak: number;
  totalInterviews: number;
  averageScore: number;
  totalRoadmaps: number;
  totalResumeAnalyses: number;
  activeStatus: boolean;
  // Profile completion fields
  profileImage?: string;
  college?: string;
  branch?: string;
  year?: string;
  bio?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  profileCompletion: number;
  isProfileComplete: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastLogin(): Promise<IUser>;
  calculateProfileCompletion(): number;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    totalInterviews: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    totalRoadmaps: {
      type: Number,
      default: 0,
    },
    totalResumeAnalyses: {
      type: Number,
      default: 0,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    // Profile completion fields
    profileImage: {
      type: String,
      default: null,
    },
    college: {
      type: String,
      trim: true,
      default: null,
    },
    branch: {
      type: String,
      trim: true,
      default: null,
    },
    year: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: null,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update lastLogin on each login
UserSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  return this.save();
};

// Calculate profile completion percentage
UserSchema.methods.calculateProfileCompletion = function (): number {
  let completion = 0;
  
  // Name (10%) - required field, always present
  if (this.name) completion += 10;
  
  // College (10%)
  if (this.college) completion += 10;
  
  // Branch (10%)
  if (this.branch) completion += 10;
  
  // Year (5%)
  if (this.year) completion += 5;
  
  // Bio (20%)
  if (this.bio && this.bio.length > 20) completion += 20;
  
  // Skills (20%)
  if (this.skills && this.skills.length >= 3) completion += 20;
  
  // Resume (20%)
  if (this.resumeUrl) completion += 20;
  
  // LinkedIn URL (5%)
  if (this.linkedinUrl) completion += 5;
  
  // GitHub URL (5%)
  if (this.githubUrl) completion += 5;
  
  // Profile Image (5%)
  if (this.profileImage) completion += 5;
  
  return Math.min(completion, 100);
};

// Auto-calculate profile completion before saving
UserSchema.pre('save', function (next) {
  if (this.isModified('college') || this.isModified('branch') ||
      this.isModified('year') || this.isModified('bio') ||
      this.isModified('skills') || this.isModified('linkedinUrl') ||
      this.isModified('githubUrl') || this.isModified('resumeUrl') ||
      this.isModified('profileImage')) {
    this.profileCompletion = this.calculateProfileCompletion();
    this.isProfileComplete = this.profileCompletion === 100;
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);

// Made with Bob
