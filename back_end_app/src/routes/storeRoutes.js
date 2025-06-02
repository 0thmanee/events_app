const express = require('express');
const CustomizationRequest = require('../models/CustomizationRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Special case for development: treat "obouchta" as admin
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    
    if (req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get store items (pricing for customizations)
router.get('/items', auth, (req, res) => {
  const storeItems = {
    customizations: {
      nickname: {
        cost: 50,
        description: 'Change your nickname'
      },
      picture: {
        cost: 100,
        description: 'Change your profile picture'
      }
    }
  };
  res.json(storeItems);
});

// Submit customization request
router.post('/request', auth, async (req, res) => {
  try {
    const { type, requestedChange } = req.body;
    
    // Get cost based on type
    const costs = {
      nickname: 50,
      picture: 100
    };

    if (!costs[type]) {
      return res.status(400).json({ error: 'Invalid customization type' });
    }

    const request = new CustomizationRequest({
      user: req.user._id,
      type,
      requestedChange,
      cost: costs[type]
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's customization requests
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all pending requests
router.get('/admin/requests', auth, isAdmin, async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ status: 'pending' })
      .populate('user', 'nickname email')
      .sort({ createdAt: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve request
router.post('/admin/requests/:requestId/approve', auth, isAdmin, async (req, res) => {
  try {
    const request = await CustomizationRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await request.approve();
    res.json({ message: 'Request approved successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Reject request
router.post('/admin/requests/:requestId/reject', auth, isAdmin, async (req, res) => {
  try {
    const { note } = req.body;
    const request = await CustomizationRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await request.reject(note);
    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
