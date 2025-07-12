import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { verifyGoogleToken, handleGoogleAuth } from '../services/googleAuth.js';
import { updateProfilePhoto } from '../services/fileUpload.js';

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location, profilePhoto } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user data
    const userData = {
      name,
      email,
      password,
      location,
      introduction: req.body.introduction || ""
    };

    // Handle profile photo if provided
    if (profilePhoto) {
      try {
        const photoData = await updateProfilePhoto({ profilePhoto: {} }, profilePhoto);
        userData.profilePhoto = photoData;
      } catch (error) {
        return res.status(400).json({ message: 'Failed to upload profile photo' });
      }
    }

    // Create user
    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        introduction: user.introduction,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.isBanned) {
        return res.status(403).json({ message: 'Your account has been banned' });
      }

      // Update last active
      await user.updateLastActive();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        introduction: user.introduction,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isAdmin: user.role === 'admin',
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Google OAuth authentication
// @route   POST /api/users/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    const googleData = await verifyGoogleToken(token);

    // Handle Google authentication
    const userData = await handleGoogleAuth(googleData);

    res.json(userData);
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update last active
      await user.updateLastActive();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        introduction: user.introduction,
        profilePhoto: user.profilePhoto,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        availability: user.availability,
        isPublic: user.isPublic,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        rating: user.rating,
        lastActive: user.lastActive,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.location = req.body.location || user.location;
      user.introduction = req.body.introduction !== undefined ? req.body.introduction : user.introduction;
      user.skillsOffered = req.body.skillsOffered || user.skillsOffered;
      user.skillsWanted = req.body.skillsWanted || user.skillsWanted;
      user.availability = req.body.availability || user.availability;
      user.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : user.isPublic;

      // Handle profile photo update
      if (req.body.profilePhoto && req.body.profilePhoto !== user.profilePhoto?.url) {
        try {
          const photoData = await updateProfilePhoto(user, req.body.profilePhoto);
          user.profilePhoto = photoData;
        } catch (error) {
          return res.status(400).json({ message: 'Failed to update profile photo' });
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      // Check if profile is complete
      user.checkProfileComplete();

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        location: updatedUser.location,
        introduction: updatedUser.introduction,
        profilePhoto: updatedUser.profilePhoto,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        availability: updatedUser.availability,
        isPublic: updatedUser.isPublic,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        isProfileComplete: updatedUser.isProfileComplete,
        rating: updatedUser.rating,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all public users
// @route   GET /api/users
// @access  Private
export const getPublicUsers = async (req, res) => {
  try {
    const { skill, location, page = 1, limit = 10 } = req.query;
    
    const query = { isPublic: true, isBanned: false };
    
    if (skill) {
      query.$or = [
        { 'skillsOffered.name': { $regex: skill, $options: 'i' } },
        { 'skillsWanted.name': { $regex: skill, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .select('name location profilePhoto skillsOffered skillsWanted availability rating lastActive isPublic introduction')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastActive: -1 })
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name location profilePhoto skillsOffered skillsWanted availability rating isPublic lastActive introduction createdAt');

    if (user && (user.isPublic || req.user._id.toString() === req.params.id)) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Ban/Unban user (Admin only)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ 
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      isBanned: user.isBanned 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      totalSwaps: 0, // This would come from SwapRequest model
      averageRating: user.rating.average,
      skillsTaught: user.skillsOffered.length,
      skillsLearned: user.skillsWanted.length,
      lastActive: user.lastActive
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 