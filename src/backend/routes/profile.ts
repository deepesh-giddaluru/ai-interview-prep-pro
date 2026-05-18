import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  deleteProfileImage,
  deleteResume,
  upload,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Profile routes
router.route('/').get(getProfile).put(updateProfile);

// File upload routes
router.post('/upload-image', upload.single('profileImage'), uploadProfileImage);
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Delete routes
router.delete('/image', deleteProfileImage);
router.delete('/resume', deleteResume);

export default router;

// Made with Bob