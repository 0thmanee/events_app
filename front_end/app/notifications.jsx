import { View, Text, ScrollView, Pressable, StatusBar, Dimensions, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft,
  Bell,
  Check,
  X,
  Clock,
  Calendar,
  Trophy,
  Users,
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Trash2,
  Filter,
  Settings,
  MoreHorizontal
} from 'lucide-react-native';
import ApiService from '../services/ApiService';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

const { width: screenWidth } = Dimensions.get('window');

// Color Palette - Minimalist Luxe Light Theme
const colors = {
  primaryBg: '#F5F5F5',      // Soft Off-White
  secondaryBg: '#EAEAEA',    // Light Gray
  primaryText: '#333333',    // Dark Gray
  secondaryText: '#555555',  // Medium Gray
  accent: '#3EB489',         // Mint Green
  highlight: '#E1C3AD',      // Soft Beige
  error: '#D9534F',          // Muted Red
  white: '#FFFFFF',
  lightAccent: '#3EB48920',  // Mint Green with opacity
  lightHighlight: '#E1C3AD30', // Soft Beige with opacity
  cardBorder: '#E0E0E0',     // Light border
  shadow: '#00000015',       // Subtle shadow
  success: '#059669',        // Success green
  warning: '#d97706',        // Warning orange
  info: '#2563eb',           // Info blue
  muted: '#9ca3af'           // Muted text
};

// Student Header Component
const StudentHeader = ({ onBack }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>Your</Text>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton}>
            <Filter color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <MoreHorizontal color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Notification Card Component
const NotificationCard = ({ notification, index, onPress, onMarkRead, onDelete }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event': return { icon: Calendar, color: '#3b82f6' };
      case 'achievement': return { icon: Trophy, color: '#f59e0b' };
      case 'social': return { icon: Users, color: '#10b981' };
      case 'reward': return { icon: Gift, color: '#8b5cf6' };
      case 'alert': return { icon: AlertCircle, color: '#ef4444' };
      case 'success': return { icon: CheckCircle, color: '#10b981' };
      case 'info': return { icon: Info, color: '#6b7280' };
      default: return { icon: Bell, color: '#6b7280' };
    }
  };

  const { icon: NotificationIcon, color } = getNotificationIcon(notification.type);

  return (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.notificationCard}>
      <Pressable style={styles.notificationContent} onPress={() => onPress(notification)}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
          style={styles.notificationGradient}
        />
        
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIconContainer}>
            <View style={[styles.notificationIconBackdrop, { backgroundColor: `${color}20` }]} />
            <NotificationIcon color={color} size={18} strokeWidth={1.5} />
          </View>
          <View style={styles.notificationMeta}>
            <View style={styles.notificationTimestamp}>
              <Clock color={colors.muted} size={12} strokeWidth={1.5} />
              <Text style={styles.timestampText}>{notification.timestamp}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
        </View>

        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>

        {notification.actionRequired && (
          <View style={styles.actionSection}>
            <Text style={styles.actionText}>Action Required</Text>
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={() => onMarkRead(notification.id)}>
                <Check color="#10b981" size={16} strokeWidth={1.5} />
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => onDelete(notification.id)}>
                <X color="#ef4444" size={16} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

// Filter Tab Component
const FilterTab = ({ tabs, selectedTab, onSelect }) => {
  return (
    <View style={styles.filterTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.filterTab, selectedTab === tab.id && styles.filterTabActive]}
            onPress={() => onSelect(tab.id)}
          >
            <Text style={[styles.filterTabText, selectedTab === tab.id && styles.filterTabTextActive]}>
              {tab.name}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.filterBadge, selectedTab === tab.id && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, selectedTab === tab.id && styles.filterBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <Bell color="#6b7280" size={48} strokeWidth={1.5} />
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateText}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );
};

export default function Notifications() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Load user profile and events to generate notifications
      const [userProfile, userStats, upcomingEvents] = await Promise.all([
        ApiService.getUserProfile(),
        ApiService.getUserStats(),
        ApiService.getUpcomingEvents(10)
      ]);

      setUserEvents(upcomingEvents);

      // Generate notifications based on user data and events
      const generatedNotifications = await generateNotifications(userProfile, userStats, upcomingEvents);
      
      // Load any stored notifications
      const storedNotifications = await loadStoredNotifications();
      
      // Combine and sort notifications
      const allNotifications = [...storedNotifications, ...generatedNotifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = async (userProfile, userStats, events) => {
    const notifications = [];
    const now = new Date();

    // Get events that need feedback
    let eventsNeedingFeedback = [];
    try {
      eventsNeedingFeedback = await ApiService.getEventsNeedingFeedback();
    } catch (error) {
      console.log('Could not load feedback events:', error);
    }

    // Feedback reminders for attended events
    eventsNeedingFeedback.forEach(event => {
      const eventTime = new Date(event.time);
      const daysSinceEvent = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceEvent <= 7) { // Show feedback reminder for up to 7 days
        notifications.push({
          id: `feedback-${event._id}`,
          type: 'alert',
          title: 'Feedback Requested',
          message: `Please provide feedback for "${event.title}" you attended`,
          timestamp: getTimeAgo(new Date(now.getTime() - Math.random() * 86400000)),
          read: false,
          actionRequired: true,
          eventId: event._id,
          createdAt: new Date(now.getTime() - Math.random() * 86400000)
        });
      }
    });

    // Event reminders for registered events
    events.forEach(event => {
      const eventTime = new Date(event.time);
      const timeDiff = eventTime.getTime() - now.getTime();
      const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      // Check if user is registered for this event
      const isRegistered = event.attendees?.some(attendee => 
        attendee.user === userProfile._id || attendee.user?._id === userProfile._id
      );

      if (isRegistered) {
        if (hoursUntil >= 0 && hoursUntil <= 2) {
          notifications.push({
            id: `reminder-${event._id}`,
            type: 'event',
            title: 'Event Reminder',
            message: `${event.title} starts in ${hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : `${minutesUntil} minutes`}`,
            timestamp: getTimeAgo(new Date(now.getTime() - Math.random() * 300000)), // Random time in last 5 mins
            read: false,
            actionRequired: false,
            eventId: event._id,
            createdAt: new Date(now.getTime() - Math.random() * 300000)
          });
        }
      } else if (hoursUntil >= 0 && hoursUntil <= 24) {
        // Suggest events happening soon
        notifications.push({
          id: `suggestion-${event._id}`,
          type: 'info',
          title: 'Event Suggestion',
          message: `${event.title} is starting soon. Join now!`,
          timestamp: getTimeAgo(new Date(now.getTime() - Math.random() * 3600000)), // Random time in last hour
          read: Math.random() > 0.5,
          actionRequired: true,
          eventId: event._id,
          createdAt: new Date(now.getTime() - Math.random() * 3600000)
        });
      }
    });

    // Achievement notifications based on user stats
    if (userStats.eventsAttended >= 5 && userStats.eventsAttended < 10) {
      notifications.push({
        id: 'achievement-events-5',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You've attended ${userStats.eventsAttended} events! Keep it up!`,
        timestamp: getTimeAgo(new Date(now.getTime() - Math.random() * 86400000)), // Random time in last day
        read: Math.random() > 0.3,
        actionRequired: false,
        createdAt: new Date(now.getTime() - Math.random() * 86400000)
      });
    }

    // Level up notifications
    if (userProfile.level > 1) {
      notifications.push({
        id: `level-${userProfile.level}`,
        type: 'reward',
        title: 'Level Up!',
        message: `Congratulations! You've reached Level ${userProfile.level}`,
        timestamp: getTimeAgo(new Date(now.getTime() - Math.random() * 86400000)),
        read: Math.random() > 0.4,
        actionRequired: false,
        createdAt: new Date(now.getTime() - Math.random() * 86400000)
      });
    }

    return notifications;
  };

  const loadStoredNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('userNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
      return [];
    }
  };

  const saveNotifications = async (notifications) => {
    try {
      await AsyncStorage.setItem('userNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const filterTabs = [
    { 
      id: 'all', 
      name: 'All', 
      count: notifications.length 
    },
    { 
      id: 'unread', 
      name: 'Unread', 
      count: notifications.filter(n => !n.read).length 
    },
    { 
      id: 'events', 
      name: 'Events', 
      count: notifications.filter(n => n.type === 'event').length 
    },
    { 
      id: 'achievements', 
      name: 'Achievements', 
      count: notifications.filter(n => n.type === 'achievement' || n.type === 'reward').length 
    },
    { 
      id: 'social', 
      name: 'Social', 
      count: notifications.filter(n => n.type === 'social').length 
    },
  ];

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'events':
        return notifications.filter(n => n.type === 'event' || n.type === 'info');
      case 'achievements':
        return notifications.filter(n => n.type === 'achievement' || n.type === 'reward');
      case 'social':
        return notifications.filter(n => n.type === 'social');
      default:
        return notifications;
    }
  };

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification.title);
    
    // Mark as read
    handleMarkRead(notification.id);
    
    // Navigate based on notification type
    if (notification.eventId) {
      router.push(`/event-details?id=${notification.eventId}`);
    }
  };

  const handleMarkRead = (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotifications = notifications.filter(n => n.id !== id);
            setNotifications(updatedNotifications);
            saveNotifications(updatedNotifications);
          }
        }
      ]
    );
  };

  const filteredNotifications = getFilteredNotifications();

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Notifications"
          subMessage="Getting your updates"
          icon={Bell}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <FilterTab 
          tabs={filterTabs}
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#9ca3af"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.notificationsSection}>
              {filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={index}
                  onPress={handleNotificationPress}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  safeArea: {
    flex: 1,
  },

  // Student Header
  studentHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.white,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter Tabs
  filterTabs: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.white,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  filterBadge: {
    backgroundColor: colors.secondaryBg,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: colors.white,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryText,
  },
  filterBadgeTextActive: {
    color: colors.accent,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Notifications Section
  notificationsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
    position: 'relative',
  },
  notificationGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  notificationIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9,
    opacity: 0.4,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  actionText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 40,
  },
}; 