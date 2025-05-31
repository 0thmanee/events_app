import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Coins,
  Play,
  Globe,
  Gem
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(100);
  const scaleAnim = useSharedValue(0.8);
  const glowAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  const features = [
    {
      icon: Calendar,
      title: 'Smart Events',
      subtitle: 'AI-Powered Discovery',
      description: 'Discover incredible 1337 events tailored to your coding journey with intelligent recommendations',
      gradient: ['#6366f1', '#8b5cf6', '#d946ef'],
      accentColor: '#8b5cf6',
    },
    {
      icon: Users,
      title: 'Elite Community',
      subtitle: 'Connect & Collaborate',
      description: 'Join an exclusive network of 1337 students and industry professionals',
      gradient: ['#06b6d4', '#3b82f6', '#6366f1'],
      accentColor: '#06b6d4',
    },
    {
      icon: Trophy,
      title: 'Level System',
      subtitle: 'Gamified Progress',
      description: 'Earn XP, unlock achievements, and rise through the ranks of 1337 excellence',
      gradient: ['#10b981', '#06b6d4', '#3b82f6'],
      accentColor: '#10b981',
    },
    {
      icon: Coins,
      title: 'Digital Economy',
      subtitle: 'Earn & Spend',
      description: 'Participate in events to earn coins and customize your digital identity',
      gradient: ['#f59e0b', '#f97316', '#ef4444'],
      accentColor: '#f59e0b',
    },
  ];

  useEffect(() => {
    // Epic entrance animations
    fadeAnim.value = withDelay(300, withTiming(1, { duration: 1200 }));
    slideAnim.value = withDelay(500, withSpring(0, { damping: 20, stiffness: 100 }));
    scaleAnim.value = withDelay(700, withSpring(1, { damping: 15, stiffness: 120 }));
    
    // Continuous glow effect
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      true
    );
    
    // Subtle rotation
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    
    // Pulse effect
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { translateY: slideAnim.value },
      { scale: scaleAnim.value }
    ]
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnim.value, [0, 1], [0.4, 1]),
    transform: [
      { scale: interpolate(glowAnim.value, [0, 1], [1, 1.02]) }
    ]
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateAnim.value}deg` }
    ]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseAnim.value }
    ]
  }));

  const currentFeatureData = features[currentFeature];

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    console.log('Login with 42 API');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Animated Background */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0a0a0a']}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Orbs Background */}
      <Animated.View style={[rotateStyle, { position: 'absolute', top: 100, right: 50, opacity: 0.3 }]}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#8b5cf6',
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 20,
        }} />
      </Animated.View>
      
      <Animated.View style={[pulseStyle, { position: 'absolute', bottom: 200, left: 30, opacity: 0.2 }]}>
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#06b6d4',
          shadowColor: '#06b6d4',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 15,
        }} />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <Animated.View style={[containerStyle, { flex: 1, paddingTop: 60 }]}>
            
            {/* Hero Section with Neon Logo */}
            <View style={{ alignItems: 'center', marginBottom: 60 }}>
              {/* Neon 1337 Logo */}
              <Animated.View style={[glowStyle, { marginBottom: 30 }]}>
                <View style={{
                  width: 120,
                  height: 120,
                  borderRadius: 30,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderWidth: 2,
                  borderColor: '#8b5cf6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 25,
                }}>
                  <Text style={{
                    fontSize: 42,
                    fontWeight: '900',
                    color: '#ffffff',
                    textShadowColor: '#8b5cf6',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 20,
                    letterSpacing: 2,
                  }}>1337</Text>
                </View>
              </Animated.View>
              
              {/* Main Title with Neon Effect */}
              <Text style={{
                fontSize: 48,
                fontWeight: '900',
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: 8,
                textShadowColor: '#8b5cf6',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
                letterSpacing: 1,
              }}>
                EVENT HUB
              </Text>
              
              <Text style={{
                fontSize: 18,
                color: '#a78bfa',
                textAlign: 'center',
                marginBottom: 12,
                fontWeight: '600',
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}>
                ELITE CODING EXPERIENCE
              </Text>
              
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 24,
                maxWidth: 320,
              }}>
                Join the most exclusive coding community. Discover events, level up, and connect with the future of tech.
              </Text>
            </View>

            {/* Premium Feature Showcase */}
            <View style={{ marginBottom: 50 }}>
              <LinearGradient
                colors={currentFeatureData.gradient}
                style={{
                  borderRadius: 24,
                  padding: 3,
                  marginHorizontal: 10,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <BlurView 
                  intensity={20} 
                  style={{
                    borderRadius: 21,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    overflow: 'hidden'
                  }}
                >
                  <View style={{ padding: 30 }}>
                    <View style={{ alignItems: 'center' }}>
                      {/* Feature Icon with Glow */}
                      <Animated.View style={[glowStyle]}>
                        <View style={{
                          width: 80,
                          height: 80,
                          borderRadius: 20,
                          backgroundColor: `${currentFeatureData.accentColor}20`,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                          borderWidth: 1,
                          borderColor: currentFeatureData.accentColor,
                          shadowColor: currentFeatureData.accentColor,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.8,
                          shadowRadius: 15,
                        }}>
                          <currentFeatureData.icon 
                            color={currentFeatureData.accentColor}
                            size={36} 
                            strokeWidth={2.5}
                          />
                        </View>
                      </Animated.View>
                      
                      {/* Feature Content */}
                      <Text style={{
                        fontSize: 28,
                        fontWeight: '800',
                        color: '#ffffff',
                        textAlign: 'center',
                        marginBottom: 8,
                        textShadowColor: currentFeatureData.accentColor,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                      }}>
                        {currentFeatureData.title}
                      </Text>
                      
                      <Text style={{
                        fontSize: 14,
                        color: currentFeatureData.accentColor,
                        textAlign: 'center',
                        marginBottom: 16,
                        fontWeight: '600',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}>
                        {currentFeatureData.subtitle}
                      </Text>
                      
                      <Text style={{
                        color: '#d1d5db',
                        textAlign: 'center',
                        fontSize: 16,
                        lineHeight: 24,
                        opacity: 0.9,
                      }}>
                        {currentFeatureData.description}
                      </Text>
                    </View>
                  </View>
                </BlurView>
              </LinearGradient>
            </View>

            {/* Elegant Feature Indicators */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
              gap: 12,
            }}>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    {
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: index === currentFeature ? feature.accentColor : '#374151',
                      width: index === currentFeature ? 24 : 4,
                    },
                    index === currentFeature && glowStyle
                  ]}
                />
              ))}
            </View>

            {/* Premium Action Buttons */}
            <View style={{ gap: 20, paddingHorizontal: 10 }}>
              {/* Primary CTA - Login with 42 */}
              <AnimatedPressable
                onPress={handleLogin}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.6,
                  shadowRadius: 20,
                }}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1', '#3b82f6']}
                  style={{ paddingVertical: 18, paddingHorizontal: 32 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Shield color="white" size={24} style={{ marginRight: 12 }} />
                    <Text style={{
                      color: 'white',
                      fontWeight: '800',
                      fontSize: 18,
                      letterSpacing: 0.5,
                    }}>
                      AUTHENTICATE WITH 42
                    </Text>
                    <ArrowRight color="white" size={24} style={{ marginLeft: 12 }} />
                  </View>
                </LinearGradient>
              </AnimatedPressable>

              {/* Secondary CTA - Demo */}
              <AnimatedPressable
                onPress={handleGetStarted}
                style={{
                  borderRadius: 20,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderWidth: 2,
                  borderColor: '#8b5cf6',
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Play color="#a78bfa" size={20} style={{ marginRight: 12 }} />
                  <Text style={{
                    color: '#a78bfa',
                    fontWeight: '700',
                    fontSize: 16,
                    letterSpacing: 0.5,
                  }}>
                    EXPLORE DEMO
                  </Text>
                </View>
              </AnimatedPressable>
            </View>

            {/* Premium Footer */}
            <View style={{
              alignItems: 'center',
              marginTop: 60,
              paddingTop: 30,
              borderTopWidth: 1,
              borderTopColor: '#374151',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Gem color="#8b5cf6" size={16} style={{ marginRight: 8 }} />
                <Text style={{
                  color: '#8b5cf6',
                  fontSize: 14,
                  fontWeight: '600',
                  letterSpacing: 1,
                }}>
                  POWERED BY 42 NETWORK
                </Text>
              </View>
              <Text style={{
                color: '#6b7280',
                fontSize: 12,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}>
                Crafted by WeDesign Club • The Future of Event Management
              </Text>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 