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
  User
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enhanced grid pattern with subtle movement
const GridPattern = () => {
  const opacity = useSharedValue(0.03);
  const shift = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(0.05, { duration: 2000 });
    shift.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 8000 }),
        withTiming(0, { duration: 8000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: shift.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { 
      position: 'absolute', 
      width: '100%', 
      height: '100%',
      pointerEvents: 'none'
    }]}>
      {Array.from({ length: 8 }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: (i + 1) * (screenWidth / 8),
            top: 0,
            width: 1,
            height: '100%',
            backgroundColor: '#1f2937',
          }}
        />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: (i + 1) * (screenHeight / 15),
            left: 0,
            width: '100%',
            height: 1,
            backgroundColor: '#1f2937',
          }}
        />
      ))}
    </Animated.View>
  );
};

// Animated Footer Background Component
const FooterBackground = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: useSharedValue(Math.random() * screenWidth),
    y: useSharedValue(Math.random() * 400),
    opacity: useSharedValue(Math.random() * 0.5 + 0.2),
  }));

  const gradientShift = useSharedValue(0);

  useEffect(() => {
    // Animate particles
    particles.forEach((particle, index) => {
      particle.x.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenWidth, { duration: 8000 + index * 1000 }),
          withTiming(Math.random() * screenWidth, { duration: 8000 + index * 1000 })
        ),
        -1,
        true
      );
      
      particle.y.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 400, { duration: 6000 + index * 800 }),
          withTiming(Math.random() * 400, { duration: 6000 + index * 800 })
        ),
        -1,
        true
      );

      particle.opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 3000 + index * 500 }),
          withTiming(0.2, { duration: 3000 + index * 500 })
        ),
        -1,
        true
      );
    });

    // Gradient animation
    gradientShift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000 }),
        withTiming(0, { duration: 8000 })
      ),
      -1,
      true
    );
  }, []);

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(gradientShift.value, [0, 1], [0.1, 0.3]),
  }));

  return (
    <View style={styles.footerBackground}>
      {/* Animated gradient overlay */}
      <Animated.View style={[gradientStyle]}>
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6', '#10b981']}
          style={styles.footerGradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Floating particles */}
      {particles.map((particle) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: particle.x.value },
            { translateY: particle.y.value },
          ],
          opacity: particle.opacity.value,
        }));

        return (
          <Animated.View
            key={particle.id}
            style={[styles.footerParticle, animatedStyle]}
          />
        );
      })}

      {/* Floating geometric elements */}
      <Animated.View style={[styles.footerFloatingElement, { top: 60, left: 40 }]}>
        <Target color="#3b82f6" size={80} strokeWidth={0.5} />
      </Animated.View>
      <Animated.View style={[styles.footerFloatingElement, { top: 200, right: 30 }]}>
        <Layers color="#10b981" size={60} strokeWidth={0.5} />
      </Animated.View>
      <Animated.View style={[styles.footerFloatingElement, { bottom: 120, left: 60 }]}>
        <Sparkles color="#8b5cf6" size={70} strokeWidth={0.5} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // Header Section - Enhanced
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  logoContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 28,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoContent: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#3b82f6',
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#3b82f6',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  statusIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: '#10b981',
    borderRadius: 5,
  },
  pulseRing: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#10b981',
    opacity: 0.4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 10,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(59, 130, 246, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 90,
    height: 2,
    backgroundColor: '#3b82f6',
    marginBottom: 18,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 18,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statusDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    marginRight: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 17,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
    fontWeight: '400',
  },
  
  // Hero Stats - Enhanced Impact
  heroSection: {
    marginBottom: 50,
  },
  sectionTitleContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#3b82f6',
    marginTop: 8,
    borderRadius: 2,
  },
  
  // Hero Card - More Dramatic
  heroCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#3b82f6',
    padding: 40,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  heroValue: {
    fontSize: 80,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginBottom: 12,
    textShadowColor: 'rgba(59, 130, 246, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  heroLabel: {
    fontSize: 20,
    color: '#3b82f6',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 10,
  },
  heroSubtext: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Enhanced Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 22,
    marginBottom: 18,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Creative borders instead of ugly corners
  statCardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  statCardSecondary: {
    borderTopWidth: 4,
    borderTopColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.02)',
  },
  statCardTertiary: {
    borderRightWidth: 4,
    borderRightColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.02)',
  },
  statCardQuaternary: {
    borderBottomWidth: 4,
    borderBottomColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.02)',
  },
  // Urgent notification badge
  urgentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  // Floating accent elements
  statFloatingIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    opacity: 0.1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 15,
    color: '#10b981',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Enhanced Quick Actions
  actionsSection: {
    marginBottom: 50,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#3b82f6',
    padding: 24,
    marginBottom: 18,
    position: 'relative',
    minHeight: 150,
    overflow: 'hidden',
    borderRadius: 18,
  },
  actionCard1: {
    borderTopLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  actionCard2: {
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  actionCard3: {
    borderRadius: 28,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  actionCard4: {
    borderRadius: 28,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  actionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  // Action badge for counts
  actionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  actionArrow: {
    marginTop: 6,
  },
  actionLabel: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
    zIndex: 2,
  },
  actionDesc: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    zIndex: 2,
    fontWeight: '500',
  },
  actionFloatingIcon: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    opacity: 0.08,
  },
  
  // Enhanced Events Section
  eventsSection: {
    marginBottom: 50,
  },
  eventsCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  eventsHeaderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.08,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    position: 'relative',
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
  },
  pendingCount: {
    fontSize: 18,
    color: '#f59e0b',
    fontWeight: '900',
    marginRight: 8,
    fontFamily: 'monospace',
  },
  pendingLabel: {
    fontSize: 11,
    color: '#f59e0b',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  
  eventCard: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.5)',
    position: 'relative',
    backgroundColor: 'rgba(15, 15, 15, 0.6)',
  },
  eventCardLast: {
    borderBottomWidth: 0,
  },
  eventCardHighPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#ef4444',
  },
  eventCardUrgent: {
    borderLeftWidth: 5,
    borderLeftColor: '#f59e0b',
  },
  
  // Compact Event Cards
  eventCardCompact: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  eventCompactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventCompactLeft: {
    flex: 1,
    marginRight: 16,
  },
  eventCompactRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  eventTitleCompact: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginBottom: 6,
    flex: 1,
  },
  eventOrganizerCompact: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  eventCompactDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  eventDetailCompact: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  eventDescription: {
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '400',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginBottom: 6,
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  
  // Speakers section
  speakersSection: {
    marginBottom: 20,
  },
  speakersTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  speakersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  speakerTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  speakerText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Fixed Event Actions Layout
  eventActionsContainer: {
    marginTop: 4,
  },
  eventActionsButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 44,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rejectButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  approveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    shadowColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  rejectButtonText: {
    color: '#ef4444',
  },
  approveButtonText: {
    color: '#10b981',
  },
  
  // Activity Feed Section
  activitySection: {
    marginBottom: 50,
  },
  activityCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.5)',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
  activityEvent: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  activityRating: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // 1337 School Footer
  schoolFooter: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 32,
    marginBottom: 50,
    alignItems: 'center',
  },
  schoolFooterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  schoolLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#3b82f6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  schoolLogoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  schoolInfo: {
    alignItems: 'flex-start',
  },
  schoolName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  schoolTagline: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 1,
  },
  schoolMessage: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  schoolFooterBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.2)',
    paddingTop: 20,
  },
  schoolCopyright: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  schoolVersion: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Enhanced Footer
  enterpriseFooter: {
    marginTop: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Artistic background elements
  footerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  footerGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.3,
  },
  footerParticle: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 1,
  },
  footerFloatingElement: {
    position: 'absolute',
    opacity: 0.1,
  },
  
  // Main footer container
  footerMainContainer: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    position: 'relative',
    zIndex: 10,
  },
  
  // Header section
  footerHeader: {
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
    paddingBottom: 30,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginRight: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  footerLogoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  footerBrandContainer: {
    alignItems: 'flex-start',
  },
  footerBrandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerBrandSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  footerTagline: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  
  // Stats showcase
  footerStatsSection: {
    marginBottom: 40,
  },
  footerStatsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  footerStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerStatCard: {
    width: (screenWidth - 80) / 3,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  footerStatCardGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    height: 3,
    opacity: 0.6,
  },
  footerStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  footerStatLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  
  // Network status
  footerNetworkSection: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  footerNetworkGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.1,
  },
  footerNetworkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  footerNetworkIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 12,
  },
  footerNetworkTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerNetworkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNetworkStatus: {
    alignItems: 'center',
  },
  footerNetworkStatusDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    marginBottom: 8,
  },
  footerNetworkStatusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerNetworkInfo: {
    alignItems: 'flex-end',
  },
  footerNetworkUptime: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 2,
  },
  footerNetworkLocation: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  
  // Links section
  footerLinksSection: {
    marginBottom: 40,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerLinkGroup: {
    width: (screenWidth - 80) / 2,
    marginBottom: 24,
  },
  footerLinkGroupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
  },
  footerLinkText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  
  // Certification showcase
  footerCertificationSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  footerCertificationGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.08,
  },
  footerCertificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    marginBottom: 16,
  },
  footerCertificationIcon: {
    marginRight: 12,
  },
  footerCertificationText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footerCertificationDescription: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  
  // Final footer bar
  footerBottomBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.2)',
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerBottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  footerCopyrightContainer: {
    alignItems: 'flex-start',
  },
  footerCopyrightMain: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  footerCopyrightSub: {
    fontSize: 12,
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  footerVersionContainer: {
    alignItems: 'flex-end',
  },
  footerVersionBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  footerVersionText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerBuildText: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  footerFinalMessage: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  
  bottomSpacer: {
    height: 40,
  },
  
  expandButton: {
    width: 32,
    height: 32,
    backgroundColor: '#374151',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  
  eventExpandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  
  eventCompactInfo: {
    gap: 4,
  },
  
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  eventTitleContainer: {
    flex: 1,
    marginRight: 20,
  },
  
  // Event title row with category badge
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  
  eventTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    lineHeight: 26,
    flex: 1,
  },
  
  // Event type badge
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 12,
  },
  
  eventTypeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  eventOrganizer: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  
  eventStats: {
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  
  // Enhanced animation values
  const masterOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(30);
  const pulseScale = useSharedValue(1);
  const heroGlow = useSharedValue(0);
  
  // 1337 School-specific data matching README requirements
  const schoolStats = { 
    value: '1,337', 
    label: 'Active Students', 
    subtext: '42 Network Community' 
  };
  
  // Core admin metrics for 1337 school
  // const adminMetrics = [
  //   { icon: Calendar, value: '24', label: 'Pending Events', trend: '+6 today', type: 'primary', urgent: true },
  //   { icon: Users, value: '892', label: 'Registered Students', trend: '+12 this week', type: 'secondary' },
  //   { icon: TrendingUp, value: '94.2%', label: 'Event Attendance', trend: '+5.1%', type: 'tertiary' },
  //   { icon: Star, value: '4.8/5', label: 'Avg Rating', trend: '+0.2', type: 'quaternary' },
  // ];

  // 1337-specific quick actions from README
  const adminActions = [
    { 
      icon: CheckCircle, 
      label: 'Approve Events', 
      desc: 'Review pending events', 
      gradient: ['#10b981', '#059669'],
      floatingIcon: Calendar,
      count: 6
    },
    { 
      icon: Users, 
      label: 'Manage Users', 
      desc: 'Student & staff access', 
      gradient: ['#3b82f6', '#1d4ed8'],
      floatingIcon: Shield 
    },
    { 
      icon: Settings, 
      label: 'Shop Requests', 
      desc: 'Image & nickname changes', 
      gradient: ['#f59e0b', '#d97706'],
      floatingIcon: User,
      count: 3
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      desc: 'Broadcast to students', 
      gradient: ['#8b5cf6', '#7c3aed'],
      floatingIcon: Flame 
    },
  ];

  // Profile change requests from students
  const profileRequests = [
    {
      id: 1,
      studentId: 'Student #1234',
      type: 'nickname',
      currentValue: 'coder_42',
      requestedValue: 'elite_coder_1337',
      submittedAt: '2 hours ago',
      reason: 'Want to reflect my new skills level',
    },
    {
      id: 2,
      studentId: 'Student #5678',
      type: 'profile_image',
      currentValue: 'default_avatar.png',
      requestedValue: 'new_professional_photo.jpg',
      submittedAt: '5 hours ago',
      reason: 'Updated professional headshot',
    },
    {
      id: 3,
      studentId: 'Student #9012',
      type: 'nickname',
      currentValue: 'newbie_dev',
      requestedValue: 'algorithm_master',
      submittedAt: '1 day ago',
      reason: 'Completed advanced algorithms track',
    },
  ];

  // 1337 school events requiring approval (matching README)
  const pendingEvents = [
    {
      id: 1,
      title: 'C Programming Workshop',
      organizer: '1337 Coding Club',
      category: 'Workshop',
      priority: 'HIGH',
      preRegistered: 45,
      capacity: 50,
      date: '2024-12-28',
      time: '14:00',
      location: 'Lab A - Building 1',
      description: 'Advanced C programming techniques for algorithm challenges and system programming.',
      type: 'workshop',
      duration: '3 hours',
      speakers: ['Prof. Ahmed Benali', 'Senior Dev Fatima Z.']
    },
    {
      id: 2,
      title: 'Career Day: Tech Industry',
      organizer: '1337 Career Services',
      category: 'Career Event',
      priority: 'URGENT',
      preRegistered: 287,
      capacity: 300,
      date: '2024-12-30',
      time: '09:00',
      location: 'Main Auditorium',
      description: 'Meet with top tech companies hiring 1337 graduates. Network with industry professionals.',
      type: 'career',
      duration: 'Full day',
      speakers: ['Google Recruiters', 'Microsoft Team', 'Local Startups']
    },
    {
      id: 3,
      title: 'Hackathon Prep Session',
      organizer: 'Student Innovation Lab',
      category: 'Coding Event',
      priority: 'MEDIUM',
      preRegistered: 67,
      capacity: 80,
      date: '2024-12-29',
      time: '16:00',
      location: 'Innovation Hub',
      description: 'Prepare for upcoming hackathons with team formation and project planning strategies.',
      type: 'coding',
      duration: '2 hours',
      speakers: ['Hackathon Winners 2024']
    }
  ];

  // Recent platform activity
  const recentActivity = [
    { type: 'registration', user: 'Student #1234', event: 'C Programming Workshop', time: '2 min ago' },
    { type: 'event_created', user: 'Prof. Sarah M.', event: 'Advanced Algorithms', time: '15 min ago' },
    { type: 'feedback', user: 'Student #5678', event: 'Web Dev Bootcamp', time: '32 min ago', rating: 5 },
    { type: 'registration', user: 'Student #9012', event: 'Career Day', time: '1 hour ago' },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Enhanced entrance animations
    const sequence = async () => {
      masterOpacity.value = withTiming(1, { duration: 1000 });
      headerSlide.value = withTiming(0, { duration: 800 });
    };
    
    // Pulse animation for status
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
    
    // Hero glow effect
    heroGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    );
    
    sequence();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerSlide.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const heroGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(heroGlow.value, [0, 1], [0.1, 0.2]),
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

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

  const getStatCardStyle = (type) => {
    switch (type) {
      case 'primary': return styles.statCardPrimary;
      case 'secondary': return styles.statCardSecondary;
      case 'tertiary': return styles.statCardTertiary;
      case 'quaternary': return styles.statCardQuaternary;
      default: return {};
    }
  };

  const getStatIconColor = (type) => {
    switch (type) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#10b981';
      case 'tertiary': return '#f59e0b';
      case 'quaternary': return '#8b5cf6';
      default: return '#3b82f6';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'workshop': return '#3b82f6';
      case 'career': return '#10b981';
      case 'coding': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return Users;
      case 'event_created': return Plus;
      case 'feedback': return Star;
      default: return Activity;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GridPattern />
      
      <SafeAreaView style={styles.container}>
        <Animated.View style={[containerStyle, styles.container]}>
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {/* Enhanced Header */}
            <Animated.View entering={FadeInDown.delay(200)} style={[headerStyle, styles.headerSection]}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCornerTL} />
                <View style={styles.logoCornerBR} />
                <View style={styles.logoContent}>
                  <Text style={styles.logoText}>1337</Text>
                </View>
                <View style={styles.statusIndicator} />
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>ADMIN PANEL</Text>
                <View style={styles.titleUnderline} />
              </View>
              
              <Text style={styles.subtitle}>1337 EVENT MANAGEMENT SYSTEM</Text>
              
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>42 Network Connected</Text>
              </View>
              
              <Text style={styles.description}>
                Manage school events, students, and analytics for the 1337 coding school community.
              </Text>
            </Animated.View>

            {/* School Statistics Hero */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.heroSection}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>School Overview</Text>
                <View style={styles.sectionTitleUnderline} />
              </View>
              
              <Animated.View entering={FadeInUp.delay(600)} style={styles.heroCard}>
                <Animated.View style={heroGlowStyle}>
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    style={styles.heroGradient}
                  />
                </Animated.View>
                <View style={styles.heroContent}>
                  <Text style={styles.heroValue}>{schoolStats.value}</Text>
                  <Text style={styles.heroLabel}>{schoolStats.label}</Text>
                  <Text style={styles.heroSubtext}>{schoolStats.subtext}</Text>
                </View>
              </Animated.View>
              
              {/* Admin Metrics Grid */}
              {/* <View style={styles.statsGrid}>
                {adminMetrics.map((metric, index) => (
                  <Animated.View
                    key={metric.label}
                    entering={FadeInLeft.delay(800 + index * 100)}
                    style={[styles.statCard, getStatCardStyle(metric.type)]}
                  >
                    {metric.urgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>!</Text>
                      </View>
                    )}
                    <View style={styles.statFloatingIcon}>
                      <metric.icon color={getStatIconColor(metric.type)} size={50} strokeWidth={0.5} />
                    </View>
                    <View style={styles.statIconContainer}>
                      <metric.icon color={getStatIconColor(metric.type)} size={20} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.statValue}>{metric.value}</Text>
                    <Text style={styles.statLabel}>{metric.label}</Text>
                    <Text style={styles.statTrend}>{metric.trend}</Text>
                  </Animated.View>
                ))}
              </View> */}
            </Animated.View>

            {/* Admin Actions */}
            <Animated.View entering={FadeInUp.delay(1200)} style={styles.actionsSection}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Admin Actions</Text>
                <View style={styles.sectionTitleUnderline} />
              </View>
              
              <View style={styles.actionsGrid}>
                {adminActions.map((action, index) => (
                  <Animated.View
                    key={action.label}
                    entering={FadeInRight.delay(1400 + index * 100)}
                  >
                    <AnimatedPressable style={[
                      styles.actionCard,
                      index === 0 && styles.actionCard1,
                      index === 1 && styles.actionCard2,
                      index === 2 && styles.actionCard3,
                      index === 3 && styles.actionCard4,
                    ]}>
                      <LinearGradient
                        colors={action.gradient}
                        style={styles.actionGradient}
                      />
                      {action.count && (
                        <View style={styles.actionBadge}>
                          <Text style={styles.actionBadgeText}>{action.count}</Text>
                        </View>
                      )}
                      <View style={styles.actionHeader}>
                        <View style={styles.actionIconContainer}>
                          <action.icon color="#ffffff" size={20} strokeWidth={1.5} />
                        </View>
                        <View style={styles.actionArrow}>
                          <ArrowUpRight color="#ffffff" size={18} strokeWidth={1.5} />
                        </View>
                      </View>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                      <Text style={styles.actionDesc}>{action.desc}</Text>
                      <View style={styles.actionFloatingIcon}>
                        <action.floatingIcon color="#ffffff" size={70} strokeWidth={0.5} />
                      </View>
                    </AnimatedPressable>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Compact Event Approval System */}
            <Animated.View entering={FadeInUp.delay(1600)} style={styles.eventsSection}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Event Approvals</Text>
                <View style={styles.sectionTitleUnderline} />
              </View>
              
              <View style={styles.eventsCard}>
                <View style={styles.eventsHeader}>
                  <LinearGradient
                    colors={['#f59e0b', '#d97706']}
                    style={styles.eventsHeaderGradient}
                  />
                  <Text style={styles.eventsTitle}>Pending Events</Text>
                  <View style={styles.pendingBadge}>
                    <Clock color="#f59e0b" size={14} strokeWidth={1.5} />
                    <Text style={styles.pendingCount}>{pendingEvents.length}</Text>
                    <Text style={styles.pendingLabel}>PENDING</Text>
                  </View>
                </View>
                
                {pendingEvents.map((event, index) => {
                  const isExpanded = expandedEvents.has(event.id);
                  return (
                    <Animated.View
                      key={event.id}
                      entering={FadeInLeft.delay(1800 + index * 200)}
                      style={[
                        styles.eventCardCompact,
                        index === pendingEvents.length - 1 && styles.eventCardLast,
                      ]}
                    >
                      {/* Compact Header - Always Visible */}
                      <View style={styles.eventCompactHeader}>
                        <View style={styles.eventCompactLeft}>
                          <View style={styles.eventTitleRow}>
                            <Text style={styles.eventTitleCompact}>{event.title}</Text>
                            <View style={[styles.eventTypeBadge, { backgroundColor: `${getEventTypeColor(event.type)}20`, borderColor: getEventTypeColor(event.type) }]}>
                              <Text style={[styles.eventTypeText, { color: getEventTypeColor(event.type) }]}>{event.category}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.eventCompactInfo}>
                            <Text style={styles.eventOrganizerCompact}>by {event.organizer}</Text>
                            <View style={styles.eventCompactDetails}>
                              <View style={styles.eventDetailCompact}>
                                <Calendar color="#6b7280" size={12} strokeWidth={1.5} />
                                <Text style={styles.eventDetailTextCompact}>{event.date}</Text>
                              </View>
                              <View style={styles.eventDetailCompact}>
                                <Users color="#6b7280" size={12} strokeWidth={1.5} />
                                <Text style={styles.eventDetailTextCompact}>{event.preRegistered}/{event.capacity}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.eventCompactRight}>
                          <AnimatedPressable 
                            onPress={() => toggleEventExpansion(event.id)}
                            style={styles.expandButton}
                          >
                            <ChevronRight 
                              color="#3b82f6" 
                              size={20} 
                              strokeWidth={2}
                              style={[
                                styles.expandIcon,
                                { transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }
                              ]}
                            />
                          </AnimatedPressable>
                        </View>
                      </View>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <Animated.View 
                          entering={FadeInDown.duration(300)}
                          exiting={FadeInUp.duration(200)}
                          style={styles.eventExpandedContent}
                        >
                          <Text style={styles.eventDescription}>{event.description}</Text>
                          
                          <View style={styles.eventDetails}>
                            <View style={styles.eventDetailItem}>
                              <Clock color="#6b7280" size={13} strokeWidth={1.5} />
                              <Text style={styles.eventDetailText}>{event.time} • {event.duration}</Text>
                            </View>
                            <View style={styles.eventDetailItem}>
                              <MapPin color="#6b7280" size={13} strokeWidth={1.5} />
                              <Text style={styles.eventDetailText}>{event.location}</Text>
                            </View>
                          </View>

                          {/* Speakers Section */}
                          <View style={styles.speakersSection}>
                            <Text style={styles.speakersTitle}>Speakers:</Text>
                            <View style={styles.speakersList}>
                              {event.speakers.map((speaker, idx) => (
                                <View key={idx} style={styles.speakerTag}>
                                  <Text style={styles.speakerText}>{speaker}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                          
                          {/* Actions */}
                          <View style={styles.eventActionsContainer}>
                            <View style={styles.eventActionsButtons}>
                              <AnimatedPressable 
                                onPress={() => handleEventAction(event.id, 'Reject')}
                                style={[styles.actionButton, styles.rejectButton]}
                              >
                                <XCircle color="#ef4444" size={16} strokeWidth={1.5} />
                                <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                              </AnimatedPressable>
                              
                              <AnimatedPressable 
                                onPress={() => handleEventAction(event.id, 'Approve')}
                                style={[styles.actionButton, styles.approveButton]}
                              >
                                <CheckCircle color="#10b981" size={16} strokeWidth={1.5} />
                                <Text style={[styles.actionButtonText, styles.approveButtonText]}>Approve</Text>
                              </AnimatedPressable>
                            </View>
                          </View>
                        </Animated.View>
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            {/* Recent Activity Feed */}
            {/* <Animated.View entering={FadeInUp.delay(2000)} style={styles.activitySection}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.sectionTitleUnderline} />
              </View>
              
              <View style={styles.activityCard}>
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <Animated.View
                      key={index}
                      entering={FadeInRight.delay(2200 + index * 100)}
                      style={[styles.activityItem, index === recentActivity.length - 1 && styles.activityItemLast]}
                    >
                      <View style={styles.activityIconContainer}>
                        <ActivityIcon color="#3b82f6" size={16} strokeWidth={1.5} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          <Text style={styles.activityUser}>{activity.user}</Text>
                          {activity.type === 'registration' && ' registered for '}
                          {activity.type === 'event_created' && ' created '}
                          {activity.type === 'feedback' && ' rated '}
                          <Text style={styles.activityEvent}>{activity.event}</Text>
                          {activity.rating && (
                            <Text style={styles.activityRating}> ({activity.rating}⭐)</Text>
                          )}
                        </Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View> */}

            {/* 1337 School Footer */}
            {/* <Animated.View entering={FadeInUp.delay(2400)} style={styles.schoolFooter}>
              <View style={styles.schoolFooterHeader}>
                <View style={styles.schoolLogo}>
                  <Text style={styles.schoolLogoText}>1337</Text>
                </View>
                <View style={styles.schoolInfo}>
                  <Text style={styles.schoolName}>1337 Coding School</Text>
                  <Text style={styles.schoolTagline}>42 Network • Rabat, Morocco</Text>
                </View>
              </View>
              
              <Text style={styles.schoolMessage}>
                Empowering the next generation of software engineers through peer-to-peer learning and innovative projects.
              </Text>
              
              <View style={styles.schoolFooterBottom}>
                <Text style={styles.schoolCopyright}>© 2025 WeDesign Club • 1337 School</Text>
                <Text style={styles.schoolVersion}>Admin Panel v1.0</Text>
              </View>
            </Animated.View> */}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 