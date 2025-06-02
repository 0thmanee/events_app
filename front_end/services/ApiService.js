import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_CONFIG } from '../constants/config';

class ApiService {
  constructor() {
    this.baseURL = BACKEND_CONFIG.BASE_URL;
  }

  // Helper method to get auth headers
  async getAuthHeaders() {
    const appToken = await AsyncStorage.getItem('appToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appToken}`
    };
  }

  // Generic request method
  async makeRequest(endpoint, options = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        let error;
        try {
          error = JSON.parse(errorData);
        } catch (e) {
          error = { error: errorData || 'Network request failed' };
        }
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ========== USER DATA ==========
  
  // Get current user profile and stats
  async getUserProfile() {
    try {
      const profile = await this.makeRequest('/api/users/profile');
      
      // Ensure arrays are properly initialized
      if (!profile.eventsAttended || !Array.isArray(profile.eventsAttended)) {
        profile.eventsAttended = [];
      }
      if (!profile.feedbacksGiven || !Array.isArray(profile.feedbacksGiven)) {
        profile.feedbacksGiven = [];
      }
      
      // Ensure numeric fields have defaults
      profile.wallet = profile.wallet || 0;
      profile.level = profile.level || 1;
      
      return profile;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  // Get user statistics (level progress, etc.)
  async getUserStats() {
    try {
      const stats = await this.makeRequest('/api/users/stats');
      
      // Ensure all stats have safe defaults
      return {
        eventsAttended: stats.eventsAttended || 0,
        feedbacksGiven: stats.feedbacksGiven || 0,
        currentLevel: stats.currentLevel || 1,
        wallet: stats.wallet || 0,
        pointsToNextLevel: stats.pointsToNextLevel || 0
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    return this.makeRequest('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // ========== EVENTS ==========
  
  // Get all events with optional filters
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.upcoming) queryParams.append('upcoming', 'true');
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tags) queryParams.append('tags', filters.tags.join(','));

    const queryString = queryParams.toString();
    const endpoint = `/api/events${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get upcoming events for dashboard
  async getUpcomingEvents(limit = 5) {
    return this.makeRequest(`/api/events?upcoming=true&limit=${limit}`);
  }

  // Get event by ID
  async getEventById(eventId) {
    return this.makeRequest(`/api/events/${eventId}`);
  }

  // Register for an event
  async registerForEvent(eventId) {
    return this.makeRequest(`/api/events/${eventId}/attend`, {
      method: 'POST'
    });
  }

  // Submit event feedback
  async submitEventFeedback(eventId, feedback) {
    return this.makeRequest(`/api/events/${eventId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback)
    });
  }

  // Submit event request for admin approval
  async submitEventRequest(eventData) {
    try {
      // Parse and validate date/time
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(eventData.date)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD.');
      }

      // Parse time - handle both 12-hour and 24-hour formats
      let timeString = eventData.time;
      if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
        throw new Error('Invalid time format. Please use HH:MM.');
      }

      // Convert to ISO string for backend
      const eventDateTime = new Date(`${eventData.date}T${timeString}`);
      if (isNaN(eventDateTime.getTime())) {
        throw new Error('Invalid date/time combination.');
      }

      // Validate future date
      if (eventDateTime <= new Date()) {
        throw new Error('Event date/time must be in the future.');
      }

      // Transform frontend form data to backend format
      const backendEventData = {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        category: eventData.category,
        time: eventDateTime.toISOString(),
        location: eventData.location.trim(),
        maxCapacity: parseInt(eventData.capacity),
        expectedTime: 4, // Default 4 hours - could be made configurable
        rewardPoints: 15, // Default reward points
        status: 'pending', // Will be pending for admin approval
        speakers: eventData.speaker ? [{
          name: eventData.speaker.trim(),
          bio: eventData.speakerBio?.trim() || ''
        }] : [],
        tags: [], // Could be derived from category or made configurable
        // Note: requirements and agenda are not part of the Event model schema
        // They could be added to the description or stored separately
      };

      // Add requirements and agenda to description if provided
      if (eventData.requirements || eventData.agenda) {
        let extendedDescription = backendEventData.description;
        if (eventData.requirements) {
          extendedDescription += `\n\nRequirements:\n${eventData.requirements.trim()}`;
        }
        if (eventData.agenda) {
          extendedDescription += `\n\nAgenda:\n${eventData.agenda.trim()}`;
        }
        backendEventData.description = extendedDescription;
      }

      console.log('Submitting event request:', backendEventData);

      const response = await this.makeRequest('/api/events', {
        method: 'POST',
        body: JSON.stringify(backendEventData)
      });

      return response;
    } catch (error) {
      console.error('Event request submission error:', error);
      throw error;
    }
  }

  // Unregister from an event
  async unregisterFromEvent(eventId) {
    return this.makeRequest(`/api/events/${eventId}/unattend`, {
      method: 'POST'
    });
  }

  // Get event volunteers
  async getEventVolunteers(eventId) {
    return this.makeRequest(`/api/events/${eventId}/volunteers`);
  }

  // Apply as volunteer for event
  async applyAsVolunteer(eventId, application) {
    return this.makeRequest(`/api/events/${eventId}/volunteer`, {
      method: 'POST',
      body: JSON.stringify(application)
    });
  }

  // Get event discussions
  async getEventDiscussions(eventId) {
    return this.makeRequest(`/api/events/${eventId}/discussions`);
  }

  // Post event discussion message
  async postEventDiscussion(eventId, message) {
    return this.makeRequest(`/api/events/${eventId}/discuss`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // ========== LEADERBOARD ==========
  
  // Get global leaderboard
  async getLeaderboard(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.period) queryParams.append('period', filters.period);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/leaderboard${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get user's ranking and nearby users
  async getUserRanking(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.period) queryParams.append('period', filters.period);

    const queryString = queryParams.toString();
    const endpoint = `/api/leaderboard/me${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get user achievements
  async getUserAchievements() {
    return this.makeRequest('/api/leaderboard/achievements');
  }

  // Admin: Get detailed leaderboard with all user data
  async getAdminLeaderboard(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.filter) queryParams.append('filter', filters.filter);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/leaderboard/admin${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // ========== WALLET & STORE ==========
  
  // Get user's wallet balance and transaction history
  async getWalletData() {
    const [profile, stats, transactions] = await Promise.all([
      this.getUserProfile(),
      this.getUserStats(),
      this.getTransactionHistory()
    ]);
    
    return {
      balance: profile.wallet,
      level: profile.level,
      stats,
      transactions: transactions.transactions,
      summary: transactions.summary
    };
  }

  // Get transaction history
  async getTransactionHistory() {
    return this.makeRequest('/api/users/transactions');
  }

  // Get store items
  async getStoreItems() {
    return this.makeRequest('/api/store/items');
  }

  // Get user's customization requests
  async getCustomizationRequests() {
    return this.makeRequest('/api/store/requests');
  }

  // Submit customization request
  async submitCustomizationRequest(request) {
    return this.makeRequest('/api/store/request', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // ========== DASHBOARD ANALYTICS ==========
  
  // Get dashboard data for student
  async getDashboardData() {
    try {
      const [userProfile, userStats, upcomingEvents, userRanking] = await Promise.all([
        this.getUserProfile(),
        this.getUserStats(),
        this.getUpcomingEvents(3),
        this.getUserRanking()
      ]);

      // Ensure upcomingEvents is an array
      const eventsArray = Array.isArray(upcomingEvents) ? upcomingEvents : [];

      // Transform events data with user registration status (non-async now)
      const transformedEvents = eventsArray.map(event => {
        try {
          return this.transformEventDataWithUserStatus(event, userProfile);
        } catch (error) {
          console.error('Error transforming event:', error);
          // Return safe fallback
          return {
            id: event._id || 'unknown',
            title: event.title || 'Unknown Event',
            description: event.description || '',
            category: event.category || 'other',
            date: 'TBD',
            time: 'TBD',
            location: event.location || 'TBD',
            enrolled: 0,
            capacity: 50,
            credits: 15,
            status: 'available',
            registrationStatus: 'available',
            isRegistered: false
          };
        }
      });

      // Calculate additional metrics with safe defaults
      const progressToNext = this.calculateLevelProgress(userProfile.level, userStats);
      
      return {
        user: {
          id: userProfile.id || 'unknown',
          name: userProfile.nickname || 'Student',
          email: userProfile.email || '',
          program: this.getProgramFromEmail(userProfile.email || ''),
          currentLevel: userProfile.level || 1,
          totalCredits: userProfile.wallet || 0,
          ranking: (userRanking && userRanking.userRank) || 999,
          progressPercentage: progressToNext.percentage || 0,
          creditsToNext: progressToNext.creditsNeeded || 0,
          eventsAttended: userStats.eventsAttended || 0,
          feedbacksGiven: userStats.feedbacksGiven || 0
        },
        upcomingEvents: transformedEvents,
        metrics: this.calculatePerformanceMetrics(userProfile, userStats, userRanking),
        ranking: userRanking || { userRank: 999 }
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      throw error;
    }
  }

  // ========== HELPER METHODS ==========
  
  // Calculate level progress
  calculateLevelProgress(currentLevel, stats) {
    // Ensure safe defaults for all inputs
    const level = currentLevel || 1;
    const eventsAttended = (stats && stats.eventsAttended) || 0;
    const feedbacksGiven = (stats && stats.feedbacksGiven) || 0;
    
    const currentLevelPoints = level * 50;
    const nextLevelPoints = (level + 1) * 50;
    const totalPoints = (eventsAttended * 10) + (feedbacksGiven * 5);
    
    const pointsInCurrentLevel = totalPoints - (level - 1) * 50;
    const pointsNeededForLevel = 50;
    const percentage = Math.min(Math.max((pointsInCurrentLevel / pointsNeededForLevel) * 100, 0), 100);
    
    return {
      percentage: Math.round(percentage),
      creditsNeeded: Math.max(nextLevelPoints - totalPoints, 0)
    };
  }

  // Get program from email (42 intra email pattern)
  getProgramFromEmail(email) {
    if (email.includes('@student.42')) {
      return 'Software Engineering';
    }
    return 'Computer Science'; // Default
  }

  // Calculate performance metrics
  calculatePerformanceMetrics(userProfile, userStats, userRanking) {
    // Safe defaults for all inputs
    const profile = userProfile || {};
    const stats = userStats || {};
    const ranking = userRanking || {};
    
    const eventsAttended = stats.eventsAttended || 0;
    const level = profile.level || 1;
    const wallet = profile.wallet || 0;
    const userRank = ranking.userRank || 999;
    
    const attendance = eventsAttended > 0 ? 
      Math.min((eventsAttended / (eventsAttended + 2)) * 100, 100) : 85;
    
    const gpa = Math.min(3.0 + (level * 0.1), 4.0);
    
    return [
      {
        label: 'Class Rank',
        value: `#${userRank}`,
        change: '+2', // TODO: Calculate actual change when backend tracks history
        trend: 'up',
        period: 'This month'
      },
      {
        label: 'Total Credits',
        value: wallet.toString(),
        change: '+45', // TODO: Calculate from recent transactions
        trend: 'up',
        period: 'This month'
      },
      {
        label: 'Attendance',
        value: `${Math.round(attendance)}%`,
        change: eventsAttended > 5 ? '+2%' : '-2%',
        trend: eventsAttended > 5 ? 'up' : 'down',
        period: 'This month'
      },
      {
        label: 'GPA',
        value: gpa.toFixed(1),
        change: '+0.1',
        trend: 'up',
        period: 'This semester'
      }
    ];
  }

  // Get event status based on backend data and user profile
  getEventStatusWithUser(event, userProfile) {
    const now = new Date();
    const eventTime = new Date(event.time);
    
    if (!userProfile) {
      // If no user profile, can't check registration
      const attendeeCount = event.attendees ? event.attendees.length : 0;
      const maxCapacity = event.maxCapacity || 50;
      if (attendeeCount >= maxCapacity) return 'full';
      if (eventTime < now) return 'past';
      return 'available';
    }
    
    // Ensure attendees array exists
    const attendees = event.attendees || [];
    const maxCapacity = event.maxCapacity || 50;
    
    // Check if user is registered - check multiple possible ID formats
    const userId = userProfile._id || userProfile.id;
    const isRegistered = attendees.some(attendee => {
      if (!attendee) return false;
      const attendeeUserId = attendee.user?._id || attendee.user?.id || attendee.user;
      return attendeeUserId && attendeeUserId.toString() === userId.toString();
    });
    
    if (isRegistered) return 'enrolled';
    if (attendees.length >= maxCapacity) return 'full';
    if (eventTime < now) return 'past';
    return 'available';
  }

  // Get event status based on backend data (legacy method)
  async getEventStatus(event) {
    const now = new Date();
    const eventTime = new Date(event.time);
    
    // Check if user is registered
    try {
      const userProfile = await this.getUserProfile();
      return this.getEventStatusWithUser(event, userProfile);
    } catch (error) {
      console.error('Error checking event status:', error);
      // Fallback to basic status checking
      const attendeeCount = event.attendees ? event.attendees.length : 0;
      const maxCapacity = event.maxCapacity || 50;
      if (attendeeCount >= maxCapacity) return 'full';
      if (eventTime < now) return 'past';
      return 'available';
    }
  }

  // Transform backend event data to frontend format
  async transformEventData(backendEvent) {
    const status = await this.getEventStatus(backendEvent);
    
    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      category: backendEvent.category,
      date: this.formatEventDate(backendEvent.time),
      time: this.formatEventTime(backendEvent.time),
      location: backendEvent.location,
      enrolled: backendEvent.attendees ? backendEvent.attendees.length : 0,
      capacity: backendEvent.maxCapacity || 50,
      credits: backendEvent.rewardPoints || 15,
      status: status
    };
  }

  // Format event date
  formatEventDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  // Format event time
  formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Transform backend user data for leaderboard
  transformLeaderboardData(backendData) {
    return backendData.map((user, index) => {
      // Calculate mock rank change based on position and activity
      let rankChange = 0;
      const currentRank = user.rank || (index + 1);
      const xp = user.wallet || 0;
      
      // Mock rank change calculation (can be improved when backend tracks history)
      if (currentRank <= 3) {
        rankChange = Math.floor(Math.random() * 3) - 1; // -1 to +1 for top players
      } else if (currentRank <= 10) {
        rankChange = Math.floor(Math.random() * 5) - 2; // -2 to +2 for top 10
      } else {
        rankChange = Math.floor(Math.random() * 7) - 3; // -3 to +3 for others
      }
      
      return {
        id: user._id || user.id || `user-${index}`,
        name: user.nickname || 'Unknown User',
        login: user.intraUsername || user.nickname?.toLowerCase().replace(/\s+/g, '') || `user${index}`,
        level: user.level || 1,
        xp: xp,
        rank: currentRank,
        rankChange: rankChange,
        avatar: (user.nickname || 'U').charAt(0).toUpperCase(),
        isCurrentUser: false, // Will be set when rendering
        program: this.getProgramFromEmail(user.email || ''),
        eventsAttended: user.eventsAttended || 0
      };
    });
  }

  // Transform detailed event data for event details page
  async transformDetailedEventData(backendEvent) {
    try {
      const status = await this.getEventStatus(backendEvent);
      
      // Get additional data if available
      let volunteers = [];
      try {
        volunteers = await this.getEventVolunteers(backendEvent._id);
      } catch (error) {
        console.log('No volunteers data available:', error.message);
      }

      return {
        id: backendEvent._id,
        title: backendEvent.title,
        description: backendEvent.description,
        category: backendEvent.category,
        status: backendEvent.status,
        date: this.formatEventDate(backendEvent.time),
        time: this.formatEventTime(backendEvent.time),
        fullDateTime: backendEvent.time,
        location: backendEvent.location,
        capacity: backendEvent.maxCapacity,
        registered: backendEvent.attendees.length,
        credits: backendEvent.rewardPoints || 15,
        registrationStatus: status,
        
        // Speaker information (if available in backend)
        speaker: {
          name: backendEvent.speakers?.[0]?.name || 'Event Organizer',
          title: backendEvent.speakers?.[0]?.bio || 'Event Speaker',
          bio: backendEvent.speakers?.[0]?.bio || 'Professional speaker with extensive experience.',
          contact: 'contact@1337.ma' // TODO: Add speaker contact to backend model
        },

        // Transform volunteers
        volunteers: volunteers.map(volunteer => ({
          id: volunteer._id || volunteer.id,
          name: volunteer.user?.nickname || 'Volunteer',
          login: volunteer.user?.intraUsername || volunteer.user?.nickname?.toLowerCase() || 'volunteer',
          status: volunteer.status,
          role: volunteer.role
        })),

        // Requirements and agenda (these should be added to backend model)
        requirements: backendEvent.requirements || 'No specific requirements. Just bring your enthusiasm to learn!',
        agenda: this.generateDefaultAgenda(backendEvent),

        // Organizer info
        organizer: backendEvent.creator?.nickname || 'Event Organizer',
      };
    } catch (error) {
      console.error('Error transforming detailed event data:', error);
      throw error;
    }
  }

  // Generate default agenda based on event data
  generateDefaultAgenda(event) {
    const startTime = new Date(event.time);
    const duration = event.expectedTime || 4; // Default 4 hours
    
    const agenda = [];
    const timeSlots = [
      { offset: 0, activity: 'Welcome & Introduction' },
      { offset: 0.5, activity: 'Main Session - Part 1' },
      { offset: 2, activity: 'Break' },
      { offset: 2.5, activity: 'Main Session - Part 2' },
      { offset: duration - 0.5, activity: 'Q&A Session' },
      { offset: duration, activity: 'Wrap-up & Networking' }
    ];

    timeSlots.forEach(slot => {
      const slotTime = new Date(startTime.getTime() + slot.offset * 60 * 60 * 1000);
      const timeStr = slotTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      agenda.push(`${timeStr} - ${slot.activity}`);
    });

    return agenda;
  }

  // Transform backend event data to frontend format with user registration status
  transformEventDataWithUserStatus(backendEvent, userProfile) {
    const registrationStatus = this.getEventStatusWithUser(backendEvent, userProfile);
    
    // Calculate enrollment numbers with safe defaults
    const attendees = backendEvent.attendees || [];
    const capacity = backendEvent.maxCapacity || 50;
    const enrolled = attendees.length;
    const spotsLeft = capacity - enrolled;
    
    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      category: backendEvent.category,
      date: this.formatEventDate(backendEvent.time),
      time: this.formatEventTime(backendEvent.time),
      location: backendEvent.location,
      enrolled: enrolled,
      capacity: capacity,
      spotsLeft: spotsLeft,
      credits: backendEvent.rewardPoints || 15,
      status: registrationStatus,
      registrationStatus: registrationStatus,
      isRegistered: registrationStatus === 'enrolled',
      occupancyPercentage: capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0,
      isFull: enrolled >= capacity,
      isNearlyFull: spotsLeft <= 5 && spotsLeft > 0
    };
  }

  // Get events that need feedback from the current user
  async getEventsNeedingFeedback() {
    return this.makeRequest('/api/events/feedback-pending');
  }

  // ========== ADMIN EVENT MANAGEMENT ==========
  
  // Get all events for admin management (including pending, rejected, etc.)
  async getAdminEvents(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const endpoint = `/api/events${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Approve event (admin only)
  async approveEvent(eventId) {
    return this.makeRequest(`/api/events/${eventId}/approve`, {
      method: 'PATCH'
    });
  }

  // Reject event (admin only) - using update endpoint with status
  async rejectEvent(eventId, reason = '') {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        status: 'rejected',
        rejectionReason: reason 
      })
    });
  }

  // Update event (admin only)
  async updateEvent(eventId, updates) {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Delete event (admin only)
  async deleteEvent(eventId) {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'DELETE'
    });
  }

  // Get event statistics (admin only)
  async getEventStats(eventId) {
    return this.makeRequest(`/api/events/${eventId}/stats`);
  }

  // Transform backend event data for admin view
  transformEventForAdmin(backendEvent) {
    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      organizer: backendEvent.creator?.nickname || 'Unknown',
      organizerId: backendEvent.creator?._id,
      category: backendEvent.category,
      status: backendEvent.status,
      date: this.formatEventDate(backendEvent.time),
      time: this.formatEventTime(backendEvent.time),
      location: backendEvent.location,
      capacity: backendEvent.maxCapacity,
      registered: backendEvent.attendees?.length || 0,
      attendees: backendEvent.attendees || [],
      speakers: backendEvent.speakers || [],
      rewardPoints: backendEvent.rewardPoints,
      expectedTime: backendEvent.expectedTime,
      tags: backendEvent.tags || [],
      createdAt: backendEvent.createdAt,
      updatedAt: backendEvent.updatedAt,
      rejectionReason: backendEvent.rejectionReason
    };
  }

  // ========== STAFF QR VERIFICATION ==========
  
  // Verify student registration by QR code (staff only)
  async verifyStudentRegistration(eventId, qrCodeData) {
    try {
      // Parse QR code data
      const parsedData = JSON.parse(qrCodeData);
      
      // Validate QR code structure
      if (!parsedData.userId || !parsedData.eventId) {
        throw new Error('Invalid QR code format');
      }
      
      // Check if the QR code is for the correct event
      if (parsedData.eventId !== eventId) {
        throw new Error('QR code is not for this event');
      }
      
      // Make API call to verify registration
      return this.makeRequest(`/api/events/${eventId}/verify-registration`, {
        method: 'POST',
        body: JSON.stringify({
          userId: parsedData.userId,
          qrData: parsedData
        })
      });
    } catch (error) {
      console.error('QR verification failed:', error);
      throw new Error(error.message || 'Failed to verify student registration');
    }
  }

  // Check-in student via QR scan (staff only)
  async checkInStudentByQR(eventId, qrCodeData) {
    try {
      // Parse QR code data
      const parsedData = JSON.parse(qrCodeData);
      
      return this.makeRequest(`/api/events/${eventId}/check-in`, {
        method: 'POST',
        body: JSON.stringify({
          userId: parsedData.userId,
          qrData: parsedData,
          checkInTime: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('QR check-in failed:', error);
      throw new Error(error.message || 'Failed to check-in student');
    }
  }

  // Get event attendance list (staff only)
  async getEventAttendance(eventId) {
    return this.makeRequest(`/api/events/${eventId}/attendance`);
  }

  // ========== NOTIFICATIONS ==========
  
  // Get user notifications
  async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (unreadOnly) queryParams.append('unreadOnly', 'true');

    const queryString = queryParams.toString();
    const endpoint = `/api/notifications${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get unread notification count
  async getUnreadNotificationCount() {
    const response = await this.makeRequest('/api/notifications/unread-count');
    return response.count || 0;
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    return this.makeRequest('/api/notifications/mark-all-read', {
      method: 'PATCH'
    });
  }

  // Admin: Create custom notification
  async createNotification(notificationData) {
    return this.makeRequest('/api/notifications/create', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  // Admin: Get all notifications
  async getAdminNotifications(page = 1, limit = 20, type = 'all') {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (type !== 'all') queryParams.append('type', type);

    const queryString = queryParams.toString();
    return this.makeRequest(`/api/notifications/admin/all?${queryString}`);
  }

  // Admin: Delete notification
  async deleteNotification(notificationId) {
    return this.makeRequest(`/api/notifications/admin/${notificationId}`, {
      method: 'DELETE'
    });
  }

  // Admin: Send event reminders
  async sendEventReminders(hours = 24) {
    return this.makeRequest('/api/notifications/send-reminders', {
      method: 'POST',
      body: JSON.stringify({ hours })
    });
  }

  // ========== PUSH NOTIFICATIONS ==========
  
  // Test push notification
  async testPushNotification(title, message) {
    return this.makeRequest('/api/users/test-push', {
      method: 'POST',
      body: JSON.stringify({ title, message })
    });
  }

  // Get user's device tokens (for debugging)
  async getDeviceTokens() {
    return this.makeRequest('/api/users/device-tokens');
  }

  // Register device token
  async registerDeviceToken(token, platform) {
    return this.makeRequest('/api/users/device-token', {
      method: 'POST',
      body: JSON.stringify({ token, platform })
    });
  }

  // Remove device token
  async removeDeviceToken(token) {
    return this.makeRequest('/api/users/device-token', {
      method: 'DELETE',
      body: JSON.stringify({ token })
    });
  }

  // Test event notification (Admin only)
  async testEventNotification(eventId) {
    return this.makeRequest(`/api/events/${eventId}/test-notification`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  }

  // Debug push notification service
  async debugPushNotifications() {
    return this.makeRequest('/api/users/debug-push');
  }
}

export default new ApiService(); 