import { Request, Response } from 'express';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // For profile images
  if (file.fieldname === 'profileImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile picture'), false);
    }
  }
  // For resumes
  else if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed for resume'), false);
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      name,
      college,
      branch,
      year,
      bio,
      skills,
      linkedinUrl,
      githubUrl,
    } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    }
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Upload profile image
 * @route   POST /api/profile/upload-image
 * @access  Private
 */
export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image',
      });
    }

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '../../uploads', path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new image URL
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        profileImage: user.profileImage,
      },
      message: 'Profile image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Upload resume
 * @route   POST /api/profile/upload-resume
 * @access  Private
 */
export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a resume',
      });
    }

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Delete old resume if exists
    if (user.resumeUrl) {
      const oldResumePath = path.join(__dirname, '../../uploads', path.basename(user.resumeUrl));
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    // Save new resume URL
    user.resumeUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        resumeUrl: user.resumeUrl,
      },
      message: 'Resume uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete profile image
 * @route   DELETE /api/profile/image
 * @access  Private
 */
export const deleteProfileImage = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.profileImage) {
      const imagePath = path.join(__dirname, '../../uploads', path.basename(user.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      user.profileImage = undefined;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete profile image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete resume
 * @route   DELETE /api/profile/resume
 * @access  Private
 */
export const deleteResume = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.resumeUrl) {
      const resumePath = path.join(__dirname, '../../uploads', path.basename(user.resumeUrl));
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
      user.resumeUrl = undefined;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// Made with Bob