import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  streak: number;
  lastActivityDate: Date;
  skillAnalytics: Array<{
    skill: string;
    count: number;
    averageScore: number;
    lastPracticed: Date;
  }>;
  topicAnalytics: Array<{
    topic: string;
    strength: 'weak' | 'moderate' | 'strong';
    score: number;
    practiceCount: number;
  }>;
  weeklyActivity: Array<{
    week: string;
    interviewCount: number;
    averageScore: number;
  }>;
  monthlyGoals: Array<{
    month: string;
    goal: string;
    target: number;
    achieved: number;
    isCompleted: boolean;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalInterviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedInterviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    bestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    worstScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    skillAnalytics: [
      {
        skill: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        lastPracticed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    topicAnalytics: [
      {
        topic: {
          type: String,
          required: true,
        },
        strength: {
          type: String,
          enum: ['weak', 'moderate', 'strong'],
          default: 'moderate',
        },
        score: {
          type: Number,
          default: 0,
        },
        practiceCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    weeklyActivity: [
      {
        week: {
          type: String,
          required: true,
        },
        interviewCount: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
      },
    ],
    monthlyGoals: [
      {
        month: {
          type: String,
          required: true,
        },
        goal: {
          type: String,
          required: true,
        },
        target: {
          type: Number,
          required: true,
        },
        achieved: {
          type: Number,
          default: 0,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    achievements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          default: '🏆',
        },
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to update streak
ProgressSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.lastActivityDate) {
    this.streak = 1;
    this.lastActivityDate = new Date();
    return;
  }

  const lastActivity = new Date(this.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActivity.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, no change
    return;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    this.streak += 1;
  } else {
    // Streak broken, reset to 1
    this.streak = 1;
  }

  this.lastActivityDate = new Date();
};

export default mongoose.model<IProgress>('Progress', ProgressSchema);

// Made with Bob
