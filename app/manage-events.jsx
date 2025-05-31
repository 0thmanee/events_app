import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  FadeInUp,
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Plus,
  Edit,
  Trash2,
  Settings,
  Bell,
  User,
  BookOpen,
  Code,
  Briefcase,
  Coffee,
  Star,
  Award,
  Target,
  Activity,
  TrendingUp
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Floating Background
const FloatingBackground = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: useSharedValue(Math.random() * screenWidth),
    y: useSharedValue(Math.random() * screenHeight),
    opacity: useSharedValue(Math.random() * 0.08 + 0.03),
    scale: useSharedValue(Math.random() * 0.8 + 0.4),
    rotation: useSharedValue(Math.random() * 360),
  }));

  useEffect(() => {
    particles.forEach((particle, index) => {
      particle.x.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenWidth, { duration: 20000 + index * 3000 }),
          withTiming(Math.random() * screenWidth, { duration: 20000 + index * 3000 })
        ),
        -1,
        true
      );
      
      particle.y.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenHeight, { duration: 25000 + index * 2000 }),
          withTiming(Math.random() * screenHeight, { duration: 25000 + index * 2000 })
        ),
        -1,
        true
      );

      particle.rotation.value = withRepeat(
        withTiming(particle.rotation.value + 360, { duration: 30000 + index * 5000 }),
        -1,
        false
      );
    });
  }, []);

  return (
    <View style={styles.floatingBackground}>
      {particles.map((particle) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: particle.x.value },
            { translateY: particle.y.value },
            { scale: particle.scale.value },
            { rotate: `${particle.rotation.value}deg` }
          ],
          opacity: particle.opacity.value,
        }));

        return (
          <Animated.View
            key={particle.id}
            style={[styles.particle, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

// Event Status Badge
const EventStatusBadge = ({ status, delay = 0 }) => {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (status === 'pending') {
      setTimeout(() => {
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(1, { duration: 800 })
          ),
          -1,
          true
        );
      }, delay);
    }
  }, [delay, status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Clock };
      case 'approved':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: CheckCircle };
      case 'rejected':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: XCircle };
      case 'draft':
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Edit };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <Animated.View style={[styles.statusBadge, animatedStyle]}>
      <LinearGradient
        colors={config.gradient}
        style={styles.statusBadgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <StatusIcon color="#ffffff" size={12} strokeWidth={2} />
      <Text style={styles.statusBadgeText}>{status.toUpperCase()}</Text>
    </Animated.View>
  );
};

// Event Category Badge
const CategoryBadge = ({ category }) => {
  const getCategoryConfig = (category) => {
    switch (category.toLowerCase()) {
      case 'workshop':
        return { color: '#3b82f6', icon: BookOpen };
      case 'career':
        return { color: '#10b981', icon: Briefcase };
      case 'coding':
        return { color: '#f59e0b', icon: Code };
      case 'social':
        return { color: '#8b5cf6', icon: Coffee };
      default:
        return { color: '#6b7280', icon: Star };
    }
  };

  const config = getCategoryConfig(category);
  const CategoryIcon = config.icon;

  return (
    <View style={[styles.categoryBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <CategoryIcon color={config.color} size={10} strokeWidth={2} />
      <Text style={[styles.categoryBadgeText, { color: config.color }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Floating background
  floatingBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  
  // Header Section
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    opacity: 0.1,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Quick Actions Section
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (screenWidth - 60) / 3,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  actionCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Filter Section
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  
  // Events Section
  eventsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginRight: 4,
  },
  
  // Event Cards
  eventCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  eventCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  eventCardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.5)',
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfoContainer: {
    flex: 1,
    marginRight: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventMetaText: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '600',
  },
  eventBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  
  // Event Actions
  eventActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  rejectButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  approveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  editButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rejectButtonText: {
    color: '#ef4444',
  },
  approveButtonText: {
    color: '#10b981',
  },
  editButtonText: {
    color: '#3b82f6',
  },
  
  // Badge Styles
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  statusBadgeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 3,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function EventManagement() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filterText, setFilterText] = useState('');
  
  // Animation values
  const masterOpacity = useSharedValue(0);
  const slideY = useSharedValue(30);
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animations
    masterOpacity.value = withTiming(1, { duration: 1000 });
    slideY.value = withTiming(0, { duration: 800 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    transform: [{ translateY: slideY.value }],
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Stats data
  const stats = [
    {
      icon: Calendar,
      value: '18',
      label: 'Pending',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      icon: CheckCircle,
      value: '42',
      label: 'Approved',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      icon: Users,
      value: '1.2K',
      label: 'Attendees',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      icon: TrendingUp,
      value: '89%',
      label: 'Success Rate',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  const quickActions = [
    {
      title: 'Create Event',
      subtitle: 'New event',
      icon: Plus,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      title: 'Analytics',
      subtitle: 'View insights',
      icon: Activity,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      title: 'Settings',
      subtitle: 'Configure',
      icon: Settings,
      color: '#6b7280',
      gradient: ['#6b7280', '#4b5563'],
    },
  ];

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Advanced React Native Workshop',
      description: 'Deep dive into React Native development with hands-on projects and real-world examples.',
      category: 'Workshop',
      date: 'Dec 15, 2024',
      time: '14:00 - 17:00',
      location: 'Lab 42',
      capacity: 30,
      registered: 24,
      instructor: 'Prof. Sarah M.',
      status: 'pending',
      submittedAt: '2 hours ago',
    },
    {
      id: 2,
      title: 'Career Day: Tech Industry Insights',
      description: 'Meet with industry professionals and learn about career opportunities in technology.',
      category: 'Career',
      date: 'Dec 20, 2024',
      time: '10:00 - 16:00',
      location: 'Main Auditorium',
      capacity: 200,
      registered: 156,
      instructor: 'HR Team',
      status: 'approved',
      submittedAt: '1 day ago',
    },
    {
      id: 3,
      title: 'Algorithm Challenge Competition',
      description: 'Test your coding skills in this exciting algorithmic problem-solving competition.',
      category: 'Coding',
      date: 'Dec 22, 2024',
      time: '13:00 - 18:00',
      location: 'Computer Lab',
      capacity: 50,
      registered: 47,
      instructor: 'Dev Team',
      status: 'approved',
      submittedAt: '3 days ago',
    },
    {
      id: 4,
      title: 'Student Networking Coffee Break',
      description: 'Informal networking session for students to connect and share experiences.',
      category: 'Social',
      date: 'Dec 18, 2024',
      time: '15:30 - 16:30',
      location: 'Cafeteria',
      capacity: 80,
      registered: 23,
      instructor: 'Student Council',
      status: 'draft',
      submittedAt: '5 days ago',
    },
  ];

  const handleEventAction = (eventId, action) => {
    Alert.alert(
      `${action} Event`,
      `Are you sure you want to ${action.toLowerCase()} this event?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action, 
          style: action === 'Approve' ? 'default' : 'destructive',
          onPress: () => console.log(`${action} event ${eventId}`)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <FloatingBackground />
      
      <SafeAreaView style={styles.container}>
        <Animated.View style={[containerStyle, styles.container]}>
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.headerSection}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'transparent']}
                style={styles.headerBackground}
              />
              <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                  <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <ArrowLeft color="#3b82f6" size={20} strokeWidth={2} />
                  </Pressable>
                  
                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Event Management</Text>
                    <Text style={styles.headerSubtitle}>Manage and approve student events</Text>
                  </View>
                  
                  <View style={styles.headerActions}>
                    <Pressable style={styles.headerActionButton}>
                      <Bell color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                    <Pressable style={styles.headerActionButton}>
                      <Settings color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Stats Overview */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.statsSection}>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={FadeInUp.delay(600 + index * 100)}
                    style={styles.statCard}
                  >
                    <LinearGradient
                      colors={stat.gradient}
                      style={styles.statCardGradient}
                    />
                    <View style={[styles.statIcon, { backgroundColor: `${stat.color}20`, borderWidth: 1, borderColor: stat.color }]}>
                      <stat.icon color={stat.color} size={18} strokeWidth={2} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Quick Actions */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                {quickActions.map((action, index) => (
                  <Animated.View
                    key={action.title}
                    entering={FadeInUp.delay(1000 + index * 100)}
                  >
                    <Pressable style={styles.actionCard}>
                      <LinearGradient
                        colors={action.gradient}
                        style={styles.actionCardGradient}
                      />
                      <View style={[styles.actionIcon, { backgroundColor: `${action.color}20`, borderWidth: 1, borderColor: action.color }]}>
                        <action.icon color={action.color} size={20} strokeWidth={2} />
                      </View>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Search & Filter */}
            <Animated.View entering={FadeInUp.delay(1200)} style={styles.filterSection}>
              <View style={styles.filterContainer}>
                <Search color="#6b7280" size={18} strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search events..."
                  placeholderTextColor="#6b7280"
                  value={filterText}
                  onChangeText={setFilterText}
                />
                <Pressable style={styles.filterButton}>
                  <Filter color="#3b82f6" size={16} strokeWidth={2} />
                </Pressable>
              </View>
            </Animated.View>

            {/* Events List */}
            <Animated.View entering={FadeInUp.delay(1400)} style={styles.eventsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Events Pending Approval</Text>
                <Pressable style={styles.sortButton}>
                  <Text style={styles.sortButtonText}>Sort by</Text>
                  <MoreVertical color="#9ca3af" size={14} strokeWidth={2} />
                </Pressable>
              </View>
              
              {events.map((event, index) => (
                <Animated.View
                  key={event.id}
                  entering={FadeInLeft.delay(1600 + index * 100)}
                  style={styles.eventCard}
                >
                  <LinearGradient
                    colors={event.status === 'pending' ? ['#f59e0b', '#d97706'] : 
                           event.status === 'approved' ? ['#10b981', '#059669'] :
                           ['#ef4444', '#dc2626']}
                    style={styles.eventCardGradient}
                  />
                  
                  <View style={styles.eventCardContent}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventOrganizer}>by {event.instructor}</Text>
                      </View>
                      <View style={styles.eventStatusContainer}>
                        <EventStatusBadge status={event.status} />
                        <CategoryBadge category={event.category} />
                      </View>
                    </View>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetail}>
                        <Calendar color="#6b7280" size={14} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{event.date}</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Clock color="#6b7280" size={14} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{event.time}</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <MapPin color="#6b7280" size={14} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{event.location}</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Users color="#6b7280" size={14} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{event.registered}/{event.capacity}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.eventDescription}>
                      <Text style={styles.eventDescriptionText}>{event.description}</Text>
                    </View>
                    
                    <View style={styles.eventActions}>
                      <Pressable 
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleEventAction(event.id, 'Approve')}
                      >
                        <CheckCircle color="#10b981" size={14} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Approve</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleEventAction(event.id, 'Reject')}
                      >
                        <XCircle color="#ef4444" size={14} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Reject</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[styles.actionButton, styles.detailsButton]}
                        onPress={() => console.log('View details')}
                      >
                        <Eye color="#3b82f6" size={14} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: '#3b82f6' }]}>Details</Text>
                      </Pressable>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 