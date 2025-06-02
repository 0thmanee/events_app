import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NotificationService from '../services/NotificationService';
import '../global.css';

// Import gesture handler and reanimated
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    // Initialize notification service
    const initializeNotifications = async () => {
      try {
        await NotificationService.initialize();
        console.log('✅ NotificationService initialized in RootLayout');
      } catch (error) {
        console.error('❌ Failed to initialize NotificationService:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="manage-shop" />
        <Stack.Screen name="manage-wallet" />
        <Stack.Screen name="manage-leaderboard" />
        <Stack.Screen name="manage-volunteers" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
} 