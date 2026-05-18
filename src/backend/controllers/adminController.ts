import { Request, Response } from 'express';
import User from '../models/User';
import Analytics from '../models/Analytics';
import Interview from '../models/Interview';
import Roadmap from '../models/Roadmap';
import ResumeAnalysis from '../models/ResumeAnalysis';

// Get all users with pagination and search
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }

    // Get users
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch users',
    });
  }
};

// Get admin analytics dashboard data
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total users
    const totalUsers = await User.countDocuments();

    // Active users (logged in last 7 days)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: last7Days },
    });

    // New users today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Total interviews
    const totalInterviews = await Interview.countDocuments();

    // Average interview score
    const avgScoreResult = await Interview.aggregate([
      { $match: { score: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } },
    ]);
    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    // Total roadmaps
    const totalRoadmaps = await Roadmap.countDocuments();

    // Total resume analyses
    const totalResumeAnalyses = await ResumeAnalysis.countDocuments();

    // Daily active users (last 30 days)
    const dailyActiveUsers = await Analytics.aggregate([
      {
        $match: {
          eventType: 'login',
          timestamp: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // User growth (last 30 days)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Interview activity (last 30 days)
    const interviewActivity = await Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most used skills
    const mostUsedSkills = await Interview.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          newUsersToday,
          totalInterviews,
          averageScore: Math.round(averageScore * 100) / 100,
          totalRoadmaps,
          totalResumeAnalyses,
        },
        charts: {
          dailyActiveUsers,
          userGrowth,
          interviewActivity,
          mostUsedSkills,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch analytics',
    });
  }
};

// Get active users (currently online)
export const getActiveUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const activeUsers = await User.find({
      lastLogin: { $gte: fiveMinutesAgo },
      activeStatus: true,
    })
      .select('name email avatar lastLogin')
      .sort({ lastLogin: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        count: activeUsers.length,
        users: activeUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch active users',
    });
  }
};

// Get interview statistics
export const getInterviewStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgDuration: { $avg: '$duration' },
          completedInterviews: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalInterviews: 0,
      avgScore: 0,
      avgDuration: 0,
      completedInterviews: 0,
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch interview stats',
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    if (user.role === 'admin') {
      res.status(403).json({
        success: false,
        error: 'Cannot delete admin users',
      });
      return;
    }

    // Delete user and related data
    await Promise.all([
      User.findByIdAndDelete(id),
      Analytics.deleteMany({ userId: id }),
      Interview.deleteMany({ userId: id }),
      Roadmap.deleteMany({ userId: id }),
      ResumeAnalysis.deleteMany({ userId: id }),
    ]);

    res.json({
      success: true,
      message: 'User and related data deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete user',
    });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({
        success: false,
        error: 'Invalid role',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update user role',
    });
  }
};

// Get user details
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Get user's activity
    const [interviews, roadmaps, resumeAnalyses, recentActivity] = await Promise.all([
      Interview.find({ userId: id }).sort({ createdAt: -1 }).limit(10),
      Roadmap.find({ userId: id }).sort({ createdAt: -1 }).limit(5),
      ResumeAnalysis.find({ userId: id }).sort({ createdAt: -1 }).limit(5),
      Analytics.find({ userId: id }).sort({ timestamp: -1 }).limit(20),
    ]);

    res.json({
      success: true,
      data: {
        user,
        activity: {
          interviews,
          roadmaps,
          resumeAnalyses,
          recentActivity,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user details',
    });
  }
};

// Made with Bob