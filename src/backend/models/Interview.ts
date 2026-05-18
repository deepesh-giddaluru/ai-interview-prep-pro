import mongoose, { Document, Schema } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'technical' | 'behavioral' | 'hr' | 'coding' | 'ai-mock';
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
    timeSpent: number; // in seconds
  }>;
  overallScore: number;
  technicalScore?: number;
  communicationScore?: number;
  confidenceScore?: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  duration: number; // in minutes
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'hr', 'coding', 'ai-mock'],
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        feedback: {
          type: String,
          default: '',
        },
        timeSpent: {
          type: Number,
          default: 0,
        },
      },
    ],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    technicalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    communicationScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    improvements: [
      {
        type: String,
      },
    ],
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
InterviewSchema.index({ userId: 1, completedAt: -1 });
InterviewSchema.index({ userId: 1, type: 1 });

export default mongoose.model<IInterview>('Interview', InterviewSchema);

// Made with Bob
