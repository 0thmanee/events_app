import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function OAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log('📱 OAuth callback received:', params);
    
    // Complete the auth session
    WebBrowser.maybeCompleteAuthSession();
    
    // Navigate back to the main app
    // The AuthService will handle the token exchange automatically
    router.replace('/');
  }, [params]);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000'
    }}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{
        color: 'white',
        marginTop: 20,
        fontSize: 16
      }}>
        Completing authentication...
      </Text>
    </View>
  );
} 