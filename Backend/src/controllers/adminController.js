import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import AdminMessage from '../models/AdminMessage.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalSwaps = await SwapRequest.countDocuments();
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
    const activeMessages = await AdminMessage.countDocuments({ isActive: true });

    // Get recent activity
    const recentUsers = await User.find()
      .select('name email createdAt isBanned')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSwaps = await SwapRequest.find()
      .populate('requester', 'name')
      .populate('recipient', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        bannedUsers,
        totalSwaps,
        pendingSwaps,
        completedSwaps,
        activeMessages
      },
      recentActivity: {
        users: recentUsers,
        swaps: recentSwaps
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, banned } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (banned !== undefined) {
      query.isBanned = banned === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all swap requests (Admin only)
// @route   GET /api/admin/swaps
// @access  Private/Admin
export const getAllSwaps = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SwapRequest.countDocuments(query);

    res.json({
      swaps,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalSwaps: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create admin message
// @route   POST /api/admin/messages
// @access  Private/Admin
export const createAdminMessage = async (req, res) => {
  try {
    const { title, content, type, priority, expiresAt } = req.body;

    const adminMessage = await AdminMessage.create({
      title,
      content,
      type,
      priority,
      expiresAt,
      createdBy: req.user._id
    });

    const populatedMessage = await AdminMessage.findById(adminMessage._id)
      .populate('createdBy', 'name');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all admin messages
// @route   GET /api/admin/messages
// @access  Private/Admin
export const getAdminMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, active } = req.query;
    
    let query = {};
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const messages = await AdminMessage.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await AdminMessage.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalMessages: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update admin message
// @route   PUT /api/admin/messages/:id
// @access  Private/Admin
export const updateAdminMessage = async (req, res) => {
  try {
    const { title, content, type, priority, isActive, expiresAt } = req.body;

    const message = await AdminMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.title = title || message.title;
    message.content = content || message.content;
    message.type = type || message.type;
    message.priority = priority || message.priority;
    message.isActive = isActive !== undefined ? isActive : message.isActive;
    message.expiresAt = expiresAt || message.expiresAt;

    await message.save();

    const updatedMessage = await AdminMessage.findById(req.params.id)
      .populate('createdBy', 'name');

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete admin message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
export const deleteAdminMessage = async (req, res) => {
  try {
    const message = await AdminMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await AdminMessage.findByIdAndDelete(req.params.id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get platform-wide messages (Public)
// @route   GET /api/admin/messages/public
// @access  Public
export const getPublicMessages = async (req, res) => {
  try {
    const messages = await AdminMessage.find({ 
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
    .select('title content type priority createdAt')
    .sort({ priority: -1, createdAt: -1 })
    .limit(10);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 