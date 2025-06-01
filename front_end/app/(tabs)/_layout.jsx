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

// Light theme colors
const colors = {
  primaryBg: '#F5F5F5',
  secondaryBg: '#EAEAEA',
  primaryText: '#333333',
  secondaryText: '#555555',
  accent: '#3EB489',
  highlight: '#E1C3AD',
  white: '#FFFFFF',
  lightAccent: '#3EB48920',
  cardBorder: '#E0E0E0',
  shadow: '#00000015',
  muted: '#9ca3af'
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enhanced Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation, userRole }) {
  // Filter routes based on user role
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';
  
  const allowedRoutes = isStaffOrAdmin 
    ? ['admin', 'event-management', 'manage-shop', 'manage-wallet', 'manage-ranking']
    : ['index', 'events', 'wallet', 'leaderboard'];

  // Filter state routes to only include allowed ones
  const filteredRoutes = state.routes.filter(route => 
    allowedRoutes.includes(route.name)
  );

  // Create filtered state
  const filteredState = {
    ...state,
    routes: filteredRoutes,
    index: Math.min(state.index, filteredRoutes.length - 1)
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        height: 80,
        borderRadius: 28,
        overflow: "hidden",
        shadowColor: colors.primaryText,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Light theme background with blur */}
      <BlurView
        intensity={100}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* White background overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      />

      {/* Gradient accent overlay */}
      <LinearGradient
        colors={[colors.lightAccent, 'transparent', colors.lightAccent]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Subtle border */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        }}
      />

      {/* Tab buttons */}
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes.findIndex(r => r.key === route.key) === state.index;

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
              userRole={userRole}
            />
          );
        })}
      </View>
    </View>
  );
}

// Enhanced Professional Tab Component
function CustomTab({ route, options, isFocused, onPress, index, userRole }) {
  const scale = useSharedValue(1);
  const iconOpacity = useSharedValue(isFocused ? 1 : 0.6);
  const textOpacity = useSharedValue(isFocused ? 1 : 0.7);
  const iconTranslateY = useSharedValue(0);
  const backgroundOpacity = useSharedValue(isFocused ? 1 : 0);
  const backgroundScale = useSharedValue(isFocused ? 1 : 0.8);

  useEffect(() => {
    iconOpacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 250 });
    textOpacity.value = withTiming(isFocused ? 1 : 0.7, { duration: 250 });
    iconTranslateY.value = withSpring(isFocused ? -2 : 0, {
      damping: 20,
      stiffness: 300,
    });
    backgroundOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
    backgroundScale.value = withSpring(isFocused ? 1 : 0.8, {
      damping: 15,
      stiffness: 200,
    });
  }, [isFocused]);

  const tabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [{ scale: backgroundScale.value }],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateY: iconTranslateY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  // Student tab icons
  const getStudentIcon = (routeName) => {
    const iconProps = {
      size: isFocused ? 24 : 22,
      strokeWidth: isFocused ? 2.5 : 2,
      color: isFocused ? colors.accent : colors.secondaryText,
    };

    switch (routeName) {
      case "index":
        return <Home {...iconProps} />;
      case "events":
        return <Search {...iconProps} />;
      case "wallet":
        return <Wallet {...iconProps} />;
      case "leaderboard":
        return <Trophy {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  // Staff/Admin tab icons
  const getAdminIcon = (routeName) => {
    const iconProps = {
      size: isFocused ? 24 : 22,
      strokeWidth: isFocused ? 2.5 : 2,
      color: isFocused ? colors.accent : colors.secondaryText,
    };

    switch (routeName) {
      case "admin":
        return <Shield {...iconProps} />;
      case "event-management":
        return <Calendar {...iconProps} />;
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

  // Determine which icon set to use based on user role
  const getIcon = (routeName) => {
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';
    return isStaffOrAdmin ? getAdminIcon(routeName) : getStudentIcon(routeName);
  };

  return (
    <AnimatedPressable
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          paddingVertical: 8,
          paddingHorizontal: 4,
          position: 'relative',
        },
        tabStyle,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
    >
      {/* Active background with gradient */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 18,
            overflow: 'hidden',
          },
          backgroundStyle,
        ]}
      >
        <LinearGradient
          colors={[colors.accent + '20', colors.accent + '10']}
          style={{
            flex: 1,
            borderRadius: 18,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Subtle border for active state */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.accent + '30',
          }}
        />
      </Animated.View>

      {/* Icon Container */}
      <Animated.View
        style={[
          {
            marginBottom: 4,
            alignItems: "center",
            justifyContent: "center",
            height: 28,
            zIndex: 1,
          },
          iconContainerStyle,
        ]}
      >
        {getIcon(route.name)}
      </Animated.View>

      {/* Enhanced Label */}
      <Animated.Text
        style={[
          {
            fontSize: 11,
            fontWeight: isFocused ? "700" : "600",
            color: isFocused ? colors.accent : colors.secondaryText,
            letterSpacing: 0.3,
            textAlign: "center",
            zIndex: 1,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {options.title}
      </Animated.Text>

      {/* Modern active indicator - glowing dot */}
      {isFocused && (
        <Animated.View
          style={{
            position: "absolute",
            top: 6,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 4,
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
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} userRole={userRole} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="admin"
            options={{
              title: isStaff ? 'Staff Panel' : 'Admin Panel',
            }}
          />
          <Tabs.Screen
            name="event-management"
            options={{
              title: 'Events',
            }}
          />
          <Tabs.Screen
            name="manage-shop"
            options={{
              title: 'Shop',
            }}
          />
          <Tabs.Screen
            name="manage-wallet"
            options={{
              title: 'Wallet',
            }}
          />
          <Tabs.Screen
            name="manage-ranking"
            options={{
              title: 'Rankings',
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
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} userRole={userRole} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Events',
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Rankings',
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
