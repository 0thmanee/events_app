import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProfileScreen() {
  return (
    <LinearGradient colors={['#f0e7ff', '#e9d5ff']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6">
          <Animated.View entering={FadeInUp.delay(200)} className="mt-6">
            <Text className="text-3xl font-bold text-neutral-900 mb-4">
              👤 Profile
            </Text>
            <Text className="text-lg text-neutral-600">
              Your personal space
            </Text>
          </Animated.View>
          <View className="h-24" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
} 