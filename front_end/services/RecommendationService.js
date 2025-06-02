import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

class RecommendationService {
  constructor() {
    this.userInterests = {};
    this.attendanceHistory = [];
    this.feedbackHistory = [];
    this.categoryWeights = {};
    this.isInitialized = false;
  }

  async initialize(userProfile, userStats) {
    if (this.isInitialized) return;

    try {
      await this.loadUserProfile(userProfile, userStats);
      await this.calculateCategoryWeights();
      this.isInitialized = true;
      console.log('✅ RecommendationService initialized');
    } catch (error) {
      console.error('❌ Failed to initialize RecommendationService:', error);
    }
  }

  async loadUserProfile(userProfile, userStats) {
    try {
      // Load stored user interests
      const storedInterests = await AsyncStorage.getItem('user_interests');
      this.userInterests = storedInterests ? JSON.parse(storedInterests) : {
        workshop: 0,
        talk: 0,
        vibe_coding: 0,
        social: 0,
        other: 0
      };

      // Load attendance and feedback history
      this.attendanceHistory = userStats.eventsAttended || 0;
      this.feedbackHistory = userStats.feedbacksGiven || 0;

      console.log('📊 User profile loaded for recommendations');
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  async updateUserInterests(eventCategory, interactionType = 'view', weight = 1) {
    try {
      if (!this.userInterests[eventCategory]) {
        this.userInterests[eventCategory] = 0;
      }

      // Different weights for different interaction types
      const weights = {
        view: 0.1,
        register: 0.5,
        attend: 1.0,
        feedback_positive: 1.5, // rating >= 4
        feedback_negative: -0.5, // rating < 3
        share: 0.3,
        bookmark: 0.4
      };

      const interactionWeight = weights[interactionType] || weight;
      this.userInterests[eventCategory] += interactionWeight;

      // Normalize to prevent infinite growth
      const maxWeight = 20;
      if (this.userInterests[eventCategory] > maxWeight) {
        this.userInterests[eventCategory] = maxWeight;
      }

      // Save updated interests
      await AsyncStorage.setItem('user_interests', JSON.stringify(this.userInterests));
      
      console.log(`📈 Updated interest in ${eventCategory}: ${this.userInterests[eventCategory].toFixed(2)}`);
    } catch (error) {
      console.error('Failed to update user interests:', error);
    }
  }

  async calculateCategoryWeights() {
    try {
      // Calculate normalized category weights
      const totalWeight = Object.values(this.userInterests).reduce((sum, weight) => sum + weight, 0);
      
      if (totalWeight > 0) {
        this.categoryWeights = {};
        Object.keys(this.userInterests).forEach(category => {
          this.categoryWeights[category] = this.userInterests[category] / totalWeight;
        });
      } else {
        // Default equal weights if no history
        this.categoryWeights = {
          workshop: 0.3,
          talk: 0.2,
          vibe_coding: 0.25,
          social: 0.15,
          other: 0.1
        };
      }

      console.log('📊 Category weights calculated:', this.categoryWeights);
    } catch (error) {
      console.error('Failed to calculate category weights:', error);
    }
  }

  async getPersonalizedRecommendations(allEvents, userProfile, limit = 5) {
    try {
      if (!this.isInitialized) {
        await this.initialize(userProfile, {});
      }

      // If no events provided, try to fetch them
      if (!allEvents || !Array.isArray(allEvents)) {
        console.log('No events provided, fetching from API...');
        try {
          allEvents = await ApiService.getEvents();
        } catch (error) {
          console.error('Failed to fetch events for recommendations:', error);
          return [];
        }
      }

      // Filter out events user is already registered for
      const unregisteredEvents = allEvents.filter(event => 
        event.status !== 'enrolled' && 
        event.status !== 'past' &&
        new Date(event.time) > new Date()
      );

      // Score each event
      const scoredEvents = unregisteredEvents.map(event => ({
        ...event,
        recommendationScore: this.calculateEventScore(event, userProfile),
        score: this.calculateEventScore(event, userProfile) / 100 // Normalized score for display
      }));

      // Sort by score and return top recommendations
      const recommendations = scoredEvents
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit)
        .map(event => ({
          ...event,
          reasons: this.generateRecommendationReason(event, userProfile)
        }));

      console.log(`🎯 Generated ${recommendations.length} personalized recommendations`);
      return recommendations;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return [];
    }
  }

  calculateEventScore(event, userProfile) {
    let score = 0;

    // 1. Category interest score (40% weight)
    const categoryScore = (this.categoryWeights[event.category] || 0) * 40;
    score += categoryScore;

    // 2. Time preference score (20% weight)
    const timeScore = this.calculateTimePreferenceScore(event) * 20;
    score += timeScore;

    // 3. Capacity and popularity score (15% weight)
    const popularityScore = this.calculatePopularityScore(event) * 15;
    score += popularityScore;

    // 4. Level appropriateness score (15% weight)
    const levelScore = this.calculateLevelScore(event, userProfile) * 15;
    score += levelScore;

    // 5. Newness boost (10% weight)
    const newnessScore = this.calculateNewnessScore(event) * 10;
    score += newnessScore;

    // Apply random factor to prevent always showing same events
    const randomFactor = (Math.random() - 0.5) * 5; // ±2.5 points
    score += randomFactor;

    return Math.max(0, score);
  }

  calculateTimePreferenceScore(event) {
    try {
      const eventTime = new Date(event.time);
      const hour = eventTime.getHours();
      const dayOfWeek = eventTime.getDay();

      let score = 0.5; // Base score

      // Prefer weekday events (Monday-Friday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        score += 0.3;
      }

      // Prefer afternoon/evening events (14:00-20:00)
      if (hour >= 14 && hour <= 20) {
        score += 0.2;
      }

      // Slight preference for events not too far in the future
      const daysUntilEvent = Math.ceil((eventTime - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilEvent <= 7) {
        score += 0.1;
      } else if (daysUntilEvent <= 30) {
        score += 0.05;
      }

      return Math.min(1, score);
    } catch (error) {
      return 0.5;
    }
  }

  calculatePopularityScore(event) {
    try {
      const occupancyRate = event.enrolled / event.capacity;
      
      // Sweet spot: 60-85% capacity (popular but not too full)
      if (occupancyRate >= 0.6 && occupancyRate <= 0.85) {
        return 1.0;
      } else if (occupancyRate >= 0.4 && occupancyRate < 0.6) {
        return 0.8;
      } else if (occupancyRate > 0.85) {
        return 0.3; // Very full, might be hard to get in
      } else {
        return 0.5; // Low attendance might indicate lower quality
      }
    } catch (error) {
      return 0.5;
    }
  }

  calculateLevelScore(event, userProfile) {
    try {
      const userLevel = userProfile.level || 1;
      
      // Prefer events slightly above or at user's level
      const difficulty = this.estimateEventDifficulty(event);
      const levelDiff = difficulty - userLevel;
      
      if (levelDiff >= -1 && levelDiff <= 2) {
        return 1.0; // Perfect range
      } else if (levelDiff >= -2 && levelDiff <= 3) {
        return 0.7; // Acceptable range
      } else {
        return 0.3; // Too easy or too hard
      }
    } catch (error) {
      return 0.5;
    }
  }

  estimateEventDifficulty(event) {
    // Estimate difficulty based on category and title keywords
    const advancedKeywords = ['advanced', 'expert', 'master', 'deep dive', 'architecture'];
    const intermediateKeywords = ['intermediate', 'practical', 'hands-on', 'workshop'];
    const beginnerKeywords = ['intro', 'beginner', 'basics', 'fundamentals', 'getting started'];
    
    const title = event.title.toLowerCase();
    const description = (event.description || '').toLowerCase();
    const content = title + ' ' + description;
    
    let difficulty = 3; // Default intermediate
    
    if (advancedKeywords.some(keyword => content.includes(keyword))) {
      difficulty = 5;
    } else if (intermediateKeywords.some(keyword => content.includes(keyword))) {
      difficulty = 3;
    } else if (beginnerKeywords.some(keyword => content.includes(keyword))) {
      difficulty = 1;
    }
    
    // Adjust based on category
    const categoryDifficulty = {
      workshop: 0,
      vibe_coding: 1,
      talk: -1,
      social: -2,
      other: 0
    };
    
    difficulty += categoryDifficulty[event.category] || 0;
    
    return Math.max(1, Math.min(5, difficulty));
  }

  calculateNewnessScore(event) {
    try {
      const eventTime = new Date(event.time);
      const daysUntilEvent = Math.ceil((eventTime - new Date()) / (1000 * 60 * 60 * 24));
      
      // Prefer events announced recently or happening soon
      if (daysUntilEvent <= 3) {
        return 1.0; // Happening very soon
      } else if (daysUntilEvent <= 7) {
        return 0.8; // Happening this week
      } else if (daysUntilEvent <= 14) {
        return 0.6; // Happening next week
      } else {
        return 0.3; // Far in the future
      }
    } catch (error) {
      return 0.5;
    }
  }

  generateRecommendationReason(event, userProfile) {
    const reasons = [];
    
    // Category interest
    const categoryWeight = this.categoryWeights[event.category] || 0;
    if (categoryWeight > 0.3) {
      reasons.push(`You frequently attend ${event.category} events`);
    }
    
    // Level appropriateness
    const userLevel = userProfile?.level || 1;
    const difficulty = this.estimateEventDifficulty(event);
    if (Math.abs(difficulty - userLevel) <= 1) {
      reasons.push('Perfect for your experience level');
    }
    
    // Popularity
    const occupancyRate = (event.enrolled || 0) / (event.capacity || 1);
    if (occupancyRate >= 0.6 && occupancyRate <= 0.85) {
      reasons.push('Popular among students');
    }
    
    // Timing
    const daysUntilEvent = Math.ceil((new Date(event.time) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilEvent <= 7) {
      reasons.push('Happening soon');
    }
    
    // Category-specific reasons
    if (event.category === 'workshop') {
      reasons.push('Hands-on learning');
    } else if (event.category === 'vibe_coding') {
      reasons.push('Coding practice');
    } else if (event.category === 'talk') {
      reasons.push('Knowledge sharing');
    }
    
    // Fallback reasons
    if (reasons.length === 0) {
      reasons.push('Recommended for you');
      reasons.push('Trending event');
    }
    
    return reasons.slice(0, 3); // Return up to 3 reasons
  }

  async getSimilarEvents(baseEvent, allEvents, limit = 3) {
    try {
      const similarEvents = allEvents
        .filter(event => 
          event.id !== baseEvent.id &&
          event.status !== 'past' &&
          new Date(event.time) > new Date()
        )
        .map(event => ({
          ...event,
          similarity: this.calculateEventSimilarity(baseEvent, event)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return similarEvents;
    } catch (error) {
      console.error('Failed to get similar events:', error);
      return [];
    }
  }

  calculateEventSimilarity(event1, event2) {
    let similarity = 0;
    
    // Category similarity (50% weight)
    if (event1.category === event2.category) {
      similarity += 0.5;
    }
    
    // Title keyword similarity (30% weight)
    const keywords1 = this.extractKeywords(event1.title);
    const keywords2 = this.extractKeywords(event2.title);
    const commonKeywords = keywords1.filter(k => keywords2.includes(k));
    const keywordSimilarity = commonKeywords.length / Math.max(keywords1.length, keywords2.length, 1);
    similarity += keywordSimilarity * 0.3;
    
    // Time proximity (20% weight)
    const timeDiff = Math.abs(new Date(event1.time) - new Date(event2.time));
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const timeProximity = Math.max(0, 1 - daysDiff / 30); // Similar if within 30 days
    similarity += timeProximity * 0.2;
    
    return similarity;
  }

  extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  async trackEventInteraction(event, interactionType, additionalData = {}) {
    try {
      // Update user interests
      await this.updateUserInterests(event.category, interactionType);
      
      // Store interaction for future analysis
      const interaction = {
        eventId: event.id,
        eventCategory: event.category,
        interactionType,
        timestamp: new Date().toISOString(),
        ...additionalData
      };
      
      const stored = await AsyncStorage.getItem('event_interactions') || '[]';
      const interactions = JSON.parse(stored);
      interactions.push(interaction);
      
      // Keep only last 500 interactions
      const recentInteractions = interactions.slice(-500);
      await AsyncStorage.setItem('event_interactions', JSON.stringify(recentInteractions));
      
      console.log(`📝 Tracked ${interactionType} interaction for ${event.category} event`);
    } catch (error) {
      console.error('Failed to track event interaction:', error);
    }
  }

  async getRecommendationInsights() {
    try {
      return {
        topCategories: Object.entries(this.categoryWeights)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([category, weight]) => ({ category, weight: Math.round(weight * 100) })),
        totalInteractions: Object.values(this.userInterests).reduce((sum, val) => sum + val, 0),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get recommendation insights:', error);
      return null;
    }
  }

  async clearRecommendationData() {
    try {
      await AsyncStorage.multiRemove(['user_interests', 'event_interactions']);
      this.userInterests = {};
      this.categoryWeights = {};
      this.isInitialized = false;
      console.log('✅ Recommendation data cleared');
    } catch (error) {
      console.error('Failed to clear recommendation data:', error);
    }
  }

  // Simplified method for quick recommendations without requiring events parameter
  async getQuickRecommendations(limit = 3) {
    try {
      return await this.getPersonalizedRecommendations(null, null, limit);
    } catch (error) {
      console.error('Failed to get quick recommendations:', error);
      return [];
    }
  }
}

export default new RecommendationService(); 