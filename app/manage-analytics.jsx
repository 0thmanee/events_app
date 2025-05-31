import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  FadeInUp,
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Target,
  Activity,
  Settings,
  Bell,
  Download,
  Filter,
  MoreVertical,
  Eye,
  Zap,
  Star,
  Award,
  Coins,
  ShoppingBag,
  Trophy,
  HeartHandshake,
  Gauge,
  PieChart,
  LineChart,
  BarChart,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Wifi
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Floating Background
const FloatingBackground = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: useSharedValue(Math.random() * screenWidth),
    y: useSharedValue(Math.random() * screenHeight),
    opacity: useSharedValue(Math.random() * 0.08 + 0.03),
    scale: useSharedValue(Math.random() * 0.8 + 0.4),
    rotation: useSharedValue(Math.random() * 360),
  }));

  useEffect(() => {
    particles.forEach((particle, index) => {
      particle.x.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenWidth, { duration: 20000 + index * 3000 }),
          withTiming(Math.random() * screenWidth, { duration: 20000 + index * 3000 })
        ),
        -1,
        true
      );
      
      particle.y.value = withRepeat(
        withSequence(
          withTiming(Math.random() * screenHeight, { duration: 25000 + index * 2000 }),
          withTiming(Math.random() * screenHeight, { duration: 25000 + index * 2000 })
        ),
        -1,
        true
      );

      particle.rotation.value = withRepeat(
        withTiming(particle.rotation.value + 360, { duration: 30000 + index * 5000 }),
        -1,
        false
      );
    });
  }, []);

  return (
    <View style={styles.floatingBackground}>
      {particles.map((particle) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: particle.x.value },
            { translateY: particle.y.value },
            { scale: particle.scale.value },
            { rotate: `${particle.rotation.value}deg` }
          ],
          opacity: particle.opacity.value,
        }));

        return (
          <Animated.View
            key={particle.id}
            style={[styles.particle, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

// Trend Indicator Component
const TrendIndicator = ({ value, isPositive }) => {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? '#10b981' : '#ef4444';
  
  return (
    <View style={[styles.trendIndicator, { backgroundColor: `${color}20`, borderColor: color }]}>
      <TrendIcon color={color} size={12} strokeWidth={2} />
      <Text style={[styles.trendText, { color }]}>{value}</Text>
    </View>
  );
};

// Simple Chart Component (Mock visualization)
const SimpleChart = ({ data, color, height = 60 }) => {
  const maxValue = Math.max(...data);
  
  return (
    <View style={[styles.chartContainer, { height }]}>
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * height * 0.8;
        return (
          <View key={index} style={styles.chartBarContainer}>
            <View 
              style={[
                styles.chartBar, 
                { 
                  height: barHeight, 
                  backgroundColor: color,
                  opacity: 0.7 + (value / maxValue) * 0.3
                }
              ]} 
            />
          </View>
        );
      })}
    </View>
  );
};

// Performance Ring Component
const PerformanceRing = ({ percentage, size = 80, strokeWidth = 8, color = '#3b82f6' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View style={[styles.performanceRing, { width: size, height: size }]}>
      <View style={styles.ringBackground}>
        <View 
          style={[
            styles.ringProgress,
            {
              width: size - strokeWidth,
              height: size - strokeWidth,
              borderRadius: (size - strokeWidth) / 2,
              borderWidth: strokeWidth,
              borderColor: `${color}20`,
            }
          ]}
        />
        <View 
          style={[
            styles.ringProgressActive,
            {
              width: size - strokeWidth,
              height: size - strokeWidth,
              borderRadius: (size - strokeWidth) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: 'transparent',
              borderRightColor: percentage > 25 ? color : 'transparent',
              borderBottomColor: percentage > 50 ? color : 'transparent',
              borderLeftColor: percentage > 75 ? color : 'transparent',
            }
          ]}
        />
      </View>
      <View style={styles.ringCenter}>
        <Text style={[styles.ringPercentage, { color }]}>{percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Floating background
  floatingBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#06b6d4',
    borderRadius: 3,
  },
  
  // Header Section
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    opacity: 0.1,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: '#06b6d4',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Overview Section
  overviewSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  overviewCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  overviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    flex: 1,
  },
  overviewCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  overviewCardTrend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewCardChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Performance Section
  performanceSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  performanceCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  performanceCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  performanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceMetrics: {
    flex: 1,
    marginRight: 20,
  },
  performanceMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  performanceRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringProgress: {
    position: 'absolute',
  },
  ringProgressActive: {
    position: 'absolute',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentage: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  
  // Charts Section
  chartsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  chartsGrid: {
    gap: 16,
  },
  chartCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  chartCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '80%',
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  
  // Activity Section
  activitySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.5)',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  activityList: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityItemLast: {
    marginBottom: 0,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activityValue: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#06b6d4',
    fontFamily: 'monospace',
  },
  
  // Trend Indicator
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 3,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function Analytics() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const masterOpacity = useSharedValue(0);
  const slideY = useSharedValue(30);
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animations
    masterOpacity.value = withTiming(1, { duration: 1000 });
    slideY.value = withTiming(0, { duration: 800 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    transform: [{ translateY: slideY.value }],
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Overview metrics
  const overviewMetrics = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      title: 'Active Events',
      value: '18',
      change: '+5',
      isPositive: true,
      icon: Calendar,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      title: 'Coins Earned',
      value: '47.2K',
      change: '+23%',
      isPositive: true,
      icon: Coins,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      title: 'Engagement',
      value: '89%',
      change: '+7%',
      isPositive: true,
      icon: Activity,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  // Performance metrics
  const performanceMetrics = [
    { label: 'System Uptime', value: '99.8%' },
    { label: 'Response Time', value: '156ms' },
    { label: 'Error Rate', value: '0.2%' },
    { label: 'User Satisfaction', value: '94%' },
  ];

  // Sample chart data
  const weeklyData = [65, 78, 82, 95, 88, 92, 87];
  const monthlyData = [42, 68, 75, 89, 95, 82, 78, 92, 87, 91, 85, 88];

  // Recent activity
  const recentActivity = [
    {
      icon: Users,
      text: 'New user registrations peak',
      time: '2 hours ago',
      value: '+47',
      color: '#3b82f6',
    },
    {
      icon: Calendar,
      text: 'Event "React Workshop" completed',
      time: '4 hours ago',
      value: '156',
      color: '#10b981',
    },
    {
      icon: Trophy,
      text: 'Leaderboard updated',
      time: '6 hours ago',
      value: '1.2K',
      color: '#f59e0b',
    },
    {
      icon: ShoppingBag,
      text: 'Shop purchases increased',
      time: '8 hours ago',
      value: '+28%',
      color: '#8b5cf6',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <FloatingBackground />
      
      <SafeAreaView style={styles.container}>
        <Animated.View style={[containerStyle, styles.container]}>
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.headerSection}>
              <LinearGradient
                colors={['rgba(6, 182, 212, 0.1)', 'transparent']}
                style={styles.headerBackground}
              />
              <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                  <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <ArrowLeft color="#06b6d4" size={20} strokeWidth={2} />
                  </Pressable>
                  
                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Analytics</Text>
                    <Text style={styles.headerSubtitle}>Platform insights and performance metrics</Text>
                  </View>
                  
                  <View style={styles.headerActions}>
                    <Pressable style={styles.headerActionButton}>
                      <Download color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                    <Pressable style={styles.headerActionButton}>
                      <Settings color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Overview Metrics */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.overviewSection}>
              <View style={styles.overviewGrid}>
                {overviewMetrics.map((metric, index) => (
                  <Animated.View
                    key={metric.title}
                    entering={FadeInUp.delay(600 + index * 100)}
                    style={styles.overviewCard}
                  >
                    <LinearGradient
                      colors={metric.gradient}
                      style={styles.overviewCardGradient}
                    />
                    <View style={styles.overviewCardHeader}>
                      <Text style={styles.overviewCardTitle}>{metric.title}</Text>
                      <View style={[styles.overviewCardIcon, { backgroundColor: `${metric.color}20`, borderWidth: 1, borderColor: metric.color }]}>
                        <metric.icon color={metric.color} size={16} strokeWidth={2} />
                      </View>
                    </View>
                    <Text style={styles.overviewCardValue}>{metric.value}</Text>
                    <View style={styles.overviewCardTrend}>
                      <TrendIndicator value={metric.change} isPositive={metric.isPositive} />
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Performance Overview */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.performanceSection}>
              <Text style={styles.sectionTitle}>System Performance</Text>
              <View style={styles.performanceCard}>
                <LinearGradient
                  colors={['#06b6d4', '#0891b2']}
                  style={styles.performanceCardGradient}
                />
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle}>Overall Health</Text>
                  <View style={[styles.overviewCardIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderWidth: 1, borderColor: '#06b6d4' }]}>
                    <Gauge color="#06b6d4" size={16} strokeWidth={2} />
                  </View>
                </View>
                <View style={styles.performanceContent}>
                  <View style={styles.performanceMetrics}>
                    {performanceMetrics.map((metric, index) => (
                      <View key={metric.label} style={styles.performanceMetric}>
                        <Text style={styles.metricLabel}>{metric.label}</Text>
                        <Text style={styles.metricValue}>{metric.value}</Text>
                      </View>
                    ))}
                  </View>
                  <PerformanceRing percentage={94} color="#06b6d4" />
                </View>
              </View>
            </Animated.View>

            {/* Charts Section */}
            <Animated.View entering={FadeInUp.delay(1000)} style={styles.chartsSection}>
              <Text style={styles.sectionTitle}>Usage Analytics</Text>
              <View style={styles.chartsGrid}>
                <View style={styles.chartCard}>
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    style={styles.chartCardGradient}
                  />
                  <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Weekly Activity</Text>
                    <View style={[styles.overviewCardIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1, borderColor: '#3b82f6' }]}>
                      <BarChart color="#3b82f6" size={14} strokeWidth={2} />
                    </View>
                  </View>
                  <SimpleChart data={weeklyData} color="#3b82f6" height={80} />
                  <View style={styles.chartLabels}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <Text key={day} style={styles.chartLabel}>{day}</Text>
                    ))}
                  </View>
                </View>

                <View style={styles.chartCard}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.chartCardGradient}
                  />
                  <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Monthly Growth</Text>
                    <View style={[styles.overviewCardIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1, borderColor: '#10b981' }]}>
                      <LineChart color="#10b981" size={14} strokeWidth={2} />
                    </View>
                  </View>
                  <SimpleChart data={monthlyData} color="#10b981" height={80} />
                  <View style={styles.chartLabels}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                      <Text key={month} style={styles.chartLabel}>{month}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Recent Activity */}
            <Animated.View entering={FadeInUp.delay(1200)} style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>Platform Events</Text>
                  <View style={[styles.overviewCardIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderWidth: 1, borderColor: '#06b6d4' }]}>
                    <Activity color="#06b6d4" size={14} strokeWidth={2} />
                  </View>
                </View>
                <View style={styles.activityList}>
                  {recentActivity.map((activity, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInLeft.delay(1400 + index * 100)}
                      style={[styles.activityItem, index === recentActivity.length - 1 && styles.activityItemLast]}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20`, borderWidth: 1, borderColor: activity.color }]}>
                        <activity.icon color={activity.color} size={18} strokeWidth={2} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>{activity.text}</Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <View style={styles.activityValue}>
                        <Text style={styles.activityAmount}>{activity.value}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 