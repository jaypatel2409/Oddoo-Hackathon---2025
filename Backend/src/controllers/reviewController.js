import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { reviewedUserId, rating, comment, skillContext } = req.body;

    // Validate input
    if (!reviewedUserId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user is trying to review themselves
    if (req.user._id.toString() === reviewedUserId) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Check if reviewed user exists and is public
    const reviewedUser = await User.findById(reviewedUserId);
    if (!reviewedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!reviewedUser.isPublic) {
      return res.status(403).json({ message: 'Cannot review private profiles' });
    }

    // Check if user already reviewed this person
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      rating,
      comment,
      skillContext: skillContext || null
    });

    // Populate reviewer details
    await review.populate('reviewer', 'name profilePhoto');

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment, skillContext } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update review
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    if (skillContext !== undefined) {
      review.skillContext = skillContext;
    }

    review.updatedAt = new Date();
    await review.save();

    // Populate reviewer details
    await review.populate('reviewer', 'name profilePhoto');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user exists and is public
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isPublic && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Cannot view reviews for private profiles' });
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      reviewedUser: userId,
      isPublic: true 
    })
    .populate('reviewer', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Review.countDocuments({ 
      reviewedUser: userId,
      isPublic: true 
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: skip + reviews.length < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('reviewedUser', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewer: req.user._id });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: skip + reviews.length < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if user can review another user
// @route   GET /api/reviews/can-review/:userId
// @access  Private
export const canReviewUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is trying to review themselves
    if (req.user._id.toString() === userId) {
      return res.json({ canReview: false, reason: 'You cannot review yourself' });
    }

    // Check if reviewed user exists and is public
    const reviewedUser = await User.findById(userId);
    if (!reviewedUser) {
      return res.json({ canReview: false, reason: 'User not found' });
    }

    if (!reviewedUser.isPublic) {
      return res.json({ canReview: false, reason: 'Cannot review private profiles' });
    }

    // Check if user already reviewed this person
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewedUser: userId
    });

    if (existingReview) {
      return res.json({ 
        canReview: false, 
        reason: 'You have already reviewed this user',
        existingReview 
      });
    }

    res.json({ canReview: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 