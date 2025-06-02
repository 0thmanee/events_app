import { View, Text, ScrollView, Pressable, Dimensions, StatusBar, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Calendar,
  Users,
  Trophy,
  Sparkles,
  ArrowRight,
  Code,
  BookOpen,
  Coffee,
  Zap,
  Star,
  Heart,
  Rocket,
  Target,
  Award,
  Coins,
  ChevronRight,
  Shield,
  ArrowUpRight,
  User,
  Settings,
  X
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth42Button from '../components/Auth42Button';

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
  lightHighlight: '#E1C3AD30', // Soft Beige with opacity
  cardBorder: '#E0E0E0',     // Light border
  shadow: '#00000015'        // Subtle shadow
};

// Advanced geometric grid system
const GridPattern = () => {
  const opacity = useSharedValue(0.02);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 4000 }),
        withTiming(0.02, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { 
      position: 'absolute', 
      width: '100%', 
      height: '100%',
      pointerEvents: 'none'
    }]}>
      {Array.from({ length: 20 }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: (i % 5) * (screenWidth / 5),
            top: Math.floor(i / 5) * (screenHeight / 4),
            width: 1,
            height: screenHeight,
            backgroundColor: colors.secondaryText,
          }}
        />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: i * (screenHeight / 15),
            left: 0,
            width: screenWidth,
            height: 1,
            backgroundColor: colors.secondaryText,
          }}
        />
      ))}
    </Animated.View>
  );
};

// Sophisticated floating elements
const FloatingElements = () => {
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const rotate1 = useSharedValue(0);

  useEffect(() => {
    float1.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 6000, easing: Easing.inOut(Easing.quad) }),
        withTiming(-20, { duration: 6000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    float2.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(15, { duration: 8000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    rotate1.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const float1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value }],
  }));

  const float2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate1.value}deg` }],
  }));

  return (
    <>
      <Animated.View style={[
        float1Style,
        {
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: 80,
          height: 80,
        }
      ]}>
        <View style={{
          width: 80,
          height: 80,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          borderRadius: 2,
          backgroundColor: 'transparent',
        }}>
          <View style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 1,
          }} />
        </View>
      </Animated.View>

      <Animated.View style={[
        float2Style,
        {
          position: 'absolute',
          bottom: '25%',
          left: '5%',
          width: 60,
          height: 60,
        }
      ]}>
        <Animated.View style={[rotateStyle]}>
          <View style={{
            width: 60,
            height: 60,
            borderWidth: 1,
            borderColor: colors.highlight,
            transform: [{ rotate: '45deg' }],
            backgroundColor: 'transparent',
          }} />
        </Animated.View>
      </Animated.View>
    </>
  );
};

// Role Selection Modal Component
const RoleSelectionModal = ({ visible, onSelectRole, onClose }) => {
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalOpacity.value = withTiming(1, { duration: 400 });
      modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const roles = [
    {
      id: 'staff',
      title: 'Staff Access',
      subtitle: 'Admin Dashboard & Event Management',
      description: 'Access to create events, manage users, view analytics',
      icon: Shield,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      route: '/(tabs)/admin'
    },
    {
      id: 'student',
      title: 'Student Access',
      subtitle: 'Student Dashboard & Event Discovery',
      description: 'View events, earn coins, compete in leaderboards',
      icon: User,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      route: '/(tabs)'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
    >
      <Animated.View style={[modalStyles.backdrop, backdropStyle]}>
        <Pressable 
          style={modalStyles.backdropPress} 
          onPress={onClose}
        />
        
        <Animated.View style={[modalStyles.modalContainer, modalStyle]}>
          <LinearGradient
            colors={['#111827', '#1f2937', '#111827']}
            style={modalStyles.modalGradient}
          >
            {/* Close Button */}
            <Pressable style={modalStyles.closeButton} onPress={onClose}>
              <X color="#6b7280" size={20} strokeWidth={2} />
            </Pressable>

            {/* Header */}
            <View style={modalStyles.header}>
              <View style={modalStyles.logoContainer}>
                <View style={modalStyles.logoSquare}>
                  <Text style={modalStyles.logoText}>1337</Text>
                </View>
              </View>
              
              <Text style={modalStyles.title}>Choose Access Level</Text>
              <Text style={modalStyles.subtitle}>
                Select your role for frontend testing purposes
              </Text>
              <Text style={modalStyles.note}>
                (This will be removed in production)
              </Text>
            </View>

            {/* Role Options */}
            <View style={modalStyles.rolesContainer}>
              {roles.map((role, index) => (
                <Animated.View
                  key={role.id}
                  entering={FadeInUp.delay(index * 200)}
                >
                  <Pressable
                    style={modalStyles.roleCard}
                    onPress={() => onSelectRole(role.id)}
                  >
                    <LinearGradient
                      colors={[`${role.color}15`, 'transparent']}
                      style={modalStyles.roleGradient}
                    />
                    
                    <View style={[modalStyles.roleIcon, { backgroundColor: `${role.color}20`, borderColor: role.color }]}>
                      <role.icon color={role.color} size={24} strokeWidth={2} />
                    </View>
                    
                    <View style={modalStyles.roleContent}>
                      <Text style={modalStyles.roleTitle}>{role.title}</Text>
                      <Text style={modalStyles.roleSubtitle}>{role.subtitle}</Text>
                      <Text style={modalStyles.roleDescription}>{role.description}</Text>
                    </View>
                    
                    <View style={modalStyles.roleArrow}>
                      <ChevronRight color="#6b7280" size={20} strokeWidth={2} />
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING');
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  // All animation values declared unconditionally
  const masterOpacity = useSharedValue(0);
  const heroTranslate = useSharedValue(50);
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const subtitleSlide = useSharedValue(30);
  const ctaScale = useSharedValue(0.9);
  
  // Loading animation values
  const loadingLogoScale = useSharedValue(0);
  const loadingLogoRotate = useSharedValue(0);
  const loadingGridOpacity = useSharedValue(0);
  const loadingTextOpacity = useSharedValue(0);
  const loadingParticleOpacity = useSharedValue(0);
  const loadingScanlineY = useSharedValue(-50);
  const loadingCornerExpand = useSharedValue(0);
  const loadingProgress = useSharedValue(0);
  const loadingScreenOpacity = useSharedValue(1);

  const metrics = [
    {
      icon: Code,
      value: '1,337+',
      label: 'Active Developers',
      description: 'Elite coders building the future of technology',
      accent: '#3b82f6',
    },
    {
      icon: Users,
      value: '42+',
      label: 'Global Campuses',
      description: 'Worldwide network of innovation hubs',
      accent: '#06b6d4',
    },
    {
      icon: BookOpen,
      value: '10K+',
      label: 'Events Hosted',
      description: 'Premium experiences delivered',
      accent: '#10b981',
    },
    {
      icon: Coffee,
      value: '99.9%',
      label: 'Uptime SLA',
      description: 'Enterprise-grade reliability',
      accent: '#f59e0b',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    checkExistingAuth();
    
    if (isLoading) {
      // Loading sequence
      const sequence = async () => {
        // Phase 1: Grid and logo appearance
        loadingGridOpacity.value = withTiming(0.1, { duration: 800 });
        loadingLogoScale.value = withDelay(400, withTiming(1, { damping: 15, stiffness: 200 }));
        
        // Phase 2: Corner expansion
        loadingCornerExpand.value = withDelay(800, withTiming(1, { duration: 1000 }));
        
        // Phase 3: Text and progress
        loadingTextOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
        
        // Phase 4: Loading sequence
        const steps = [
          { text: 'CONNECTING TO 42 NETWORK', delay: 1500, duration: 800 },
          { text: 'AUTHENTICATING SYSTEMS', delay: 2300, duration: 700 },
          { text: 'LOADING EVENT DATABASE', delay: 3000, duration: 600 },
          { text: 'OPTIMIZING INTERFACE', delay: 3600, duration: 500 },
          { text: 'READY TO LAUNCH', delay: 4100, duration: 400 },
        ];

        steps.forEach((step, index) => {
          setTimeout(() => {
            runOnJS(setLoadingText)(step.text);
            runOnJS(setLoadingPercent)((index + 1) * 20);
            loadingProgress.value = withTiming((index + 1) * 0.2, { duration: step.duration });
          }, step.delay);
        });

        // Phase 5: Scanline effect
        loadingScanlineY.value = withDelay(1800, withRepeat(
          withTiming(screenHeight + 50, { duration: 2000, easing: Easing.linear }),
          3,
          false
        ));

        // Phase 6: Particle effects
        loadingParticleOpacity.value = withDelay(2000, withTiming(1, { duration: 1000 }));

        // Phase 7: Completion (only if no existing auth found)
        setTimeout(() => {
          loadingScreenOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
          setTimeout(() => {
            runOnJS(setIsLoading)(false);
          }, 600);
        }, 5000);
      };

      sequence();

      // Continuous logo rotation
      loadingLogoRotate.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      // Welcome screen entrance sequence
      const sequence = async () => {
        masterOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
        heroTranslate.value = withDelay(200, withTiming(0, { damping: 25, stiffness: 200 }));
        logoScale.value = withDelay(400, withTiming(1, { damping: 20, stiffness: 150 }));
        titleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
        subtitleSlide.value = withDelay(800, withTiming(0, { damping: 25, stiffness: 200 }));
        ctaScale.value = withDelay(1200, withTiming(1, { damping: 20, stiffness: 150 }));
      };

      sequence();

      // Auto-rotate metrics
      const interval = setInterval(() => {
        setCurrentMetric(prev => (prev + 1) % metrics.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const checkExistingAuth = async () => {
    try {
      const [appToken, userRole, userData] = await Promise.all([
        AsyncStorage.getItem('appToken'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userData')
      ]);

      if (appToken && userRole) {
        console.log('🔐 Existing authentication found, redirecting...');
        
        // Special case for development: treat "obouchta" as staff
        let finalUserRole = userRole;
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData?.intraUsername === 'obouchta' || parsedUserData?.nickname === 'obouchta') {
            console.log('🔧 DEV: Treating obouchta as staff for existing auth check');
            finalUserRole = 'staff';
            await AsyncStorage.setItem('userRole', 'staff'); // Update stored role
          }
        }
        
        // Update loading text to show auto-login
        setLoadingText('AUTHENTICATING...');
        setLoadingPercent(80);
        
        // Small delay to show the loading state
        setTimeout(() => {
          if (finalUserRole === 'staff' || finalUserRole === 'admin') {
            console.log('🎯 Auto-routing to admin panel...');
            router.replace('/(tabs)/admin');
          } else {
            console.log('🎯 Auto-routing to student interface...');
            router.replace('/(tabs)/');
          }
        }, 2000);
      } else {
        console.log('🔐 No existing authentication found');
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    }
  };

  // All animated styles declared unconditionally
  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
  }));

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroTranslate.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleSlide.value }],
    opacity: titleOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  // Loading screen animated styles
  const loadingLogoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: loadingLogoScale.value },
      { rotate: `${loadingLogoRotate.value}deg` }
    ],
  }));

  const loadingGridStyle = useAnimatedStyle(() => ({
    opacity: loadingGridOpacity.value,
  }));

  const loadingProgressStyle = useAnimatedStyle(() => ({
    width: `${loadingProgress.value * 100}%`,
  }));

  const loadingTextStyle = useAnimatedStyle(() => ({
    opacity: loadingTextOpacity.value,
  }));

  const loadingScanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: loadingScanlineY.value }],
  }));

  const loadingParticleStyle = useAnimatedStyle(() => ({
    opacity: loadingParticleOpacity.value,
  }));

  const loadingCornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loadingCornerExpand.value }],
  }));

  const loadingScreenStyle = useAnimatedStyle(() => ({
    opacity: loadingScreenOpacity.value,
  }));

  const currentMetricData = metrics[currentMetric];

  const handleAuth42Success = async (authData) => {
    console.log('🔐 42 Authentication successful!', authData.user);
    console.log('👤 User role from backend:', authData.user.role);
    
    try {
      // Show loading during transition
      setIsLoading(true);
      
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // The role is already determined by the backend based on 42 staff status
      let userRole = authData.user.role;
      
      // Special case for development: treat "obouchta" as staff
      if (authData.user.intraUsername === 'obouchta' || authData.user.nickname === 'obouchta') {
        console.log('🔧 DEV: Treating obouchta as staff for navigation');
        userRole = 'staff';
      }
      
      // Store the role (override if obouchta)
      await AsyncStorage.setItem('userRole', userRole);
      
      // Navigate directly based on the determined role
      if (userRole === 'staff' || userRole === 'admin') {
        console.log('🎯 Routing to staff/admin panel...');
        router.replace('/(tabs)/admin');
      } else {
        console.log('🎯 Routing to student interface...');
        router.replace('/(tabs)/');
      }
    } catch (error) {
      console.error('Error processing authentication:', error);
      // Fallback navigation
      router.replace('/(tabs)/');
    } finally {
      // Keep loading state until navigation completes
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleAuth42Error = (error) => {
    console.error('🔐 42 Authentication failed:', error);
  };

  const handleAuth = () => {
    console.log('🔐 Initiating 42 Network Authentication...');
    // This will be handled by the Auth42Button component
  };

  const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
      setShowRoleModal(false);
      
      // Navigate based on role
      if (role === 'staff') {
        router.push('/(tabs)/admin');
      } else {
        router.push('/(tabs)/');
      }
    } catch (error) {
      console.error('Error saving user role:', error);
      // Fallback navigation
      router.push('/(tabs)/');
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
  };

  const handleExplore = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryBg }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Loading Screen Overlay */}
      {isLoading && (
        <Animated.View style={[loadingScreenStyle, { 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 1000,
          backgroundColor: colors.primaryBg
        }]}>
          
          {/* Loading Background Grid */}
          <Animated.View style={[loadingGridStyle, { 
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none'
          }]}>
            {/* Vertical lines */}
            {Array.from({ length: 6 }, (_, i) => (
              <View
                key={`v-${i}`}
                style={{
                  position: 'absolute',
                  left: i * (screenWidth / 5),
                  top: 0,
                  width: 1,
                  height: '100%',
                  backgroundColor: colors.cardBorder,
                }}
              />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <View
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  top: i * (screenHeight / 7),
                  left: 0,
                  width: '100%',
                  height: 1,
                  backgroundColor: colors.cardBorder,
                }}
              />
            ))}
          </Animated.View>

          {/* Loading Floating Particles */}
          <Animated.View style={[loadingParticleStyle, { position: 'absolute', width: '100%', height: '100%' }]}>
            {Array.from({ length: 12 }, (_, i) => (
              <View
                key={`particle-${i}`}
                style={{
                  position: 'absolute',
                  left: Math.random() * screenWidth,
                  top: Math.random() * screenHeight,
                  width: 3,
                  height: 3,
                  backgroundColor: colors.accent,
                  borderRadius: 1.5,
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 4,
                }}
              />
            ))}
          </Animated.View>

          {/* Loading Scanline Effect */}
          <Animated.View style={[
            loadingScanlineStyle,
            {
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 2,
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
            }
          ]} />

          {/* Loading Main Content */}
          <View style={{ 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingHorizontal: 40,
            minHeight: screenHeight,
          }}>
            
            {/* Loading Corner Decorations */}
            <Animated.View style={[loadingCornerStyle, { position: 'absolute', top: screenHeight * 0.15, left: 40 }]}>
              <View style={{
                width: 40,
                height: 40,
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderColor: colors.accent,
              }} />
            </Animated.View>
            
            <Animated.View style={[loadingCornerStyle, { position: 'absolute', top: screenHeight * 0.15, right: 40 }]}>
              <View style={{
                width: 40,
                height: 40,
                borderTopWidth: 3,
                borderRightWidth: 3,
                borderColor: colors.accent,
              }} />
            </Animated.View>
            
            <Animated.View style={[loadingCornerStyle, { position: 'absolute', bottom: screenHeight * 0.15, left: 40 }]}>
              <View style={{
                width: 40,
                height: 40,
                borderBottomWidth: 3,
                borderLeftWidth: 3,
                borderColor: colors.accent,
              }} />
            </Animated.View>
            
            <Animated.View style={[loadingCornerStyle, { position: 'absolute', bottom: screenHeight * 0.15, right: 40 }]}>
              <View style={{
                width: 40,
                height: 40,
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderColor: colors.accent,
              }} />
            </Animated.View>

            {/* Centered Loading Content Container */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>

              {/* Loading Central Logo */}
              <Animated.View style={[loadingLogoStyle, { marginBottom: 60 }]}>
                <View style={{
                  width: 160,
                  height: 160,
                  backgroundColor: colors.white,
                  borderWidth: 2,
                  borderColor: colors.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                  
                  {/* Simplified Corner accents - no additional shadows */}
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    width: 30,
                    height: 30,
                    borderTopWidth: 4,
                    borderLeftWidth: 4,
                    borderColor: colors.accent,
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 30,
                    height: 30,
                    borderBottomWidth: 4,
                    borderRightWidth: 4,
                    borderColor: colors.accent,
                  }} />
                  
                  {/* Loading Logo text */}
                  <Text style={{
                    fontSize: 48,
                    fontWeight: '900',
                    color: colors.primaryText,
                    letterSpacing: 6,
                    fontFamily: 'monospace',
                  }}>1337</Text>
                  
                  {/* Loading Status indicators */}
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 12,
                    height: 12,
                    backgroundColor: colors.accent,
                    borderRadius: 6,
                  }} />
                </View>
              </Animated.View>

              {/* Loading Section */}
              <Animated.View style={[loadingTextStyle, { alignItems: 'center', width: '100%', maxWidth: 400 }]}>
                
                {/* Loading System Status */}
                <Text style={{
                  fontSize: 24,
                  fontWeight: '900',
                  color: colors.primaryText,
                  letterSpacing: 2,
                  marginBottom: 8,
                  fontFamily: 'monospace',
                }}>
                  EVENT HUB
                </Text>
                
                <Text style={{
                  fontSize: 12,
                  color: colors.secondaryText,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  marginBottom: 40,
                  fontWeight: '600',
                }}>
                  ENTERPRISE PLATFORM
                </Text>

                {/* Loading Progress */}
                <View style={{
                  width: '100%',
                  backgroundColor: colors.secondaryBg,
                  height: 3,
                  marginBottom: 20,
                  overflow: 'hidden',
                  borderRadius: 1.5,
                }}>
                  <Animated.View style={[
                    loadingProgressStyle,
                    {
                      height: '100%',
                      backgroundColor: colors.accent,
                      shadowColor: colors.accent,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 6,
                      borderRadius: 1.5,
                    }
                  ]} />
                </View>

                {/* Loading Text */}
                <Text style={{
                  fontSize: 14,
                  color: colors.accent,
                  letterSpacing: 2,
                  textAlign: 'center',
                  marginBottom: 12,
                  fontWeight: '700',
                  fontFamily: 'monospace',
                }}>
                  {loadingText}
                </Text>

                {/* Loading Progress Percentage */}
                <Text style={{
                  fontSize: 12,
                  color: colors.secondaryText,
                  letterSpacing: 1,
                  fontWeight: '600',
                }}>
                  {loadingPercent}% COMPLETE
                </Text>

                {/* Loading System Info */}
                <View style={{
                  marginTop: 40,
                  alignItems: 'center',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      backgroundColor: colors.accent,
                      marginRight: 8,
                      borderRadius: 1,
                    }} />
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      letterSpacing: 1,
                      fontWeight: '600',
                    }}>
                      SYSTEM STATUS: ONLINE
                    </Text>
                  </View>

                  <Text style={{
                    fontSize: 11,
                    color: colors.secondaryText,
                    letterSpacing: 0.5,
                    textAlign: 'center',
                    opacity: 0.8,
                  }}>
                    © 2025 WeDesign Club • All Rights Reserved
                  </Text>
                </View>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      )}
      
      {/* Main Welcome Screen Content */}
      <GridPattern />
      <FloatingElements />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[containerStyle, { flex: 1 }]}>
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 24, 
              paddingVertical: 40,
              minHeight: screenHeight - 100
            }}
          >
            
            {/* Hero Section - Minimal & Powerful */}
            <Animated.View style={[heroStyle, { alignItems: 'center', marginBottom: 80 }]}>
              
              {/* Sophisticated Logo */}
              <Animated.View style={[logoStyle, { marginBottom: 40 }]}>
                <View style={{
                  width: 120,
                  height: 120,
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                  {/* Enhanced Corner details */}
                  <View style={{
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    width: 20,
                    height: 20,
                    borderTopWidth: 2,
                    borderLeftWidth: 2,
                    borderColor: colors.accent,
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 20,
                    height: 20,
                    borderBottomWidth: 2,
                    borderRightWidth: 2,
                    borderColor: colors.accent,
                  }} />
                  
                  {/* Logo */}
                  <Text style={{
                    fontSize: 32,
                    fontWeight: '900',
                    color: colors.primaryText,
                    letterSpacing: 4,
                    fontFamily: 'monospace',
                  }}>1337</Text>
                  
                  {/* Status indicator */}
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    backgroundColor: colors.accent,
                    borderRadius: 4,
                  }} />
                </View>
              </Animated.View>
              
              {/* Professional Typography */}
              <Animated.View style={[titleStyle, { alignItems: 'center', marginBottom: 24 }]}>
                <Text style={{
                  fontSize: 48,
                  fontWeight: '900',
                  color: colors.primaryText,
                  textAlign: 'center',
                  letterSpacing: -1,
                  marginBottom: 8,
                  fontFamily: 'monospace',
                }}>
                  EVENT-HUB
                </Text>
                
                <View style={{
                  width: 60,
                  height: 1,
                  backgroundColor: colors.accent,
                  marginBottom: 16,
                }} />
              </Animated.View>
              
              <Animated.View style={[subtitleStyle, { alignItems: 'center' }]}>
                <Text style={{
                  fontSize: 14,
                  color: colors.secondaryText,
                  textAlign: 'center',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  fontWeight: '600',
                }}>
                  EVENT PLATFORM
                </Text>
                
                <Text style={{
                  fontSize: 18,
                  color: colors.secondaryText,
                  textAlign: 'center',
                  lineHeight: 28,
                  maxWidth: 320,
                  fontWeight: '400',
                }}>
                  Advanced event management for the world's most innovative coding network.
                </Text>
              </Animated.View>
            </Animated.View>

             {/* Professional CTA Section */}
             <Animated.View style={[ctaStyle, { gap: 20 }]}>
               
               {/* 42 Authentication Button */}
               <Auth42Button 
                 onAuthSuccess={handleAuth42Success}
                 onAuthError={handleAuth42Error}
               />
             </Animated.View>

             {/* Enterprise Footer */}
             <View style={{
               marginTop: 60,
               paddingTop: 32,
               borderTopWidth: 1,
               borderTopColor: colors.cardBorder,
               alignItems: 'center',
             }}>
               <View style={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 marginBottom: 16,
               }}>
                 <View style={{
                   width: 12,
                   height: 12,
                   backgroundColor: colors.accent,
                   marginRight: 8,
                   borderRadius: 1,
                 }} />
                 <Text style={{
                   fontSize: 14,
                   color: colors.secondaryText,
                   fontWeight: '600',
                   letterSpacing: 1,
                   textTransform: 'uppercase',
                 }}>
                   42 Network
                 </Text>
               </View>
               
               <Text style={{
                 fontSize: 12,
                 color: colors.secondaryText,
                 textAlign: 'center',
                 letterSpacing: 0.5,
                 lineHeight: 18,
               }}>
                 Event Platform © 2025 WeDesign Club{'\n'}
                 Advanced Event Management System 
               </Text>
             </View>

           </ScrollView>
        </Animated.View>
      </SafeAreaView>
     </View>
  );
}

// Modal Styles
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(51, 51, 51, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdropPress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 24,
    backgroundColor: colors.white,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoSquare: {
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.accent,
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  roleGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '600',
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  roleArrow: {
    marginLeft: 12,
  },
}); 