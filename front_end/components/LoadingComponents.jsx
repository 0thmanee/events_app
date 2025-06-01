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

// Enhanced Professional Background with animated particles
export const ProfessionalBackground = () => {
  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.gradientBase}
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
            colors={['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)']}
            style={styles.iconGradientBg}
          />
          <Animated.View style={[styles.dataLoadingIcon, iconStyle]}>
            <Icon color="#3b82f6" size={40} strokeWidth={1.5} />
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
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarTrack}>
        <Animated.View style={[styles.progressBarFill, progressStyle]}>
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6', '#06b6d4']}
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
      <View style={styles.skeletonContent}>
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
        <View style={styles.skeletonDetails}>
          <SkeletonElement width={60} height={12} />
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
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },

  // Skeleton Components
  skeletonCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a2332',
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonContent: {
    padding: 20,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonCategory: {
    width: 80,
    height: 12,
    backgroundColor: '#1a2332',
    borderRadius: 6,
  },
  skeletonStatus: {
    width: 60,
    height: 20,
    backgroundColor: '#1a2332',
    borderRadius: 10,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: '#1a2332',
    borderRadius: 8,
    marginBottom: 4,
  },
  skeletonDescription: {
    height: 14,
    backgroundColor: '#1a2332',
    borderRadius: 7,
    marginBottom: 16,
    width: '80%',
  },
  skeletonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skeletonDetail: {
    width: 60,
    height: 12,
    backgroundColor: '#1a2332',
    borderRadius: 6,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a2332',
  },
  skeletonCredits: {
    width: 80,
    height: 24,
    backgroundColor: '#1a2332',
    borderRadius: 12,
  },
  skeletonArrow: {
    width: 16,
    height: 16,
    backgroundColor: '#1a2332',
    borderRadius: 8,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: -100,
    bottom: 0,
  },
  shimmerGradient: {
    flex: 1,
  },

  // Summary Skeleton
  skeletonSummary: {
    backgroundColor: '#0a0f1c',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  skeletonSummaryContent: {
    gap: 16,
  },
  skeletonProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a2332',
    marginRight: 16,
  },
  skeletonUserInfo: {
    flex: 1,
    gap: 4,
  },
  skeletonUserName: {
    width: 120,
    height: 18,
    backgroundColor: '#1a2332',
    borderRadius: 9,
  },
  skeletonUserRole: {
    width: 80,
    height: 14,
    backgroundColor: '#1a2332',
    borderRadius: 7,
  },
  skeletonStatusBadge: {
    width: 60,
    height: 24,
    backgroundColor: '#1a2332',
    borderRadius: 12,
  },
  skeletonMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonMetric: {
    alignItems: 'center',
    gap: 4,
  },
  skeletonDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#1a2332',
  },
  skeletonProgress: {
    gap: 8,
  },
  skeletonProgressHeader: {
    width: 120,
    height: 14,
    backgroundColor: '#1a2332',
    borderRadius: 7,
  },
  skeletonProgressBar: {
    height: 10,
    backgroundColor: '#1a2332',
    borderRadius: 5,
  },
  skeletonProgressText: {
    width: 180,
    height: 12,
    backgroundColor: '#1a2332',
    borderRadius: 6,
  },

  // Icon Loading State
  iconLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLoadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  iconLoadingIcon: {
    marginBottom: 32,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  iconLoadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  iconLoadingSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  progressContainer: {
    width: 200,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a2332',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },

  // Navigation Loading
  navigationLoading: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  navigationLoadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 15, 28, 0.95)',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navigationLoadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Data Loading Overlay
  dataLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataLoadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  dataLoadingIconContainer: {
    marginBottom: 24,
  },
  iconGradientBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataLoadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  dataLoadingText: {
    marginBottom: 24,
  },
  dataLoadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  dataLoadingSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
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
    opacity: 0.98,
  },
  pageTransitionContent: {
    alignItems: 'center',
    padding: 40,
  },
  pageTransitionIcon: {
    marginBottom: 24,
  },
  pageTransitionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: 'rgba(59, 130, 246, 0.4)',
  },

  // Enhanced Skeleton Elements
  skeletonElement: {
    backgroundColor: '#1a2332',
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