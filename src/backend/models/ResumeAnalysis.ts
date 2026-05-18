import mongoose, { Document, Schema } from 'mongoose';

export interface IResumeAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileSize: number;
  role: string;
  analysis: string;
  skills: string[];
  suggestedQuestions: string[];
  atsScore?: number;
  missingKeywords?: string[];
  improvements?: string[];
  jobMatchScore?: number;
  strengthAreas?: string[];
  weaknessAreas?: string[];
  currentSkills?: string[];
  missingSkills?: string[];
  overallScore?: number;
  estimatedTimeToReady?: string;
  recommendations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeAnalysisSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    analysis: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    suggestedQuestions: [
      {
        type: String,
      },
    ],
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    missingKeywords: [
      {
        type: String,
      },
    ],
    improvements: [
      {
        type: String,
      },
    ],
    jobMatchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengthAreas: [
      {
        type: String,
      },
    ],
    weaknessAreas: [
      {
        type: String,
      },
    ],
    currentSkills: [
      {
        type: String,
      },
    ],
    missingSkills: [
      {
        type: String,
      },
    ],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    estimatedTimeToReady: {
      type: String,
    },
    recommendations: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ResumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IResumeAnalysis>('ResumeAnalysis', ResumeAnalysisSchema);

// Made with Bob
