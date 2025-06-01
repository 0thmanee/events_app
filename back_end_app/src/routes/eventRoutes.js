const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Check if user is admin middleware
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      creator: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Approve event
router.patch('/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.status = 'approved';
    await event.save();

    // Notify users about new event
    // This is where you'd implement push notifications
    // For now, we'll just console.log
    console.log(`New event approved: ${event.title}`);

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events with filters
router.get('/', async (req, res) => {
  try {
    const match = {};
    
    if (req.query.status) {
      match.status = req.query.status;
    }
    
    if (req.query.category) {
      match.category = req.query.category;
    }

    // Filter for upcoming events
    if (req.query.upcoming === 'true') {
      match.time = { $gt: new Date() };
      match.status = { $in: ['approved', 'upcoming'] };
    }

    // Search by tags
    if (req.query.tags) {
      match.tags = { $in: req.query.tags.split(',') };
    }

    // If user is not admin, only show approved or upcoming events
    if (!req.user?.role === 'admin') {
      match.status = { $in: ['approved', 'upcoming', 'ongoing'] };
    }

    let query = Event.find(match)
      .populate('attendees.user', 'nickname')
      .sort({ time: 1 });

    // Apply limit if specified
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (limit > 0) {
        query = query.limit(limit);
      }
    }

    const events = await query;

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events needing feedback from current user
router.get('/feedback-pending', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    // Find events where:
    // 1. User attended (status: 'attended')
    // 2. Event has ended (time < now)
    // 3. User hasn't given feedback yet
    const eventsNeedingFeedback = await Event.find({
      'attendees.user': userId,
      'attendees.status': 'attended',
      time: { $lt: now },
      'feedbacks.user': { $ne: userId } // User hasn't given feedback
    })
    .populate('attendees.user', 'nickname')
    .sort({ time: -1 }) // Most recent first
    .limit(10);

    res.json(eventsNeedingFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'nickname')
      .populate('feedbacks.user', 'nickname');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register for event
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'nickname');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'approved' && event.status !== 'upcoming') {
      return res.status(400).json({ error: 'Event registration is not open' });
    }

    // Check capacity
    if (event.attendees.length >= event.maxCapacity) {
      return res.status(400).json({ error: 'Event has reached maximum capacity' });
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.attendees.some(
      attendee => attendee.user.toString() === req.user._id.toString()
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    // Ensure all required fields are present before saving
    if (!event.creator) {
      // If creator is missing, assign a default admin user or the current user
      event.creator = req.user._id;
    }
    
    if (!event.maxCapacity || event.maxCapacity <= 0) {
      // Set a default capacity if missing
      event.maxCapacity = Math.max(50, event.attendees.length + 1);
    }
    
    if (!event.location) {
      // Set a default location if missing
      event.location = '1337 Campus';
    }

    // Add attendee
    event.attendees.push({
      user: req.user._id,
      status: 'registered'
    });

    // Save the event with validation
    await event.save({ validateBeforeSave: true });

    // Add event to user's attended events if not already there
    if (!req.user.eventsAttended.includes(event._id)) {
      req.user.eventsAttended.push(event._id);
      await req.user.save();
    }

    res.json({ 
      message: 'Successfully registered for event',
      event: {
        id: event._id,
        title: event.title,
        attendees: event.attendees.length,
        maxCapacity: event.maxCapacity
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Mark attendance status (for admin/organizer)
router.patch('/:id/attendance', auth, async (req, res) => {
  try {
    const { userId, status } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendee = event.attendees.find(a => a.user.toString() === userId);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    attendee.status = status;
    await event.save();

    // Update user's wallet if attended
    if (status === 'attended') {
      const user = await User.findById(userId);
      user.wallet += 10; // Award points for attendance
      await user.calculateLevel();
      await user.save();
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add feedback
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.canGiveFeedback(req.user._id)) {
      return res.status(400).json({ error: 'Cannot give feedback for this event' });
    }

    const feedback = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    event.feedbacks.push(feedback);
    await event.save();

    // Add to user's feedback given list and update wallet/level
    if (!req.user.feedbacksGiven.includes(event._id)) {
      req.user.feedbacksGiven.push(event._id);
      req.user.wallet += 5; // Award points for giving feedback
      await req.user.calculateLevel();
      await req.user.save();
    }

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unregister from event
router.post('/:id/unattend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'nickname');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'approved' && event.status !== 'upcoming') {
      return res.status(400).json({ error: 'Cannot unregister at this time' });
    }

    // Check if user is actually registered
    const attendeeIndex = event.attendees.findIndex(a => a.user.toString() === req.user._id.toString());
    
    if (attendeeIndex === -1) {
      return res.status(400).json({ error: 'You are not registered for this event' });
    }

    // Ensure all required fields are present before saving
    if (!event.creator) {
      event.creator = req.user._id;
    }
    
    if (!event.maxCapacity || event.maxCapacity <= 0) {
      event.maxCapacity = Math.max(50, event.attendees.length);
    }
    
    if (!event.location) {
      event.location = '1337 Campus';
    }

    // Remove user from attendees
    event.attendees.splice(attendeeIndex, 1);
    
    // Save the event with validation
    await event.save({ validateBeforeSave: true });

    // Remove event from user's attended events
    req.user.eventsAttended = req.user.eventsAttended.filter(e => e.toString() !== event._id.toString());
    await req.user.save();

    res.json({ 
      message: 'Successfully unregistered from event',
      event: {
        id: event._id,
        title: event.title,
        attendees: event.attendees.length,
        maxCapacity: event.maxCapacity
      }
    });
  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Admin: Update event
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'time', 'expectedTime', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    updates.forEach(update => event[update] = req.body[update]);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Delete event
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove event from all users' attended/feedback lists
    await User.updateMany(
      { $or: [{ eventsAttended: event._id }, { feedbacksGiven: event._id }] },
      { $pull: { eventsAttended: event._id, feedbacksGiven: event._id } }
    );

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get event statistics
router.get('/:id/stats', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'nickname email')
      .populate('feedbacks.user', 'nickname email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const stats = {
      totalAttendees: event.attendees.length,
      maxCapacity: event.maxCapacity,
      registeredCount: event.attendees.filter(a => a.status === 'registered').length,
      attendedCount: event.attendees.filter(a => a.status === 'attended').length,
      absentCount: event.attendees.filter(a => a.status === 'absent').length,
      averageRating: event.averageRating,
      feedbackCount: event.feedbacks.length,
      detailedAttendance: event.attendees
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply as volunteer
router.post('/:id/volunteer', auth, async (req, res) => {
  try {
    const { role, experience, motivation, timeCommitment } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.addVolunteer(req.user._id, role, {
      experience,
      motivation,
      timeCommitment
    });
    await event.save();

    res.json({ message: 'Volunteer application submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Manage volunteer applications
router.patch('/:id/volunteer/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.updateVolunteerStatus(req.params.userId, status);
    await event.save();

    // Notify user about volunteer application status
    console.log(`Volunteer application ${status} for event: ${event.title}`);

    res.json({ message: 'Volunteer status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get event volunteers
router.get('/:id/volunteers', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('volunteers.user', 'nickname email picture');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event.volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add discussion message
router.post('/:id/discuss', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.discussionEnabled) {
      return res.status(400).json({ error: 'Discussions are disabled for this event' });
    }

    event.discussions.push({
      user: req.user._id,
      message
    });

    await event.save();
    
    // Populate the user details for the new message
    const populatedEvent = await Event.findById(event._id)
      .populate('discussions.user', 'nickname picture');
    
    const newMessage = populatedEvent.discussions[populatedEvent.discussions.length - 1];
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get event discussions
router.get('/:id/discussions', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('discussions.user', 'nickname picture');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.discussionEnabled) {
      return res.status(400).json({ error: 'Discussions are disabled for this event' });
    }

    res.json(event.discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle event discussions
router.patch('/:id/discussions/toggle', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.discussionEnabled = !event.discussionEnabled;
    await event.save();

    res.json({ discussionEnabled: event.discussionEnabled });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Fix events with missing required fields (temporary utility)
router.post('/fix-events', auth, async (req, res) => {
  try {
    // Only allow admin to run this
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('Starting event fix process...');
    
    // Find all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events to check`);

    let fixedCount = 0;
    const fixedEvents = [];
    
    // Get a default admin user to assign as creator if missing
    const adminUser = await User.findOne({ role: 'admin' });
    const defaultCreatorId = adminUser ? adminUser._id : req.user._id;

    for (const event of events) {
      let needsUpdate = false;
      const updates = {};
      const issues = [];

      // Check and fix creator
      if (!event.creator) {
        updates.creator = defaultCreatorId;
        needsUpdate = true;
        issues.push('creator');
      }

      // Check and fix maxCapacity
      if (!event.maxCapacity || event.maxCapacity <= 0) {
        updates.maxCapacity = Math.max(50, event.attendees.length + 10);
        needsUpdate = true;
        issues.push('maxCapacity');
      }

      // Check and fix location
      if (!event.location || event.location.trim() === '') {
        updates.location = '1337 Campus';
        needsUpdate = true;
        issues.push('location');
      }

      // Check and fix other potential issues
      if (!event.description || event.description.trim() === '') {
        updates.description = 'Event description will be updated soon.';
        needsUpdate = true;
        issues.push('description');
      }

      if (!event.time) {
        updates.time = new Date();
        needsUpdate = true;
        issues.push('time');
      }

      if (!event.expectedTime || event.expectedTime <= 0) {
        updates.expectedTime = 2; // Default 2 hours
        needsUpdate = true;
        issues.push('expectedTime');
      }

      if (!event.category) {
        updates.category = 'other';
        needsUpdate = true;
        issues.push('category');
      }

      // Apply updates if needed
      if (needsUpdate) {
        try {
          await Event.findByIdAndUpdate(event._id, updates, { 
            runValidators: true,
            new: true 
          });
          fixedCount++;
          fixedEvents.push({
            id: event._id,
            title: event.title,
            issues: issues
          });
          console.log(`Fixed event: ${event.title} (issues: ${issues.join(', ')})`);
        } catch (error) {
          console.error(`Failed to fix event ${event.title}:`, error.message);
        }
      }
    }

    const result = {
      message: `Fixed ${fixedCount} events out of ${events.length} total events`,
      totalEvents: events.length,
      fixedCount,
      fixedEvents
    };

    console.log('Event fix process completed:', result.message);
    res.json(result);

  } catch (error) {
    console.error('Error fixing events:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
