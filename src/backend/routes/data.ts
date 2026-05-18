import { Router } from 'express';
import {
  saveRoadmap,
  getRoadmaps,
  getRoadmap,
  updateRoadmap,
  deleteRoadmap,
  saveResumeAnalysis,
  getResumeAnalyses,
  getResumeAnalysis,
  deleteResumeAnalysis,
  getProgress,
  updateProgress,
  getDashboardData,
} from '../controllers/dataController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(protect);

// Roadmap routes
router.route('/roadmaps').get(getRoadmaps).post(saveRoadmap);
router
  .route('/roadmaps/:id')
  .get(getRoadmap)
  .put(updateRoadmap)
  .delete(deleteRoadmap);

// Resume analysis routes
router.route('/resume-analysis').get(getResumeAnalyses).post(saveResumeAnalysis);
router
  .route('/resume-analysis/:id')
  .get(getResumeAnalysis)
  .delete(deleteResumeAnalysis);

// Progress routes
router.route('/progress').get(getProgress).put(updateProgress);

// Dashboard route
router.route('/dashboard').get(getDashboardData);

export default router;

// Made with Bob
