import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUsers,
  getUserById,
  toggleUserBan
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, getPublicUsers);
router.get('/:id', protect, getUserById);

// Admin routes
router.put('/:id/ban', protect, admin, toggleUserBan);

export default router; 