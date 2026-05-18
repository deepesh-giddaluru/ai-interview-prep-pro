import { Request, Response } from 'express';
import Interview from '../models/Interview';
import Progress from '../models/Progress';
import User from '../models/User';

// @desc    Save interview result
// @route   POST /api/interviews
// @access  Private
export const saveInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      role,
      difficulty,
      questions,
      overallScore,
      technicalScore,
      communicationScore,
      confidenceScore,
      strengths,
      weaknesses,
      improvements,
      duration,
    } = req.body;

    // Create interview
    const interview = await Interview.create({
      userId: req.user.id,
      type,
      role,
      difficulty,
      questions,
      overallScore,
      technicalScore,
      communicationScore,
      confidenceScore,
      strengths,
      weaknesses,
      improvements,
      duration,
      completedAt: new Date(),
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalInterviews += 1;
      // Calculate new average score
      user.averageScore =
        (user.averageScore * (user.totalInterviews - 1) + overallScore) /
        user.totalInterviews;
      await user.save();
    }

    // Update progress
    const progress = await Progress.findOne({ userId: req.user.id });
    if (progress) {
      progress.totalInterviews += 1;
      progress.completedInterviews += 1;
      
      // Update average score
      progress.averageScore =
        (progress.averageScore * (progress.totalInterviews - 1) + overallScore) /
        progress.totalInterviews;

      // Update best and worst scores
      if (overallScore > progress.bestScore) {
        progress.bestScore = overallScore;
      }
      if (overallScore < progress.worstScore) {
        progress.worstScore = overallScore;
      }

      // Update streak
      progress.updateStreak();

      await progress.save();
    }

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error: any) {
    console.error('Save interview error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get all interviews for user
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: interviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
export const getInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
      return;
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get interview statistics
// @route   GET /api/interviews/stats
// @access  Private
export const getInterviewStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviews = await Interview.find({ userId: req.user.id });

    const stats = {
      total: interviews.length,
      averageScore:
        interviews.reduce((acc, int) => acc + int.overallScore, 0) /
          interviews.length || 0,
      byType: {} as any,
      byDifficulty: {} as any,
      recentScores: interviews
        .slice(0, 10)
        .map((int) => ({
          date: int.completedAt,
          score: int.overallScore,
          type: int.type,
        })),
    };

    // Group by type
    interviews.forEach((int) => {
      if (!stats.byType[int.type]) {
        stats.byType[int.type] = { count: 0, averageScore: 0 };
      }
      stats.byType[int.type].count += 1;
      stats.byType[int.type].averageScore += int.overallScore;
    });

    // Calculate averages for types
    Object.keys(stats.byType).forEach((type) => {
      stats.byType[type].averageScore /= stats.byType[type].count;
    });

    // Group by difficulty
    interviews.forEach((int) => {
      if (!stats.byDifficulty[int.difficulty]) {
        stats.byDifficulty[int.difficulty] = { count: 0, averageScore: 0 };
      }
      stats.byDifficulty[int.difficulty].count += 1;
      stats.byDifficulty[int.difficulty].averageScore += int.overallScore;
    });

    // Calculate averages for difficulty
    Object.keys(stats.byDifficulty).forEach((difficulty) => {
      stats.byDifficulty[difficulty].averageScore /=
        stats.byDifficulty[difficulty].count;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// Made with Bob
