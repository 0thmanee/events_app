import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  User,
  Building2,
  Briefcase,
  GraduationCap,
  Star,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/notifications')}>
            <Bell color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push('/settings')}>
            <Settings color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Clean Professional Background
const ProfessionalBackground = () => {
  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.gradientBase}
      />
      {/* Subtle grid pattern */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 20 }, (_, i) => (
          <View
            key={`grid-${i}`}
            style={[
              styles.gridLine,
              i % 4 === 0 ? styles.gridLineMajor : styles.gridLineMinor,
              {
                left: (i * screenWidth) / 19,
                width: 1,
                height: '100%',
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Executive Summary Card
const ExecutiveSummaryCard = ({ data }) => {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  return (
    <Animated.View style={[styles.summaryCard, cardStyle]}>
      <View style={styles.summaryHeader}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{data.name.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{data.name}</Text>
            <Text style={styles.userRole}>Student • {data.program}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.summaryMetrics}>
        <View style={styles.metricGroup}>
          <Text style={styles.metricValue}>{data.currentLevel}</Text>
          <Text style={styles.metricLabel}>Current Level</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricGroup}>
          <Text style={styles.metricValue}>{data.totalCredits}</Text>
          <Text style={styles.metricLabel}>Total Credits</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricGroup}>
          <Text style={styles.metricValue}>#{data.ranking}</Text>
          <Text style={styles.metricLabel}>Class Ranking</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Level Progress</Text>
          <Text style={styles.progressPercentage}>{data.progressPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${data.progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressSubtext}>
          {data.creditsToNext} credits needed for Level {data.currentLevel + 1}
        </Text>
      </View>
    </Animated.View>
  );
};

// Business Metrics Card
const BusinessMetricCard = ({ metric, index }) => {
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 500 });
      cardTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = metric.trend === 'up' ? '#10b981' : '#ef4444';

  return (
    <Animated.View style={[styles.metricCard, cardStyle]}>
      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent', 'rgba(0, 0, 0, 0.1)']}
        style={styles.cardGradientOverlay}
        locations={[0, 0.5, 1]}
      />
      
      <View style={styles.metricHeader}>
        <View style={styles.metricIconContainer}>
          <View style={[styles.iconBackdrop, { backgroundColor: metric.iconColor + '10' }]} />
          <metric.icon color={metric.iconColor} size={20} strokeWidth={1.8} />
        </View>
        {/* <MoreHorizontal color="#4b5563" size={16} strokeWidth={1.5} /> */}
      </View>
      
      <View style={styles.metricContent}>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
      </View>

      <View style={styles.metricFooter}>
        <View style={styles.trendContainer}>
          <TrendIcon color={trendColor} size={14} strokeWidth={1.5} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {metric.change}
          </Text>
        </View>
        <Text style={styles.periodText}>{metric.period}</Text>
      </View>
    </Animated.View>
  );
};

// Professional Event Card
const ProfessionalEventCard = ({ event, index, onPress }) => {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 500 });
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const getStatusConfig = (status) => {
    switch (status) {
      case 'enrolled':
        return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle2, text: 'Enrolled' };
      case 'available':
        return { color: '#2563eb', bg: '#eff6ff', icon: Clock, text: 'Available' };
      case 'waitlist':
        return { color: '#d97706', bg: '#fef3c7', icon: AlertTriangle, text: 'Waitlist' };
      case 'full':
        return { color: '#dc2626', bg: '#fef2f2', icon: Info, text: 'Full' };
      default:
        return { color: '#6b7280', bg: '#f9fafb', icon: Info, text: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Animated.View style={[styles.eventCard, cardStyle]}>
      <Pressable style={styles.eventCardContent} onPress={() => onPress(event)}>
        <View style={styles.eventHeader}>
          <View style={styles.eventMeta}>
            <Text style={styles.eventCategory}>{event.category}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
          <View style={[styles.eventStatus, { backgroundColor: statusConfig.bg }]}>
            <StatusIcon color={statusConfig.color} size={12} strokeWidth={1.5} />
            <Text style={[styles.eventStatusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Clock color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <MapPin color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Users color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.enrolled}/{event.capacity}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventCredits}>
            <Text style={styles.creditsText}>{event.credits} Credits</Text>
          </View>
          <ChevronRight color="#9ca3af" size={16} strokeWidth={1.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Quick Action Button
const QuickActionButton = ({ action, onPress, delay = 0 }) => {
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 400 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <Animated.View style={buttonStyle}>
      <Pressable style={styles.actionButton} onPress={onPress}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
          style={styles.actionGradientOverlay}
        />
        
        <View style={styles.actionIconContainer}>
          <View style={[styles.actionIconBackdrop, { backgroundColor: action.iconColor + '08' }]} />
          <action.icon color={action.iconColor} size={18} strokeWidth={1.8} />
        </View>
        <Text style={styles.actionText}>{action.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

// Main Student Dashboard
export default function StudentDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const studentData = {
    name: 'Si Yhya',
    program: 'Software Engineering',
    currentLevel: 12,
    totalCredits: 875,
    ranking: 23,
    progressPercentage: 73,
    creditsToNext: 125,
  };

  const businessMetrics = [
    {
      icon: Trophy,
      value: '#23',
      label: 'Class Rank',
      change: '+2',
      trend: 'up',
      period: 'This month',
      iconColor: '#f59e0b',
      accentColor: '#f59e0b'
    },
    {
      icon: GraduationCap,
      value: '875',
      label: 'Total Credits',
      change: '+45',
      trend: 'up',
      period: 'This month',
      iconColor: '#8b5cf6',
      accentColor: '#8b5cf6'
    },
    {
      icon: Activity,
      value: '92%',
      label: 'Attendance',
      change: '-2%',
      trend: 'down',
      period: 'This month',
      iconColor: '#ef4444',
      accentColor: '#ef4444'
    },
    {
      icon: Target,
      value: '4.2',
      label: 'GPA',
      change: '+0.1',
      trend: 'up',
      period: 'This semester',
      iconColor: '#10b981',
      accentColor: '#10b981'
    }
  ];

  const quickActions = [
    { icon: Calendar, label: 'Schedule', iconColor: '#6366f1' },
    { icon: BarChart3, label: 'Analytics', iconColor: '#8b5cf6' },
    { icon: Users, label: 'Study Groups', iconColor: '#10b981' },
    { icon: Bell, label: 'Notifications', iconColor: '#f59e0b' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Advanced Data Structures',
      description: 'Deep dive into advanced algorithms and data structure implementations.',
      category: 'Computer Science',
      date: 'Today',
      time: '2:00 PM - 4:00 PM',
      location: 'Room A-101',
      enrolled: 28,
      capacity: 35,
      credits: 15,
      status: 'enrolled'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts, supervised and unsupervised learning.',
      category: 'Artificial Intelligence',
      date: 'Tomorrow',
      time: '10:00 AM - 12:00 PM',
      location: 'Tech Lab B',
      enrolled: 24,
      capacity: 30,
      credits: 20,
      status: 'available'
    },
    {
      id: 3,
      title: 'Software Architecture Patterns',
      description: 'Best practices and design patterns for scalable software systems.',
      category: 'Software Engineering',
      date: 'Jan 15',
      time: '9:00 AM - 11:00 AM',
      location: 'Conference Room',
      enrolled: 40,
      capacity: 40,
      credits: 25,
      status: 'full'
    }
  ];

  const handleEventPress = (event) => {
    router.push(`/event-details?id=${event.id}`);
  };

  const handleActionPress = (action) => {
    switch (action.label) {
      case 'Schedule':
        router.push('/calendar');
        break;
      case 'Analytics':
        router.push('/leaderboard');
        break;
      case 'Study Groups':
        router.push('/events');
        break;
      case 'Notifications':
        // Handle notifications
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader />

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
          {/* Executive Summary */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.summarySection}>
            <ExecutiveSummaryCard data={studentData} />
          </Animated.View>

          {/* Business Metrics */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.metricsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowUpRight color="#9ca3af" size={14} strokeWidth={1.5} />
              </Pressable>
            </View>
            <View style={styles.metricsGrid}>
              {businessMetrics.map((metric, index) => (
                <BusinessMetricCard
                  key={metric.label}
                  metric={metric}
                  index={index}
                />
              ))}
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={action.label}
                  action={action}
                  onPress={() => handleActionPress(action)}
                  delay={800 + index * 100}
                />
              ))}
            </View>
          </Animated.View>

          {/* Upcoming Events */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
              <Pressable style={styles.viewAllButton} onPress={() => router.push('/events')}>
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowUpRight color="#9ca3af" size={14} strokeWidth={1.5} />
              </Pressable>
            </View>

            <View style={styles.eventsContainer}>
              {upcomingEvents.map((event, index) => (
                <ProfessionalEventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onPress={handleEventPress}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 

const styles = StyleSheet.create({
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
    flex: 1,
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

  // Background
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientBase: {
    flex: 1,
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.02,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#374151',
  },
  gridLineMajor: {
    backgroundColor: '#4b5563',
  },
  gridLineMinor: {
    backgroundColor: '#1f2937',
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // Executive Summary
  summarySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f1419',
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f59e0b',
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  metricGroup: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#1a2332',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#0f1419',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 5,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Business Metrics
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  iconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 13,
    opacity: 0.6,
  },
  metricContent: {
    marginBottom: 16,
    zIndex: 1,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 13,
    color: '#8892b0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  periodText: {
    fontSize: 11,
    color: '#5a6475',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Quick Actions
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: (screenWidth - 52) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
  },
  actionGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  actionIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 11,
    opacity: 0.4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#cbd5e1',
    flex: 1,
    letterSpacing: 0.2,
  },

  // Events
  eventsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
  },
  eventCardContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventMeta: {
    flex: 1,
  },
  eventCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  eventStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  eventDetailText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a2332',
  },
  eventCredits: {
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: 40,
  },
}); 