const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  newUsers: {
    type: Number,
    default: 0
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  totalEvents: {
    type: Number,
    default: 0
  },
  eventsByCategory: {
    workshop: { type: Number, default: 0 },
    talk: { type: Number, default: 0 },
    coding_night: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalAttendance: {
    type: Number,
    default: 0
  },
  feedbacksReceived: {
    type: Number,
    default: 0
  },
  averageEventRating: {
    type: Number,
    default: 0
  },
  coinsEarned: {
    type: Number,
    default: 0
  },
  coinsSpent: {
    type: Number,
    default: 0
  },
  customizationRequests: {
    total: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 }
  },
  volunteerApplications: {
    total: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 }
  }
});

const eventAnalyticsSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  registrationCount: {
    type: Number,
    default: 0
  },
  attendanceRate: {
    type: Number,
    default: 0
  },
  feedbackCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  volunteerStats: {
    applications: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 }
  },
  discussionCount: {
    type: Number,
    default: 0
  }
});

const userEngagementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventsRegistered: {
    type: Number,
    default: 0
  },
  eventsAttended: {
    type: Number,
    default: 0
  },
  feedbacksGiven: {
    type: Number,
    default: 0
  },
  volunteerApplications: {
    type: Number,
    default: 0
  },
  coinsEarned: {
    type: Number,
    default: 0
  },
  coinsSpent: {
    type: Number,
    default: 0
  },
  customizationRequests: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

const analyticsSchema = new mongoose.Schema({
  dailyStats: [dailyStatsSchema],
  eventAnalytics: [eventAnalyticsSchema],
  userEngagement: [userEngagementSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Method to update daily stats
analyticsSchema.methods.updateDailyStats = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get daily stats
  const events = await mongoose.model('Event').find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });

  const users = await mongoose.model('User').find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });

  const feedbacks = await mongoose.model('Event').aggregate([
    { $unwind: '$feedbacks' },
    { $match: { 'feedbacks.createdAt': { $gte: startOfDay, $lte: endOfDay } } }
  ]);

  // Calculate stats
  const stats = {
    date: startOfDay,
    newUsers: users.length,
    totalEvents: events.length,
    eventsByCategory: events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {
      workshop: 0,
      talk: 0,
      coding_night: 0,
      social: 0,
      other: 0
    }),
    feedbacksReceived: feedbacks.length
  };

  // Update or create daily stats
  const existingStats = this.dailyStats.find(s => s.date.getTime() === startOfDay.getTime());
  if (existingStats) {
    Object.assign(existingStats, stats);
  } else {
    this.dailyStats.push(stats);
  }
};

// Method to update event analytics
analyticsSchema.methods.updateEventAnalytics = async function(eventId) {
  const event = await mongoose.model('Event').findById(eventId);
  if (!event) return;

  const analytics = {
    eventId: event._id,
    title: event.title,
    category: event.category,
    date: event.time,
    registrationCount: event.attendees.length,
    attendanceRate: event.attendees.filter(a => a.status === 'attended').length / event.attendees.length,
    feedbackCount: event.feedbacks.length,
    averageRating: event.averageRating,
    volunteerStats: {
      applications: event.volunteers.length,
      approved: event.volunteers.filter(v => v.status === 'approved').length,
      rejected: event.volunteers.filter(v => v.status === 'rejected').length
    },
    discussionCount: event.discussions.length
  };

  const existingAnalytics = this.eventAnalytics.find(a => a.eventId.toString() === eventId);
  if (existingAnalytics) {
    Object.assign(existingAnalytics, analytics);
  } else {
    this.eventAnalytics.push(analytics);
  }
};

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
