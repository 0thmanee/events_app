const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.intraId; // Password only required if not using 42 auth
    }
  },
  intraId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  intraUsername: {
    type: String,
    sparse: true
  },
  intraEmail: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'student', 'staff', 'admin'],
    default: 'user'
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: null
  },
  wallet: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  eventsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  feedbacksGiven: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  settings: {
    language: {
      type: String,
      enum: ['en', 'fr'],
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      eventReminders: {
        type: Boolean,
        default: true
      },
      eventStarting: {
        type: Boolean,
        default: true
      },
      newEvents: {
        type: Boolean,
        default: true
      },
      eventChanges: {
        type: Boolean,
        default: true
      },
      pushEnabled: {
        type: Boolean,
        default: true
      }
    },
    timezone: {
      type: String,
      default: 'Africa/Casablanca'
    }
  },
  
  // Device tokens for push notifications
  deviceTokens: [{
    token: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      required: true
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    active: {
      type: Boolean,
      default: true
    }
  }],
  
  // Push notification preferences
  pushNotificationSettings: {
    enabled: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    },
    newEvents: {
      type: Boolean,
      default: true
    },
    eventApproved: {
      type: Boolean,
      default: true
    },
    eventCancelled: {
      type: Boolean,
      default: true
    },
    eventFeedback: {
      type: Boolean,
      default: true
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false
      },
      startTime: {
        type: String,
        default: '22:00'
      },
      endTime: {
        type: String,
        default: '08:00'
      }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Ensure arrays are always initialized
  if (!this.eventsAttended || !Array.isArray(this.eventsAttended)) {
    this.eventsAttended = [];
  }
  if (!this.feedbacksGiven || !Array.isArray(this.feedbacksGiven)) {
    this.feedbacksGiven = [];
  }
  
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level based on events attended and feedbacks
userSchema.methods.calculateLevel = function() {
  // Ensure arrays are defined before accessing length
  const eventsAttended = this.eventsAttended || [];
  const feedbacksGiven = this.feedbacksGiven || [];
  
  const eventsPoints = eventsAttended.length * 10;
  const feedbackPoints = feedbacksGiven.length * 5;
  const totalPoints = eventsPoints + feedbackPoints;
  
  // Every 50 points = 1 level
  this.level = Math.floor(totalPoints / 50) + 1;
  return this.level;
};

// Method to add or update device token
userSchema.methods.addDeviceToken = function(token, platform) {
  if (!token || !platform) return;
  
  // Initialize deviceTokens array if not exists
  if (!this.deviceTokens) {
    this.deviceTokens = [];
  }
  
  // Check if token already exists
  const existingToken = this.deviceTokens.find(dt => dt.token === token);
  
  if (existingToken) {
    // Update existing token
    existingToken.lastUsed = new Date();
    existingToken.active = true;
    existingToken.platform = platform;
  } else {
    // Add new token
    this.deviceTokens.push({
      token,
      platform,
      lastUsed: new Date(),
      active: true
    });
  }
  
  // Keep only the 5 most recent tokens per platform
  const platformTokens = this.deviceTokens.filter(dt => dt.platform === platform);
  if (platformTokens.length > 5) {
    platformTokens.sort((a, b) => b.lastUsed - a.lastUsed);
    const tokensToRemove = platformTokens.slice(5);
    this.deviceTokens = this.deviceTokens.filter(dt => !tokensToRemove.includes(dt));
  }
};

// Method to remove device token
userSchema.methods.removeDeviceToken = function(token) {
  if (!this.deviceTokens) return;
  
  this.deviceTokens = this.deviceTokens.filter(dt => dt.token !== token);
};

// Method to get active device tokens
userSchema.methods.getActiveDeviceTokens = function() {
  if (!this.deviceTokens) return [];
  
  // Filter active tokens and remove old ones (older than 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.deviceTokens
    .filter(dt => dt.active && dt.lastUsed > thirtyDaysAgo)
    .map(dt => dt.token);
};

// Method to check if user wants specific notification type
userSchema.methods.wantsPushNotification = function(notificationType) {
  // Check if push notifications are globally enabled
  if (!this.pushNotificationSettings?.enabled) return false;
  
  // Check specific notification type preference
  switch (notificationType) {
    case 'event_reminder':
      return this.pushNotificationSettings?.eventReminders !== false;
    case 'event_created':
      return this.pushNotificationSettings?.newEvents !== false;
    case 'event_approved':
      return this.pushNotificationSettings?.eventApproved !== false;
    case 'event_cancelled':
      return this.pushNotificationSettings?.eventCancelled !== false;
    case 'event_feedback':
      return this.pushNotificationSettings?.eventFeedback !== false;
    default:
      return true;
  }
};

// Method to check if it's quiet hours
userSchema.methods.isQuietHours = function() {
  if (!this.pushNotificationSettings?.quietHours?.enabled) return false;
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const startTime = this.pushNotificationSettings.quietHours.startTime || '22:00';
  const endTime = this.pushNotificationSettings.quietHours.endTime || '08:00';
  
  // Handle quiet hours that span midnight
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
