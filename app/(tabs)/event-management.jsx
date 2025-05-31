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
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
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
  Award,
  Star,
  Trophy,
  UserCheck,
  Activity,
  BarChart3,
  Coins,
  Timer,
  BookOpen,
  Briefcase,
  Code,
  Coffee,
  Heart,
  Target,
  Zap,
  Sparkles,
  Flame
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Floating Background for Event Management
const EventFloatingBackground = () => {
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
            style={[styles.eventParticle, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

// Pulsing Status Indicator
const StatusIndicator = ({ status, delay = 0 }) => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    }, delay);
  }, [delay]);

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
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: AlertTriangle };
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

// Event Priority Badge
const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: Zap };
      case 'high':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: AlertTriangle };
      case 'medium':
        return { color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'], icon: Target };
      case 'low':
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Clock };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Clock };
    }
  };

  const config = getPriorityConfig(priority);
  const PriorityIcon = config.icon;

  return (
    <View style={[styles.priorityBadge, { borderColor: config.color }]}>
      <LinearGradient
        colors={[...config.gradient, 'transparent']}
        style={styles.priorityBadgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <PriorityIcon color={config.color} size={10} strokeWidth={2} />
      <Text style={[styles.priorityBadgeText, { color: config.color }]}>{priority}</Text>
    </View>
  );
};

// Event Category Badge
const CategoryBadge = ({ category }) => {
  const getCategoryConfig = (category) => {
    switch (category.toLowerCase()) {
      case 'workshop':
        return { color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'], icon: BookOpen };
      case 'career':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: Briefcase };
      case 'coding':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Code };
      case 'social':
        return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], icon: Heart };
      case 'talk':
        return { color: '#06b6d4', gradient: ['#06b6d4', '#0891b2'], icon: Globe };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Calendar };
    }
  };

  const config = getCategoryConfig(category);
  const CategoryIcon = config.icon;

  return (
    <View style={[styles.categoryBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <CategoryIcon color={config.color} size={12} strokeWidth={2} />
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
  
  // Enhanced Floating Background
  floatingBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  eventParticle: {
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
  
  // Stats Overview
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
  
  // Events List
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
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
  eventTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  eventOrganizer: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  eventBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  eventMetaText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
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
  viewButton: {
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
  viewButtonText: {
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
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  priorityBadgeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function EventManagement() {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
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

  // Sample events data matching 1337 school context
  const events = [
    {
      id: 1,
      title: 'Advanced C Programming Masterclass',
      organizer: '1337 Faculty - Prof. Ahmed Benali',
      category: 'Workshop',
      priority: 'High',
      status: 'pending',
      date: '2024-12-30',
      time: '14:00',
      duration: '3 hours',
      location: 'Lab A - Building 1',
      capacity: 50,
      registered: 42,
      description: 'Deep dive into advanced C programming concepts including memory management, pointers, and system programming. Perfect for students preparing for complex algorithmic challenges.',
      speakers: ['Prof. Ahmed Benali', 'Senior Dev Fatima Z.'],
      submittedAt: '2 hours ago',
    },
    {
      id: 2,
      title: 'Career Day: Tech Giants Recruitment',
      organizer: '1337 Career Services',
      category: 'Career',
      priority: 'Urgent',
      status: 'pending',
      date: '2025-01-15',
      time: '09:00',
      duration: 'Full day',
      location: 'Main Auditorium',
      capacity: 300,
      registered: 287,
      description: 'Meet with recruiters from Google, Microsoft, Facebook, and leading Moroccan tech companies. Network with industry professionals and learn about career opportunities.',
      speakers: ['Google Recruiters', 'Microsoft Team', 'OCP Group Tech'],
      submittedAt: '5 hours ago',
    },
    {
      id: 3,
      title: 'React Native Mobile Development Workshop',
      organizer: 'Student Innovation Club',
      category: 'Coding',
      priority: 'Medium',
      status: 'approved',
      date: '2025-01-08',
      time: '16:00',
      duration: '2 hours',
      location: 'Innovation Hub',
      capacity: 80,
      registered: 67,
      description: 'Learn to build cross-platform mobile applications using React Native. Hands-on workshop covering navigation, state management, and API integration.',
      speakers: ['Senior Student Mentors', 'Industry Expert'],
      submittedAt: '1 day ago',
    },
    {
      id: 4,
      title: 'Cybersecurity Awareness & Ethical Hacking',
      organizer: '1337 Security Team',
      category: 'Workshop',
      priority: 'High',
      status: 'rejected',
      date: '2025-01-20',
      time: '10:00',
      duration: '4 hours',
      location: 'Security Lab',
      capacity: 30,
      registered: 45,
      description: 'Introduction to cybersecurity principles, ethical hacking techniques, and security best practices. Includes hands-on penetration testing exercises.',
      speakers: ['Cybersecurity Expert', '1337 Alumni'],
      submittedAt: '3 days ago',
    },
  ];

  // Stats calculation
  const stats = [
    {
      value: events.filter(e => e.status === 'pending').length,
      label: 'Pending',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      value: events.filter(e => e.status === 'approved').length,
      label: 'Approved',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      value: events.filter(e => e.status === 'rejected').length,
      label: 'Rejected',
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
    },
    {
      value: events.length,
      label: 'Total',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
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
      <EventFloatingBackground />
      
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
                  <Pressable style={styles.backButton}>
                    <ArrowLeft color="#3b82f6" size={20} strokeWidth={2} />
                  </Pressable>
                  
                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Event Management</Text>
                    <Text style={styles.headerSubtitle}>Approve and manage school events</Text>
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
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Search & Filter */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.filterSection}>
              <View style={styles.filterContainer}>
                <Search color="#6b7280" size={18} strokeWidth={2} />
                <Text style={styles.searchInput}>Search events...</Text>
                <Pressable style={styles.filterButton}>
                  <Filter color="#3b82f6" size={16} strokeWidth={2} />
                </Pressable>
              </View>
            </Animated.View>

            {/* Events List */}
            <Animated.View entering={FadeInUp.delay(1000)} style={styles.eventsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pending Events</Text>
                <Pressable style={styles.sortButton}>
                  <Text style={styles.sortButtonText}>Sort by</Text>
                  <ChevronDown color="#9ca3af" size={14} strokeWidth={2} />
                </Pressable>
              </View>
              
              {events.map((event, index) => (
                <Animated.View
                  key={event.id}
                  entering={FadeInLeft.delay(1200 + index * 150)}
                  style={styles.eventCard}
                >
                  <LinearGradient
                    colors={event.priority === 'Urgent' ? ['#ef4444', '#dc2626'] : ['#3b82f6', '#1d4ed8']}
                    style={styles.eventCardGradient}
                  />
                  
                  <View style={styles.eventCardHeader}>
                    <View style={styles.eventCardTop}>
                      <View style={styles.eventTitleContainer}>
                        <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                        <Text style={styles.eventOrganizer}>{event.organizer}</Text>
                      </View>
                      
                      <View style={styles.eventBadges}>
                        <StatusIndicator status={event.status} delay={1400 + index * 100} />
                        <PriorityBadge priority={event.priority} />
                        <CategoryBadge category={event.category} />
                      </View>
                    </View>
                    
                    <View style={styles.eventMeta}>
                      <View style={styles.eventMetaItem}>
                        <Calendar color="#6b7280" size={12} strokeWidth={2} />
                        <Text style={styles.eventMetaText}>{event.date}</Text>
                      </View>
                      <View style={styles.eventMetaItem}>
                        <Clock color="#6b7280" size={12} strokeWidth={2} />
                        <Text style={styles.eventMetaText}>{event.time}</Text>
                      </View>
                      <View style={styles.eventMetaItem}>
                        <MapPin color="#6b7280" size={12} strokeWidth={2} />
                        <Text style={styles.eventMetaText}>{event.location}</Text>
                      </View>
                      <View style={styles.eventMetaItem}>
                        <Users color="#6b7280" size={12} strokeWidth={2} />
                        <Text style={styles.eventMetaText}>{event.registered}/{event.capacity}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.eventDescription} numberOfLines={3}>
                      {event.description}
                    </Text>
                  </View>
                  
                  {event.status === 'pending' && (
                    <View style={styles.eventActions}>
                      <Pressable 
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleEventAction(event.id, 'Reject')}
                      >
                        <XCircle color="#ef4444" size={16} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => console.log('View event details')}
                      >
                        <Eye color="#3b82f6" size={16} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, styles.viewButtonText]}>Details</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleEventAction(event.id, 'Approve')}
                      >
                        <CheckCircle color="#10b981" size={16} strokeWidth={2} />
                        <Text style={[styles.actionButtonText, styles.approveButtonText]}>Approve</Text>
                      </Pressable>
                    </View>
                  )}
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