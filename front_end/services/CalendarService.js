import * as Calendar from 'expo-calendar';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CalendarService {
  constructor() {
    this.calendarId = null;
    this.isInitialized = false;
    this.hasPermissions = false;
  }

  async checkPermissions() {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      this.hasPermissions = status === 'granted';
      return this.hasPermissions;
    } catch (error) {
      console.error('Error checking calendar permissions:', error);
      return false;
    }
  }

  async requestPermissions() {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      this.hasPermissions = status === 'granted';
      
      if (!this.hasPermissions) {
        Alert.alert(
          'Calendar Permission Required',
          'To add events to your calendar, please enable calendar access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // On iOS/Android, users need to manually go to settings
              Alert.alert('Settings', 'Please go to Settings > Privacy > Calendars and enable access for this app.');
            }}
          ]
        );
      }
      
      return this.hasPermissions;
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Check if we already have permissions
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        console.log('Calendar permissions not granted');
        return false;
      }

      // Get or create 1337 Events calendar
      this.calendarId = await this.getOrCreate1337Calendar();
      this.isInitialized = !!this.calendarId;
      
      if (this.isInitialized) {
        console.log('✅ CalendarService initialized');
      } else {
        console.log('❌ Failed to initialize CalendarService - no calendar available');
      }
      
      return this.isInitialized;
    } catch (error) {
      console.error('❌ Failed to initialize CalendarService:', error);
      return false;
    }
  }

  async getOrCreate1337Calendar() {
    try {
      // Get available calendars
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      // Look for existing 1337 Events calendar first
      const existingCalendar = calendars.find(cal => 
        cal.title === '1337 Events' && cal.allowsModifications
      );
      
      if (existingCalendar) {
        await AsyncStorage.setItem('1337_calendar_id', existingCalendar.id);
        console.log('📅 Found existing 1337 Events calendar');
        return existingCalendar.id;
      }

      // If we can't create calendars, use the default calendar
      const defaultCalendar = calendars.find(cal => 
        cal.allowsModifications && cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
      );

      if (!defaultCalendar) {
        // Find any writable calendar
        const writableCalendar = calendars.find(cal => cal.allowsModifications);
        if (writableCalendar) {
          console.log('📅 Using existing writable calendar:', writableCalendar.title);
          await AsyncStorage.setItem('1337_calendar_id', writableCalendar.id);
          return writableCalendar.id;
        } else {
          console.error('No writable calendars found');
          return null;
        }
      }

      // Try to create a new calendar
      try {
        let calendarConfig = {
          title: '1337 Events',
          color: '#6366f1',
          entityType: Calendar.EntityTypes.EVENT,
          name: '1337 Events',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        };

        if (Platform.OS === 'android') {
          // For Android, use a simpler configuration
          calendarConfig.source = {
            name: '1337 Events',
            isLocalAccount: true,
          };
        } else {
          // For iOS, get the default calendar source
          const defaultSource = await Calendar.getDefaultCalendarAsync();
          calendarConfig.sourceId = defaultSource.source.id;
          calendarConfig.source = defaultSource.source;
        }

        const calendarId = await Calendar.createCalendarAsync(calendarConfig);
        await AsyncStorage.setItem('1337_calendar_id', calendarId);
        console.log('📅 Created new 1337 Events calendar');
        return calendarId;

      } catch (createError) {
        console.log('Could not create calendar, using default:', createError.message);
        // Fallback to default calendar
        await AsyncStorage.setItem('1337_calendar_id', defaultCalendar.id);
        return defaultCalendar.id;
      }

    } catch (error) {
      console.error('Failed to get/create calendar:', error);
      return null;
    }
  }

  async addEventToCalendar(event) {
    try {
      // Check permissions first
      if (!this.hasPermissions) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Calendar permissions not granted');
        }
      }

      // Initialize if not already done
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Calendar service not available');
        }
      }

      if (!this.calendarId) {
        throw new Error('No calendar available');
      }

      // Parse event time - handle different time formats
      let eventStartDate;
      try {
        eventStartDate = new Date(event.time);
        if (isNaN(eventStartDate.getTime())) {
          // Fallback: try to parse as ISO string or create a default date
          eventStartDate = new Date();
          console.warn('Invalid event time, using current time as fallback');
        }
      } catch (timeError) {
        console.warn('Error parsing event time:', timeError);
        eventStartDate = new Date();
      }

      const eventEndDate = new Date(eventStartDate.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours

      const calendarEvent = {
        title: event.title || 'Untitled Event',
        startDate: eventStartDate,
        endDate: eventEndDate,
        location: event.location || '',
        notes: this.formatEventDescription(event),
        alarms: [
          { relativeOffset: -30 }, // 30 minutes before
          { relativeOffset: -10 }   // 10 minutes before
        ],
      };

      // Only add URL if it's valid
      if (event.id) {
        calendarEvent.url = `https://events.1337.ma/event/${event.id}`;
      }

      const calendarEventId = await Calendar.createEventAsync(this.calendarId, calendarEvent);
      
      // Store mapping between event and calendar event
      if (event.id) {
        await this.storeEventMapping(event.id, calendarEventId);
      }
      
      console.log(`📅 Event "${event.title}" added to calendar`);
      
      // Show success feedback
      Alert.alert(
        'Event Added',
        `"${event.title}" has been added to your calendar with reminders.`,
        [{ text: 'OK' }]
      );
      
      return calendarEventId;
    } catch (error) {
      console.error('Failed to add event to calendar:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Unable to add event to calendar.';
      
      if (error.message.includes('permission')) {
        errorMessage = 'Calendar permission is required to add events.';
      } else if (error.message.includes('not available')) {
        errorMessage = 'Calendar service is not available on this device.';
      }
      
      Alert.alert('Calendar Error', errorMessage, [{ text: 'OK' }]);
      throw error;
    }
  }

  async removeEventFromCalendar(eventId) {
    try {
      const calendarEventId = await this.getCalendarEventId(eventId);
      if (calendarEventId) {
        await Calendar.deleteEventAsync(calendarEventId);
        await this.removeEventMapping(eventId);
        console.log(`📅 Event removed from calendar`);
      }
    } catch (error) {
      console.error('Failed to remove event from calendar:', error);
    }
  }

  async updateEventInCalendar(event) {
    try {
      const calendarEventId = await this.getCalendarEventId(event.id);
      if (calendarEventId) {
        const eventStartDate = new Date(event.time);
        const eventEndDate = new Date(eventStartDate.getTime() + (2 * 60 * 60 * 1000));

        const updates = {
          title: event.title,
          startDate: eventStartDate,
          endDate: eventEndDate,
          location: event.location,
          notes: this.formatEventDescription(event),
        };

        await Calendar.updateEventAsync(calendarEventId, updates);
        console.log(`📅 Event "${event.title}" updated in calendar`);
      }
    } catch (error) {
      console.error('Failed to update event in calendar:', error);
    }
  }

  formatEventDescription(event) {
    let description = event.description || '';
    
    if (event.speakers && event.speakers.length > 0) {
      description += '\n\n🎤 Speakers:\n';
      event.speakers.forEach(speaker => {
        description += `• ${speaker.name}${speaker.bio ? ': ' + speaker.bio : ''}\n`;
      });
    }

    if (event.category) {
      description += `\n🏷️ Category: ${event.category}`;
    }

    if (event.credits) {
      description += `\n🪙 Credits: ${event.credits}`;
    }

    description += '\n\n📱 Powered by 1337 Events App';
    
    return description;
  }

  async generateICalFile(event) {
    try {
      const eventStartDate = new Date(event.time);
      const eventEndDate = new Date(eventStartDate.getTime() + (2 * 60 * 60 * 1000));

      // Format dates for iCal
      const formatICalDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      };

      const startDateStr = formatICalDate(eventStartDate);
      const endDateStr = formatICalDate(eventEndDate);
      const createdDate = formatICalDate(new Date());

      const iCalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//1337 School//1337 Events App//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.id}@events.1337.ma`,
        `DTSTART:${startDateStr}`,
        `DTEND:${endDateStr}`,
        `DTSTAMP:${createdDate}`,
        `CREATED:${createdDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${this.escapeICalText(this.formatEventDescription(event))}`,
        `LOCATION:${this.escapeICalText(event.location || '')}`,
        `URL:https://events.1337.ma/event/${event.id}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'SEQUENCE:0',
        // Add alarms
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'DESCRIPTION:Event reminder',
        'ACTION:DISPLAY',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT10M',
        'DESCRIPTION:Event starting soon',
        'ACTION:DISPLAY',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      return iCalContent;
    } catch (error) {
      console.error('Failed to generate iCal file:', error);
      throw error;
    }
  }

  escapeICalText(text) {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  async shareEventCalendar(event) {
    try {
      const iCalContent = await this.generateICalFile(event);
      const fileName = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, iCalContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/calendar',
        dialogTitle: 'Add Event to Calendar',
        UTI: 'public.calendar-event',
      });

      console.log('📅 Event calendar file shared');
    } catch (error) {
      console.error('Failed to share event calendar:', error);
      Alert.alert('Error', 'Failed to share calendar event');
    }
  }

  async bulkAddEventsToCalendar(events) {
    try {
      const results = [];
      
      for (const event of events) {
        try {
          const calendarEventId = await this.addEventToCalendar(event);
          results.push({ eventId: event.id, success: true, calendarEventId });
        } catch (error) {
          results.push({ eventId: event.id, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      console.log(`📅 Bulk calendar sync: ${successful}/${events.length} events added`);
      
      return results;
    } catch (error) {
      console.error('Failed to bulk add events:', error);
      throw error;
    }
  }

  async storeEventMapping(eventId, calendarEventId) {
    try {
      const stored = await AsyncStorage.getItem('calendar_event_mappings') || '{}';
      const mappings = JSON.parse(stored);
      mappings[eventId] = calendarEventId;
      await AsyncStorage.setItem('calendar_event_mappings', JSON.stringify(mappings));
    } catch (error) {
      console.error('Failed to store event mapping:', error);
    }
  }

  async getCalendarEventId(eventId) {
    try {
      const stored = await AsyncStorage.getItem('calendar_event_mappings') || '{}';
      const mappings = JSON.parse(stored);
      return mappings[eventId] || null;
    } catch (error) {
      console.error('Failed to get calendar event ID:', error);
      return null;
    }
  }

  async removeEventMapping(eventId) {
    try {
      const stored = await AsyncStorage.getItem('calendar_event_mappings') || '{}';
      const mappings = JSON.parse(stored);
      delete mappings[eventId];
      await AsyncStorage.setItem('calendar_event_mappings', JSON.stringify(mappings));
    } catch (error) {
      console.error('Failed to remove event mapping:', error);
    }
  }

  async getCalendarSyncSettings() {
    try {
      const settings = await AsyncStorage.getItem('calendar_sync_settings');
      return settings ? JSON.parse(settings) : {
        autoSync: true,
        syncRegisteredEvents: true,
        syncAllEvents: false,
        reminderTime: 30, // minutes
      };
    } catch (error) {
      console.error('Failed to get calendar sync settings:', error);
      return {};
    }
  }

  async updateCalendarSyncSettings(newSettings) {
    try {
      await AsyncStorage.setItem('calendar_sync_settings', JSON.stringify(newSettings));
      console.log('✅ Calendar sync settings updated');
    } catch (error) {
      console.error('Failed to update calendar sync settings:', error);
    }
  }

  async getSyncedEvents() {
    try {
      const stored = await AsyncStorage.getItem('calendar_event_mappings') || '{}';
      const mappings = JSON.parse(stored);
      return Object.keys(mappings);
    } catch (error) {
      console.error('Failed to get synced events:', error);
      return [];
    }
  }

  async clearAllCalendarData() {
    try {
      await AsyncStorage.multiRemove([
        'calendar_event_mappings',
        'calendar_sync_settings',
        '1337_calendar_id'
      ]);
      this.calendarId = null;
      this.isInitialized = false;
      this.hasPermissions = false;
      console.log('✅ Calendar data cleared');
    } catch (error) {
      console.error('Failed to clear calendar data:', error);
    }
  }

  // Convenience method for opening calendar sync
  async openCalendarSync() {
    try {
      if (!this.hasPermissions) {
        const granted = await this.requestPermissions();
        if (!granted) {
          return false;
        }
      }

      Alert.alert(
        'Calendar Sync',
        'Calendar sync is enabled. New events will automatically be added to your calendar.',
        [
          { text: 'Settings', onPress: () => {
            Alert.alert('Calendar Settings', 'You can manage calendar sync in the app settings.');
          }},
          { text: 'OK' }
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Calendar sync error:', error);
      Alert.alert('Error', 'Unable to access calendar.');
      return false;
    }
  }

  // Check if calendar service is available
  async isAvailable() {
    try {
      const permissions = await this.checkPermissions();
      return permissions;
    } catch (error) {
      console.error('Calendar availability check failed:', error);
      return false;
    }
  }
}

export default new CalendarService(); 