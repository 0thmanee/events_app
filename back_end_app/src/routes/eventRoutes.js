const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Check if user is admin middleware
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

// Create event
router.post('/', auth, async (req, res) => {
  try {
    // Check if the creator is admin or obouchta (for testing)
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    const isAdminUser = req.user.role === 'admin' || isTestUser;
    
    const event = new Event({
      ...req.body,
      creator: req.user._id,
      // Automatically approve events created by admins
      status: isAdminUser ? 'approved' : 'pending'
    });
    
    await event.save();
    
    // Log event creation status
    if (isAdminUser) {
      console.log(`✅ Admin event auto-approved: ${event.title}`);
      
      // Send notification to all users for approved events
      try {
        await Notification.createEventNotification(event._id, 'event_created');
        console.log(`📱 Notification sent to all users for event: ${event.title}`);
      } catch (notificationError) {
        console.error('Failed to send event notification:', notificationError);
      }
    } else {
      console.log(`⏳ Event created and pending approval: ${event.title}`);
    }
    
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

    // Send notifications about newly approved event
    try {
      // Notify creator that their event was approved
      await Notification.createEventNotification(event._id, 'event_approved');
      
      // Notify all users about the new approved event
      await Notification.createEventNotification(event._id, 'event_created');
      
      console.log(`📱 Notifications sent for approved event: ${event.title}`);
    } catch (notificationError) {
      console.error('Failed to send approval notifications:', notificationError);
    }

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
    const isTestUser = req.user?.intraUsername === 'obouchta' || req.user?.nickname === 'obouchta';
    if (!req.user?.role === 'admin' && !isTestUser) {
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

// Get events available for feedback (with 5-minute delay and role restrictions)
router.get('/feedback-available', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // Staff cannot give feedback
    if (userRole === 'staff' || userRole === 'admin') {
      return res.json([]);
    }
    
    const now = new Date();
    
    // Find events where user attended
    const attendedEvents = await Event.find({
      'attendees.user': userId,
      'attendees.status': 'attended',
      'feedbacks.user': { $ne: userId } // User hasn't given feedback yet
    })
    .populate('attendees.user', 'nickname')
    .sort({ time: -1 });

    // Filter events that are available for feedback (5 minutes after event ends)
    const availableForFeedback = attendedEvents.filter(event => {
      const eventEndTime = new Date(event.time.getTime() + (event.expectedTime * 60 * 1000));
      const feedbackAvailableTime = new Date(eventEndTime.getTime() + (5 * 60 * 1000));
      return now >= feedbackAvailableTime;
    });

    // Add timing info to each event
    const eventsWithTiming = availableForFeedback.map(event => {
      const eventEndTime = new Date(event.time.getTime() + (event.expectedTime * 60 * 1000));
      const feedbackAvailableTime = new Date(eventEndTime.getTime() + (5 * 60 * 1000));
      
      return {
        ...event.toJSON(),
        eventEndTime,
        feedbackAvailableTime,
        canGiveFeedbackNow: now >= feedbackAvailableTime
      };
    });

    res.json(eventsWithTiming);
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

// Add feedback with enhanced validation and role checking
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (comment.trim().length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters long' });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user can give feedback (includes timing and role checks)
    if (!event.canGiveFeedback(req.user._id, req.user.role)) {
      // Provide specific error messages
      if (req.user.role === 'staff' || req.user.role === 'admin') {
        return res.status(403).json({ error: 'Staff members cannot provide feedback on events' });
      }
      
      const now = new Date();
      const eventEndTime = new Date(event.time.getTime() + (event.expectedTime * 60 * 1000));
      const feedbackAvailableTime = new Date(eventEndTime.getTime() + (5 * 60 * 1000));
      
      if (now < feedbackAvailableTime) {
        const timeLeft = Math.ceil((feedbackAvailableTime - now) / (1000 * 60)); // minutes
        return res.status(400).json({ 
          error: `Feedback will be available ${timeLeft} minute(s) after the event ends`,
          feedbackAvailableAt: feedbackAvailableTime.toISOString()
        });
      }
      
      const attendee = event.attendees.find(a => a.user.toString() === req.user._id.toString());
      if (!attendee) {
        return res.status(400).json({ error: 'You must attend the event to give feedback' });
      }
      
      if (attendee.status !== 'attended') {
        return res.status(400).json({ error: 'You must have attended the event to give feedback' });
      }
      
      const hasGivenFeedback = event.feedbacks.some(f => f.user.toString() === req.user._id.toString());
      if (hasGivenFeedback) {
        return res.status(400).json({ error: 'You have already provided feedback for this event' });
      }
    }

    const feedback = {
      user: req.user._id,
      rating: parseInt(rating),
      comment: comment.trim()
    };

    event.feedbacks.push(feedback);
    await event.save();

    // Add to user's feedback given list and update wallet/level
    const user = await User.findById(req.user._id);
    if (!user.feedbacksGiven.includes(event._id)) {
      user.feedbacksGiven.push(event._id);
      user.wallet += 5; // Award points for giving feedback
      await user.calculateLevel();
      await user.save();
    }

    // Populate the feedback with user details for response
    const populatedFeedback = await Event.findById(req.params.id)
      .populate('feedbacks.user', 'nickname picture')
      .then(e => e.feedbacks[e.feedbacks.length - 1]);

    console.log(`✅ Feedback submitted by ${req.user.nickname} for event: ${event.title}`);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: populatedFeedback,
      pointsEarned: 5
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: error.message });
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

// ========== STAFF ATTENDANCE MANAGEMENT ==========

// Get event attendance list (staff only)
router.get('/:id/attendance', auth, async (req, res) => {
  try {
    // Check if user is staff or admin (with temporary bypass for testing)
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Staff or admin access required' });
    }

    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'nickname email intraUsername')
      .populate('creator', 'nickname');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Transform attendees data for frontend
    const attendees = event.attendees.map(attendee => ({
      _id: attendee.user._id,
      userId: attendee.user._id,
      name: attendee.user.nickname,
      nickname: attendee.user.nickname,
      login: attendee.user.intraUsername,
      intraUsername: attendee.user.intraUsername,
      email: attendee.user.email,
      checkedIn: attendee.status === 'attended' || attendee.status === 'checked_in',
      checkInTime: attendee.checkInTime || null,
      status: attendee.status,
      registrationTime: attendee.registrationTime || attendee.createdAt
    }));

    res.json({
      attendees,
      eventInfo: {
        title: event.title,
        time: event.time,
        location: event.location,
        capacity: event.maxCapacity,
        registered: event.attendees.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify student registration by QR code (staff only)
router.post('/:id/verify-registration', auth, async (req, res) => {
  try {
    // Check if user is staff or admin (with temporary bypass for testing)
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Staff or admin access required' });
    }

    const { userId, qrData } = req.body;
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'nickname email intraUsername');
    
    if (!event) {
      return res.json({
        registered: false,
        studentName: 'Unknown Student',
        reason: 'Event not found'
      });
    }

    // Find the attendee
    const attendee = event.attendees.find(a => a.user._id.toString() === userId);
    const user = attendee ? attendee.user : await User.findById(userId);

    if (!attendee) {
      return res.json({
        registered: false,
        studentName: user ? user.nickname : 'Unknown Student',
        reason: 'Student is not registered for this event'
      });
    }

    return res.json({
      registered: true,
      studentName: user.nickname,
      studentEmail: user.email,
      studentLogin: user.intraUsername,
      registrationStatus: attendee.status,
      alreadyCheckedIn: attendee.status === 'attended' || attendee.status === 'checked_in'
    });
  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check-in student via QR scan (staff only)
router.post('/:id/check-in', auth, async (req, res) => {
  try {
    // Check if user is staff or admin (with temporary bypass for testing)
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Staff or admin access required' });
    }

    const { userId, qrData, checkInTime } = req.body;
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'nickname email intraUsername');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the attendee
    const attendeeIndex = event.attendees.findIndex(a => a.user._id.toString() === userId);
    
    if (attendeeIndex === -1) {
      return res.status(400).json({ error: 'Student is not registered for this event' });
    }

    const attendee = event.attendees[attendeeIndex];
    const wasAlreadyCheckedIn = attendee.status === 'attended' || attendee.status === 'checked_in';

    // Update attendee status
    event.attendees[attendeeIndex].status = 'attended';
    event.attendees[attendeeIndex].checkInTime = checkInTime || new Date().toISOString();
    
    await event.save();

    // Award points if this is first check-in
    if (!wasAlreadyCheckedIn) {
      const user = await User.findById(userId);
      if (user) {
        user.wallet += 10; // Award points for attendance
        await user.calculateLevel();
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Student checked in successfully',
      studentName: attendee.user.nickname,
      checkInTime: event.attendees[attendeeIndex].checkInTime,
      alreadyCheckedIn: wasAlreadyCheckedIn,
      pointsAwarded: wasAlreadyCheckedIn ? 0 : 10
    });
  } catch (error) {
    console.error('Check-in error:', error);
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

// Staff/Admin: Get all feedbacks for events
router.get('/feedbacks/all', auth, async (req, res) => {
  try {
    // Check if user is staff or admin
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Access denied. Staff/Admin only.' });
    }

    const { page = 1, limit = 20, eventId, rating } = req.query;
    const skip = (page - 1) * limit;

    let matchCondition = {};
    
    // Filter by specific event if provided
    if (eventId) {
      matchCondition._id = eventId;
    }

    // Get events with feedbacks
    const events = await Event.find(matchCondition)
      .populate('feedbacks.user', 'nickname picture email intraUsername')
      .populate('creator', 'nickname')
      .select('title time location feedbacks averageRating attendees category')
      .sort({ 'feedbacks.createdAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter events that have feedbacks
    const eventsWithFeedbacks = events.filter(event => event.feedbacks && event.feedbacks.length > 0);

    // Flatten feedbacks with event info and apply rating filter if provided
    let allFeedbacks = [];
    
    eventsWithFeedbacks.forEach(event => {
      event.feedbacks.forEach(feedback => {
        if (!rating || feedback.rating == rating) {
          allFeedbacks.push({
            _id: feedback._id,
            rating: feedback.rating,
            comment: feedback.comment,
            createdAt: feedback.createdAt,
            user: feedback.user,
            event: {
              _id: event._id,
              title: event.title,
              time: event.time,
              location: event.location,
              category: event.category,
              creator: event.creator,
              averageRating: event.averageRating,
              totalAttendees: event.attendees.length
            }
          });
        }
      });
    });

    // Sort by creation date (newest first)
    allFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate statistics
    const stats = {
      totalFeedbacks: allFeedbacks.length,
      averageRating: allFeedbacks.length > 0 
        ? (allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length).toFixed(1)
        : 0,
      ratingDistribution: {
        1: allFeedbacks.filter(f => f.rating === 1).length,
        2: allFeedbacks.filter(f => f.rating === 2).length,
        3: allFeedbacks.filter(f => f.rating === 3).length,
        4: allFeedbacks.filter(f => f.rating === 4).length,
        5: allFeedbacks.filter(f => f.rating === 5).length
      },
      eventsWithFeedback: eventsWithFeedbacks.length
    };

    res.json({
      feedbacks: allFeedbacks.slice(0, parseInt(limit)),
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allFeedbacks.length,
        hasMore: allFeedbacks.length > parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Staff/Admin: Get feedback summary for a specific event
router.get('/:id/feedbacks', auth, async (req, res) => {
  try {
    // Check if user is staff or admin
    const isTestUser = req.user.intraUsername === 'obouchta' || req.user.nickname === 'obouchta';
    if (req.user.role !== 'staff' && req.user.role !== 'admin' && !isTestUser) {
      return res.status(403).json({ error: 'Access denied. Staff/Admin only.' });
    }

    const event = await Event.findById(req.params.id)
      .populate('feedbacks.user', 'nickname picture email intraUsername')
      .populate('creator', 'nickname')
      .populate('attendees.user', 'nickname');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const feedbacks = event.feedbacks || [];
    
    // Calculate detailed statistics
    const stats = {
      eventInfo: {
        title: event.title,
        time: event.time,
        location: event.location,
        category: event.category,
        creator: event.creator,
        totalAttendees: event.attendees.length,
        attendedCount: event.attendees.filter(a => a.status === 'attended').length
      },
      feedbackStats: {
        totalFeedbacks: feedbacks.length,
        averageRating: event.averageRating,
        feedbackRate: event.attendees.length > 0 
          ? ((feedbacks.length / event.attendees.filter(a => a.status === 'attended').length) * 100).toFixed(1)
          : 0,
        ratingDistribution: {
          1: feedbacks.filter(f => f.rating === 1).length,
          2: feedbacks.filter(f => f.rating === 2).length,
          3: feedbacks.filter(f => f.rating === 3).length,
          4: feedbacks.filter(f => f.rating === 4).length,
          5: feedbacks.filter(f => f.rating === 5).length
        }
      },
      feedbacks: feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching event feedbacks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint: Trigger event notification manually (for testing)
router.post('/:id/test-notification', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Manually trigger event notification
    const notification = await Notification.createEventNotification(event._id, 'event_created', 
      `🧪 TEST: "${event.title}" - This is a test notification to all users!`);

    res.json({
      message: 'Test notification sent successfully',
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        recipientCount: notification.recipients.length,
        pushSent: notification.pushNotification.sent
      }
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
