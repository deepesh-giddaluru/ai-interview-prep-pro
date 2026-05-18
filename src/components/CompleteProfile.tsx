import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  GraduationCap,
  Calendar,
  FileText,
  Code,
  Linkedin,
  Github,
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../lib/api';

interface ProfileData {
  name: string;
  college: string;
  branch: string;
  year: string;
  bio: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  profileImage: string | null;
  resumeUrl: string | null;
}

export function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(10);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    college: '',
    branch: '',
    year: '',
    bio: '',
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    profileImage: null,
    resumeUrl: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        profileImage: user.profileImage || null,
        resumeUrl: user.resumeUrl || null,
        college: user.college || '',
        branch: user.branch || '',
        year: user.year || '',
        bio: user.bio || '',
        skills: user.skills || [],
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
      }));
    }
  }, []);

  // Calculate profile completion
  useEffect(() => {
    let completion = 0;
    if (formData.name) completion += 10;
    if (formData.college) completion += 10;
    if (formData.branch) completion += 10;
    if (formData.year) completion += 5;
    if (formData.bio && formData.bio.length > 20) completion += 20;
    if (formData.skills.length >= 3) completion += 20;
    if (formData.resumeUrl) completion += 20;
    if (formData.linkedinUrl) completion += 5;
    if (formData.githubUrl) completion += 5;
    if (formData.profileImage) completion += 5;
    setProfileCompletion(Math.min(completion, 100));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const formDataToSend = new FormData();
    formDataToSend.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, profileImage: data.data.profileImage }));
        toast.success('Profile image uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && 
        file.type !== 'application/msword' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast.error('Please upload a PDF or DOC file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume size should be less than 5MB');
      return;
    }

    setUploadingResume(true);
    const formDataToSend = new FormData();
    formDataToSend.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/upload-resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, resumeUrl: data.data.resumeUrl }));
        toast.success('Resume uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (formData.bio.length < 20) newErrors.bio = 'Bio should be at least 20 characters';
    if (formData.skills.length < 3) newErrors.skills = 'Add at least 3 skills';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success('Profile completed successfully!');
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-sidebar to-bg-card">
      {/* Header */}
      <header className="border-b border-white/10 bg-bg-sidebar/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="text-xl font-bold text-white">Complete Your Profile</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-text-secondary">Profile Completion</p>
              <p className="text-2xl font-bold text-brand">{profileCompletion}%</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - profileCompletion / 100)}`}
                  className="text-brand transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{profileCompletion}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Welcome! Let's Get Started</h1>
            <p className="text-text-secondary text-lg">
              Complete your profile to unlock all features and get personalized interview preparation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="elegant-card bg-white/5 border-white/10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center overflow-hidden">
                    {formData.profileImage ? (
                      <img
                        src={`${API_BASE_URL}${formData.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-brand rounded-full flex items-center justify-center cursor-pointer hover:bg-brand/80 transition-colors shadow-lg"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Profile Picture</h3>
                  <p className="text-sm text-text-secondary">
                    Upload a professional photo (Max 5MB, JPG/PNG)
                  </p>
                  <p className="text-xs text-brand mt-2">+5% completion</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange(e as any)}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                  {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand" />
                Education
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    College/University *
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="MIT, Stanford, etc."
                  />
                  {errors.college && <p className="text-red-400 text-sm mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Branch/Major *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="Computer Science, IT, etc."
                  />
                  {errors.branch && <p className="text-red-400 text-sm mt-1">{errors.branch}</p>}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand" />
                About You
              </h3>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Bio/Description * (Min 20 characters)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself, your interests, career goals, etc."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}
                  <p className="text-xs text-text-muted ml-auto">{formData.bio.length} characters</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-brand" />
                Skills * (Add at least 3)
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  placeholder="e.g., React, Python, Machine Learning"
                />
                <Button type="button" onClick={handleAddSkill} className="px-6">
                  Add
                </Button>
              </div>
              {errors.skills && <p className="text-red-400 text-sm">{errors.skills}</p>}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-brand/20 border border-brand/30 rounded-lg text-brand text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand" />
                Resume Upload
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-brand/50 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  disabled={uploadingResume}
                />
                <label htmlFor="resume-upload" className="cursor-pointer block">
                  {uploadingResume ? (
                    <Loader2 className="w-12 h-12 text-brand mx-auto mb-4 animate-spin" />
                  ) : formData.resumeUrl ? (
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  ) : (
                    <Upload className="w-12 h-12 text-brand mx-auto mb-4" />
                  )}
                  <p className="text-white font-medium mb-1">
                    {formData.resumeUrl ? 'Resume Uploaded' : 'Upload Your Resume'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    PDF or DOC (Max 5MB) • +20% completion
                  </p>
                </label>
              </div>
            </div>

            {/* Social Links */}
            <div className="elegant-card bg-white/5 border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white">Social Profiles</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-500" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-main border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
                disabled={loading}
              >
                Skip for Now
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Made with Bob