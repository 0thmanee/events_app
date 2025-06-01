import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
      
      // Get push token
      if (Device.isDevice) {
        this.expoPushToken = await this.registerForPushNotificationsAsync();
        console.log('📱 Push token:', this.expoPushToken);
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
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId || 
                       Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      console.log('📱 Expo push token:', token.data);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });

        // Create additional channels for different notification types
        await Notifications.setNotificationChannelAsync('events', {
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

      return token.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
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
}

export default new NotificationService(); 