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
      }
    },
    timezone: {
      type: String,
      default: 'Africa/Casablanca'
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

const User = mongoose.model('User', userSchema);
module.exports = User;
