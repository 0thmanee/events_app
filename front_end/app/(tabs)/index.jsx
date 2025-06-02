import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring
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
  MoreHorizontal,
  Coins,
  QrCode,
  Smartphone,
  BookOpen,
  Heart,
  Sparkles
} from 'lucide-react-native';
import ApiService from '../../services/ApiService';
import RecommendationService from '../../services/RecommendationService';
import CalendarService from '../../services/CalendarService';
import NotificationService from '../../services/NotificationService';
import NotificationBell from '../../components/NotificationBell';
import { 
  ProfessionalBackground, 
  EventCardSkeleton, 
  SummaryCardSkeleton, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../../components/LoadingComponents';
import usePageTransition from '../../hooks/usePageTransition';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
const StudentHeader = ({ navigateWithTransition }) => {
  return (
    <View style={[styles.studentHeader, { backgroundColor: colors.white }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>Welcome back to your event hub</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell iconSize={20} showBadge={true} />
          <Pressable style={[styles.headerButton, { backgroundColor: colors.secondaryBg }]} onPress={() => navigateWithTransition('/settings', 'Loading settings...')}>
            <Settings color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
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
    <Animated.View style={[styles.summaryCard, cardStyle, { 
      backgroundColor: colors.white,
      borderColor: colors.cardBorder,
      shadowColor: colors.primaryText
    }]}>
      <View style={styles.summaryHeader}>
        <View style={styles.userProfile}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[styles.avatarInitial, { color: colors.white }]}>{data.name.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.primaryText }]}>{data.name}</Text>
            <Text style={[styles.userRole, { color: colors.secondaryText }]}>Student • {data.program}</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryMetrics}>
        <View style={styles.metricGroup}>
          <Text style={[styles.metricValue, { color: colors.primaryText }]}>{data.currentLevel}</Text>
          <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Current Level</Text>
        </View>
        <View style={[styles.metricDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.metricGroup}>
          <Text style={[styles.metricValue, { color: colors.primaryText }]}>{data.totalCredits}</Text>
          <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Total Credits</Text>
        </View>
        <View style={[styles.metricDivider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.metricGroup}>
          <Text style={[styles.metricValue, { color: colors.primaryText }]}>#{data.ranking}</Text>
          <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Ranking</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.primaryText }]}>Level Progress</Text>
          <Text style={[styles.progressPercentage, { color: colors.accent }]}>{data.progressPercentage}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.secondaryBg }]}>
          <View style={[styles.progressFill, { 
            width: `${data.progressPercentage}%`,
            backgroundColor: colors.accent
          }]} />
        </View>
        <Text style={[styles.progressSubtext, { color: colors.secondaryText }]}>
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
  const trendColor = metric.trend === 'up' ? colors.success : colors.error;

  return (
    <Animated.View style={[styles.metricCard, cardStyle, {
      backgroundColor: colors.white,
      borderColor: colors.cardBorder,
      shadowColor: colors.primaryText
    }]}>
      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={[colors.lightAccent, 'transparent', colors.lightHighlight]}
        style={styles.cardGradientOverlay}
        locations={[0, 0.5, 1]}
      />
      
      <View style={styles.metricHeader}>
        <View style={[styles.metricIconContainer, {
          backgroundColor: colors.secondaryBg,
          borderColor: colors.cardBorder
        }]}>
          <View style={[styles.iconBackdrop, { backgroundColor: metric.iconColor + '15' }]} />
          <metric.icon color={metric.iconColor} size={20} strokeWidth={1.8} />
        </View>
      </View>
      
      <View style={styles.metricContent}>
        <Text style={[styles.metricValue, { color: colors.primaryText }]}>{metric.value}</Text>
        <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>{metric.label}</Text>
      </View>

      <View style={styles.metricFooter}>
        <View style={styles.trendContainer}>
          <TrendIcon color={trendColor} size={14} strokeWidth={1.5} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {metric.change}
          </Text>
        </View>
        <Text style={[styles.periodText, { color: colors.muted }]}>{metric.period}</Text>
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
        return { color: colors.success, bg: colors.success + '15', icon: CheckCircle2, text: 'Registered', border: colors.success };
      case 'available':
        return { color: colors.info, bg: colors.info + '15', icon: Clock, text: 'Available', border: colors.info };
      case 'waitlist':
        return { color: colors.warning, bg: colors.warning + '15', icon: AlertTriangle, text: 'Waitlist', border: colors.warning };
      case 'full':
        return { color: colors.error, bg: colors.error + '15', icon: Info, text: 'Full', border: colors.error };
      case 'past':
        return { color: colors.muted, bg: colors.muted + '15', icon: Clock, text: 'Ended', border: colors.muted };
      default:
        return { color: colors.muted, bg: colors.muted + '15', icon: Info, text: 'Unknown', border: colors.muted };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  // Add a subtle border color for registered events
  const cardBorderStyle = event.status === 'enrolled' ? {
    borderLeftWidth: 3,
    borderLeftColor: colors.success
  } : {};

  return (
    <Animated.View style={[styles.eventCard, cardStyle, cardBorderStyle, {
      backgroundColor: colors.white,
      borderColor: colors.cardBorder,
      shadowColor: colors.primaryText
    }]}>
      <Pressable style={styles.eventCardContent} onPress={() => onPress(event)}>
        <View style={styles.eventHeader}>
          <View style={styles.eventMeta}>
            <Text style={[styles.eventCategory, { color: colors.accent }]}>{event.category}</Text>
            <Text style={[styles.eventDate, { color: colors.secondaryText }]}>{event.date}</Text>
          </View>
          <View style={[styles.eventStatus, { 
            backgroundColor: statusConfig.bg,
            borderColor: statusConfig.border,
            borderWidth: 1
          }]}>
            <StatusIcon color={statusConfig.color} size={12} strokeWidth={1.5} />
            <Text style={[styles.eventStatusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        <Text style={[styles.eventTitle, { color: colors.primaryText }]}>{event.title}</Text>
        <Text style={[styles.eventDescription, { color: colors.secondaryText }]}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Clock color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={[styles.eventDetailText, { color: colors.secondaryText }]}>{event.time}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <MapPin color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={[styles.eventDetailText, { color: colors.secondaryText }]}>{event.location}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Users color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={[styles.eventDetailText, { color: colors.secondaryText }]}>{event.enrolled}/{event.capacity}</Text>
          </View>
        </View>

        <View style={[styles.eventFooter, { borderTopColor: colors.cardBorder }]}>
          <View style={[styles.eventCredits, {
            backgroundColor: colors.lightAccent,
            borderColor: colors.accent
          }]}>
            <Text style={[styles.creditsText, { color: colors.accent }]}>{event.credits} Credits</Text>
          </View>
          <View style={styles.registrationIndicator}>
            {event.status === 'enrolled' && (
              <Text style={[styles.registrationText, { color: colors.success }]}>✓ Registered</Text>
            )}
            <ChevronRight color={colors.secondaryText} size={16} strokeWidth={1.5} />
          </View>
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
      <Pressable style={[styles.actionButton, {
        backgroundColor: colors.white,
        borderColor: colors.cardBorder,
        shadowColor: colors.primaryText
      }]} onPress={onPress}>
        {/* Enhanced gradient overlay */}
        <LinearGradient
          colors={[colors.lightAccent, 'transparent', colors.lightHighlight]}
          style={styles.actionGradientOverlay}
          locations={[0, 0.3, 1]}
        />
        
        <View style={[styles.actionIconContainer, {
          backgroundColor: colors.secondaryBg,
          borderColor: colors.cardBorder
        }]}>
          <View style={[styles.actionIconBackdrop, { backgroundColor: action.iconColor + '20' }]} />
          <action.icon color={action.iconColor} size={18} strokeWidth={1.8} />
        </View>
        <Text style={[styles.actionText, { color: colors.primaryText }]}>{action.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

// Recommended Events Component
const RecommendedEventsSection = ({ navigateWithTransition }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const recs = await RecommendationService.getQuickRecommendations(3);
      setRecommendations(recs); // Show top 3
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.recommendationsSection, { paddingHorizontal: 20 }]}>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Recommended for You</Text>
        <EventCardSkeleton />
      </View>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInUp.delay(600)} style={styles.recommendationsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.recommendationHeader}>
          <Sparkles color={colors.highlight} size={20} strokeWidth={1.5} />
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Recommended for You</Text>
        </View>
        <Pressable style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: colors.secondaryText }]}>View All</Text>
          <ArrowUpRight color={colors.secondaryText} size={14} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationsScroll}
      >
        {recommendations.map((event, index) => (
          <Pressable
            key={event.id}
            style={[styles.recommendationCard, {
              backgroundColor: colors.white,
              shadowColor: colors.primaryText,
              borderColor: colors.cardBorder
            }]}
            onPress={() => navigateWithTransition(`/event-details?id=${event.id}`, 'Loading event details...')}
          >
            <LinearGradient
              colors={[colors.lightAccent, 'transparent', colors.lightHighlight]}
              style={styles.recommendationGradient}
              locations={[0, 0.5, 1]}
            />
            
            <View style={styles.recommendationContent}>
              <View style={[styles.recommendationScore, {
                backgroundColor: colors.lightHighlight,
                borderColor: colors.highlight
              }]}>
                <Heart color={colors.accent} size={12} strokeWidth={1.5} />
                <Text style={[styles.scoreText, { color: colors.accent }]}>{Math.round(event.score * 100)}% match</Text>
              </View>
              
              <Text style={[styles.recommendationTitle, { color: colors.primaryText }]}>{event.title}</Text>
              <Text style={[styles.recommendationCategory, { color: colors.accent }]}>{event.category}</Text>
              
              <View style={styles.recommendationDetails}>
                <View style={styles.recommendationDetail}>
                  <Clock color={colors.muted} size={12} strokeWidth={1.5} />
                  <Text style={[styles.recommendationDetailText, { color: colors.secondaryText }]}>{event.time}</Text>
                </View>
                <View style={styles.recommendationDetail}>
                  <MapPin color={colors.muted} size={12} strokeWidth={1.5} />
                  <Text style={[styles.recommendationDetailText, { color: colors.secondaryText }]}>{event.location}</Text>
                </View>
              </View>

              <View style={styles.recommendationTags}>
                {event.reasons?.slice(0, 2).map((reason, idx) => (
                  <View key={idx} style={[styles.reasonTag, {
                    backgroundColor: colors.lightAccent,
                    borderColor: colors.accent
                  }]}>
                    <Text style={[styles.reasonText, { color: colors.accent }]}>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// Quick Access Features Component
const QuickAccessFeatures = ({ navigateWithTransition }) => {
  const quickFeatures = [
    { 
      icon: QrCode, 
      label: 'QR Check-in', 
      iconColor: '#6366f1',
      description: 'Scan event QR codes'
    },
    { 
      icon: Calendar, 
      label: 'Add to Calendar', 
      iconColor: '#10b981',
      description: 'Sync with device calendar'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      iconColor: '#f59e0b',
      description: 'Manage reminders'
    },
    { 
      icon: Sparkles, 
      label: 'Recommendations', 
      iconColor: '#8b5cf6',
      description: 'Personalized events'
    },
  ];

  const handleFeaturePress = (feature) => {
    switch (feature.label) {
      case 'QR Check-in':
        navigateWithTransition('/qr-check-in?mode=scan', 'Opening QR scanner...');
        break;
      case 'Add to Calendar':
        CalendarService.openCalendarSync();
        break;
      case 'Notifications':
        navigateWithTransition('/settings', 'Loading notification settings...');
        break;
      case 'Recommendations':
        navigateWithTransition('/events?filter=recommended', 'Loading recommendations...');
        break;
      default:
        break;
    }
  };

  return (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.quickAccessSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
      </View>

      <View style={styles.quickAccessGrid}>
        {quickFeatures.map((feature, index) => (
          <QuickActionButton
            key={feature.label}
            action={feature}
            onPress={() => handleFeaturePress(feature)}
            delay={index * 100}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Enhanced Business Metrics Section with better layout
const BusinessMetricsSection = ({ businessMetrics, navigateWithTransition }) => {
  if (!businessMetrics || businessMetrics.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.metricsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.metricsHeaderContainer}>
          <BarChart3 color={colors.accent} size={20} strokeWidth={1.5} />
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Academic Overview</Text>
        </View>
        <Pressable style={styles.viewAllButton} onPress={() => navigateWithTransition('/leaderboard', 'Loading analytics...')}>
          <Text style={[styles.viewAllText, { color: colors.secondaryText }]}>Details</Text>
          <ArrowUpRight color={colors.secondaryText} size={14} strokeWidth={1.5} />
        </Pressable>
      </View>

      <View style={styles.metricsGrid}>
        {businessMetrics.slice(0, 4).map((metric, index) => (
          <BusinessMetricCard
            key={metric.label}
            metric={metric}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Floating Action Button for Quick Actions
const FloatingActionButton = ({ navigateWithTransition }) => {
  const fabOpacity = useSharedValue(0);
  const fabScale = useSharedValue(0.8);

  useEffect(() => {
    const timer = setTimeout(() => {
      fabOpacity.value = withSpring(1, { damping: 15, stiffness: 300 });
      fabScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fabStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <Animated.View style={[styles.floatingActionButton, fabStyle]}>
      <Pressable 
        style={[styles.fabButton, {
          backgroundColor: colors.accent,
          shadowColor: colors.primaryText
        }]}
        onPress={() => navigateWithTransition('/events?mode=quick-register', 'Finding available events...')}
      >
        <LinearGradient
          colors={[colors.accent, colors.success]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Plus color={colors.white} size={24} strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
};

// Enhanced Stats Overview Component
const StatsOverviewCard = ({ data }) => {
  const statsData = [
    { label: 'Events Attended', value: data?.eventsAttended || 0, icon: Calendar, color: colors.accent },
    { label: 'Coins Earned', value: data?.coinsEarned || 0, icon: Coins, color: colors.warning },
    { label: 'Volunteering', value: data?.volunteerHours || 0, icon: Heart, color: colors.success },
    { label: 'Current Level', value: data?.currentLevel || 1, icon: Star, color: colors.info },
  ];

  return (
    <Animated.View entering={FadeInUp.delay(500)} style={styles.statsOverviewSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.statsHeaderContainer}>
          <Activity color={colors.accent} size={20} strokeWidth={1.5} />
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Activity Overview</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <Animated.View 
            key={stat.label}
            entering={FadeInDown.delay(600 + index * 100)}
            style={[styles.statCard, {
              backgroundColor: colors.white,
              borderColor: colors.cardBorder,
              shadowColor: colors.primaryText
            }]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
              <stat.icon color={stat.color} size={18} strokeWidth={1.5} />
            </View>
            <Text style={[styles.statValue, { color: colors.primaryText }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{stat.label}</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

// Main Student Dashboard
export default function StudentDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { isNavigating, navigationMessage, navigateWithTransition } = usePageTransition();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const data = await ApiService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Show loading state
  if (loading && !dashboardData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primaryBg }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Dashboard"
          subMessage="Fetching your student data and upcoming events"
          icon={Activity}
        />
      </View>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.primaryBg }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={AlertTriangle}
          message="Unable to Load Dashboard"
          subMessage={error}
        />
      </View>
    );
  }

  // Use real data or fallback to empty states
  const studentData = dashboardData?.user || {
    name: 'Student',
    program: 'Loading...',
    currentLevel: 1,
    totalCredits: 0,
    ranking: 0,
    progressPercentage: 0,
    creditsToNext: 0,
  };

  const businessMetrics = dashboardData?.metrics?.map(metric => ({
    icon: getIconForMetric(metric.label),
    value: metric.value,
    label: metric.label,
    change: metric.change,
    trend: metric.trend,
    period: metric.period,
    iconColor: getColorForMetric(metric.label),
    accentColor: getColorForMetric(metric.label)
  })) || [];

  // Helper function to get icon for metric
  function getIconForMetric(label) {
    switch (label) {
      case 'Class Rank': return Trophy;
      case 'Total Credits': return GraduationCap;
      case 'Attendance': return Activity;
      case 'GPA': return Target;
      default: return Star;
    }
  }

  // Helper function to get color for metric
  function getColorForMetric(label) {
    switch (label) {
      case 'Class Rank': return '#f59e0b';
      case 'Total Credits': return '#8b5cf6';
      case 'Attendance': return '#ef4444';
      case 'GPA': return '#10b981';
      default: return '#6b7280';
    }
  }

  const quickActions = [
    { icon: Calendar, label: 'Schedule', iconColor: '#6366f1' },
    { icon: BarChart3, label: 'Analytics', iconColor: '#8b5cf6' },
    { icon: Users, label: 'Study Groups', iconColor: '#10b981' },
    { icon: Bell, label: 'Notifications', iconColor: '#f59e0b' },
  ];

  const upcomingEvents = dashboardData?.upcomingEvents || [];

  const handleEventPress = (event) => {
    navigateWithTransition(`/event-details?id=${event.id}`, 'Loading event details...');
  };

  const handleActionPress = (action) => {
    switch (action.label) {
      case 'Schedule':
        navigateWithTransition('/calendar', 'Loading calendar...');
        break;
      case 'Analytics':
        navigateWithTransition('/leaderboard', 'Loading leaderboard...');
        break;
      case 'Study Groups':
        navigateWithTransition('/events', 'Loading events...');
        break;
      case 'Notifications':
        navigateWithTransition('/notifications', 'Loading notifications...');
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryBg }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader navigateWithTransition={navigateWithTransition} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Executive Summary */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.summarySection}>
            <ExecutiveSummaryCard data={studentData} />
          </Animated.View>

          {/* Quick Access Features */}
          <QuickAccessFeatures navigateWithTransition={navigateWithTransition} />

          {/* Business Metrics */}
          {/* <BusinessMetricsSection businessMetrics={businessMetrics} navigateWithTransition={navigateWithTransition} /> */}

          {/* Stats Overview */}
          <StatsOverviewCard data={studentData} />

          {/* Recommended Events */}
          <RecommendedEventsSection navigateWithTransition={navigateWithTransition} />

          {/* Upcoming Events */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Upcoming Events</Text>
              <Pressable style={styles.viewAllButton} onPress={() => navigateWithTransition('/events', 'Loading all events...')}>
                <Text style={[styles.viewAllText, { color: colors.secondaryText }]}>View All</Text>
                <ArrowUpRight color={colors.secondaryText} size={14} strokeWidth={1.5} />
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

      {/* Floating Action Button */}
      <FloatingActionButton navigateWithTransition={navigateWithTransition} />

      {/* Page Transition Loading Overlay */}
      <PageTransitionLoading visible={isNavigating} message={navigationMessage} />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  studentHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
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
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
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
    color: colors.primaryText,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 20,
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
    color: colors.primaryText,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.secondaryBg,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 5,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },

  // Bottom spacing
  bottomSpacer: {
    height: 40,
  },

  // Business Metrics
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    color: colors.muted,
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
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    color: colors.primaryText,
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
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: colors.secondaryText,
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
    color: colors.primaryText,
    marginBottom: 6,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.secondaryText,
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
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  eventCredits: {
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  registrationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registrationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
    letterSpacing: 0.3,
  },

  // Recommended Events
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendationsScroll: {
    gap: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  recommendationCard: {
    width: screenWidth * 0.8,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 16,
  },
  recommendationGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  recommendationContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  recommendationScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: colors.lightHighlight,
    borderWidth: 1,
    borderColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
    lineHeight: 22,
  },
  recommendationCategory: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  recommendationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  recommendationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendationDetailText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  recommendationTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  reasonTag: {
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reasonText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Quick Access
  quickAccessSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  // Floating Action Button
  floatingActionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },

  // Stats Overview
  statsOverviewSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
}); 