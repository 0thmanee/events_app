import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { useState } from 'react';
import { Zap, Sparkles, Rocket, Heart } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const [likedCards, setLikedCards] = useState(new Set());
  
  const cards = [
    { id: 1, title: 'Performance', subtitle: 'Lightning Fast', icon: Zap, color: '#fbbf24' },
    { id: 2, title: 'Animations', subtitle: 'Smooth & Fluid', icon: Sparkles, color: '#a855f7' },
    { id: 3, title: 'Navigation', subtitle: 'Intuitive Flow', icon: Rocket, color: '#3b82f6' },
  ];

  const handleCardPress = (cardId) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <LinearGradient colors={['#f8fafc', '#e2e8f0']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            className="mt-6 mb-8"
          >
            <Text className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome Back! 👋
            </Text>
            <Text className="text-lg text-neutral-600">
              Explore the power of React Native + Expo
            </Text>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            className="mb-8"
          >
            <BlurView intensity={20} className="rounded-3xl p-6 bg-white/60">
              <Text className="text-xl font-bold text-neutral-900 mb-4">Quick Stats</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary-600">60fps</Text>
                  <Text className="text-sm text-neutral-600">Smooth</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-accent-600">Fast</Text>
                  <Text className="text-sm text-neutral-600">Loading</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-secondary-600">Native</Text>
                  <Text className="text-sm text-neutral-600">Feel</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            className="mb-8"
          >
            <Text className="text-xl font-bold text-neutral-900 mb-4">Features</Text>
            <View className="space-y-4">
              {cards.map((card, index) => (
                <AnimatedPressable
                  key={card.id}
                  entering={FadeInRight.delay(800 + index * 200).springify()}
                  onPress={() => handleCardPress(card.id)}
                  className="overflow-hidden rounded-2xl"
                >
                  <BlurView intensity={30} className="p-4 bg-white/70">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View 
                          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                          style={{ backgroundColor: card.color + '20' }}
                        >
                          <card.icon color={card.color} size={24} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-neutral-900">
                            {card.title}
                          </Text>
                          <Text className="text-sm text-neutral-600">
                            {card.subtitle}
                          </Text>
                        </View>
                      </View>
                      <View className="ml-4">
                        <Heart 
                          color={likedCards.has(card.id) ? '#ef4444' : '#94a3b8'} 
                          size={24}
                          fill={likedCards.has(card.id) ? '#ef4444' : 'transparent'}
                        />
                      </View>
                    </View>
                  </BlurView>
                </AnimatedPressable>
              ))}
            </View>
          </Animated.View>

          {/* Bottom spacing for tab bar */}
          <View className="h-24" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
} 