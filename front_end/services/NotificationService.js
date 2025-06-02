import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { BACKEND_CONFIG } from '../constants/config';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Get FCM token instead of Expo token
async function getFirebaseToken() {
  try {
    if (Platform.OS === 'android') {
      // For Android, we can get the FCM token using Expo's Firebase integration
      const { getExpoPushTokenAsync } = await import('expo-notifications');
      const token = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId
      });
      
      // Extract the actual FCM token from Expo's response
      if (token.data && token.data.includes('ExponentPushToken')) {
        // If we get an Expo token, we need to convert it to FCM
        // For now, let's try to get the FCM token directly
        try {
          const { getDevicePushTokenAsync } = await import('expo-notifications');
          const fcmToken = await getDevicePushTokenAsync();
          console.log('📱 FCM Token obtained:', fcmToken.data.substring(0, 20) + '...');
          return fcmToken.data;
        } catch (error) {
          console.log('⚠️ Could not get FCM token, using Expo token:', error.message);
          return token.data;
        }
      }
      
      return token.data;
    } else if (Platform.OS === 'ios') {
      // For iOS, get the device push token which should be compatible with FCM
      const { getDevicePushTokenAsync } = await import('expo-notifications');
      const token = await getDevicePushTokenAsync();
      console.log('📱 iOS APNs Token obtained:', token.data.substring(0, 20) + '...');
      return token.data;
    }
    
    // Fallback to Expo token
    const { getExpoPushTokenAsync } = await import('expo-notifications');
    const token = await getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId
    });
    return token.data;
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    throw error;
  }
}

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      await this.requestPermissions();
      
      // Set up Android notification channels
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });

        // Create additional channels for different notification types
        await Notifications.setNotificationChannelAsync('events_channel', {
          name: 'Event Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3b82f6',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Event Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 200, 500],
          lightColor: '#f59e0b',
          sound: 'default',
        });
      }
      
      // Get push token
      if (Device.isDevice) {
        this.expoPushToken = await getFirebaseToken();
        console.log('📱 Push token:', this.expoPushToken);
        
        // Register token with backend
        if (this.expoPushToken) {
          await this.registerTokenWithBackend(this.expoPushToken);
        }
      } else {
        console.log('⚠️ Must use physical device for Push Notifications');
      }

      // Configure notification categories
      await this.setupNotificationCategories();

      this.isInitialized = true;
      console.log('✅ NotificationService initialized');
    } catch (error) {
      console.error('❌ Failed to initialize NotificationService:', error);
    }
  }

  async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permissions not granted');
      return false;
    }

    return true;
  }

  async registerForPushNotificationsAsync() {
    try {
      if (!Device.isDevice) {
        console.log('❌ Must use physical device for Push Notifications');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Failed to get push token for push notification!');
        return null;
      }

      // Get FCM/device push token
      const token = await getFirebaseToken();
      
      if (!token) {
        console.log('❌ Failed to get push token');
        return null;
      }

      console.log('✅ Push notification token obtained');
      return token;
    } catch (error) {
      console.error('❌ Error in registerForPushNotificationsAsync:', error);
      throw error;
    }
  }

  async setupNotificationCategories() {
    // Define notification categories with actions
    await Notifications.setNotificationCategoryAsync('EVENT_REMINDER', [
      {
        identifier: 'VIEW_EVENT',
        buttonTitle: 'View Event',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'DISMISS',
        buttonTitle: 'Dismiss',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('EVENT_FEEDBACK', [
      {
        identifier: 'GIVE_FEEDBACK',
        buttonTitle: 'Give Feedback',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'LATER',
        buttonTitle: 'Later',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('EVENT_UPDATE', [
      {
        identifier: 'VIEW_DETAILS',
        buttonTitle: 'View Details',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
  }

  async scheduleEventReminder(event, reminderTime = 30) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const eventTime = new Date(event.time);
      const reminderTimeMs = eventTime.getTime() - (reminderTime * 60 * 1000);
      const now = Date.now();

      if (reminderTimeMs <= now) {
        console.log('Event time has passed, not scheduling reminder');
        return null;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Event Reminder',
          body: `${event.title} starts in ${reminderTime} minutes!`,
          data: {
            eventId: event.id,
            type: 'event_reminder',
            action: 'view_event'
          },
          categoryIdentifier: 'EVENT_REMINDER',
          sound: 'default',
        },
        trigger: {
          date: new Date(reminderTimeMs),
        },
      });

      // Store scheduled notification info
      await this.storeScheduledNotification(identifier, {
        eventId: event.id,
        type: 'event_reminder',
        scheduledFor: new Date(reminderTimeMs),
      });

      console.log(`📅 Event reminder scheduled for ${event.title} at ${new Date(reminderTimeMs)}`);
      return identifier;
    } catch (error) {
      console.error('Failed to schedule event reminder:', error);
      return null;
    }
  }

  async scheduleFeedbackReminder(event, delayHours = 2) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const eventEndTime = new Date(event.time);
      const feedbackReminderTime = eventEndTime.getTime() + (delayHours * 60 * 60 * 1000);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💭 Share Your Feedback',
          body: `How was "${event.title}"? Your feedback helps improve future events!`,
          data: {
            eventId: event.id,
            type: 'feedback_reminder',
            action: 'give_feedback'
          },
          categoryIdentifier: 'EVENT_FEEDBACK',
          sound: 'default',
        },
        trigger: {
          date: new Date(feedbackReminderTime),
        },
      });

      await this.storeScheduledNotification(identifier, {
        eventId: event.id,
        type: 'feedback_reminder',
        scheduledFor: new Date(feedbackReminderTime),
      });

      console.log(`💭 Feedback reminder scheduled for ${event.title}`);
      return identifier;
    } catch (error) {
      console.error('Failed to schedule feedback reminder:', error);
      return null;
    }
  }

  async sendLocalNotification(title, body, data = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      console.log('📨 Local notification sent:', title);
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  async cancelEventNotifications(eventId) {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      const eventNotifications = scheduledNotifications.filter(n => n.eventId === eventId);

      for (const notification of eventNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`🗑️ Cancelled notification for event ${eventId}`);
      }

      // Remove from stored notifications
      await this.removeScheduledNotifications(eventId);
    } catch (error) {
      console.error('Failed to cancel event notifications:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('scheduledNotifications');
      console.log('🗑️ All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async storeScheduledNotification(identifier, notificationData) {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications') || '[]';
      const notifications = JSON.parse(stored);
      
      notifications.push({
        identifier,
        ...notificationData,
        createdAt: new Date(),
      });

      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store scheduled notification:', error);
    }
  }

  async getScheduledNotifications() {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async removeScheduledNotifications(eventId) {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications') || '[]';
      const notifications = JSON.parse(stored);
      
      const filtered = notifications.filter(n => n.eventId !== eventId);
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove scheduled notifications:', error);
    }
  }

  // Get notification settings from user preferences
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : {
        eventReminders: true,
        eventStarting: true,
        newEvents: true,
        eventChanges: true,
        feedbackReminders: true,
        achievements: true,
        reminderTime: 30, // minutes before event
      };
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return {};
    }
  }

  async updateNotificationSettings(newSettings) {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      console.log('✅ Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }

  // Auto-schedule notifications for newly registered events
  async scheduleEventNotifications(event) {
    try {
      const settings = await this.getNotificationSettings();
      
      if (settings.eventReminders) {
        await this.scheduleEventReminder(event, settings.reminderTime || 30);
      }

      if (settings.feedbackReminders) {
        await this.scheduleFeedbackReminder(event, 2);
      }
    } catch (error) {
      console.error('Failed to schedule event notifications:', error);
    }
  }

  getPushToken() {
    return this.expoPushToken;
  }

  async registerTokenWithBackend(token) {
    try {
      const appToken = await AsyncStorage.getItem('appToken');
      
      if (!appToken) {
        console.log('⚠️ No auth token found, will register push token after login');
        // Store token for later registration
        await AsyncStorage.setItem('pendingPushToken', token);
        return;
      }

      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/api/users/device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appToken}`
        },
        body: JSON.stringify({
          token: token,
          platform: platform
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register push token: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Push token registered with backend:', result.message);
      
      // Remove pending token since it's now registered
      await AsyncStorage.removeItem('pendingPushToken');
      
    } catch (error) {
      console.error('❌ Failed to register push token with backend:', error);
      // Store token for retry later
      await AsyncStorage.setItem('pendingPushToken', token);
    }
  }

  async retryPendingTokenRegistration() {
    try {
      const pendingToken = await AsyncStorage.getItem('pendingPushToken');
      const appToken = await AsyncStorage.getItem('appToken');
      
      if (pendingToken && appToken) {
        console.log('🔄 Retrying pending push token registration...');
        await this.registerTokenWithBackend(pendingToken);
      }
    } catch (error) {
      console.error('❌ Failed to retry push token registration:', error);
    }
  }

  async unregisterTokenFromBackend() {
    try {
      const appToken = await AsyncStorage.getItem('appToken');
      
      if (!appToken || !this.expoPushToken) {
        return;
      }

      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/api/users/device-token`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appToken}`
        },
        body: JSON.stringify({
          token: this.expoPushToken
        })
      });

      if (response.ok) {
        console.log('✅ Push token unregistered from backend');
      } else {
        console.error('❌ Failed to unregister push token from backend');
      }
      
    } catch (error) {
      console.error('❌ Error unregistering push token:', error);
    }
  }
}

export default new NotificationService(); 