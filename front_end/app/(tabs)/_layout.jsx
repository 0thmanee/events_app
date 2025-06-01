import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Platform, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
import { useState, useEffect } from "react";
import {
  Calendar,
  Shield,
  ShoppingBag,
  Wallet,
  Trophy,
  Users,
  HeartHandshake,
  Home,
  Search,
  BookOpen,
  User,
  Settings,
  Store,
  Target,
  BarChart3,
  UserCheck
} from "lucide-react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 72,
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
      }}
    >
      {/* Clean background */}
      <BlurView
        intensity={80}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
        }}
      />

      {/* Subtle border */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 24,
          borderWidth: 0.5,
          borderColor: "rgba(148, 163, 184, 0.2)",
        }}
      />

      {/* Tab buttons */}
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <CustomTab
              key={route.key}
              route={route}
              options={options}
              isFocused={isFocused}
              onPress={onPress}
              index={index}
            />
          );
        })}
      </View>
    </View>
  );
}

// Professional Tab Component
function CustomTab({ route, options, isFocused, onPress, index }) {
  const scale = useSharedValue(1);
  const iconOpacity = useSharedValue(isFocused ? 1 : 0.6);
  const textOpacity = useSharedValue(isFocused ? 1 : 0.7);
  const iconTranslateY = useSharedValue(0);

  useEffect(() => {
    iconOpacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
    textOpacity.value = withTiming(isFocused ? 1 : 0.7, { duration: 200 });
    iconTranslateY.value = withSpring(isFocused ? -1 : 0, {
      damping: 20,
      stiffness: 300,
    });
  }, [isFocused]);

  const tabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateY: iconTranslateY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const getIcon = (routeName) => {
    const iconProps = {
      size: 22,
      strokeWidth: 2,
      color: isFocused ? "#3b82f6" : "#94a3b8",
    };

    switch (routeName) {
      case "event-management":
        return <Calendar {...iconProps} />;
      case "admin":
        return <Shield {...iconProps} />;
      case "manage-shop":
        return <ShoppingBag {...iconProps} />;
      case "manage-wallet":
        return <Wallet {...iconProps} />;
      case "manage-ranking":
        return <Trophy {...iconProps} />;
      default:
        return <Shield {...iconProps} />;
    }
  };

  return (
    <AnimatedPressable
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          zIndex: 2,
          paddingVertical: 6,
        },
        tabStyle,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
    >
      {/* Icon Container */}
      <Animated.View
        style={[
          {
            marginBottom: 3,
            alignItems: "center",
            justifyContent: "center",
            height: 28,
          },
          iconContainerStyle,
        ]}
      >
        {getIcon(route.name)}
      </Animated.View>

      {/* Clean Label */}
      <Animated.Text
        style={[
          {
            fontSize: 10,
            fontWeight: isFocused ? "600" : "500",
            color: isFocused ? "#1e293b" : "#64748b",
            letterSpacing: 0.2,
            textAlign: "center",
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {options.title}
      </Animated.Text>

      {/* Minimal active indicator dot */}
      {isFocused && (
        <View
          style={{
            position: "absolute",
            bottom: 2,
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: "#3b82f6",
          }}
        />
      )}
    </AnimatedPressable>
  );
}

export default function TabLayout() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        console.log('📱 Current user role:', role);
        setUserRole(role || 'student'); // Default to student
      } catch (error) {
        console.log('Error getting user role:', error);
        setUserRole('student'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, []);

  // Show loading state while determining role
  if (isLoading) {
    return null;
  }

  const isStaff = userRole === 'staff';
  const isAdmin = userRole === 'admin'; // Keep admin separate from staff
  const isStaffOrAdmin = isStaff || isAdmin;

  if (isStaffOrAdmin) {
    // Staff/Admin tab layout with management pages
    return (
      <>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#f59e0b',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
              backgroundColor: 'rgba(10, 15, 28, 0.98)',
              borderTopColor: 'rgba(26, 35, 50, 0.8)',
              borderTopWidth: 1,
              paddingTop: 12,
              paddingBottom: Platform.OS === 'ios' ? 28 : 12,
              height: Platform.OS === 'ios' ? 96 : 72,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
              marginTop: 6,
              textTransform: 'uppercase',
            },
            headerShown: false,
            tabBarItemStyle: {
              paddingTop: 6,
              borderRadius: 12,
              marginHorizontal: 4,
            },
          }}
        >
          <Tabs.Screen
            name="admin"
            options={{
              title: isStaff ? 'Staff Panel' : 'Admin Panel',
              tabBarIcon: ({ color, size, focused }) => (
                <Shield 
                  color={color} 
                  size={focused ? 24 : 22} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color + '20' : 'transparent'}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="event-management"
            options={{
              title: 'Events',
              tabBarIcon: ({ color, size, focused }) => (
                <Calendar 
                  color={color} 
                  size={focused ? 24 : 22} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color + '20' : 'transparent'}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="manage-shop"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color, size, focused }) => (
                <ShoppingBag 
                  color={color} 
                  size={focused ? 24 : 22} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color + '20' : 'transparent'}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="manage-wallet"
            options={{
              title: 'Wallet',
              tabBarIcon: ({ color, size, focused }) => (
                <Wallet 
                  color={color} 
                  size={focused ? 24 : 22} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color + '20' : 'transparent'}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="manage-ranking"
            options={{
              title: 'Rankings',
              tabBarIcon: ({ color, size, focused }) => (
                <Trophy 
                  color={color} 
                  size={focused ? 24 : 22} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color + '20' : 'transparent'}
                />
              ),
            }}
          />

          {/* Hide student screens from admin */}
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="events" options={{ href: null }} />
          <Tabs.Screen name="calendar" options={{ href: null }} />
          <Tabs.Screen name="wallet" options={{ href: null }} />
          <Tabs.Screen name="leaderboard" options={{ href: null }} />
          <Tabs.Screen name="store" options={{ href: null }} />
          <Tabs.Screen name="profile" options={{ href: null }} />
        </Tabs>
      </>
    );
  }

  // Student tab layout with their own pages
  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: 'rgba(10, 15, 28, 0.98)',
            borderTopColor: 'rgba(26, 35, 50, 0.8)',
            borderTopWidth: 1,
            paddingTop: 10,
            paddingBottom: Platform.OS === 'ios' ? 26 : 10,
            height: Platform.OS === 'ios' ? 92 : 68,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.3,
            marginTop: 4,
          },
          headerShown: false,
          tabBarItemStyle: {
            paddingTop: 4,
            borderRadius: 10,
            marginHorizontal: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Home 
                color={color} 
                size={focused ? 22 : 20} 
                strokeWidth={focused ? 2.5 : 2} 
                fill={focused ? color + '15' : 'transparent'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Events',
            tabBarIcon: ({ color, size, focused }) => (
              <Search 
                color={color} 
                size={focused ? 22 : 20} 
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, size, focused }) => (
              <Wallet 
                color={color} 
                size={focused ? 22 : 20} 
                strokeWidth={focused ? 2.5 : 2}
                fill={focused ? color + '15' : 'transparent'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rankings',
            tabBarIcon: ({ color, size, focused }) => (
              <Trophy 
                color={color} 
                size={focused ? 22 : 20} 
                strokeWidth={focused ? 2.5 : 2}
                fill={focused ? color + '15' : 'transparent'}
              />
            ),
          }}
        />

        {/* Hide admin screens from students */}
        <Tabs.Screen name="admin" options={{ href: null }} />
        <Tabs.Screen name="event-management" options={{ href: null }} />
        <Tabs.Screen name="manage-shop" options={{ href: null }} />
        <Tabs.Screen name="manage-wallet" options={{ href: null }} />
        <Tabs.Screen name="manage-ranking" options={{ href: null }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
        <Tabs.Screen name="store" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
    </>
  );
}
