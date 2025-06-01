import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Code, Star, Gift } from 'lucide-react-native';
import AuthService from '../services/AuthService';

export default function Auth42Button({ onAuthSuccess, onAuthError }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async () => {
    try {
      setIsAuthenticating(true);
      console.log('🚀 Starting 42 OAuth authentication...');
      
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
    }
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <Pressable 
        onPress={handleAuth}
        disabled={isAuthenticating}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
      >
        <LinearGradient
          colors={['#00babc', '#1dd3b0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            minHeight: 56,
          }}
        >
          {isAuthenticating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Code size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginRight: 8,
              }}>
                Continue with 42
              </Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
      
    </View>
  );
} 