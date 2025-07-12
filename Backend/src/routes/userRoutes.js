import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  getPublicUsers,
  getUserById,
  toggleUserBan,
  getUserStats
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validateProfileUpdate
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/google', validateGoogleAuth, googleAuth);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);
router.get('/stats', protect, getUserStats);
router.get('/', protect, getPublicUsers);
router.get('/:id', protect, getUserById);

// Admin routes
router.put('/:id/ban', protect, admin, toggleUserBan);

export default router; 