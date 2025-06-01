const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

// Get global leaderboard
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, {
      nickname: 1,
      picture: 1,
      level: 1,
      wallet: 1,
      eventsAttended: 1,
      feedbacksGiven: 1
    })
    .sort({ level: -1, wallet: -1 })
    .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      nickname: user.nickname,
      picture: user.picture,
      level: user.level,
      wallet: user.wallet,
      stats: {
        eventsAttended: user.eventsAttended.length,
        feedbacksGiven: user.feedbacksGiven.length
      }
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's ranking and nearby users
router.get('/me', auth, async (req, res) => {
  try {
    // Get all users sorted by level and wallet
    const users = await User.find({}, {
      nickname: 1,
      picture: 1,
      level: 1,
      wallet: 1
    }).sort({ level: -1, wallet: -1 });

    // Find user's position
    const userIndex = users.findIndex(u => u._id.toString() === req.user._id.toString());
    const userRank = userIndex + 1;

    // Get 5 users above and below
    const start = Math.max(0, userIndex - 5);
    const end = Math.min(users.length, userIndex + 6);
    const nearbyUsers = users.slice(start, end).map((user, index) => ({
      rank: start + index + 1,
      nickname: user.nickname,
      picture: user.picture,
      level: user.level,
      wallet: user.wallet,
      isCurrentUser: user._id.toString() === req.user._id.toString()
    }));

    res.json({
      userRank,
      totalUsers: users.length,
      nearbyUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventsAttended = user.eventsAttended.length;
    const feedbacksGiven = user.feedbacksGiven.length;
    
    // Calculate achievements
    const achievements = {
      earned: [],
      inProgress: []
    };

    // Event attendance achievements
    const attendanceAchievements = [
      { name: 'First Step', description: 'Attend your first event', requirement: 1 },
      { name: 'Regular', description: 'Attend 5 events', requirement: 5 },
      { name: 'Dedicated', description: 'Attend 10 events', requirement: 10 },
      { name: 'Event Master', description: 'Attend 25 events', requirement: 25 }
    ];

    // Feedback achievements
    const feedbackAchievements = [
      { name: 'Reviewer', description: 'Give your first feedback', requirement: 1 },
      { name: 'Critic', description: 'Give 5 feedbacks', requirement: 5 },
      { name: 'Feedback Master', description: 'Give 15 feedbacks', requirement: 15 }
    ];

    // Level achievements
    const levelAchievements = [
      { name: 'Beginner', description: 'Reach level 5', requirement: 5 },
      { name: 'Intermediate', description: 'Reach level 10', requirement: 10 },
      { name: 'Expert', description: 'Reach level 25', requirement: 25 }
    ];

    // Process attendance achievements
    attendanceAchievements.forEach(achievement => {
      if (eventsAttended >= achievement.requirement) {
        achievements.earned.push({
          ...achievement,
          type: 'attendance',
          progress: 100
        });
      } else {
        achievements.inProgress.push({
          ...achievement,
          type: 'attendance',
          progress: Math.round((eventsAttended / achievement.requirement) * 100)
        });
      }
    });

    // Process feedback achievements
    feedbackAchievements.forEach(achievement => {
      if (feedbacksGiven >= achievement.requirement) {
        achievements.earned.push({
          ...achievement,
          type: 'feedback',
          progress: 100
        });
      } else {
        achievements.inProgress.push({
          ...achievement,
          type: 'feedback',
          progress: Math.round((feedbacksGiven / achievement.requirement) * 100)
        });
      }
    });

    // Process level achievements
    levelAchievements.forEach(achievement => {
      if (user.level >= achievement.requirement) {
        achievements.earned.push({
          ...achievement,
          type: 'level',
          progress: 100
        });
      } else {
        achievements.inProgress.push({
          ...achievement,
          type: 'level',
          progress: Math.round((user.level / achievement.requirement) * 100)
        });
      }
    });

    res.json({
      achievements,
      stats: {
        eventsAttended,
        feedbacksGiven,
        level: user.level,
        wallet: user.wallet
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
