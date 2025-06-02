const Notification = require('../models/Notification');
const Event = require('../models/Event');
const cron = require('node-cron');
const PushNotificationService = require('./PushNotificationService');

class NotificationScheduler {
  constructor() {
    this.scheduledJobs = new Map();
    this.isRunning = false;
  }

  // Start the notification scheduler
  start() {
    if (this.isRunning) {
      console.log('Notification scheduler is already running');
      return;
    }

    console.log('🚀 Starting notification scheduler...');
    this.isRunning = true;

    // Schedule reminder checks every hour
    this.hourlyReminderJob = cron.schedule('0 * * * *', async () => {
      try {
        await this.sendEventReminders();
      } catch (error) {
        console.error('Error in hourly reminder job:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    // Schedule daily cleanup at midnight
    this.dailyCleanupJob = cron.schedule('0 0 * * *', async () => {
      try {
        await this.cleanupOldNotifications();
      } catch (error) {
        console.error('Error in daily cleanup job:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    console.log('✅ Notification scheduler started successfully');
  }

  // Stop the notification scheduler
  stop() {
    if (!this.isRunning) {
      console.log('Notification scheduler is not running');
      return;
    }

    console.log('🛑 Stopping notification scheduler...');
    
    if (this.hourlyReminderJob) {
      this.hourlyReminderJob.stop();
    }
    
    if (this.dailyCleanupJob) {
      this.dailyCleanupJob.stop();
    }

    // Cancel all scheduled jobs
    this.scheduledJobs.forEach((job, jobId) => {
      job.cancel();
    });
    this.scheduledJobs.clear();
    
    this.isRunning = false;
    console.log('✅ Notification scheduler stopped');
  }

  // Send event reminders for upcoming events
  async sendEventReminders() {
    try {
      console.log('⏰ Checking for events needing reminders...');
      
      const now = new Date();
      const reminderTime24h = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now
      const reminderTime2h = new Date(now.getTime() + (2 * 60 * 60 * 1000));   // 2 hours from now
      
      // Find events happening within reminder timeframes
      const upcomingEvents = await Event.find({
        date: {
          $gte: now,
          $lte: reminderTime24h
        },
        status: 'approved',
        'attendees.0': { $exists: true } // Has at least one attendee
      }).populate('attendees.user', 'nickname email');

      let remindersSent = 0;

      for (const event of upcomingEvents) {
        const eventTime = new Date(event.date);
        const timeDiff = eventTime.getTime() - now.getTime();
        const hoursUntilEvent = timeDiff / (1000 * 60 * 60);

        // Send 24-hour reminder
        if (hoursUntilEvent <= 24 && hoursUntilEvent > 23) {
          const existing24hReminder = await Notification.findOne({
            relatedEvent: event._id,
            type: 'event_reminder',
            'data.reminderType': '24h'
          });

          if (!existing24hReminder) {
            await this.createEventReminder(event, '24h', 'Don\'t forget! This event is happening tomorrow.');
            remindersSent++;
            console.log(`📱 24h reminder sent for event: ${event.title}`);
          }
        }

        // Send 2-hour reminder
        if (hoursUntilEvent <= 2 && hoursUntilEvent > 1) {
          const existing2hReminder = await Notification.findOne({
            relatedEvent: event._id,
            type: 'event_reminder',
            'data.reminderType': '2h'
          });

          if (!existing2hReminder) {
            await this.createEventReminder(event, '2h', 'Starting soon! This event begins in 2 hours.');
            remindersSent++;
            console.log(`📱 2h reminder sent for event: ${event.title}`);
          }
        }

        // Send 30-minute reminder
        if (hoursUntilEvent <= 0.5 && hoursUntilEvent > 0.25) {
          const existing30mReminder = await Notification.findOne({
            relatedEvent: event._id,
            type: 'event_reminder',
            'data.reminderType': '30m'
          });

          if (!existing30mReminder) {
            await this.createEventReminder(event, '30m', 'Starting very soon! This event begins in 30 minutes.');
            remindersSent++;
            console.log(`📱 30m reminder sent for event: ${event.title}`);
          }
        }
      }

      if (remindersSent > 0) {
        console.log(`✅ Sent ${remindersSent} event reminders`);
      } else {
        console.log('ℹ️ No reminders needed at this time');
      }

      return remindersSent;
    } catch (error) {
      console.error('Error sending event reminders:', error);
      throw error;
    }
  }

  // Create a reminder notification for an event
  async createEventReminder(event, reminderType, customMessage) {
    try {
      const notification = new Notification({
        title: '⏰ Event Reminder',
        message: customMessage || `Don't forget! "${event.title}" is coming up soon.`,
        type: 'event_reminder',
        recipients: event.attendees.map(attendee => ({
          user: attendee.user._id || attendee.user,
          read: false,
          delivered: false
        })),
        relatedEvent: event._id,
        data: {
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.date,
          reminderType: reminderType
        },
        inAppNotification: {
          enabled: true,
          priority: reminderType === '30m' ? 'urgent' : reminderType === '2h' ? 'high' : 'medium',
          actionUrl: `/event-details/${event._id}`,
          actionText: 'View Event'
        },
        pushNotification: {
          enabled: true,
          sent: false
        }
      });

      await notification.save();
      
      // Send actual push notification
      try {
        const User = require('../models/User');
        
        // Get recipient user IDs
        const recipientIds = notification.recipients.map(r => r.user);
        
        // Fetch users with device tokens
        const users = await User.find({ 
          _id: { $in: recipientIds } 
        }).select('deviceTokens pushNotificationSettings nickname');
        
        console.log(`📱 Sending push notifications to ${users.length} users for reminder: ${notification.title}`);
        
        let notificationsSent = 0;
        
        for (const user of users) {
          // Check if user wants push notifications
          if (!user.wantsPushNotification('event_reminder')) {
            console.log(`⏭️ User ${user.nickname} has disabled event reminder notifications`);
            continue;
          }
          
          // Check quiet hours
          if (user.isQuietHours()) {
            console.log(`🔇 User ${user.nickname} is in quiet hours`);
            continue;
          }
          
          // Get active device tokens
          const deviceTokens = user.getActiveDeviceTokens();
          if (deviceTokens.length === 0) {
            console.log(`📱 No active device tokens for user ${user.nickname}`);
            continue;
          }
          
          // Prepare notification data
          const pushData = {
            notificationId: notification._id,
            type: 'event_reminder',
            actionUrl: `/event-details/${event._id}`,
            eventId: event._id,
            eventTitle: event.title,
            reminderType: reminderType,
            timestamp: new Date().toISOString()
          };
          
          // Send push notification
          const result = await PushNotificationService.sendToMultipleDevices(
            deviceTokens,
            {
              title: notification.title,
              message: notification.message
            },
            pushData
          );
          
          if (result.success) {
            notificationsSent += result.successCount || 1;
            console.log(`✅ Push notification sent to ${result.successCount || 1} devices for ${user.nickname}`);
          } else {
            console.log(`❌ Failed to send push notification to ${user.nickname}: ${result.error}`);
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Update notification status
        if (notificationsSent > 0) {
          notification.pushNotification.sent = true;
          notification.pushNotification.sentAt = new Date();
          await notification.save();
          console.log(`📊 Successfully sent ${notificationsSent} push notifications for event reminder`);
        }
        
      } catch (pushError) {
        console.error('❌ Error sending push notifications for reminder:', pushError);
        notification.pushNotification.error = pushError.message;
        await notification.save();
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating event reminder:', error);
      throw error;
    }
  }

  // Schedule a custom reminder for a specific event
  async scheduleEventReminder(eventId, reminderTime, message = null) {
    try {
      const event = await Event.findById(eventId).populate('attendees.user');
      if (!event) {
        throw new Error('Event not found');
      }

      const now = new Date();
      const reminderDate = new Date(reminderTime);
      
      if (reminderDate <= now) {
        throw new Error('Reminder time must be in the future');
      }

      // Schedule the reminder using node-cron
      const cronExpression = this.convertDateToCron(reminderDate);
      const jobId = `reminder_${eventId}_${Date.now()}`;

      const job = cron.schedule(cronExpression, async () => {
        try {
          await this.createEventReminder(event, 'custom', message);
          console.log(`📱 Custom reminder sent for event: ${event.title}`);
          
          // Remove job after execution
          this.scheduledJobs.delete(jobId);
        } catch (error) {
          console.error('Error in scheduled reminder job:', error);
        }
      }, {
        scheduled: true,
        timezone: "UTC"
      });

      this.scheduledJobs.set(jobId, job);
      
      console.log(`📅 Reminder scheduled for ${reminderDate.toISOString()} for event: ${event.title}`);
      
      return jobId;
    } catch (error) {
      console.error('Error scheduling event reminder:', error);
      throw error;
    }
  }

  // Clean up old notifications (older than 30 days)
  async cleanupOldNotifications() {
    try {
      console.log('🧹 Starting notification cleanup...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo }
      });

      console.log(`🗑️ Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }

  // Convert Date to cron expression
  convertDateToCron(date) {
    const minute = date.getUTCMinutes();
    const hour = date.getUTCHours();
    const dayOfMonth = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    
    return `${minute} ${hour} ${dayOfMonth} ${month} *`;
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      scheduledJobs: this.scheduledJobs.size,
      uptime: this.isRunning ? Date.now() - this.startTime : 0
    };
  }
}

// Export singleton instance
module.exports = new NotificationScheduler(); 