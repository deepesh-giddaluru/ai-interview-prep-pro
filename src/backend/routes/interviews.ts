import { Router } from 'express';
import {
  saveInterview,
  getInterviews,
  getInterview,
  deleteInterview,
  getInterviewStats,
} from '../controllers/interviewController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(protect);

router.route('/').get(getInterviews).post(saveInterview);

router.route('/stats').get(getInterviewStats);

router.route('/:id').get(getInterview).delete(deleteInterview);

export default router;

// Made with Bob
