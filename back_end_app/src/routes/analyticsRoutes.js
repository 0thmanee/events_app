const express = require('express');
const Analytics = require('../models/Analytics');
const Event = require('../models/Event');
const User = require('../models/User');
const CustomizationRequest = require('../models/CustomizationRequest');
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

// Get platform overview
router.get('/overview', auth, isAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeEvents,
      totalAttendance,
      averageRating
    ] = await Promise.all([
      User.countDocuments(),
      Event.find({ status: { $in: ['approved', 'upcoming', 'ongoing'] } }).countDocuments(),
      Event.aggregate([
        { $unwind: '$attendees' },
        { $match: { 'attendees.status': 'attended' } },
        { $count: 'total' }
      ]),
      Event.aggregate([
        { $unwind: '$feedbacks' },
        { $group: { _id: null, avg: { $avg: '$feedbacks.rating' } } }
      ])
    ]);

    res.json({
      totalUsers,
      activeEvents,
      totalAttendance: totalAttendance[0]?.total || 0,
      averageEventRating: averageRating[0]?.avg?.toFixed(1) || 0,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily stats
router.get('/daily', auth, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await Analytics.findOne();
    
    if (!analytics) {
      return res.status(404).json({ error: 'No analytics data found' });
    }

    let stats = analytics.dailyStats;
    if (startDate && endDate) {
      stats = stats.filter(stat => 
        stat.date >= new Date(startDate) && 
        stat.date <= new Date(endDate)
      );
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event analytics
router.get('/events', auth, isAdmin, async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const analytics = await Analytics.findOne()
      .populate('eventAnalytics.eventId', 'title category time');

    if (!analytics) {
      return res.status(404).json({ error: 'No analytics data found' });
    }

    let events = analytics.eventAnalytics;
    
    // Apply filters
    if (category) {
      events = events.filter(event => event.category === category);
    }
    if (startDate && endDate) {
      events = events.filter(event => 
        event.date >= new Date(startDate) && 
        event.date <= new Date(endDate)
      );
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user engagement metrics
router.get('/engagement', auth, isAdmin, async (req, res) => {
  try {
    const analytics = await Analytics.findOne()
      .populate('userEngagement.userId', 'nickname email');

    if (!analytics) {
      return res.status(404).json({ error: 'No analytics data found' });
    }

    // Calculate engagement metrics
    const metrics = {
      totalUsers: analytics.userEngagement.length,
      activeUsers: analytics.userEngagement.filter(u => 
        new Date(u.lastActive) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      averageEventsPerUser: analytics.userEngagement.reduce((acc, u) => acc + u.eventsAttended, 0) / analytics.userEngagement.length,
      totalCoinsEarned: analytics.userEngagement.reduce((acc, u) => acc + u.coinsEarned, 0),
      totalCoinsSpent: analytics.userEngagement.reduce((acc, u) => acc + u.coinsSpent, 0),
      userEngagement: analytics.userEngagement
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category breakdown
router.get('/categories', auth, isAdmin, async (req, res) => {
  try {
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: '$attendees' } },
          averageRating: { $avg: '$averageRating' }
        }
      }
    ]);

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get volunteer statistics
router.get('/volunteers', auth, isAdmin, async (req, res) => {
  try {
    const volunteerStats = await Event.aggregate([
      { $unwind: '$volunteers' },
      {
        $group: {
          _id: '$volunteers.status',
          count: { $sum: 1 },
          byRole: {
            $push: {
              role: '$volunteers.role',
              eventId: '$_id',
              eventTitle: '$title'
            }
          }
        }
      }
    ]);

    res.json(volunteerStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customization request stats
router.get('/customizations', auth, isAdmin, async (req, res) => {
  try {
    const stats = await CustomizationRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCoins: { $sum: '$cost' },
          byType: {
            $push: {
              type: '$type',
              cost: '$cost',
              userId: '$user'
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update analytics data
router.post('/update', auth, isAdmin, async (req, res) => {
  try {
    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = new Analytics();
    }

    // Update daily stats
    await analytics.updateDailyStats(new Date());

    // Update event analytics for all events
    const events = await Event.find();
    for (const event of events) {
      await analytics.updateEventAnalytics(event._id);
    }

    analytics.lastUpdated = new Date();
    await analytics.save();

    res.json({ message: 'Analytics updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
