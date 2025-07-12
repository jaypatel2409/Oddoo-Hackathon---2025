import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllSwaps,
  createAdminMessage,
  getAdminMessages,
  updateAdminMessage,
  deleteAdminMessage,
  getPublicMessages
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/swaps', getAllSwaps);

router.route('/messages')
  .post(createAdminMessage)
  .get(getAdminMessages);

router.route('/messages/:id')
  .put(updateAdminMessage)
  .delete(deleteAdminMessage);

// Public route for platform messages
router.get('/messages/public', getPublicMessages);

export default router; 