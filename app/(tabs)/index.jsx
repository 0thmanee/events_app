import { View, Text, ScrollView, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Shield,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Bell,
  Zap,
  Star,
  ChevronRight,
  Activity,
  TrendingUp,
  Coffee,
  BookOpen,
  Code,
  Heart,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();

  const adminActions = [
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Full admin management',
      icon: Shield,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      route: '/admin',
    },
    {
      id: 'events',
      title: 'Event Management',
      description: 'Manage school events',
      icon: Calendar,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      route: '/event-management',
    },
  ];

  const quickStats = [
    { label: 'Active Students', value: '1,247', icon: Users, color: '#3b82f6' },
    { label: 'Events Today', value: '8', icon: Calendar, color: '#10b981' },
    { label: 'Notifications', value: '23', icon: Bell, color: '#f59e0b' },
    { label: 'Active Rate', value: '94%', icon: TrendingUp, color: '#8b5cf6' },
  ];

  const recentEvents = [
    {
      title: 'C Programming Workshop',
      category: 'Workshop',
      time: '14:00',
      attendees: 42,
      icon: Code,
      color: '#3b82f6',
    },
    {
      title: 'Career Day',
      category: 'Career',
      time: '09:00',
      attendees: 287,
      icon: Coffee,
      color: '#10b981',
    },
    {
      title: 'React Native Session',
      category: 'Coding',
      time: '16:00',
      attendees: 67,
      icon: BookOpen,
      color: '#f59e0b',
    },
  ];

  const handleNavigation = (route) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <StatusBar style="light" />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 30,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <View style={{
                width: 48,
                height: 48,
                backgroundColor: '#3b82f6',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
                <Shield color="#ffffff" size={24} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: 4,
                  letterSpacing: -0.5,
                }}>
                  1337 Admin
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6b7280',
                  fontWeight: '500',
                }}>
                  Event Management System
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View
            entering={FadeInUp.delay(400)}
            style={{
              paddingHorizontal: 24,
              marginBottom: 32,
            }}
          >
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {quickStats.map((stat, index) => (
                <Animated.View
                  key={stat.label}
                  entering={FadeInLeft.delay(600 + index * 100)}
                  style={{
                    width: (width - 60) / 2,
                    backgroundColor: '#111827',
                    borderWidth: 1,
                    borderColor: '#1f2937',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: `${stat.color}20`,
                    borderWidth: 1,
                    borderColor: stat.color,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <stat.icon color={stat.color} size={20} strokeWidth={2} />
                  </View>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: 4,
                    fontFamily: 'monospace',
                  }}>
                    {stat.value}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#6b7280',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    {stat.label}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Admin Actions */}
          <Animated.View
            entering={FadeInUp.delay(800)}
            style={{
              paddingHorizontal: 24,
              marginBottom: 32,
            }}
          >
            <Text style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Management
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              {adminActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInRight.delay(1000 + index * 100)}
                  style={{ width: (width - 60) / 2 }}
                >
                  <Pressable
                    onPress={() => handleNavigation(action.route)}
                    style={{
                      backgroundColor: '#111827',
                      borderWidth: 1,
                      borderColor: '#1f2937',
                      borderRadius: 20,
                      padding: 24,
                      minHeight: 140,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={action.gradient}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.05,
                      }}
                    />
                    
                    <View style={{
                      width: 52,
                      height: 52,
                      backgroundColor: `${action.color}20`,
                      borderWidth: 1,
                      borderColor: action.color,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}>
                      <action.icon color={action.color} size={26} strokeWidth={2} />
                    </View>
                    
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '800',
                      color: '#ffffff',
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}>
                      {action.title}
                    </Text>
                    
                    <Text style={{
                      fontSize: 13,
                      color: '#6b7280',
                      lineHeight: 18,
                    }}>
                      {action.description}
                    </Text>
                    
                    <View style={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                    }}>
                      <ChevronRight color={action.color} size={20} strokeWidth={2} />
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Recent Events */}
          <Animated.View
            entering={FadeInUp.delay(1200)}
            style={{
              paddingHorizontal: 24,
              marginBottom: 40,
            }}
          >
            <Text style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Recent Events
            </Text>
            
            {recentEvents.map((event, index) => (
              <Animated.View
                key={event.title}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={{
                  backgroundColor: '#111827',
                  borderWidth: 1,
                  borderColor: '#1f2937',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  backgroundColor: `${event.color}20`,
                  borderWidth: 1,
                  borderColor: event.color,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <event.icon color={event.color} size={20} strokeWidth={2} />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 4,
                  }}>
                    {event.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#6b7280',
                    fontWeight: '500',
                  }}>
                    {event.category} • {event.time} • {event.attendees} attendees
                  </Text>
                </View>
                
                <ChevronRight color="#6b7280" size={20} strokeWidth={2} />
              </Animated.View>
            ))}
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 