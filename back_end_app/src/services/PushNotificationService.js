const admin = require('firebase-admin');

class PushNotificationService {
  constructor() {
    this.isInitialized = false;
    this.initializeFirebase();
  }

  // Initialize Firebase Admin SDK
  initializeFirebase() {
    try {
      // Check if Firebase app is already initialized
      if (admin.apps.length === 0) {
        // For development/testing, we'll use a mock service account
        // In production, you should use a real Firebase service account
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID || "events-app-dev",
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "mock-key-id",
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "mock-private-key",
          client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@events-app-dev.iam.gserviceaccount.com",
          client_id: process.env.FIREBASE_CLIENT_ID || "mock-client-id",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
        };

        // Initialize Firebase only if we have proper credentials
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id
          });
          
          this.isInitialized = true;
          console.log('🔥 Firebase Admin SDK initialized successfully');
        } else {
          console.log('⚠️ Firebase credentials not found. Push notifications will be simulated.');
          console.log('ℹ️ To enable real push notifications, set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.');
          this.isInitialized = false;
        }
      } else {
        this.isInitialized = true;
        console.log('🔥 Firebase Admin SDK already initialized');
      }
    } catch (error) {
      console.error('❌ Firebase initialization error:', error.message);
      this.isInitialized = false;
    }
  }

  // Send push notification to a single device
  async sendToDevice(deviceToken, notification, data = {}) {
    try {
      if (!this.isInitialized) {
        return this.simulatePushNotification(deviceToken, notification, data);
      }

      const message = {
        token: deviceToken,
        notification: {
          title: notification.title,
          body: notification.message,
          imageUrl: notification.imageUrl || undefined
        },
        data: {
          ...data,
          notificationId: data.notificationId?.toString() || '',
          eventId: data.eventId?.toString() || '',
          type: data.type || 'general',
          actionUrl: data.actionUrl || '',
          timestamp: new Date().toISOString()
        },
        android: {
          notification: {
            icon: 'notification_icon',
            color: '#3EB489', // App accent color
            sound: 'default',
            channelId: 'events_channel',
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true
          },
          data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            ...data
          }
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.message
              },
              badge: 1,
              sound: 'default',
              category: data.type || 'general'
            }
          },
          headers: {
            'apns-priority': '10',
            'apns-collapse-id': data.type || 'general'
          }
        }
      };

      const response = await admin.messaging().send(message);
      console.log(`📱 Push notification sent successfully: ${response}`);
      
      return {
        success: true,
        messageId: response,
        error: null
      };
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      
      return {
        success: false,
        messageId: null,
        error: error.message
      };
    }
  }

  // Send push notification to multiple devices
  async sendToMultipleDevices(deviceTokens, notification, data = {}) {
    try {
      if (!this.isInitialized) {
        return this.simulateMulticastPushNotification(deviceTokens, notification, data);
      }

      if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
        throw new Error('Device tokens array is required and cannot be empty');
      }

      // Filter out invalid tokens
      const validTokens = deviceTokens.filter(token => 
        typeof token === 'string' && token.length > 0
      );

      if (validTokens.length === 0) {
        throw new Error('No valid device tokens provided');
      }

      const message = {
        tokens: validTokens,
        notification: {
          title: notification.title,
          body: notification.message,
          imageUrl: notification.imageUrl || undefined
        },
        data: {
          ...data,
          notificationId: data.notificationId?.toString() || '',
          eventId: data.eventId?.toString() || '',
          type: data.type || 'general',
          actionUrl: data.actionUrl || '',
          timestamp: new Date().toISOString()
        },
        android: {
          notification: {
            icon: 'notification_icon',
            color: '#3EB489',
            sound: 'default',
            channelId: 'events_channel',
            priority: 'high'
          }
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.message
              },
              badge: 1,
              sound: 'default'
            }
          }
        }
      };

      const response = await admin.messaging().sendMulticast(message);
      
      console.log(`📱 Multicast notification sent: ${response.successCount}/${validTokens.length} successful`);
      
      // Log failed tokens for debugging
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push({
              token: validTokens[idx],
              error: resp.error?.message
            });
          }
        });
        console.log('❌ Failed tokens:', failedTokens);
      }

      return {
        success: response.successCount > 0,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
        error: response.failureCount === validTokens.length ? 'All notifications failed' : null
      };
    } catch (error) {
      console.error('❌ Error sending multicast push notification:', error);
      
      return {
        success: false,
        successCount: 0,
        failureCount: deviceTokens.length,
        responses: [],
        error: error.message
      };
    }
  }

  // Send push notification to a topic (for broadcasting)
  async sendToTopic(topic, notification, data = {}) {
    try {
      if (!this.isInitialized) {
        return this.simulateTopicPushNotification(topic, notification, data);
      }

      const message = {
        topic: topic,
        notification: {
          title: notification.title,
          body: notification.message,
          imageUrl: notification.imageUrl || undefined
        },
        data: {
          ...data,
          notificationId: data.notificationId?.toString() || '',
          eventId: data.eventId?.toString() || '',
          type: data.type || 'general',
          actionUrl: data.actionUrl || '',
          timestamp: new Date().toISOString()
        },
        android: {
          notification: {
            icon: 'notification_icon',
            color: '#3EB489',
            sound: 'default',
            channelId: 'events_channel'
          }
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: notification.title,
                body: notification.message
              },
              badge: 1,
              sound: 'default'
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      console.log(`📱 Topic notification sent successfully to "${topic}": ${response}`);
      
      return {
        success: true,
        messageId: response,
        error: null
      };
    } catch (error) {
      console.error(`❌ Error sending topic notification to "${topic}":`, error);
      
      return {
        success: false,
        messageId: null,
        error: error.message
      };
    }
  }

  // Subscribe device to topic
  async subscribeToTopic(deviceTokens, topic) {
    try {
      if (!this.isInitialized) {
        console.log(`📝 [SIMULATION] Subscribed devices to topic "${topic}"`);
        return { success: true, error: null };
      }

      const tokensArray = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];
      const response = await admin.messaging().subscribeToTopic(tokensArray, topic);
      
      console.log(`📝 Successfully subscribed ${response.successCount} devices to topic "${topic}"`);
      
      return {
        success: response.successCount > 0,
        successCount: response.successCount,
        failureCount: response.failureCount,
        error: response.failureCount > 0 ? 'Some subscriptions failed' : null
      };
    } catch (error) {
      console.error(`❌ Error subscribing to topic "${topic}":`, error);
      return { success: false, error: error.message };
    }
  }

  // Unsubscribe device from topic
  async unsubscribeFromTopic(deviceTokens, topic) {
    try {
      if (!this.isInitialized) {
        console.log(`📝 [SIMULATION] Unsubscribed devices from topic "${topic}"`);
        return { success: true, error: null };
      }

      const tokensArray = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];
      const response = await admin.messaging().unsubscribeFromTopic(tokensArray, topic);
      
      console.log(`📝 Successfully unsubscribed ${response.successCount} devices from topic "${topic}"`);
      
      return {
        success: response.successCount > 0,
        successCount: response.successCount,
        failureCount: response.failureCount,
        error: response.failureCount > 0 ? 'Some unsubscriptions failed' : null
      };
    } catch (error) {
      console.error(`❌ Error unsubscribing from topic "${topic}":`, error);
      return { success: false, error: error.message };
    }
  }

  // Simulate push notification when Firebase is not available
  simulatePushNotification(deviceToken, notification, data = {}) {
    console.log(`📱 [SIMULATION] Push notification sent to device:`);
    console.log(`   📱 Token: ${deviceToken.substring(0, 20)}...`);
    console.log(`   📋 Title: ${notification.title}`);
    console.log(`   💬 Message: ${notification.message}`);
    console.log(`   📊 Data:`, data);
    
    return {
      success: true,
      messageId: `simulated_${Date.now()}`,
      error: null,
      simulated: true
    };
  }

  // Simulate multicast push notification
  simulateMulticastPushNotification(deviceTokens, notification, data = {}) {
    console.log(`📱 [SIMULATION] Multicast push notification:`);
    console.log(`   👥 Recipients: ${deviceTokens.length} devices`);
    console.log(`   📋 Title: ${notification.title}`);
    console.log(`   💬 Message: ${notification.message}`);
    console.log(`   📊 Data:`, data);
    
    return {
      success: true,
      successCount: deviceTokens.length,
      failureCount: 0,
      responses: deviceTokens.map(() => ({ success: true })),
      error: null,
      simulated: true
    };
  }

  // Simulate topic push notification
  simulateTopicPushNotification(topic, notification, data = {}) {
    console.log(`📱 [SIMULATION] Topic push notification:`);
    console.log(`   📢 Topic: ${topic}`);
    console.log(`   📋 Title: ${notification.title}`);
    console.log(`   💬 Message: ${notification.message}`);
    console.log(`   📊 Data:`, data);
    
    return {
      success: true,
      messageId: `simulated_topic_${Date.now()}`,
      error: null,
      simulated: true
    };
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      firebaseAppsCount: admin.apps.length,
      mode: this.isInitialized ? 'firebase' : 'simulation'
    };
  }
}

// Export singleton instance
module.exports = new PushNotificationService(); 