import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: 'login' | 'interview' | 'roadmap' | 'resume' | 'logout';
  eventData?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const AnalyticsSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['login', 'interview', 'roadmap', 'resume', 'logout'],
      required: true,
      index: true,
    },
    eventData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ eventType: 1, timestamp: -1 });

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

// Made with Bob