const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const FormData = require('form-data');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const PushNotificationService = require('../services/PushNotificationService');

// Helper function to get 42 user data
async function get42UserData(accessToken) {
  try {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data from 42 API');
    }
    
    return response.json();
  } catch (error) {
    throw new Error('Error fetching 42 user data: ' + error.message);
  }
}

// Helper function to get 42 access token
async function get42AccessToken(code) {
  try {
    // Use FormData for multipart/form-data (as required by 42 API)
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', process.env.FORTYTWO_CLIENT_ID);
    formData.append('client_secret', process.env.FORTYTWO_CLIENT_SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', process.env.REDIRECT_URI);

    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: formData, // FormData automatically sets multipart/form-data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token from 42 API: ${response.status} ${errorText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error('Error getting access token: ' + error.message);
  }
}

// Middleware to check if user is admin
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

// 42 Authentication routes
router.get('/auth/42', (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const scope = 'public';
  const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${
    process.env.FORTYTWO_CLIENT_ID
  }&redirect_uri=${
    encodeURIComponent(redirectUri)
  }&response_type=code&scope=${scope}`;
  
  res.json({ authUrl });
});

router.get('/auth/42/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    // Get access token
    const tokenData = await get42AccessToken(code);
    
    // Get user data from 42 API
    const userData = await get42UserData(tokenData.access_token);
    
    // Find or create user
    let user = await User.findOne({ intraId: userData.id });
    if (!user) {
      user = new User({
        intraId: userData.id,
        intraUsername: userData.login,
        intraEmail: userData.email,
        email: userData.email,
        nickname: userData.login,
        picture: userData.image_url,
        settings: {
          language: userData.language || 'en',
          theme: 'light',
          notifications: {
            eventReminders: true,
            eventStarting: true,
            newEvents: true,
            eventChanges: true
          },
          timezone: 'Africa/Casablanca'
        }
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        picture: user.picture,
        wallet: user.wallet,
        level: user.level,
        settings: user.settings
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// New endpoint for frontend OAuth flow - accepts access token from client
router.post('/auth/42/frontend', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }
    
    console.log('🔐 Frontend 42 auth request received');
    
    // Get user data from 42 API using provided access token
    const userData = await get42UserData(accessToken);
    
    console.log('👤 42 user data received:', userData.login);
    console.log('🏢 Staff status:', userData.staff ? 'Staff' : 'Student');
    
    // Find existing user by intraId
    let user = await User.findOne({ intraId: userData.id });
    
    // Determine role based on 42 staff status
    const userRole = userData.staff ? 'staff' : 'student';
    
    if (!user) {
      // Create new user for first-time 42 students/staff
      console.log('🆕 Creating new user for:', userData.login, `(${userRole})`);
      
      // Check if email already exists (in case of manual registration)
      const existingEmail = await User.findOne({ email: userData.email });
      if (existingEmail) {
        return res.status(400).json({ 
          error: 'This email is already registered with a different account. Please contact support.',
          code: 'EMAIL_CONFLICT'
        });
      }
      
      // Set initial wallet amount based on role
      const initialWallet = userData.staff ? 500 : 100; // Staff get more tokens
      
      user = new User({
        intraId: userData.id.toString(),
        intraUsername: userData.login,
        intraEmail: userData.email,
        email: userData.email,
        nickname: userData.login,
        picture: userData.image?.link || userData.image_url || null,
        role: userRole, // 'staff' for staff, 'student' for students
        wallet: initialWallet, // Higher bonus for staff
        level: 1,
        settings: {
          language: userData.language || 'en',
          theme: 'light',
          notifications: {
            eventReminders: true,
            eventStarting: true,
            newEvents: true,
            eventChanges: true
          },
          timezone: 'Africa/Casablanca'
        }
      });
      
      await user.save();
      console.log('✅ New user created:', user._id, `with role: ${userRole}`);
    } else {
      // Update existing user data with latest 42 info
      console.log('🔄 Updating existing user:', user.intraUsername);
      
      // Update user's 42 data in case it changed
      user.intraUsername = userData.login;
      user.intraEmail = userData.email;
      user.email = userData.email;
      user.picture = userData.image?.link || userData.image_url || user.picture;
      
      // Update role if it changed (e.g., student became staff)
      if (user.role !== userRole) {
        console.log(`🔄 Role change detected: ${user.role} -> ${userRole}`);
        user.role = userRole;
        
        // If upgraded to staff, give bonus tokens
        if (userRole === 'staff' && user.wallet < 500) {
          user.wallet = Math.max(user.wallet, 500);
          console.log('💰 Staff role bonus applied');
        }
      }
      
      // Update nickname only if it's still the default (same as intraUsername)
      if (user.nickname === user.intraUsername || !user.nickname) {
        user.nickname = userData.login;
      }
      
      await user.save();
      console.log('✅ User data updated');
    }

    // Generate JWT token for app authentication
    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Calculate user level based on activity
    await user.calculateLevel();
    await user.save();

    const response = {
      success: true,
      user: {
        id: user._id,
        intraId: user.intraId,
        intraUsername: user.intraUsername,
        email: user.email,
        intraEmail: user.intraEmail,
        nickname: user.nickname,
        picture: user.picture,
        wallet: user.wallet,
        level: user.level,
        role: user.role,
        is42Staff: userData.staff || false, // Include 42 staff status
        eventsAttended: user.eventsAttended.length,
        feedbacksGiven: user.feedbacksGiven.length,
        settings: user.settings,
        createdAt: user.createdAt,
        isNewUser: !user.createdAt || Date.now() - user.createdAt.getTime() < 60000 // Created in last minute
      },
      token: appToken
    };

    console.log('🎉 Authentication successful for:', user.intraUsername, `(${user.role})`);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Frontend 42 auth error:', error);
    
    // Handle specific 42 API errors
    if (error.message.includes('Failed to fetch user data')) {
      return res.status(401).json({ 
        error: 'Invalid or expired access token',
        code: 'INVALID_TOKEN'
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email,
      password,
      nickname
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        picture: user.picture,
        wallet: user.wallet,
        level: user.level
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        picture: user.picture,
        wallet: user.wallet,
        level: user.level
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('eventsAttended', 'title time')
      .populate('feedbacksGiven', 'title');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure arrays are initialized and filter out any null/undefined populated documents
    const eventsAttended = Array.isArray(user.eventsAttended) 
      ? user.eventsAttended.filter(event => event != null) 
      : [];
    const feedbacksGiven = Array.isArray(user.feedbacksGiven) 
      ? user.feedbacksGiven.filter(event => event != null) 
      : [];

    res.json({
      id: user._id,
      email: user.email,
      nickname: user.nickname,
      picture: user.picture,
      wallet: user.wallet || 0,
      level: user.level || 1,
      eventsAttended: eventsAttended,
      feedbacksGiven: feedbacksGiven
    });
  } catch (error) {
    console.error('Profile endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile and settings
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nickname', 'picture', 'settings'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user settings
router.patch('/settings', auth, async (req, res) => {
  try {
    const { language, theme, notifications, timezone } = req.body;
    const user = req.user;

    if (language) user.settings.language = language;
    if (theme) user.settings.theme = theme;
    if (notifications) {
      Object.assign(user.settings.notifications, notifications);
    }
    if (timezone) user.settings.timezone = timezone;

    await user.save();
    res.json({ settings: user.settings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Routes
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Ensure arrays are initialized with safe defaults
    const eventsAttended = Array.isArray(user.eventsAttended) ? user.eventsAttended : [];
    const feedbacksGiven = Array.isArray(user.feedbacksGiven) ? user.feedbacksGiven : [];
    
    const stats = {
      eventsAttended: eventsAttended.length,
      feedbacksGiven: feedbacksGiven.length,
      currentLevel: user.level || 1,
      wallet: user.wallet || 0,
      pointsToNextLevel: Math.max(0, (Math.ceil(user.level || 1) * 50) - 
        ((eventsAttended.length * 10) + (feedbacksGiven.length * 5)))
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Make user an admin
router.patch('/make-admin/:userId', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.json({ message: 'User role updated to admin', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get user details
router.get('/admin/user/:userId', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('eventsAttended')
      .populate('feedbacksGiven');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete user
router.delete('/admin/user/:userId', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('eventsAttended', 'title time rewardPoints')
      .populate('feedbacksGiven', 'title time');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure arrays are initialized and filter out null/undefined populated documents
    const eventsAttended = Array.isArray(user.eventsAttended) 
      ? user.eventsAttended.filter(event => event != null) 
      : [];
    const feedbacksGiven = Array.isArray(user.feedbacksGiven) 
      ? user.feedbacksGiven.filter(event => event != null) 
      : [];

    // Create transaction history from user activities
    const transactions = [];

    // Add event attendance transactions
    eventsAttended.forEach(event => {
      if (event && event._id) {
        transactions.push({
          id: `event_${event._id}`,
          title: `${event.title || 'Event'} Completion`,
          amount: event.rewardPoints || 15,
          date: event.time || new Date(),
          type: 'earned',
          status: 'completed',
          category: 'Event'
        });
      }
    });

    // Add feedback transactions
    feedbacksGiven.forEach(event => {
      if (event && event._id) {
        transactions.push({
          id: `feedback_${event._id}`,
          title: `Feedback for ${event.title || 'Event'}`,
          amount: 5,
          date: event.time || new Date(),
          type: 'bonus',
          status: 'completed',
          category: 'Feedback'
        });
      }
    });

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to recent 20 transactions
    const recentTransactions = transactions.slice(0, 20);

    res.json({
      transactions: recentTransactions,
      summary: {
        totalEarned: transactions.reduce((sum, t) => t.type === 'earned' ? sum + t.amount : sum, 0),
        totalSpent: 0, // TODO: Add when implementing purchases
        currentBalance: user.wallet || 0
      }
    });
  } catch (error) {
    console.error('Transactions endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Fix users with missing array fields (temporary utility)
router.post('/fix-users', async (req, res) => {
  try {
    console.log('Starting user fix process...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let fixedCount = 0;
    const fixedUsers = [];
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};
      const issues = [];

      // Check and fix eventsAttended array
      if (!user.eventsAttended || !Array.isArray(user.eventsAttended)) {
        updates.eventsAttended = [];
        needsUpdate = true;
        issues.push('eventsAttended');
      }

      // Check and fix feedbacksGiven array
      if (!user.feedbacksGiven || !Array.isArray(user.feedbacksGiven)) {
        updates.feedbacksGiven = [];
        needsUpdate = true;
        issues.push('feedbacksGiven');
      }

      // Check and fix wallet
      if (typeof user.wallet !== 'number' || user.wallet < 0) {
        updates.wallet = Math.max(0, user.wallet || 0);
        needsUpdate = true;
        issues.push('wallet');
      }

      // Check and fix level
      if (typeof user.level !== 'number' || user.level < 1) {
        updates.level = 1;
        needsUpdate = true;
        issues.push('level');
      }

      // Check and fix role
      if (!user.role || !['user', 'student', 'staff', 'admin'].includes(user.role)) {
        updates.role = 'student';
        needsUpdate = true;
        issues.push('role');
      }

      // Apply updates if needed
      if (needsUpdate) {
        try {
          await User.findByIdAndUpdate(user._id, updates, { 
            runValidators: true,
            new: true 
          });
          fixedCount++;
          fixedUsers.push({
            id: user._id,
            nickname: user.nickname,
            issues: issues
          });
          console.log(`Fixed user: ${user.nickname} (issues: ${issues.join(', ')})`);
        } catch (error) {
          console.error(`Failed to fix user ${user.nickname}:`, error.message);
        }
      }
    }

    const result = {
      message: `Fixed ${fixedCount} users out of ${users.length} total users`,
      totalUsers: users.length,
      fixedCount,
      fixedUsers
    };

    console.log('User fix process completed:', result.message);
    res.json(result);

  } catch (error) {
    console.error('Error fixing users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Device Token Management for Push Notifications

// Register device token for push notifications
router.post('/device-token', auth, async (req, res) => {
  try {
    const { token, platform } = req.body;
    
    if (!token || !platform) {
      return res.status(400).json({ error: 'Device token and platform are required' });
    }
    
    if (!['ios', 'android', 'web'].includes(platform)) {
      return res.status(400).json({ error: 'Platform must be ios, android, or web' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add or update device token
    user.addDeviceToken(token, platform);
    await user.save();
    
    console.log(`📱 Device token registered for user ${user.nickname} (${platform})`);
    
    res.json({ 
      message: 'Device token registered successfully',
      tokenCount: user.deviceTokens?.length || 0
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove device token
router.delete('/device-token', auth, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Device token is required' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.removeDeviceToken(token);
    await user.save();
    
    console.log(`📱 Device token removed for user ${user.nickname}`);
    
    res.json({ 
      message: 'Device token removed successfully',
      tokenCount: user.deviceTokens?.length || 0
    });
  } catch (error) {
    console.error('Error removing device token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's device tokens (for debugging)
router.get('/device-tokens', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('deviceTokens pushNotificationSettings');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const activeTokens = user.getActiveDeviceTokens();
    
    res.json({
      totalTokens: user.deviceTokens?.length || 0,
      activeTokens: activeTokens.length,
      tokens: user.deviceTokens?.map(dt => ({
        platform: dt.platform,
        active: dt.active,
        lastUsed: dt.lastUsed,
        tokenPreview: dt.token.substring(0, 20) + '...'
      })) || [],
      pushSettings: user.pushNotificationSettings
    });
  } catch (error) {
    console.error('Error fetching device tokens:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update push notification preferences
router.patch('/push-settings', auth, async (req, res) => {
  try {
    const {
      enabled,
      eventReminders,
      newEvents,
      eventApproved,
      eventCancelled,
      quietHours
    } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize pushNotificationSettings if not exists
    if (!user.pushNotificationSettings) {
      user.pushNotificationSettings = {};
    }
    
    // Update settings
    if (typeof enabled === 'boolean') {
      user.pushNotificationSettings.enabled = enabled;
    }
    if (typeof eventReminders === 'boolean') {
      user.pushNotificationSettings.eventReminders = eventReminders;
    }
    if (typeof newEvents === 'boolean') {
      user.pushNotificationSettings.newEvents = newEvents;
    }
    if (typeof eventApproved === 'boolean') {
      user.pushNotificationSettings.eventApproved = eventApproved;
    }
    if (typeof eventCancelled === 'boolean') {
      user.pushNotificationSettings.eventCancelled = eventCancelled;
    }
    if (quietHours && typeof quietHours === 'object') {
      user.pushNotificationSettings.quietHours = {
        ...user.pushNotificationSettings.quietHours,
        ...quietHours
      };
    }
    
    await user.save();
    
    console.log(`🔧 Push notification settings updated for user ${user.nickname}`);
    
    res.json({ 
      message: 'Push notification settings updated successfully',
      settings: user.pushNotificationSettings
    });
  } catch (error) {
    console.error('Error updating push settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test push notification (for development)
router.post('/test-push', auth, async (req, res) => {
  try {
    const { title = 'Test Notification', message = 'This is a test push notification' } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const deviceTokens = user.getActiveDeviceTokens();
    if (deviceTokens.length === 0) {
      return res.status(400).json({ 
        error: 'No active device tokens found. Please register a device token first.' 
      });
    }
    
    console.log(`🧪 Sending test push notification to ${user.nickname}`);
    
    const result = await PushNotificationService.sendToMultipleDevices(
      deviceTokens,
      { title, message },
      {
        type: 'test',
        notificationId: 'test',
        actionUrl: '/notifications',
        timestamp: new Date().toISOString()
      }
    );
    
    res.json({
      message: 'Test push notification sent',
      result: {
        success: result.success,
        successCount: result.successCount,
        failureCount: result.failureCount,
        devicesTargeted: deviceTokens.length
      }
    });
  } catch (error) {
    console.error('Error sending test push notification:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
