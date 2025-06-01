import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay,
  interpolate,
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { 
  Loader2, 
  Activity, 
  Zap,
  Calendar,
  Users,
  Trophy,
  Target,
  Clock,
  Star,
  Sparkles,
  Database,
  Wifi
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color Palette - Minimalist Luxe
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
  lightHighlight: '#E1C3AD30' // Soft Beige with opacity
};

// Enhanced Professional Background with animated particles
export const ProfessionalBackground = () => {
  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={[colors.primaryBg, colors.secondaryBg, colors.primaryBg]}
        style={styles.gradientBase}
        locations={[0, 0.5, 1]}
      />
      {/* Animated floating particles */}
      <FloatingParticles />
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

// Floating Particles Animation
const FloatingParticles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <View style={styles.particlesContainer}>
      {particles.map((_, index) => (
        <FloatingParticle key={index} index={index} />
      ))}
    </View>
  );
};

const FloatingParticle = ({ index }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 800;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-30, { duration: 3000, easing: Easing.inOut }),
          withTiming(30, { duration: 3000, easing: Easing.inOut })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000, easing: Easing.inOut }),
          withTiming(0.2, { duration: 2000, easing: Easing.inOut })
        ),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay + 1000,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500, easing: Easing.inOut }),
          withTiming(0.8, { duration: 1500, easing: Easing.inOut })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${(index + 1) * 12}%`,
          top: `${20 + (index % 3) * 20}%`,
        },
        animatedStyle,
      ]}
    />
  );
};

// Enhanced Data Loading Overlay with beautiful animations
export const DataLoadingOverlay = ({ 
  message = "Loading...", 
  subMessage = "Fetching your data", 
  visible = true,
  icon: Icon = Database
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const iconRotation = useSharedValue(0);
  const dotsProgress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 400, easing: Easing.out });
      scale.value = withTiming(1, { duration: 500, easing: Easing.out });
      
      iconRotation.value = withRepeat(
        withTiming(360, { duration: 2500, easing: Easing.linear }),
        -1
      );

      dotsProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut }),
          withTiming(0, { duration: 100 })
        ),
        -1
      );
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Animated.View 
      style={[styles.dataLoadingOverlay, containerStyle]} 
      entering={ZoomIn.duration(400)} 
      exiting={ZoomOut.duration(300)}
    >
      <ProfessionalBackground />
      
      {/* Main loading content */}
      <Animated.View style={styles.dataLoadingContent} entering={SlideInUp.delay(200)}>
        {/* Animated icon container */}
        <View style={styles.dataLoadingIconContainer}>
          <LinearGradient
            colors={[colors.lightAccent, colors.lightHighlight]}
            style={styles.iconGradientBg}
          />
          <Animated.View style={[styles.dataLoadingIcon, iconStyle]}>
            <Icon color={colors.accent} size={40} strokeWidth={1.5} />
          </Animated.View>
          
          {/* Pulsing rings */}
          <PulsingRing delay={0} />
          <PulsingRing delay={300} />
          <PulsingRing delay={600} />
        </View>

        {/* Text content */}
        <Animated.View style={styles.dataLoadingText} entering={FadeIn.delay(400)}>
          <Text style={styles.dataLoadingTitle}>{message}</Text>
          <Text style={styles.dataLoadingSubtitle}>{subMessage}</Text>
        </Animated.View>

        {/* Enhanced animated dots */}
        <LoadingDots progress={dotsProgress} />

        {/* Progress bar */}
        <Animated.View style={styles.progressContainer} entering={FadeIn.delay(600)}>
          <AnimatedProgressBar />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

// Pulsing Ring Component
const PulsingRing = ({ delay }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1500, easing: Easing.out }),
          withTiming(1, { duration: 100 })
        ),
        -1
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 1500, easing: Easing.out }),
          withTiming(0.6, { duration: 100 })
        ),
        -1
      )
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulsingRing, ringStyle]} />
  );
};

// Enhanced Loading Dots
const LoadingDots = ({ progress }) => {
  return (
    <View style={styles.loadingDotsContainer}>
      {[0, 1, 2, 3, 4].map((index) => (
        <AnimatedDot key={index} index={index} progress={progress} />
      ))}
    </View>
  );
};

const AnimatedDot = ({ index, progress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const delay = index * 0.2;
    const dotProgress = Math.max(0, Math.min(1, progress.value - delay));
    
    return {
      transform: [
        { scale: interpolate(dotProgress, [0, 0.5, 1], [0.5, 1.2, 0.5]) }
      ],
      opacity: interpolate(dotProgress, [0, 0.5, 1], [0.3, 1, 0.3]),
    };
  });

  return (
    <Animated.View style={[styles.loadingDot, animatedStyle]} />
  );
};

// Animated Progress Bar
const AnimatedProgressBar = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000, easing: Easing.inOut }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut }),
        withTiming(1, { duration: 1500, easing: Easing.inOut }),
        withTiming(0, { duration: 200 })
      ),
      -1
    );
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarTrack}>
        <Animated.View style={[styles.progressBarFill, progressStyle]}>
          <LinearGradient
            colors={[colors.accent, colors.highlight, colors.accent]}
            style={styles.progressBarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
        <Animated.View style={[styles.progressBarGlow, glowStyle]} />
      </View>
    </View>
  );
};

// Enhanced Skeleton Cards with better animations
export const EnhancedEventCardSkeleton = ({ index = 0 }) => {
  const shimmer = useSharedValue(-1);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    // Staggered fade in
    fadeIn.value = withDelay(
      index * 150,
      withTiming(1, { duration: 600, easing: Easing.out })
    );

    // Shimmer effect
    const timer = setTimeout(() => {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.inOut }),
        -1,
        true
      );
    }, index * 100);

    return () => clearTimeout(timer);
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ scale: interpolate(fadeIn.value, [0, 1], [0.95, 1]) }],
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [-1, 1], [-120, 120]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.skeletonCard, cardStyle]}>
      <View style={styles.skeletonCardContent}>
        {/* Header */}
        <View style={styles.skeletonHeader}>
          <SkeletonElement width={80} height={12} />
          <SkeletonElement width={60} height={20} borderRadius={10} />
        </View>

        {/* Title */}
        <SkeletonElement width="100%" height={16} marginBottom={4} />
        <SkeletonElement width="60%" height={16} marginBottom={16} />

        {/* Description */}
        <SkeletonElement width="80%" height={14} marginBottom={16} />

        {/* Details */}
        <View style={styles.skeletonMetaRow}>
          <SkeletonElement width={60} height={12} />
          <SkeletonElement width={60} height={12} />
        </View>

        {/* Footer */}
        <View style={styles.skeletonFooter}>
          <SkeletonElement width={80} height={24} borderRadius={12} />
          <SkeletonElement width={16} height={16} borderRadius={8} />
        </View>

        {/* Enhanced shimmer overlay */}
        <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
          <LinearGradient
            colors={[
              'transparent',
              'rgba(59, 130, 246, 0.1)',
              'rgba(139, 92, 246, 0.1)',
              'transparent'
            ]}
            style={styles.shimmerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Reusable Skeleton Element
const SkeletonElement = ({ width, height, borderRadius = 6, marginBottom = 0 }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000, easing: Easing.inOut }),
        withTiming(1, { duration: 1000, easing: Easing.inOut })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeletonElement,
        {
          width,
          height,
          borderRadius,
          marginBottom,
        },
        animatedStyle,
      ]}
    />
  );
};

// Quick Page Transition Loading
export const PageTransitionLoading = ({ visible, message = "Loading..." }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 250, easing: Easing.out });
      translateY.value = withTiming(0, { duration: 350, easing: Easing.out });
      
      iconRotation.value = withRepeat(
        withTiming(360, { duration: 1500, easing: Easing.linear }),
        -1
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(20, { duration: 200 });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.pageTransitionLoading, containerStyle]}>
      <LinearGradient
        colors={['rgba(10, 15, 28, 0.98)', 'rgba(26, 35, 50, 0.95)']}
        style={styles.pageTransitionBackground}
      />
      <View style={styles.pageTransitionContent}>
        <Animated.View style={[styles.pageTransitionIcon, iconStyle]}>
          <Wifi color="#3b82f6" size={20} strokeWidth={2} />
        </Animated.View>
        <Text style={styles.pageTransitionText}>{message}</Text>
        <View style={styles.pageTransitionDots}>
          {[0, 1, 2].map((index) => (
            <PageTransitionDot key={index} delay={index * 200} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const PageTransitionDot = ({ delay }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: 400, easing: Easing.out }),
          withTiming(1, { duration: 400, easing: Easing.out })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.pageTransitionDot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  // Professional Background
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
    opacity: 0.03,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.secondaryText,
  },
  gridLineMajor: {
    opacity: 0.1,
  },
  gridLineMinor: {
    opacity: 0.05,
  },

  // Data Loading Overlay
  dataLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dataLoadingContent: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  dataLoadingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGradientBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  dataLoadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dataLoadingText: {
    marginBottom: 24,
  },
  dataLoadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  dataLoadingSubtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  pulsingRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lightAccent,
    backgroundColor: 'transparent',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: colors.secondaryBg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarTrack: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressBarGradient: {
    flex: 1,
  },
  progressBarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: colors.lightAccent,
  },

  // Enhanced Event Card Skeleton
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondaryBg,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    margin: 10,
    overflow: 'hidden',
  },
  skeletonCardContent: {
    padding: 20,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  skeletonBadge: {
    height: 20,
    width: 60,
    borderRadius: 10,
    backgroundColor: colors.secondaryBg,
  },
  skeletonTitle: {
    height: 24,
    width: '70%',
    borderRadius: 8,
    backgroundColor: colors.secondaryBg,
    marginBottom: 8,
  },
  skeletonDescription: {
    height: 16,
    width: '90%',
    borderRadius: 6,
    backgroundColor: colors.secondaryBg,
    marginBottom: 6,
  },
  skeletonDescriptionShort: {
    height: 16,
    width: '60%',
    borderRadius: 6,
    backgroundColor: colors.secondaryBg,
    marginBottom: 16,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonMetaItem: {
    height: 14,
    width: 80,
    borderRadius: 6,
    backgroundColor: colors.secondaryBg,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondaryBg,
  },
  skeletonButton: {
    height: 36,
    width: 100,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
  },
  skeletonProgress: {
    flex: 1,
    marginRight: 16,
  },
  skeletonProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryBg,
    marginBottom: 8,
  },
  skeletonProgressText: {
    height: 12,
    width: '60%',
    borderRadius: 4,
    backgroundColor: colors.secondaryBg,
  },

  // Page Transition Loading
  pageTransitionLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTransitionBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
  },
  pageTransitionContent: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  pageTransitionIcon: {
    marginBottom: 24,
  },
  pageTransitionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  pageTransitionDots: {
    flexDirection: 'row',
    gap: 8,
  },
  pageTransitionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  // Floating Particles
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lightAccent,
  },

  // Summary Card Skeleton
  skeletonSummary: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondaryBg,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    margin: 10,
    overflow: 'hidden',
  },
  skeletonSummaryContent: {
    padding: 20,
  },
  skeletonProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryBg,
    marginRight: 12,
  },
  skeletonUserInfo: {
    flex: 1,
  },
  skeletonUserName: {
    height: 16,
    width: '60%',
    borderRadius: 6,
    backgroundColor: colors.secondaryBg,
    marginBottom: 6,
  },
  skeletonUserRole: {
    height: 12,
    width: '40%',
    borderRadius: 4,
    backgroundColor: colors.secondaryBg,
  },
  skeletonStatusBadge: {
    height: 24,
    width: 60,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
  },
  skeletonMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonMetric: {
    flex: 1,
    alignItems: 'center',
  },
  skeletonDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.secondaryBg,
    marginHorizontal: 12,
  },

  // Enhanced Skeleton Elements
  skeletonElement: {
    backgroundColor: colors.secondaryBg,
  },

  // Page Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pulsingRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'transparent',
  },
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#1a2332',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarTrack: {
    flex: 1,
    backgroundColor: '#1a2332',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressBarGradient: {
    flex: 1,
  },
  progressBarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
});

// Legacy components for backward compatibility
export const PageLoadingOverlay = DataLoadingOverlay;
export const EventCardSkeleton = EnhancedEventCardSkeleton;
export const NavigationLoading = PageTransitionLoading;

// Keep original SummaryCardSkeleton and IconLoadingState
export const SummaryCardSkeleton = () => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 1000, easing: Easing.inOut }),
        withTiming(1, { duration: 1000, easing: Easing.inOut })
      ),
      -1
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.skeletonSummary, pulseStyle]} entering={FadeIn}>
      <View style={styles.skeletonSummaryContent}>
        <View style={styles.skeletonProfileHeader}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonUserInfo}>
            <View style={styles.skeletonUserName} />
            <View style={styles.skeletonUserRole} />
          </View>
          <View style={styles.skeletonStatusBadge} />
        </View>
        <View style={styles.skeletonMetrics}>
          <View style={styles.skeletonMetric} />
          <View style={styles.skeletonDivider} />
          <View style={styles.skeletonMetric} />
          <View style={styles.skeletonDivider} />
          <View style={styles.skeletonMetric} />
        </View>
        <View style={styles.skeletonProgress}>
          <View style={styles.skeletonProgressHeader} />
          <View style={styles.skeletonProgressBar} />
          <View style={styles.skeletonProgressText} />
        </View>
      </View>
    </Animated.View>
  );
};

export const IconLoadingState = ({ 
  icon: Icon = Activity, 
  message = "Loading...", 
  subMessage = "Please wait while we fetch your data" 
}) => {
  return (
    <DataLoadingOverlay 
      visible={true}
      message={message}
      subMessage={subMessage}
      icon={Icon}
    />
  );
};

export default {
  ProfessionalBackground,
  DataLoadingOverlay,
  PageLoadingOverlay,
  EnhancedEventCardSkeleton,
  EventCardSkeleton,
  SummaryCardSkeleton,
  IconLoadingState,
  PageTransitionLoading,
  NavigationLoading
}; 