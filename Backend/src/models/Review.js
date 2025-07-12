import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Review comment cannot be more than 500 characters']
  },
  skillContext: {
    type: String,
    trim: true,
    maxlength: [100, 'Skill context cannot be more than 100 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from the same user
reviewSchema.index({ reviewer: 1, reviewedUser: 1 }, { unique: true });

// Update user rating when review is created/updated
reviewSchema.post('save', async function(doc) {
  const User = mongoose.model('User');
  const reviewedUser = await User.findById(doc.reviewedUser);
  
  if (reviewedUser) {
    // Recalculate average rating
    const reviews = await mongoose.model('Review').find({ 
      reviewedUser: doc.reviewedUser,
      isPublic: true 
    });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    reviewedUser.rating = {
      average: averageRating,
      count: reviews.length
    };
    
    await reviewedUser.save();
  }
});

// Update user rating when review is deleted
reviewSchema.post('remove', async function(doc) {
  const User = mongoose.model('User');
  const reviewedUser = await User.findById(doc.reviewedUser);
  
  if (reviewedUser) {
    // Recalculate average rating
    const reviews = await mongoose.model('Review').find({ 
      reviewedUser: doc.reviewedUser,
      isPublic: true 
    });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    reviewedUser.rating = {
      average: averageRating,
      count: reviews.length
    };
    
    await reviewedUser.save();
  }
});

export default mongoose.model('Review', reviewSchema); 