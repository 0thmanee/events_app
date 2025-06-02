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
      eventDate: event.date
    },
    inAppNotification: {
      enabled: true,
      priority: type === 'event_reminder' ? 'high' : 'medium',
      actionUrl: `/event-details/${eventId}`,
      actionText: 'View Event'
    }
  };
  
  const notification = new this(notificationData);
  await notification.save();
  
  return notification;
};

module.exports = mongoose.model('Notification', notificationSchema); 