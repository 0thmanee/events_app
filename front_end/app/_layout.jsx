import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

// Import gesture handler and reanimated
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    // Any initialization logic here
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