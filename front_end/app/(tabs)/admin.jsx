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
  withSequence,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../../components/LoadingComponents';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    paddingBottom: 30,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.1,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  
  // Clean Professional Header
  cleanHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 16,
  },
  logoCornerTL: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#3b82f6',
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#3b82f6',
  },
  logoTextLines: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    fontFamily: 'monospace',
    textShadowColor: '#3b82f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    lineHeight: 18,
  },
  logoStatus: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 2,
  },
  profileButton: {
    position: 'relative',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  
  // Modern Header Layout
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  
  // Logo and branding
  brandContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  
  // Status indicators
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'relative',
    marginRight: 12,
  },
  statusPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    opacity: 0.3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    margin: 4,
  },
  statusText: {
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  currentTime: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  currentDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
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
  
  // Enhanced Management Header
  managementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
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
  managementSectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  managementSectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  managementBadgeContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  managementBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Primary Cards (Top 2 - Larger)
  primaryCardsRow: {
    marginBottom: 24,
  },
  primaryCardWrapper: {
    marginBottom: 20,
  },
  primaryManagementCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 24,
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    height: 140,
  },
  primaryCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
  },
  primaryFloatingIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.05,
  },
  primaryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBadgeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  primaryBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '900',
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  primaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 1,
    position: 'relative',
  },
  primaryIconGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    opacity: 0.4,
  },
  primaryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  primaryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  primaryDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  primaryActionHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  primaryActionArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionArrowText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '900',
  },

  // Secondary Cards (Bottom 4 - Grid)
  secondaryCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  secondaryCardWrapper: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
  },
  secondaryManagementCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
  },
  secondaryFloatingIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    opacity: 0.08,
  },
  secondaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  secondaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  secondaryDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  secondaryAccessIndicator: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    borderRadius: 2,
  },

  // System Status Footer
  systemStatus: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#374151',
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    marginRight: 4,
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
    marginTop: 0,
  },
  analyticsCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
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
    width: 36,
    height: 36,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsMetric: {
    alignItems: 'center',
    flex: 1,
  },
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
  
  const router = useRouter();
  
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

  const handleNavigation = (route) => {
    router.push(route);
  };

  // Enhanced data based on new README features
  const quickStats = [
    {
      icon: Clock,
      value: '18',
      label: 'Pending Events',
      trend: '+3 today',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      icon: ShoppingBag,
      value: '8',
      label: 'Shop Requests',
      trend: '+2 this week',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
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
      value: '247',
      label: 'Active Rankings',
      trend: '+12 this week',
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
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
      route: '/event-management',
    },
    {
      title: 'Shop Requests',
      description: 'Profile customizations',
      icon: ShoppingBag,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      badge: 3,
      route: '/manage-shop',
    },
    {
      title: 'Wallet System',
      description: 'Monitor transactions',
      icon: Wallet,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      route: '/manage-wallet',
    },
    {
      title: 'Rankings',
      description: 'Student leaderboards',
      icon: Trophy,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      route: '/manage-ranking',
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
      type: 'ranking_update',
      user: 'Si Yhya',
      action: 'reached new level',
      detail: 'Level 12 - Master Rank',
      time: '2 hours ago',
      amount: '+500 XP',
      icon: Crown,
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
            {/* Clean Professional Header */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.cleanHeader}>
              <View style={styles.headerRow}>
                {/* Innovative Logo */}
                <View style={styles.logoContainer}>
                  <View style={styles.logoSquare}>
                    {/* Corner Accents */}
                    <View style={styles.logoCornerTL} />
                    <View style={styles.logoCornerBR} />
                    
                    {/* Logo Text */}
                    <View style={styles.logoTextLines}>
                      <Text style={styles.logoNumber}>13</Text>
                      <Text style={styles.logoNumber}>37</Text>
                    </View>
                  </View>
                  
                  <View style={styles.logoTextContainer}>
                    <Text style={styles.logoTitle}>EVENT.HUB</Text>
                    <Text style={styles.logoSubtitle}>Professional</Text>
                  </View>
                </View>

                {/* User Profile Icon */}
                <Pressable style={styles.profileButton}>
                  <View style={styles.profileAvatar}>
                    <User color="#3b82f6" size={20} strokeWidth={2} />
                  </View>
                  <View style={styles.profileDot} />
                </Pressable>
              </View>
            </Animated.View>

            {/* Management Modules - Enhanced Layout */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.managementSection}>
              
              {/* Section Title */}
              {/* <Animated.View entering={FadeInDown.delay(900)} style={styles.managementHeader}>
                <View style={styles.headerTitleContainer}>
                  <View style={styles.headerIconContainer}>
                    <Shield color="#3b82f6" size={24} strokeWidth={2} />
                  </View>
                  <View>
                    <Text style={styles.managementSectionTitle}>Management Center</Text>
                    <Text style={styles.managementSectionSubtitle}>Admin Dashboard • Full Control</Text>
                  </View>
                </View>
              </Animated.View> */}

              {/* Primary Cards Row */}
              <View style={styles.primaryCardsRow}>
                {managementModules.slice(0, 2).map((module, index) => (
                  <Animated.View
                    key={module.title}
                    entering={FadeInRight.delay(1000 + index * 150)}
                    style={styles.primaryCardWrapper}
                  >
                    <Pressable 
                      style={styles.primaryManagementCard}
                      onPress={() => handleNavigation(module.route)}
                    >
                      <LinearGradient
                        colors={module.gradient}
                        style={styles.primaryCardGradient}
                      />
                      
                      {/* Floating Background Icon */}
                      <View style={styles.primaryFloatingIcon}>
                        <module.icon color={module.color} size={120} strokeWidth={0.3} />
                      </View>
                      
                      <View style={styles.primaryCardContent}>
                        <View style={[styles.primaryIconContainer, { backgroundColor: `${module.color}15`, borderColor: module.color }]}>
                          <LinearGradient
                            colors={[`${module.color}30`, `${module.color}10`]}
                            style={styles.primaryIconGlow}
                          />
                          <module.icon color={module.color} size={32} strokeWidth={2} />
                        </View>
                        
                        <View style={styles.primaryTextContainer}>
                          <Text style={styles.primaryTitle}>{module.title}</Text>
                          <Text style={styles.primaryDescription}>{module.description}</Text>
                          
                          <View style={styles.primaryActionHint}>
                            <Text style={[styles.primaryActionText, { color: module.color }]}>Tap to manage</Text>
                            <View style={[styles.primaryActionArrow, { backgroundColor: module.color }]}>
                              <Text style={styles.primaryActionArrowText}>→</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>

              {/* Secondary Cards Grid */}
              <View style={styles.secondaryCardsGrid}>
                {managementModules.slice(2).map((module, index) => (
                  <Animated.View
                    key={module.title}
                    entering={FadeInUp.delay(1300 + index * 120)}
                    style={styles.secondaryCardWrapper}
                  >
                    <Pressable 
                      style={styles.secondaryManagementCard}
                      onPress={() => handleNavigation(module.route)}
                    >
                      <LinearGradient
                        colors={[...module.gradient, 'transparent']}
                        style={styles.secondaryCardGradient}
                      />
                      
                      <View style={styles.secondaryFloatingIcon}>
                        <module.icon color={module.color} size={80} strokeWidth={0.4} />
                      </View>
                      
                      <View style={[styles.secondaryIconContainer, { backgroundColor: `${module.color}20`, borderColor: module.color }]}>
                        <module.icon color={module.color} size={24} strokeWidth={2} />
                      </View>
                      
                      <Text style={styles.secondaryTitle}>{module.title}</Text>
                      <Text style={styles.secondaryDescription}>{module.description}</Text>
                      
                      {/* <View style={[styles.secondaryAccessIndicator, { backgroundColor: module.color }]} /> */}
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 