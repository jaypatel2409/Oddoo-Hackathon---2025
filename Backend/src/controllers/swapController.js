import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';

// @desc    Create swap request
// @route   POST /api/swaps
// @access  Private
export const createSwapRequest = async (req, res) => {
  try {
    const { recipientId, skillOffered, skillRequested, message, proposedSchedule } = req.body;

    // Check if recipient exists and is not banned
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.isBanned) {
      return res.status(404).json({ message: 'Recipient not found or banned' });
    }

    // Check if recipient is public
    if (!recipient.isPublic) {
      return res.status(403).json({ message: 'Cannot send request to private user' });
    }

    // Check if there's already a pending request
    const existingRequest = await SwapRequest.findOne({
      requester: req.user._id,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this user' });
    }

    const swapRequest = await SwapRequest.create({
      requester: req.user._id,
      recipient: recipientId,
      skillOffered,
      skillRequested,
      message,
      proposedSchedule
    });

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's swap requests (sent and received)
// @route   GET /api/swaps
// @access  Private
export const getSwapRequests = async (req, res) => {
  try {
    const { status, type = 'all', page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (status) {
      query.status = status;
    }

    if (type === 'sent') {
      query.requester = req.user._id;
    } else if (type === 'received') {
      query.recipient = req.user._id;
    } else {
      query.$or = [
        { requester: req.user._id },
        { recipient: req.user._id }
      ];
    }

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SwapRequest.countDocuments(query);

    res.json({
      swapRequests,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get swap request by ID
// @route   GET /api/swaps/:id
// @access  Private
export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is authorized to view this request
    if (swapRequest.requester._id.toString() !== req.user._id.toString() && 
        swapRequest.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update swap request status
// @route   PUT /api/swaps/:id/status
// @access  Private
export const updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient and can accept/reject
    if (swapRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Only allow status updates for pending requests
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending requests' });
    }

    // Validate status
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    swapRequest.status = status;
    await swapRequest.save();

    const updatedRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel swap request
// @route   PUT /api/swaps/:id/cancel
// @access  Private
export const cancelSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the requester and can cancel
    if (swapRequest.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    // Only allow cancellation of pending requests
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    swapRequest.status = 'cancelled';
    await swapRequest.save();

    const updatedRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add feedback to completed swap
// @route   POST /api/swaps/:id/feedback
// @access  Private
export const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swapRequest.requester.toString() !== req.user._id.toString() && 
        swapRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add feedback' });
    }

    // Only allow feedback for completed swaps
    if (swapRequest.status !== 'completed') {
      return res.status(400).json({ message: 'Can only add feedback to completed swaps' });
    }

    // Check if user already gave feedback
    if (swapRequest.feedback.givenBy && 
        swapRequest.feedback.givenBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You have already given feedback for this swap' });
    }

    // Add feedback
    swapRequest.feedback = {
      rating,
      comment,
      givenBy: req.user._id,
      givenAt: new Date()
    };

    await swapRequest.save();

    // Update user rating
    const otherUserId = swapRequest.requester.toString() === req.user._id.toString() 
      ? swapRequest.recipient 
      : swapRequest.requester;
    
    const otherUser = await User.findById(otherUserId);
    if (otherUser) {
      await otherUser.updateRating(rating);
    }

    const updatedRequest = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto')
      .populate('feedback.givenBy', 'name');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 