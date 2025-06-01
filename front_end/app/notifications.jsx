import { View, Text, ScrollView, Pressable, StatusBar, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

const { width: screenWidth } = Dimensions.get('window');

// Student Header Component
const StudentHeader = ({ onBack }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>Your</Text>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton}>
            <Filter color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <MoreHorizontal color="#9ca3af" size={20} strokeWidth={1.5} />
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
              <Clock color="#6b7280" size={12} strokeWidth={1.5} />
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
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filterTabs = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'unread', name: 'Unread', count: 3 },
    { id: 'events', name: 'Events', count: 4 },
    { id: 'achievements', name: 'Achievements', count: 2 },
    { id: 'social', name: 'Social', count: 1 },
  ];

  const notifications = [
    {
      id: 1,
      type: 'event',
      title: 'Event Reminder',
      message: 'Advanced React Native Workshop starts in 30 minutes in Innovation Lab',
      timestamp: '5 minutes ago',
      read: false,
      actionRequired: false
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve completed 10 coding challenges this month. Keep up the great work!',
      timestamp: '1 hour ago',
      read: false,
      actionRequired: false
    },
    {
      id: 3,
      type: 'social',
      title: 'New Study Group',
      message: 'Sarah Kim invited you to join "Machine Learning Study Group"',
      timestamp: '2 hours ago',
      read: false,
      actionRequired: true
    },
    {
      id: 4,
      type: 'reward',
      title: 'Credits Earned',
      message: 'You earned 50 credits for completing the React Workshop',
      timestamp: '3 hours ago',
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'info',
      title: 'Schedule Update',
      message: 'Tomorrow\'s Data Structures class has been moved to Room B-204',
      timestamp: 'Yesterday',
      read: true,
      actionRequired: false
    },
    {
      id: 6,
      type: 'success',
      title: 'Project Approved',
      message: 'Your capstone project proposal has been approved by Prof. Ahmed',
      timestamp: '2 days ago',
      read: true,
      actionRequired: false
    }
  ];

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification.title);
  };

  const handleMarkRead = (id) => {
    console.log('Mark as read:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete notification:', id);
  };

  const filteredNotifications = selectedTab === 'all' 
    ? notifications 
    : selectedTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type.includes(selectedTab.slice(0, -1)));

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
    backgroundColor: '#000000',
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
    borderBottomColor: '#1a2332',
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
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
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
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter Tabs
  filterTabs: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2332',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#1a2332',
    borderColor: '#334155',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#0f1419',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: '#6366f1',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
  },
  filterBadgeTextActive: {
    color: '#ffffff',
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
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
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
    color: '#6b7280',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2332',
  },
  actionText: {
    fontSize: 12,
    color: '#f59e0b',
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
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
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
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 40,
  },
}; 