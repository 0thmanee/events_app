import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing
} from 'react-native-reanimated';
import { Code, Star, Shield, ArrowRight } from 'lucide-react-native';
import AuthService from '../services/AuthService';

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

export default function Auth42Button({ onAuthSuccess, onAuthError }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(-1);
  const iconRotation = useSharedValue(0);

  const handleAuth = async () => {
    try {
      setIsAuthenticating(true);
      console.log('🚀 Starting 42 OAuth authentication...');
      
      // Start loading animation
      iconRotation.value = withTiming(360, { 
        duration: 1500, 
        easing: Easing.linear 
      });
      
      const result = await AuthService.login();
      
      if (result.success) {
        console.log('✅ Authentication successful');
        console.log('👤 User role:', result.user.role);
        console.log('🎯 Routing user to appropriate interface...');
        
        // No popup - just route directly based on role
        onAuthSuccess?.(result);
      } else {
        console.error('❌ Authentication failed:', result.error);
        onAuthError?.(new Error(result.error));
        
        // Show user-friendly error messages
        let errorMessage = result.error;
        if (result.error.includes('User cancelled')) {
          errorMessage = 'Authentication was cancelled. Please try again.';
        } else if (result.error.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (result.error.includes('Invalid client')) {
          errorMessage = 'Invalid client credentials. Please check your 42 OAuth setup.';
        } else if (result.error.includes('EMAIL_CONFLICT')) {
          errorMessage = 'This email is already registered with a different account. Please contact support.';
        }
        
        Alert.alert('Authentication Error', errorMessage);
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      onAuthError?.(error);
      
      // Handle specific error types
      let errorMessage = error.message;
      if (errorMessage.includes('Backend authentication failed')) {
        errorMessage = 'Failed to register with our servers. Please try again.';
      }
      
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsAuthenticating(false);
      iconRotation.value = 0;
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  // Animated styles
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  return (
    <View style={{ marginVertical: 8 }}>
      <Animated.View style={buttonStyle}>
        <Pressable 
          onPress={handleAuth}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isAuthenticating}
          style={({ pressed }) => [
            {
              opacity: isAuthenticating ? 0.7 : 1,
            }
          ]}
        >
          {/* Main Button Container */}
          <View style={{
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: colors.accent,
            borderRadius: 16,
            padding: 2,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}>
            
            {/* Inner Gradient Button */}
            <LinearGradient
              colors={[colors.accent, '#2EA574', colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 18,
                paddingHorizontal: 24,
                borderRadius: 14,
                minHeight: 64,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              
              {/* Subtle shimmer overlay */}
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255, 255, 255, 0.2)',
                  'transparent'
                ]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: -100,
                  right: -100,
                  bottom: 0,
                  opacity: 0.6,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />

              {/* Button Content */}
              {isAuthenticating ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="white" style={{ marginRight: 12 }} />
                  <Text style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                  }}>
                    Authenticating...
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* 42 Logo/Icon */}
                  <View style={{
                    width: 32,
                    height: 32,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Animated.View style={iconStyle}>
                      <Code size={18} color="white" strokeWidth={2.5} />
                    </Animated.View>
                  </View>
                  
                  {/* Button Text */}
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}>
                      Continue with 42 Network
                    </Text>
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 12,
                      fontWeight: '500',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>
                      Secure Authentication
                    </Text>
                  </View>
                  
                  {/* Arrow Icon */}
                  <View style={{
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                  }}>
                    <ArrowRight size={16} color="white" strokeWidth={2.5} />
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>
        </Pressable>
      </Animated.View>
      
      {/* Security Badge */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
      }}>
        <Shield size={14} color={colors.secondaryText} strokeWidth={2} />
        <Text style={{
          color: colors.secondaryText,
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 6,
          letterSpacing: 0.5,
        }}>
          OAuth 2.0 Secure Authentication
        </Text>
      </View>
    </View>
  );
} 