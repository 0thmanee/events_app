const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Notification identification
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['event_created', 'event_reminder', 'event_approved', 'event_cancelled', 'general', 'system'],
    required: true
  },
  
  // Targeting
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    },
    delivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date
    }
  }],
  
  // Related data
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Notification metadata
  data: {
    type: Object,
    default: {}
  },
  
  // Scheduling
  scheduledFor: {
    type: Date
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date
  },
  
  // Push notification settings
  pushNotification: {
    enabled: {
      type: Boolean,
      default: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    error: {
      type: String
    }
  },
  
  // In-app notification settings
  inAppNotification: {
    enabled: {
      type: Boolean,
      default: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    actionUrl: {
      type: String
    },
    actionText: {
      type: String
    }
  },
  
  // System fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
notificationSchema.index({ 'recipients.user': 1, createdAt: -1 });
notificationSchema.index({ type: 1, scheduledFor: 1 });
notificationSchema.index({ sent: 1, scheduledFor: 1 });
notificationSchema.index({ relatedEvent: 1 });

// Update timestamp on save
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
notificationSchema.methods.markAsRead = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient) {
    recipient.read = true;
    recipient.readAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.markAsDelivered = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient) {
    recipient.delivered = true;
    recipient.deliveredAt = new Date();
  }
  return this.save();
};

// Static methods for creating notifications
notificationSchema.statics.createEventNotification = async function(eventId, type, customMessage = null) {
  const Event = mongoose.model('Event');
  const User = mongoose.model('User');
  
  const event = await Event.findById(eventId).populate('creator');
  if (!event) throw new Error('Event not found');
  
  let title, message, recipients;
  
  switch (type) {
    case 'event_created':
      title = '🎉 New Event Available!';
      message = customMessage || `"${event.title}" has been created. Check it out!`;
      // Send to all users
      recipients = await User.find({}, '_id');
      break;
      
    case 'event_reminder':
      title = '⏰ Event Reminder';
      message = customMessage || `Don't forget! "${event.title}" is coming up soon.`;
      // Send only to registered users
      recipients = event.attendees.map(attendee => ({ _id: attendee.user }));
      break;
      
    case 'event_approved':
      title = '✅ Event Approved';
      message = customMessage || `Your event "${event.title}" has been approved!`;
      recipients = [{ _id: event.creator._id }];
      break;
      
    case 'event_cancelled':
      title = '❌ Event Cancelled';
      message = customMessage || `Unfortunately, "${event.title}" has been cancelled.`;
      recipients = event.attendees.map(attendee => ({ _id: attendee.user }));
      break;
      
    default:
      throw new Error('Invalid notification type');
  }
  
  const notificationData = {
    title,
    message,
    type,
    recipients: recipients.map(user => ({
      user: user._id,
      read: false,
      delivered: false
    })),
    relatedEvent: eventId,
    data: {
      eventId: eventId,
      eventTitle: event.title,
      eventDate: event.time
    },
    inAppNotification: {
      enabled: true,
      priority: type === 'event_reminder' ? 'high' : 'medium',
      actionUrl: `/event-details/${eventId}`,
      actionText: 'View Event'
    },
    pushNotification: {
      enabled: true,
      sent: false
    }
  };
  
  const notification = new this(notificationData);
  await notification.save();
  
  // Send push notifications immediately after creating the notification
  try {
    console.log(`🚀 Triggering push notifications for: ${title}`);
    await this.sendPushNotificationsForNotification(notification);
  } catch (pushError) {
    console.error('❌ Failed to send push notifications:', pushError);
    notification.pushNotification.error = pushError.message;
    await notification.save();
  }
  
  return notification;
};

// Helper method to send push notifications for a notification
notificationSchema.statics.sendPushNotificationsForNotification = async function(notification) {
  const PushNotificationService = require('../services/PushNotificationService');
  const User = mongoose.model('User');
  
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
};

module.exports = mongoose.model('Notification', notificationSchema); 