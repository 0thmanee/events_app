import { View, Text, ScrollView, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { useState, useEffect, useMemo } from 'react';
import Svg, { Circle, Path, Text as SvgText, Line, Rect } from 'react-native-svg';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  Zap
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 200;

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(end, { duration }, (finished) => {
      if (finished) {
        runOnJS(setDisplayValue)(end);
      }
    });
  }, [end]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = animatedValue.value;
      setDisplayValue(Math.floor(current));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={styles.statValue}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </Text>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 80, strokeWidth = 8, color = '#6366f1' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withDelay(300, withTiming(progress, { duration: 1500 }));
  }, [progress]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke="#374151"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.progressCenter, { width: size, height: size }]}>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

// Line Chart Component
const LineChart = ({ data, color = '#6366f1', showGrid = true }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index * chartWidth) / (data.length - 1);
    const y = chartHeight - ((value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').join(' L ')}`;

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={`h-${index}`}
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#374151"
                strokeWidth={0.5}
                opacity={0.3}
              />
            ))}
            {data.map((_, index) => (
              <Line
                key={`v-${index}`}
                x1={(index * chartWidth) / (data.length - 1)}
                y1={0}
                x2={(index * chartWidth) / (data.length - 1)}
                y2={chartHeight}
                stroke="#374151"
                strokeWidth={0.5}
                opacity={0.3}
              />
            ))}
          </>
        )}
        
        {/* Area under curve */}
        <Path
          d={`${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
          fill={color}
          opacity={0.1}
        />
        
        {/* Main line */}
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={3}
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index * chartWidth) / (data.length - 1);
          const y = chartHeight - ((value - minValue) / range) * chartHeight;
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r={4}
              fill={color}
              stroke="#ffffff"
              strokeWidth={2}
            />
          );
        })}
      </Svg>
    </View>
  );
};

// Bar Chart Component
const BarChart = ({ data, colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (chartWidth - (data.length + 1) * 10) / data.length;

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight * 0.8;
          const x = 10 + index * (barWidth + 10);
          const y = chartHeight - barHeight - 20;
          
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={colors[index % colors.length]}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 5}
                fontSize={12}
                fill="#9ca3af"
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                fontSize={12}
                fill="#ffffff"
                textAnchor="middle"
                fontWeight="bold"
              >
                {item.value}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, change, trend, color = '#6366f1', delay = 0 }) => {
  const scaleAnim = useSharedValue(0);

  useEffect(() => {
    scaleAnim.value = withDelay(delay, withTiming(1, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: scaleAnim.value,
  }));

  return (
    <Animated.View style={[styles.metricCard, animatedStyle]}>
      <LinearGradient
        colors={[`${color}20`, 'transparent']}
        style={styles.metricGradient}
      />
      
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={20} strokeWidth={1.5} />
        </View>
        {trend && (
          <View style={[styles.trendIndicator, { backgroundColor: trend > 0 ? '#10b98120' : '#ef444420' }]}>
            <TrendingUp 
              color={trend > 0 ? '#10b981' : '#ef4444'} 
              size={14} 
              strokeWidth={1.5}
              style={{ transform: [{ rotate: trend > 0 ? '0deg' : '180deg' }] }}
            />
          </View>
        )}
      </View>

      <Text style={styles.metricTitle}>{title}</Text>
      <AnimatedCounter end={parseInt(value)} />
      
      {change && (
        <Text style={[
          styles.metricChange, 
          { color: trend > 0 ? '#10b981' : '#ef4444' }
        ]}>
          {trend > 0 ? '+' : ''}{change}% vs last month
        </Text>
      )}
    </Animated.View>
  );
};

// Category Performance Component
const CategoryPerformance = ({ categories }) => {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Category Performance</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <Animated.View 
            key={category.name}
            entering={FadeInUp.delay(index * 100)}
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryScore}>{category.score}/5</Text>
            </View>
            
            <ProgressRing 
              progress={(category.score / 5) * 100}
              size={60}
              strokeWidth={6}
              color={category.color}
            />
            
            <View style={styles.categoryStats}>
              <Text style={styles.categoryStatLabel}>Events</Text>
              <Text style={styles.categoryStatValue}>{category.events}</Text>
            </View>
            
            <View style={styles.categoryStats}>
              <Text style={styles.categoryStatLabel}>Attendance</Text>
              <Text style={styles.categoryStatValue}>{category.attendance}%</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

// Main Analytics Dashboard Component
export default function AnalyticsDashboard({ data, timeRange = '30d' }) {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  // Sample data structure (replace with real data)
  const mockData = useMemo(() => ({
    metrics: {
      totalEvents: data?.totalEvents || 47,
      totalAttendees: data?.totalAttendees || 1234,
      avgRating: data?.avgRating || 4.6,
      completionRate: data?.completionRate || 89,
    },
    trends: {
      eventsGrowth: 12,
      attendeesGrowth: 23,
      ratingGrowth: 5,
      completionGrowth: -3,
    },
    eventsByDay: data?.eventsByDay || [5, 8, 12, 15, 11, 18, 22, 19, 25, 28, 24, 30, 35, 32, 38],
    categoriesData: data?.categories || [
      { name: 'Workshops', value: 15, events: 15, attendance: 92, score: 4.7, color: '#6366f1' },
      { name: 'Talks', value: 12, events: 12, attendance: 85, score: 4.4, color: '#8b5cf6' },
      { name: 'Coding', value: 10, events: 10, attendance: 78, score: 4.2, color: '#06b6d4' },
      { name: 'Social', value: 8, events: 8, attendance: 95, score: 4.8, color: '#10b981' },
      { name: 'Other', value: 2, events: 2, attendance: 72, score: 4.0, color: '#f59e0b' },
    ],
    topPerformers: data?.topPerformers || [
      { name: 'React Workshop', attendees: 45, rating: 4.9 },
      { name: 'AI/ML Talk', attendees: 38, rating: 4.8 },
    ]
  }), [data]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overview Metrics */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon={Calendar}
            title="Total Events"
            value={mockData.metrics.totalEvents}
            change={mockData.trends.eventsGrowth}
            trend={mockData.trends.eventsGrowth}
            color="#6366f1"
            delay={0}
          />
          <MetricCard
            icon={Users}
            title="Total Attendees"
            value={mockData.metrics.totalAttendees}
            change={mockData.trends.attendeesGrowth}
            trend={mockData.trends.attendeesGrowth}
            color="#10b981"
            delay={100}
          />
          <MetricCard
            icon={Star}
            title="Avg Rating"
            value={mockData.metrics.avgRating.toFixed(1)}
            change={mockData.trends.ratingGrowth}
            trend={mockData.trends.ratingGrowth}
            color="#f59e0b"
            delay={200}
          />
          <MetricCard
            icon={Target}
            title="Completion Rate"
            value={mockData.metrics.completionRate}
            change={mockData.trends.completionGrowth}
            trend={mockData.trends.completionGrowth}
            color="#8b5cf6"
            delay={300}
          />
        </View>
      </Animated.View>

      {/* Events Trend Chart */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Events Trend (Last {timeRange})</Text>
        <View style={styles.chartCard}>
          <LineChart 
            data={mockData.eventsByDay}
            color="#6366f1"
            showGrid={true}
          />
        </View>
      </Animated.View>

      {/* Category Distribution */}
      <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
        <Text style={styles.sectionTitle}>Category Distribution</Text>
        <View style={styles.chartCard}>
          <BarChart 
            data={mockData.categoriesData}
            colors={['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']}
          />
        </View>
      </Animated.View>

      {/* Category Performance */}
      <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
        <CategoryPerformance categories={mockData.categoriesData} />
      </Animated.View>

      {/* Top Performing Events */}
      <Animated.View entering={FadeInUp.delay(700)} style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Events</Text>
        <View style={styles.topPerformersContainer}>
          {mockData.topPerformers.map((event, index) => (
            <Animated.View 
              key={event.name}
              entering={FadeInUp.delay(700 + index * 100)}
              style={styles.performerCard}
            >
              <View style={styles.performerRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>{event.name}</Text>
                <View style={styles.performerStats}>
                  <View style={styles.performerStat}>
                    <Users color="#9ca3af" size={14} strokeWidth={1.5} />
                    <Text style={styles.performerStatText}>{event.attendees}</Text>
                  </View>
                  <View style={styles.performerStat}>
                    <Star color="#f59e0b" size={14} strokeWidth={1.5} />
                    <Text style={styles.performerStatText}>{event.rating}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.performerTrend}>
                <TrendingUp color="#10b981" size={16} strokeWidth={1.5} />
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Engagement Insights */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
        <Text style={styles.sectionTitle}>Engagement Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <Activity color="#6366f1" size={24} strokeWidth={1.5} />
            <Text style={styles.insightTitle}>Peak Hours</Text>
            <Text style={styles.insightValue}>2PM - 6PM</Text>
            <Text style={styles.insightDescription}>
              Most events scheduled during afternoon hours
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Award color="#10b981" size={24} strokeWidth={1.5} />
            <Text style={styles.insightTitle}>Best Day</Text>
            <Text style={styles.insightValue}>Wednesday</Text>
            <Text style={styles.insightDescription}>
              Highest attendance rates on mid-week
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Zap color="#f59e0b" size={24} strokeWidth={1.5} />
            <Text style={styles.insightTitle}>Hot Topic</Text>
            <Text style={styles.insightValue}>AI/ML</Text>
            <Text style={styles.insightDescription}>
              Most requested event category
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: (screenWidth - 50) / 2,
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  metricGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    borderRadius: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  categoryContainer: {
    paddingLeft: 20,
  },
  categoryCard: {
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    width: 140,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  categoryScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  categoryStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoryStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  topPerformersContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 16,
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  performerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  performerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  performerStatText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  performerTrend: {
    marginLeft: 16,
  },
  insightsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
}); 