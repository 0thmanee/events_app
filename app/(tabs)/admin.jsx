import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet } from 'react-native';
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
import { 
  Shield,
  BarChart3,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Plus,
  Bell,
  Settings,
  Database,
  Server,
  Zap,
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  ChevronRight,
  Star,
  Flame,
  Target,
  Award,
  Layers,
  Sparkles,
  Crown,
  Rocket,
  User,
  Coins,
  ShoppingBag,
  Trophy,
  UserCheck,
  Wallet,
  Store,
  Medal,
  HeartHandshake,
  Briefcase,
  BookOpen,
  Code,
  Coffee,
  Gamepad2,
  Gauge,
  Zap as Lightning,
  Globe,
  Cpu,
  Activity as Pulse
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Pulsing Badge Component for enhanced visual appeal
const PulsingBadge = ({ children, delay = 0, style }) => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    const startPulsing = () => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    };

    const timer = setTimeout(startPulsing, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Modern floating particles background
const FloatingBackground = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: useSharedValue(Math.random() * screenWidth),
    y: useSharedValue(Math.random() * screenHeight),
    opacity: useSharedValue(Math.random() * 0.1 + 0.05),
    scale: useSharedValue(Math.random() * 0.5 + 0.5),
  }));

  useEffect(() => {
    particles.forEach((particle, index) => {
      particle.x.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenWidth, { duration: 15000 + index * 2000 }),
          withTiming(Math.random() * screenWidth, { duration: 15000 + index * 2000 })
        ),
        -1,
        true
      );
      
      particle.y.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenHeight, { duration: 20000 + index * 1500 }),
          withTiming(Math.random() * screenHeight, { duration: 20000 + index * 1500 })
        ),
        -1,
        true
      );

      particle.opacity.value = withRepeat(
        withSequence(
          withTiming(0.15, { duration: 8000 + index * 1000 }),
          withTiming(0.05, { duration: 8000 + index * 1000 })
        ),
        -1,
        true
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
            { scale: particle.scale.value }
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
    width: 4,
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  
  // Header Section - Modern & Professional
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  
  // Enhanced Header Layout
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  
  // Enhanced Logo and branding
  brandContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  logoIconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoIconGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    opacity: 0.6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    letterSpacing: 3,
    textShadowColor: 'rgba(59, 130, 246, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  
  // Staff Info Section
  staffInfoContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  staffName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  staffRole: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Enhanced Title Section
  titleSection: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  
  // Enhanced Status indicators
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statusGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusDot: {
    width: 10,
    height: 10,
    backgroundColor: '#10b981',
    borderRadius: 5,
    marginRight: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(16, 185, 129, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Enhanced Time Info
  timeInfo: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  currentTime: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '900',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(59, 130, 246, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  currentDate: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  
  // Floating decorative elements
  headerDecoration: {
    position: 'absolute',
    opacity: 0.1,
  },
  
  // Quick Stats Grid - Modern Cards
  quickStatsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendPositive: {
    color: '#10b981',
  },
  trendNeutral: {
    color: '#6b7280',
  },
  
  // Management Grid - Professional Layout
  managementSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    marginRight: 4,
    letterSpacing: 0.5,
  },
  
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  managementCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    height: 160,
  },
  managementCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  managementIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
    numberOfLines: 1,
  },
  managementDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
    numberOfLines: 2,
    textAlign: 'left',
  },
  managementBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  managementBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  managementFloatingIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    opacity: 0.1,
  },
  
  // Enhanced badge with gradient background
  managementBadgeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  
  // Enhanced icon background with glow effect
  managementIconGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    opacity: 0.3,
  },
  
  // Analytics Dashboard Section
  analyticsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  analyticsGrid: {
    gap: 16,
  },
  analyticsCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  analyticsIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsMetric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Recent Activity Feed
  activitySection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  activityFeed: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.5)',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 4,
  },
  activityUser: {
    fontWeight: '700',
    color: '#ffffff',
  },
  activityAction: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activityValue: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 2,
  },
  activityChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Footer
  footerSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  footerCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  footerLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 41, 55, 0.5)',
    paddingTop: 16,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  footerItemLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const masterOpacity = useSharedValue(0);
  const slideY = useSharedValue(30);
  
  // Current time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animations
    masterOpacity.value = withTiming(1, { duration: 1000 });
    slideY.value = withTiming(0, { duration: 800 });
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
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

  // Enhanced data based on new README features
  const quickStats = [
    {
      icon: Users,
      value: '1,247',
      label: 'Active Students',
      trend: '+23 today',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      icon: Calendar,
      value: '18',
      label: 'Pending Events',
      trend: '+5 this week',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      icon: Coins,
      value: '47.2K',
      label: 'Coins Distributed',
      trend: '+1.2K today',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      icon: Trophy,
      value: '89%',
      label: 'Engagement Rate',
      trend: '+7% this month',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  const managementModules = [
    {
      title: 'Event Management',
      description: 'Approve and manage events',
      icon: Calendar,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      badge: 6,
    },
    {
      title: 'Shop Requests',
      description: 'Profile customizations',
      icon: ShoppingBag,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      badge: 3,
    },
    {
      title: 'Wallet System',
      description: 'Monitor transactions',
      icon: Wallet,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      title: 'Leaderboard',
      description: 'Student rankings',
      icon: Medal,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      title: 'Volunteers',
      description: 'Manage applications',
      icon: HeartHandshake,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
    },
    {
      title: 'Analytics',
      description: 'Platform insights',
      icon: BarChart3,
      color: '#06b6d4',
      gradient: ['#06b6d4', '#0891b2'],
    },
  ];

  const recentActivity = [
    {
      type: 'coin_earned',
      user: 'Student #1234',
      action: 'earned 50 coins',
      detail: 'C++ Workshop attendance',
      time: '2 min ago',
      amount: '+50',
      icon: Coins,
      color: '#10b981',
    },
    {
      type: 'shop_request',
      user: 'Student #5678',
      action: 'requested nickname change',
      detail: 'to "algorithm_master"',
      time: '15 min ago',
      amount: '-100',
      icon: User,
      color: '#f59e0b',
    },
    {
      type: 'event_created',
      user: 'Prof. Sarah M.',
      action: 'created new event',
      detail: 'Advanced React Workshop',
      time: '1 hour ago',
      amount: '',
      icon: Plus,
      color: '#3b82f6',
    },
    {
      type: 'volunteer_application',
      user: 'Student #9012',
      action: 'applied as volunteer',
      detail: 'Career Day Tech Fair',
      time: '2 hours ago',
      amount: '',
      icon: HeartHandshake,
      color: '#8b5cf6',
    },
  ];

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
            {/* Modern Header */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.headerSection}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.15)', 'rgba(139, 92, 246, 0.1)', 'transparent']}
                style={styles.headerBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              
              {/* Floating Decorative Elements */}
              <View style={[styles.headerDecoration, { top: 40, right: 60 }]}>
                <Target color="#3b82f6" size={120} strokeWidth={0.5} />
              </View>
              <View style={[styles.headerDecoration, { bottom: 60, left: 40 }]}>
                <Layers color="#8b5cf6" size={100} strokeWidth={0.5} />
              </View>
              <View style={[styles.headerDecoration, { top: 120, left: 20 }]}>
                <Sparkles color="#10b981" size={80} strokeWidth={0.5} />
              </View>
              
              <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                  <View style={styles.brandContainer}>
                    <View style={styles.logoRow}>
                      <View style={styles.logoIcon}>
                        <LinearGradient
                          colors={['#3b82f6', '#1d4ed8', '#1e40af']}
                          style={styles.logoIconGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                        <LinearGradient
                          colors={['rgba(59, 130, 246, 0.8)', 'rgba(29, 78, 216, 0.4)']}
                          style={styles.logoIconGlow}
                        />
                        <Shield color="#ffffff" size={28} strokeWidth={2.5} />
                      </View>
                      <Text style={styles.logoText}>1337</Text>
                    </View>
                    
                    {/* Staff Information */}
                    <Animated.View entering={FadeInRight.delay(400)} style={styles.staffInfoContainer}>
                      <Text style={styles.welcomeText}>Welcome back,</Text>
                      <Text style={styles.staffName}>Ahmed Ben Salah</Text>
                      <Text style={styles.staffRole}>• System Administrator</Text>
                    </Animated.View>
                    
                    {/* Enhanced Title Section */}
                    <Animated.View entering={FadeInUp.delay(600)} style={styles.titleSection}>
                      <Text style={styles.headerTitle}>Admin Center</Text>
                      <Text style={styles.headerSubtitle}>
                        1337 Event Management System
                      </Text>
                    </Animated.View>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <Animated.View entering={FadeInDown.delay(800)} style={styles.statusIndicator}>
                      <LinearGradient
                        colors={['rgba(16, 185, 129, 0.3)', 'rgba(5, 150, 105, 0.2)']}
                        style={styles.statusGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Online</Text>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInLeft.delay(1000)} style={styles.timeInfo}>
                      <Text style={styles.currentTime}>
                        {currentTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </Text>
                      <Text style={styles.currentDate}>
                        {currentTime.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </Animated.View>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Quick Stats */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.quickStatsSection}>
              <View style={styles.statsGrid}>
                {quickStats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={FadeInLeft.delay(600 + index * 100)}
                    style={styles.statCard}
                  >
                    <LinearGradient
                      colors={stat.gradient}
                      style={styles.statCardGradient}
                    />
                    <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20`, borderWidth: 1, borderColor: stat.color }]}>
                      <stat.icon color={stat.color} size={24} strokeWidth={2} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={[styles.statTrend, styles.trendPositive]}>{stat.trend}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Management Modules */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.managementSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Management</Text>
                <AnimatedPressable style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ArrowUpRight color="#3b82f6" size={14} strokeWidth={2} />
                </AnimatedPressable>
              </View>
              
              <View style={styles.managementGrid}>
                {managementModules.map((module, index) => (
                  <Animated.View
                    key={module.title}
                    entering={FadeInRight.delay(1000 + index * 100)}
                  >
                    <AnimatedPressable style={styles.managementCard}>
                      <LinearGradient
                        colors={module.gradient}
                        style={styles.managementCardGradient}
                      />
                      {module.badge && (
                        <PulsingBadge 
                          style={styles.managementBadge}
                          delay={1200 + index * 200}
                        >
                          <LinearGradient
                            colors={['#ef4444', '#dc2626', '#b91c1c']}
                            style={styles.managementBadgeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          />
                          <Text style={styles.managementBadgeText}>{module.badge}</Text>
                        </PulsingBadge>
                      )}
                      <View style={[styles.managementIconContainer, { backgroundColor: `${module.color}20`, borderWidth: 1, borderColor: module.color }]}>
                        <LinearGradient
                          colors={[`${module.color}40`, `${module.color}20`]}
                          style={styles.managementIconGlow}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                        <module.icon color={module.color} size={26} strokeWidth={2} />
                      </View>
                      <Text style={styles.managementTitle} numberOfLines={1} ellipsizeMode="tail">{module.title}</Text>
                      <Text style={styles.managementDesc} numberOfLines={2} ellipsizeMode="tail">{module.description}</Text>
                      <View style={styles.managementFloatingIcon}>
                        <module.icon color={module.color} size={60} strokeWidth={0.5} />
                      </View>
                    </AnimatedPressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Analytics Overview */}
            <Animated.View entering={FadeInUp.delay(1200)} style={styles.analyticsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Platform Analytics</Text>
              </View>
              
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsCard}>
                  <View style={styles.analyticsHeader}>
                    <Text style={styles.analyticsTitle}>System Overview</Text>
                    <View style={styles.analyticsIcon}>
                      <Gauge color="#3b82f6" size={20} strokeWidth={2} />
                    </View>
                  </View>
                  <View style={styles.analyticsMetrics}>
                    <View style={styles.analyticsMetric}>
                      <Text style={styles.metricValue}>99.8%</Text>
                      <Text style={styles.metricLabel}>Uptime</Text>
                    </View>
                    <View style={styles.analyticsMetric}>
                      <Text style={styles.metricValue}>2.1K</Text>
                      <Text style={styles.metricLabel}>Daily Active</Text>
                    </View>
                    <View style={styles.analyticsMetric}>
                      <Text style={styles.metricValue}>156ms</Text>
                      <Text style={styles.metricLabel}>Response Time</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Recent Activity */}
            <Animated.View entering={FadeInUp.delay(1400)} style={styles.activitySection}>
              <View style={styles.activityFeed}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>Recent Activity</Text>
                  <View style={styles.analyticsIcon}>
                    <Pulse color="#3b82f6" size={20} strokeWidth={2} />
                  </View>
                </View>
                
                {recentActivity.map((activity, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInLeft.delay(1600 + index * 100)}
                    style={[styles.activityItem, index === recentActivity.length - 1 && styles.activityItemLast]}
                  >
                    <View style={[styles.activityIconContainer, { backgroundColor: `${activity.color}20`, borderWidth: 1, borderColor: activity.color }]}>
                      <activity.icon color={activity.color} size={20} strokeWidth={2} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>
                        <Text style={styles.activityUser}>{activity.user}</Text>
                        {' '}
                        <Text style={styles.activityAction}>{activity.action}</Text>
                        {activity.detail && (
                          <Text style={{ color: '#9ca3af' }}> • {activity.detail}</Text>
                        )}
                      </Text>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                    {activity.amount && (
                      <View style={styles.activityValue}>
                        <Text style={[styles.activityAmount, { color: activity.amount.startsWith('+') ? '#10b981' : '#ef4444' }]}>
                          {activity.amount}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInUp.delay(1800)} style={styles.footerSection}>
              <View style={styles.footerCard}>
                <View style={styles.footerLogo}>
                  <View style={styles.footerLogoIcon}>
                    <Shield color="#ffffff" size={20} strokeWidth={2} />
                  </View>
                  <Text style={styles.footerLogoText}>1337 Admin</Text>
                </View>
                <Text style={styles.footerText}>
                  Professional event management system for the 1337 coding school community.
                  Built with modern technologies and best practices.
                </Text>
                <View style={styles.footerInfo}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerItemValue}>v2.1.0</Text>
                    <Text style={styles.footerItemLabel}>Version</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerItemValue}>Rabat</Text>
                    <Text style={styles.footerItemLabel}>Location</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerItemValue}>24/7</Text>
                    <Text style={styles.footerItemLabel}>Support</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 