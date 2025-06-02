const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const PushNotificationService = require('../services/PushNotificationService');

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

// Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;
    
    let matchCondition = {
      'recipients.user': req.user._id
    };
    
    if (unreadOnly === 'true') {
      matchCondition['recipients.read'] = false;
    }
    
    const notifications = await Notification.find(matchCondition)
      .populate('relatedEvent', 'title date location')
      .populate('createdBy', 'nickname picture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Transform notifications to include user-specific read status
    const userNotifications = notifications.map(notification => {
      const recipient = notification.recipients.find(r => 
        r.user.toString() === req.user._id.toString()
      );
      
      return {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedEvent: notification.relatedEvent,
        createdBy: notification.createdBy,
        data: notification.data,
        inAppNotification: notification.inAppNotification,
        createdAt: notification.createdAt,
        read: recipient ? recipient.read : false,
        readAt: recipient ? recipient.readAt : null,
        delivered: recipient ? recipient.delivered : false,
        deliveredAt: recipient ? recipient.deliveredAt : null
      };
    });
    
    // Get unread count
    const unreadCount = await Notification.countDocuments({
      'recipients.user': req.user._id,
      'recipients.read': false
    });
    
    res.json({
      notifications: userNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: userNotifications.length,
        hasMore: userNotifications.length === parseInt(limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      'recipients.user': req.user._id,
      'recipients.read': false
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    await notification.markAsRead(req.user._id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { 'recipients.user': req.user._id },
      { 
        $set: { 
          'recipients.$.read': true,
          'recipients.$.readAt': new Date()
        }
      }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create custom notification
router.post('/create', auth, isAdmin, async (req, res) => {
  try {
    const { title, message, type = 'general', targetUsers, relatedEvent } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    let recipients;
    if (targetUsers && targetUsers.length > 0) {
      // Send to specific users
      recipients = targetUsers.map(userId => ({
        user: userId,
        read: false,
        delivered: false
      }));
    } else {
      // Send to all users
      const allUsers = await User.find({}, '_id');
      recipients = allUsers.map(user => ({
        user: user._id,
        read: false,
        delivered: false
      }));
    }
    
    const notification = new Notification({
      title,
      message,
      type,
      recipients,
      relatedEvent,
      createdBy: req.user._id,
      inAppNotification: {
        enabled: true,
        priority: req.body.priority || 'medium',
        actionUrl: req.body.actionUrl,
        actionText: req.body.actionText
      }
    });
    
    await notification.save();
    
    // Send push notifications if enabled
    if (req.body.sendPush !== false) {
      await sendPushNotifications(notification);
    }
    
    res.status(201).json({ 
      message: 'Notification created successfully',
      notification: {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        recipientCount: recipients.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all notifications
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;
    
    let matchCondition = {};
    if (type && type !== 'all') {
      matchCondition.type = type;
    }
    
    const notifications = await Notification.find(matchCondition)
      .populate('relatedEvent', 'title date')
      .populate('createdBy', 'nickname picture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalCount = await Notification.countDocuments(matchCondition);
    
    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + notifications.length < totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete notification
router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send event reminders (called by scheduler)
router.post('/send-reminders', auth, isAdmin, async (req, res) => {
  try {
    const { hours = 24 } = req.body; // Default 24 hours before event
    
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + hours);
    
    // Find events happening within the specified time frame
    const upcomingEvents = await Event.find({
      date: {
        $gte: new Date(),
        $lte: reminderTime
      },
      status: 'approved',
      'attendees.0': { $exists: true } // Has at least one attendee
    });
    
    let remindersSent = 0;
    
    for (const event of upcomingEvents) {
      // Check if reminder already sent for this event
      const existingReminder = await Notification.findOne({
        relatedEvent: event._id,
        type: 'event_reminder'
      });
      
      if (!existingReminder) {
        await Notification.createEventNotification(event._id, 'event_reminder');
        remindersSent++;
      }
    }
    
    res.json({ 
      message: `Event reminders processed successfully`,
      remindersSent,
      eventsChecked: upcomingEvents.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to send push notifications using Firebase
async function sendPushNotifications(notification) {
  try {
    console.log(`🚀 Starting push notification process for: ${notification.title}`);
    
    // Get all recipient user IDs
    const recipientIds = notification.recipients.map(r => r.user);
    
    // Fetch users with their device tokens and push preferences
    const users = await User.find({ 
      _id: { $in: recipientIds } 
    }).select('deviceTokens pushNotificationSettings nickname');
    
    console.log(`👥 Found ${users.length} users to potentially notify`);
    
    let totalSent = 0;
    let totalFailed = 0;
    const failedUsers = [];
    
    for (const user of users) {
      try {
        // Check if user wants this type of notification
        if (!user.wantsPushNotification(notification.type)) {
          console.log(`⏭️ User ${user.nickname} has disabled ${notification.type} notifications`);
          continue;
        }
        
        // Check quiet hours
        if (user.isQuietHours()) {
          console.log(`🔇 User ${user.nickname} is in quiet hours`);
          continue;
        }
        
        // Get active device tokens
        const deviceTokens = user.getActiveDeviceTokens();
        if (deviceTokens.length === 0) {
          console.log(`📱 No active device tokens for user ${user.nickname}`);
          continue;
        }
        
        console.log(`📱 Sending to ${deviceTokens.length} devices for user ${user.nickname}`);
        
        // Prepare notification data
        const pushData = {
          notificationId: notification._id,
          type: notification.type,
          actionUrl: notification.inAppNotification?.actionUrl || '',
          eventId: notification.data?.eventId || '',
          eventTitle: notification.data?.eventTitle || '',
          timestamp: new Date().toISOString()
        };
        
        // Send to multiple devices
        const result = await PushNotificationService.sendToMultipleDevices(
          deviceTokens,
          {
            title: notification.title,
            message: notification.message
          },
          pushData
        );
        
        if (result.success) {
          totalSent += result.successCount || 1;
          console.log(`✅ Successfully sent to ${result.successCount || 1} devices for ${user.nickname}`);
        } else {
          totalFailed += deviceTokens.length;
          failedUsers.push({
            userId: user._id,
            nickname: user.nickname,
            error: result.error
          });
          console.log(`❌ Failed to send to ${user.nickname}: ${result.error}`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (userError) {
        totalFailed++;
        failedUsers.push({
          userId: user._id,
          nickname: user.nickname,
          error: userError.message
        });
        console.error(`❌ Error sending to user ${user.nickname}:`, userError.message);
      }
    }
    
    // Update notification status
    const success = totalSent > 0;
    notification.pushNotification.sent = success;
    notification.pushNotification.sentAt = new Date();
    
    if (!success && totalFailed > 0) {
      notification.pushNotification.error = `Failed to send to ${totalFailed} recipients`;
    } else if (failedUsers.length > 0) {
      notification.pushNotification.error = `Partial failure: ${failedUsers.length} failed recipients`;
    }
    
    await notification.save();
    
    console.log(`📊 Push notification summary for "${notification.title}":`);
    console.log(`   ✅ Successfully sent: ${totalSent}`);
    console.log(`   ❌ Failed: ${totalFailed}`);
    console.log(`   👥 Total users processed: ${users.length}`);
    
    if (failedUsers.length > 0) {
      console.log(`   Failed users:`, failedUsers.map(u => `${u.nickname} (${u.error})`));
    }
    
    return {
      success,
      totalSent,
      totalFailed,
      failedUsers
    };
    
  } catch (error) {
    console.error('❌ Push notification service error:', error);
    
    // Update notification with error
    notification.pushNotification.sent = false;
    notification.pushNotification.error = error.message;
    await notification.save();
    
    return {
      success: false,
      totalSent: 0,
      totalFailed: 1,
      error: error.message
    };
  }
}

module.exports = router; 