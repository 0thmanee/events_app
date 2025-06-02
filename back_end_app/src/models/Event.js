const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['workshop', 'talk', 'vibe_coding', 'social', 'other'],
    default: 'other'
  },
  volunteers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['helper', 'organizer', 'technical_support'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    application: {
      experience: String,
      motivation: String,
      timeCommitment: String
    }
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    required: true
  },
  expectedTime: {
    type: Number,
    required: true,
    min: 0
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'absent', 'checked_in'],
      default: 'registered'
    },
    checkInTime: {
      type: Date
    }
  }],
  feedbacks: [feedbackSchema],
  location: {
    type: String,
    required: true,
    trim: true
  },
  speakers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    picture: {
      type: String
    }
  }],
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  rewardPoints: {
    type: Number,
    default: 15,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  tags: [String],
  discussionEnabled: {
    type: Boolean,
    default: true
  },
  discussions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notificationsSent: {
    reminder: {
      type: Boolean,
      default: false
    },
    startingSoon: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to ensure arrays are initialized
eventSchema.pre('save', function(next) {
  // Ensure arrays are always initialized
  if (!this.attendees || !Array.isArray(this.attendees)) {
    this.attendees = [];
  }
  if (!this.feedbacks || !Array.isArray(this.feedbacks)) {
    this.feedbacks = [];
  }
  if (!this.volunteers || !Array.isArray(this.volunteers)) {
    this.volunteers = [];
  }
  if (!this.speakers || !Array.isArray(this.speakers)) {
    this.speakers = [];
  }
  if (!this.tags || !Array.isArray(this.tags)) {
    this.tags = [];
  }
  if (!this.discussions || !Array.isArray(this.discussions)) {
    this.discussions = [];
  }
  next();
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return (this.attendees || []).length;
});

// Virtual for average rating
eventSchema.virtual('averageRating').get(function() {
  const feedbacks = this.feedbacks || [];
  if (feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return (sum / feedbacks.length).toFixed(1);
});

// Method to check if user can give feedback
eventSchema.methods.canGiveFeedback = function(userId, userRole) {
  // Staff members cannot give feedback
  if (userRole === 'staff' || userRole === 'admin') {
    return false;
  }
  
  const now = new Date();
  const eventEndTime = new Date(this.time.getTime() + (this.expectedTime * 60 * 1000)); // event time + duration in minutes
  const feedbackAvailableTime = new Date(eventEndTime.getTime() + (5 * 60 * 1000)); // 5 minutes after event ends
  
  // Check if feedback period has started (5 minutes after event ends)
  if (now < feedbackAvailableTime) {
    return false;
  }
  
  // Check if user attended the event
  const attendees = this.attendees || [];
  const attendee = attendees.find(a => a.user.toString() === userId.toString());
  if (!attendee || attendee.status !== 'attended') {
    return false;
  }
  
  // Check if user hasn't already given feedback
  const feedbacks = this.feedbacks || [];
  const hasGivenFeedback = feedbacks.some(f => f.user.toString() === userId.toString());
  
  return !hasGivenFeedback;
};

// Method to add volunteer
eventSchema.methods.addVolunteer = async function(userId, role, application) {
  const volunteers = this.volunteers || [];
  if (!volunteers.some(v => v.user.toString() === userId.toString())) {
    if (!this.volunteers) this.volunteers = [];
    this.volunteers.push({
      user: userId,
      role,
      application
    });
  }
};

// Method to handle volunteer status
eventSchema.methods.updateVolunteerStatus = async function(userId, status) {
  const volunteers = this.volunteers || [];
  const volunteer = volunteers.find(v => v.user.toString() === userId.toString());
  if (volunteer) {
    volunteer.status = status;
  }
};

// Method to get volunteers by status
eventSchema.methods.getVolunteers = function(status) {
  const volunteers = this.volunteers || [];
  return volunteers.filter(v => v.status === status);
};

// Method to add attendee
eventSchema.methods.addAttendee = function(userId) {
  const attendees = this.attendees || [];
  if (!attendees.some(a => a.user.toString() === userId.toString())) {
    if (!this.attendees) this.attendees = [];
    this.attendees.push({ user: userId });
  }
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
