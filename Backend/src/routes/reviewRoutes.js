import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getMyReviews,
  canReviewUser
} from '../controllers/reviewController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Review CRUD operations
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Get reviews
router.get('/user/:userId', getUserReviews);
router.get('/my-reviews', getMyReviews);
router.get('/can-review/:userId', canReviewUser);

export default router; 