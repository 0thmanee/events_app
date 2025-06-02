import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
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
    backgroundColor: colors.primaryBg,
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
    backgroundColor: colors.accent,
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
    paddingBottom: 32,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: colors.white,
    // borderWidth: 2,
    // borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 16,
    borderRadius: 16,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.accent,
    borderTopLeftRadius: 8,
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.accent,
    borderBottomRightRadius: 8,
  },
  logoTextLines: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 1,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  logoStatus: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
    shadowColor: colors.success,
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
    color: colors.primaryText,
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  logoSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
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
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profileDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: colors.success,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
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
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryText,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.secondaryText,
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
    backgroundColor: colors.success,
    opacity: 0.3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    margin: 4,
  },
  statusText: {
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  currentTime: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  currentDate: {
    fontSize: 12,
    color: colors.secondaryText,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '600',
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendPositive: {
    color: colors.success,
  },
  trendNeutral: {
    color: colors.secondaryText,
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
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  managementSectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryText,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  managementSectionSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  managementBadgeContainer: {
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  managementBadgeText: {
    fontSize: 12,
    color: colors.primaryText,
    fontWeight: '900',
  },

  // Primary Cards (Top 2 - Larger)
  primaryCardsRow: {
    marginBottom: 24,
  },
  primaryCardWrapper: {
    marginBottom: 20,
  },
  primaryManagementCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    height: 140,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
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
    color: colors.white,
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
    color: colors.primaryText,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  primaryDescription: {
    fontSize: 14,
    color: colors.secondaryText,
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
    color: colors.white,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  secondaryDescription: {
    fontSize: 12,
    color: colors.secondaryText,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    color: colors.primaryText,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.cardBorder,
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
    color: colors.primaryText,
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: colors.accent,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    height: 160,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    marginBottom: 6,
    letterSpacing: 0.5,
    numberOfLines: 1,
  },
  managementDesc: {
    fontSize: 13,
    color: colors.secondaryText,
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
    shadowColor: colors.error,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    letterSpacing: 0.5,
  },
  analyticsIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: 0.5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
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
    color: colors.primaryText,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityUser: {
    fontWeight: '700',
    color: colors.primaryText,
  },
  activityAction: {
    fontWeight: '600',
    color: colors.accent,
  },
  activityTime: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  activityValue: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogoIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  footerLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryText,
    fontFamily: 'monospace',
  },
  footerText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 16,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  footerItemLabel: {
    fontSize: 12,
    color: colors.secondaryText,
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
    StatusBar.setBarStyle('dark-content');
    
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
      color: colors.warning,
      gradient: [colors.warning, colors.warning],
    },
    {
      icon: ShoppingBag,
      value: '8',
      label: 'Shop Requests',
      trend: '+2 this week',
      color: colors.highlight,
      gradient: [colors.highlight, colors.highlight],
    },
    {
      icon: Coins,
      value: '47.2K',
      label: 'Coins Distributed',
      trend: '+1.2K today',
      color: colors.success,
      gradient: [colors.success, colors.success],
    },
    {
      icon: Trophy,
      value: '247',
      label: 'Active Rankings',
      trend: '+12 this week',
      color: colors.error,
      gradient: [colors.error, colors.error],
    },
  ];

  const managementModules = [
    {
      title: 'Event Management',
      description: 'Approve and manage events',
      icon: Calendar,
      color: colors.info,
      gradient: [colors.info, colors.info],
      badge: 6,
      route: '/event-management',
    },
    {
      title: 'Shop Requests',
      description: 'Profile customizations',
      icon: ShoppingBag,
      color: colors.warning,
      gradient: [colors.warning, colors.warning],
      badge: 3,
      route: '/manage-shop',
    },
    {
      title: 'Wallet System',
      description: 'Monitor transactions',
      icon: Wallet,
      color: colors.success,
      gradient: [colors.success, colors.success],
      route: '/manage-wallet',
    },
    {
      title: 'Rankings',
      description: 'Student leaderboards',
      icon: Trophy,
      color: colors.error,
      gradient: [colors.error, colors.error],
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
      color: colors.success,
    },
    {
      type: 'shop_request',
      user: 'Student #5678',
      action: 'requested nickname change',
      detail: 'to "algorithm_master"',
      time: '15 min ago',
      amount: '-100',
      icon: User,
      color: colors.warning,
    },
    {
      type: 'event_created',
      user: 'Prof. Sarah M.',
      action: 'created new event',
      detail: 'Advanced React Workshop',
      time: '1 hour ago',
      amount: '',
      icon: Plus,
      color: colors.info,
    },
    {
      type: 'ranking_update',
      user: 'Si Yhya',
      action: 'reached new level',
      detail: 'Level 12 - Master Rank',
      time: '2 hours ago',
      amount: '+500 XP',
      icon: Crown,
      color: colors.accent,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
            <View style={styles.cleanHeader}>
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

                {/* Settings Button */}
                <Pressable style={styles.profileButton} onPress={() => router.push('/settings')}>
                  <View style={styles.profileAvatar}>
                    <Settings color={colors.accent} size={20} strokeWidth={2} />
                  </View>
                  <View style={styles.profileDot} />
                </Pressable>
              </View>
            </View>

            {/* Management Modules - Enhanced Layout */}
            <View style={styles.managementSection}>
              
              {/* Section Title */}
              {/* <Animated.View entering={FadeInDown.delay(900)} style={styles.managementHeader}>
                <View style={styles.headerTitleContainer}>
                  <View style={styles.headerIconContainer}>
                    <Shield color={colors.info} size={24} strokeWidth={2} />
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
                  <View
                    key={module.title}
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
                  </View>
                ))}
              </View>

              {/* Secondary Cards Grid */}
              <View style={styles.secondaryCardsGrid}>
                {managementModules.slice(2).map((module, index) => (
                  <View
                    key={module.title}
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
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 