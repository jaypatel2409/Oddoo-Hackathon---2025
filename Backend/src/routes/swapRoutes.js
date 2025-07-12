import express from 'express';
import {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  updateSwapStatus,
  cancelSwapRequest,
  addFeedback
} from '../controllers/swapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createSwapRequest)
  .get(getSwapRequests);

router.route('/:id')
  .get(getSwapRequestById);

router.put('/:id/status', updateSwapStatus);
router.put('/:id/cancel', cancelSwapRequest);
router.post('/:id/feedback', addFeedback);

export default router; 