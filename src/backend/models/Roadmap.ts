import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  career: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  timeframe: string;
  skills: string[];
  courses: Array<{
    title: string;
    url: string;
    duration: string;
    platform: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
  }>;
  certifications: string[];
  monthlyPlan: Array<{
    month: number;
    focus: string;
    tasks: string[];
  }>;
  timeline: string;
  aiSuggestions: string[];
  progress: number; // 0-100
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    career: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    timeframe: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    courses: [
      {
        title: String,
        url: String,
        duration: String,
        platform: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        difficulty: String,
        estimatedTime: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    monthlyPlan: [
      {
        month: Number,
        focus: String,
        tasks: [String],
      },
    ],
    timeline: {
      type: String,
      required: true,
    },
    aiSuggestions: [
      {
        type: String,
      },
    ],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
RoadmapSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

// Made with Bob
