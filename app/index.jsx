import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Animate entrance
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withSpring(0, { damping: 15 });
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        <Animated.View style={animatedStyle} className="items-center">
          {/* Hero Section */}
          <View className="items-center mb-8">
            <Text className="text-5xl font-bold text-white text-center mb-4">
              🚀 Hackathon
            </Text>
            <Text className="text-xl text-blue-100 text-center mb-2">
              High-Performance Mobile App
            </Text>
            <Text className="text-base text-blue-200 text-center max-w-xs">
              Built with React Native + Expo for the ultimate mobile experience
            </Text>
          </View>

          {/* Features List */}
          <BlurView intensity={20} className="rounded-3xl p-6 mb-8 w-full max-w-sm">
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">✨</Text>
                <Text className="text-white font-medium">Stunning animations</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🧭</Text>
                <Text className="text-white font-medium">Smooth navigation</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">📱</Text>
                <Text className="text-white font-medium">Native performance</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🛠️</Text>
                <Text className="text-white font-medium">Easy to extend</Text>
              </View>
            </View>
          </BlurView>

          {/* Get Started Button */}
          <Pressable
            onPress={handleGetStarted}
            className="bg-white rounded-2xl px-8 py-4 w-full max-w-xs"
          >
            <Text className="text-primary-600 font-bold text-lg text-center">
              Get Started
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
} 