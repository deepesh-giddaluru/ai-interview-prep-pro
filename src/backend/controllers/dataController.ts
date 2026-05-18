import { Request, Response } from 'express';
import Roadmap from '../models/Roadmap';
import ResumeAnalysis from '../models/ResumeAnalysis';
import Progress from '../models/Progress';

// ==================== ROADMAP CONTROLLERS ====================

// @desc    Save roadmap
// @route   POST /api/roadmaps
// @access  Private
export const saveRoadmap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roadmap = await Roadmap.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get all roadmaps for user
// @route   GET /api/roadmaps
// @access  Private
export const getRoadmaps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: roadmaps.length,
      data: roadmaps,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get single roadmap
// @route   GET /api/roadmaps/:id
// @access  Private
export const getRoadmap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      res.status(404).json({
        success: false,
        error: 'Roadmap not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Update roadmap progress
// @route   PUT /api/roadmaps/:id
// @access  Private
export const updateRoadmap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!roadmap) {
      res.status(404).json({
        success: false,
        error: 'Roadmap not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
export const deleteRoadmap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      res.status(404).json({
        success: false,
        error: 'Roadmap not found',
      });
      return;
    }

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

// ==================== RESUME ANALYSIS CONTROLLERS ====================

// @desc    Save resume analysis
// @route   POST /api/resume-analysis
// @access  Private
export const saveResumeAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analysis = await ResumeAnalysis.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get all resume analyses for user
// @route   GET /api/resume-analysis
// @access  Private
export const getResumeAnalyses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume-analysis/:id
// @access  Private
export const getResumeAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      res.status(404).json({
        success: false,
        error: 'Resume analysis not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete resume analysis
// @route   DELETE /api/resume-analysis/:id
// @access  Private
export const deleteResumeAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analysis = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      res.status(404).json({
        success: false,
        error: 'Resume analysis not found',
      });
      return;
    }

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

// ==================== PROGRESS CONTROLLERS ====================

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
export const getProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    // Create progress if doesn't exist
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Update user progress
// @route   PUT /api/progress
// @access  Private
export const updateProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// ==================== DASHBOARD CONTROLLERS ====================

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    const recentInterviews = await require('../models/Interview')
      .default.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(5);
    const roadmaps = await Roadmap.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);
    const resumeAnalyses = await ResumeAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        progress: progress || {},
        recentInterviews,
        roadmaps,
        resumeAnalyses,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// Made with Bob
