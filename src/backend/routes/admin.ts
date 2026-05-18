import express from 'express';
import {
  getAllUsers,
  getAnalytics,
  getActiveUsers,
  getInterviewStats,
  deleteUser,
  updateUserRole,
  getUserDetails,
} from '../controllers/adminController';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);

// Analytics routes
router.get('/analytics', getAnalytics);
router.get('/active-users', getActiveUsers);
router.get('/interview-stats', getInterviewStats);

export default router;

// Made with Bob