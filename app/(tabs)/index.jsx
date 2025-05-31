import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Bell,
  Plus,
  ChevronRight,
  Code2,
  Coffee,
  Mic,
  Gamepad2,
  Trophy,
  Bookmark,
  Activity,
  TrendingUp
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set([1, 3]));
  const [registeredEvents, setRegisteredEvents] = useState(new Set([1, 2]));
  
  // Mock user data - will be replaced with real data from 42 API
  const user = {
    name: 'John Doe',
    login: 'jdoe',
    campus: 'Khouribga',
    level: 8.42,
    coalition: 'Assembly',
    avatar: null,
  };

  // Mock events data - will be replaced with real API data
  const eventsData = [
    {
      id: 1,
      title: 'React Native Workshop',
      description: 'Advanced mobile development techniques',
      date: '2024-12-20',
      time: '14:00',
      location: 'Room A201',
      category: 'Workshop',
      instructor: 'Sarah Chen',
      capacity: 30,
      registered: 24,
      tags: ['React Native', 'Mobile', 'Development'],
      difficulty: 'Intermediate',
      estimatedDuration: '3 hours',
    },
    {
      id: 2,
      title: 'Algorithm Design Talk',
      description: 'Optimizing complex algorithms for competitive programming',
      date: '2024-12-21',
      time: '16:00',
      location: 'Auditorium',
      category: 'Talk',
      instructor: 'Ahmed Benali',
      capacity: 100,
      registered: 67,
      tags: ['Algorithms', 'Competitive Programming'],
      difficulty: 'Advanced',
      estimatedDuration: '2 hours',
    },
    {
      id: 3,
      title: 'Coding Night #12',
      description: 'Collaborative coding session with pizza!',
      date: '2024-12-22',
      time: '19:00',
      location: 'Main Lab',
      category: 'Social',
      instructor: null,
      capacity: 50,
      registered: 31,
      tags: ['Collaboration', 'Fun', 'Networking'],
      difficulty: 'All Levels',
      estimatedDuration: '4 hours',
    },
    {
      id: 4,
      title: 'Game Development Bootcamp',
      description: 'Build your first game using Unity',
      date: '2024-12-23',
      time: '10:00',
      location: 'Creative Studio',
      category: 'Workshop',
      instructor: 'Lisa Park',
      capacity: 20,
      registered: 18,
      tags: ['Unity', 'Game Dev', 'Graphics'],
      difficulty: 'Beginner',
      estimatedDuration: '6 hours',
    }
  ];

  const categories = [
    { name: 'All', icon: Activity, count: eventsData.length },
    { name: 'Workshop', icon: Code2, count: eventsData.filter(e => e.category === 'Workshop').length },
    { name: 'Talk', icon: Mic, count: eventsData.filter(e => e.category === 'Talk').length },
    { name: 'Social', icon: Coffee, count: eventsData.filter(e => e.category === 'Social').length },
  ];

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return eventsData;
    return eventsData.filter(event => event.category === selectedCategory);
  }, [selectedCategory]);

  const upcomingEvents = eventsData.filter(event => 
    new Date(event.date) >= new Date()
  ).slice(0, 3);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Workshop': return Code2;
      case 'Talk': return Mic;
      case 'Social': return Coffee;
      default: return Activity;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Workshop': return '#3b82f6';
      case 'Talk': return '#10b981';
      case 'Social': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleBookmark = (eventId) => {
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleRegister = (eventId) => {
    setRegisteredEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <LinearGradient colors={['#000000', '#111827']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            className="mt-6 mb-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-2xl font-bold text-white mb-1">
                  Welcome back, {user.name.split(' ')[0]} 👋
            </Text>
                <Text className="text-base text-gray-400">
                  {user.login} • {user.campus} Campus • Level {user.level}
            </Text>
              </View>
              <Pressable className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center">
                <Bell color="#ffffff" size={20} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            className="mb-8"
          >
            <BlurView intensity={40} className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <Text className="text-lg font-bold text-white mb-4">Your Activity</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-400">{registeredEvents.size}</Text>
                  <Text className="text-sm text-gray-400">Registered</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-400">{bookmarkedEvents.size}</Text>
                  <Text className="text-sm text-gray-400">Bookmarked</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-400">12</Text>
                  <Text className="text-sm text-gray-400">Attended</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-yellow-400">4.8</Text>
                  <Text className="text-sm text-gray-400">Avg Rating</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Upcoming Events */}
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            className="mb-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">Upcoming Events</Text>
              <Pressable className="flex-row items-center">
                <Text className="text-blue-400 text-sm font-medium mr-1">View All</Text>
                <ChevronRight color="#60a5fa" size={16} />
              </Pressable>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
              {upcomingEvents.map((event, index) => {
                const IconComponent = getCategoryIcon(event.category);
                const isRegistered = registeredEvents.has(event.id);
                
                return (
                  <Animated.View
                    key={event.id}
                    entering={FadeInRight.delay(800 + index * 200).springify()}
                    className="mr-4"
                  >
                    <Pressable className="w-64">
                      <BlurView intensity={30} className="rounded-2xl p-4 bg-white/10 border border-white/20">
                        <View className="flex-row items-start justify-between mb-3">
                          <View 
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{ backgroundColor: getCategoryColor(event.category) + '20' }}
                          >
                            <IconComponent color={getCategoryColor(event.category)} size={20} />
                          </View>
                          <View className="flex-row items-center space-x-2">
                            <Pressable onPress={() => handleBookmark(event.id)}>
                              <Bookmark 
                                color={bookmarkedEvents.has(event.id) ? '#60a5fa' : '#6b7280'} 
                                size={18}
                                fill={bookmarkedEvents.has(event.id) ? '#60a5fa' : 'transparent'}
                              />
                            </Pressable>
                          </View>
                        </View>
                        
                        <Text className="text-white font-bold text-base mb-2" numberOfLines={2}>
                          {event.title}
                        </Text>
                        
                        <Text className="text-gray-300 text-sm mb-3" numberOfLines={2}>
                          {event.description}
                        </Text>
                        
                        <View className="space-y-2 mb-4">
                          <View className="flex-row items-center">
                            <Calendar color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-2">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <MapPin color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-2">{event.location}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <Users color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-2">
                              {event.registered}/{event.capacity} registered
                            </Text>
                          </View>
                        </View>
                        
                        <Pressable 
                          onPress={() => handleRegister(event.id)}
                          className={`rounded-xl py-3 px-4 ${
                            isRegistered 
                              ? 'bg-green-600/20 border border-green-600/30' 
                              : 'bg-blue-600/20 border border-blue-600/30'
                          }`}
                        >
                          <Text className={`text-center font-medium text-sm ${
                            isRegistered ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {isRegistered ? 'Registered ✓' : 'Register'}
                          </Text>
                        </Pressable>
                      </BlurView>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Categories */}
          <Animated.View 
            entering={FadeInDown.delay(1000).springify()}
            className="mb-8"
          >
            <Text className="text-xl font-bold text-white mb-4">Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.name;
                
                return (
                  <AnimatedPressable
                    key={category.name}
                    entering={FadeInUp.delay(1200 + index * 100).springify()}
                    onPress={() => setSelectedCategory(category.name)}
                    className="mr-3"
                  >
                    <BlurView 
                      intensity={isSelected ? 60 : 30} 
                      className={`rounded-2xl p-4 min-w-[120px] items-center ${
                        isSelected 
                          ? 'bg-blue-600/30 border border-blue-600/50' 
                          : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      <IconComponent 
                        color={isSelected ? '#60a5fa' : '#9ca3af'} 
                        size={24} 
                      />
                      <Text className={`font-medium text-sm mt-2 ${
                        isSelected ? 'text-blue-400' : 'text-gray-300'
                      }`}>
                        {category.name}
                      </Text>
                      <Text className={`text-xs mt-1 ${
                        isSelected ? 'text-blue-300' : 'text-gray-500'
                      }`}>
                        {category.count} events
                      </Text>
                    </BlurView>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* All Events */}
          <Animated.View 
            entering={FadeInDown.delay(1400).springify()}
            className="mb-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-white">
                {selectedCategory} Events
              </Text>
              <Text className="text-gray-400 text-sm">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            <View className="space-y-4">
              {filteredEvents.map((event, index) => {
                const IconComponent = getCategoryIcon(event.category);
                const isRegistered = registeredEvents.has(event.id);
                const isBookmarked = bookmarkedEvents.has(event.id);
                
                return (
                <AnimatedPressable
                    key={event.id}
                    entering={FadeInUp.delay(1600 + index * 200).springify()}
                    className="overflow-hidden"
                >
                    <BlurView intensity={30} className="rounded-2xl p-4 bg-white/10 border border-white/20">
                      <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View 
                            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: getCategoryColor(event.category) + '20' }}
                        >
                            <IconComponent color={getCategoryColor(event.category)} size={24} />
                          </View>
                          <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                              <Text className="text-white font-bold text-base flex-1" numberOfLines={1}>
                                {event.title}
                              </Text>
                              <View className="flex-row items-center space-x-3 ml-3">
                                <Pressable onPress={() => handleBookmark(event.id)}>
                                  <Bookmark 
                                    color={isBookmarked ? '#60a5fa' : '#6b7280'} 
                                    size={18}
                                    fill={isBookmarked ? '#60a5fa' : 'transparent'}
                                  />
                                </Pressable>
                              </View>
                            </View>
                            <Text className="text-gray-300 text-sm mb-2" numberOfLines={2}>
                              {event.description}
                            </Text>
                            {event.instructor && (
                              <Text className="text-gray-400 text-xs mb-2">
                                Instructor: {event.instructor}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center space-x-4">
                          <View className="flex-row items-center">
                            <Calendar color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-1">
                              {new Date(event.date).toLocaleDateString()}
                          </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Clock color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-1">{event.time}</Text>
                          </View>
                          <View className="flex-row items-center">
                            <MapPin color="#9ca3af" size={14} />
                            <Text className="text-gray-400 text-xs ml-1">{event.location}</Text>
                          </View>
                        </View>
                        <View className="flex-row items-center">
                          <Users color="#9ca3af" size={14} />
                          <Text className="text-gray-400 text-xs ml-1">
                            {event.registered}/{event.capacity}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center space-x-2">
                          <View className="bg-gray-800 rounded-lg px-2 py-1">
                            <Text className="text-gray-300 text-xs">{event.difficulty}</Text>
                          </View>
                          <View className="bg-gray-800 rounded-lg px-2 py-1">
                            <Text className="text-gray-300 text-xs">{event.estimatedDuration}</Text>
                          </View>
                      </View>
                        
                        <Pressable 
                          onPress={() => handleRegister(event.id)}
                          className={`rounded-xl py-2 px-4 ${
                            isRegistered 
                              ? 'bg-green-600/20 border border-green-600/30' 
                              : 'bg-blue-600/20 border border-blue-600/30'
                          }`}
                        >
                          <Text className={`font-medium text-sm ${
                            isRegistered ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {isRegistered ? 'Registered ✓' : 'Register'}
                          </Text>
                        </Pressable>
                    </View>
                  </BlurView>
                </AnimatedPressable>
                );
              })}
            </View>
          </Animated.View>

          {/* Bottom spacing for tab bar */}
          <View className="h-24" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
} 