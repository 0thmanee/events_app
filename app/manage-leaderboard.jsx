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
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Coins,
  Calendar,
  Target,
  Zap,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Settings,
  Bell,
  Download,
  Share,
  Edit,
  Plus,
  CheckCircle,
  AlertTriangle
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

// Ranking Badge Component
const RankingBadge = ({ rank }) => {
  const getRankConfig = (rank) => {
    if (rank === 1) {
      return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Crown, glow: true };
    } else if (rank === 2) {
      return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Medal, glow: true };
    } else if (rank === 3) {
      return { color: '#cd7f32', gradient: ['#cd7f32', '#a0522d'], icon: Award, glow: true };
    } else if (rank <= 10) {
      return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], icon: Star, glow: false };
    } else {
      return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Target, glow: false };
    }
  };

  const config = getRankConfig(rank);
  const RankIcon = config.icon;

  return (
    <View style={[styles.rankBadge, { 
      backgroundColor: `${config.color}20`, 
      borderColor: config.color,
      shadowColor: config.glow ? config.color : 'transparent',
      shadowOpacity: config.glow ? 0.6 : 0,
      shadowRadius: config.glow ? 8 : 0,
      elevation: config.glow ? 6 : 0,
    }]}>
      <RankIcon color={config.color} size={16} strokeWidth={2} />
      <Text style={[styles.rankBadgeText, { color: config.color }]}>#{rank}</Text>
    </View>
  );
};

// Achievement Badge
const AchievementBadge = ({ achievement }) => {
  const getAchievementConfig = (achievement) => {
    switch (achievement.toLowerCase()) {
      case 'coding master':
        return { color: '#3b82f6', icon: Code };
      case 'event champion':
        return { color: '#10b981', icon: Trophy };
      case 'community hero':
        return { color: '#8b5cf6', icon: Users };
      case 'streak legend':
        return { color: '#f59e0b', icon: Flame };
      default:
        return { color: '#6b7280', icon: Star };
    }
  };

  const config = getAchievementConfig(achievement);
  const AchIcon = config.icon;

  return (
    <View style={[styles.achievementBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <AchIcon color={config.color} size={10} strokeWidth={2} />
      <Text style={[styles.achievementBadgeText, { color: config.color }]}>{achievement}</Text>
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
    backgroundColor: '#8b5cf6',
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
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
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
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Top Students Section
  topStudentsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    height: 160,
  },
  podiumPlace: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  podiumBase: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  podiumGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  firstPlace: {
    height: 120,
  },
  secondPlace: {
    height: 100,
  },
  thirdPlace: {
    height: 80,
  },
  podiumStudent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#374151',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
  },
  studentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  studentScore: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  podiumRank: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  
  // Filter Section
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  
  // Leaderboard Section
  leaderboardSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginRight: 4,
  },
  
  // Student Cards
  studentCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  studentCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  studentCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentRankContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8b5cf6',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  studentInfo: {
    flex: 1,
  },
  studentNameMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  studentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  studentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  studentMetaText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '600',
  },
  studentStats: {
    alignItems: 'flex-end',
  },
  studentScore: {
    fontSize: 20,
    fontWeight: '900',
    color: '#8b5cf6',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  studentChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  changePositive: {
    color: '#10b981',
  },
  changeNegative: {
    color: '#ef4444',
  },
  changeNeutral: {
    color: '#6b7280',
  },
  
  // Badge Styles
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 3,
  },
  achievementBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function Leaderboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filterText, setFilterText] = useState('');
  
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

  // Stats data
  const stats = [
    {
      icon: Users,
      value: '1,247',
      label: 'Students',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      icon: Trophy,
      value: '89',
      label: 'Champions',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      icon: Target,
      value: '94%',
      label: 'Active Rate',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      icon: Activity,
      value: '15K',
      label: 'Actions',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  // Top 3 students
  const topStudents = [
    {
      rank: 2,
      name: 'Fatima Z.',
      score: 2847,
      change: +12,
      achievements: ['Event Champion'],
      color: '#6b7280',
    },
    {
      rank: 1,
      name: 'Ahmed B.',
      score: 3254,
      change: +25,
      achievements: ['Coding Master', 'Streak Legend'],
      color: '#f59e0b',
    },
    {
      rank: 3,
      name: 'Omar M.',
      score: 2631,
      change: -3,
      achievements: ['Community Hero'],
      color: '#cd7f32',
    },
  ];

  // Sample leaderboard data
  const students = [
    {
      rank: 4,
      name: 'Yasmine Alami',
      studentId: '#3456',
      score: 2543,
      change: +8,
      achievements: ['Event Champion'],
      level: 12,
      streak: 45,
    },
    {
      rank: 5,
      name: 'Youssef Talib',
      studentId: '#7890',
      score: 2398,
      change: +15,
      achievements: ['Coding Master'],
      level: 11,
      streak: 23,
    },
    {
      rank: 6,
      name: 'Salma Benali',
      studentId: '#2468',
      score: 2187,
      change: -2,
      achievements: ['Community Hero'],
      level: 10,
      streak: 67,
    },
    {
      rank: 7,
      name: 'Khalid Amrani',
      studentId: '#1357',
      score: 2056,
      change: +5,
      achievements: ['Streak Legend'],
      level: 9,
      streak: 89,
    },
    {
      rank: 8,
      name: 'Nadia Filali',
      studentId: '#9753',
      score: 1923,
      change: 0,
      achievements: [],
      level: 8,
      streak: 12,
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
                colors={['rgba(139, 92, 246, 0.1)', 'transparent']}
                style={styles.headerBackground}
              />
              <View style={styles.headerContent}>
                <View style={styles.headerTop}>
                  <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <ArrowLeft color="#8b5cf6" size={20} strokeWidth={2} />
                  </Pressable>
                  
                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Leaderboard</Text>
                    <Text style={styles.headerSubtitle}>Student rankings and achievements</Text>
                  </View>
                  
                  <View style={styles.headerActions}>
                    <Pressable style={styles.headerActionButton}>
                      <Bell color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                    <Pressable style={styles.headerActionButton}>
                      <Settings color="#9ca3af" size={18} strokeWidth={2} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Stats Overview */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.statsSection}>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <Animated.View
                    key={stat.label}
                    entering={FadeInUp.delay(600 + index * 100)}
                    style={styles.statCard}
                  >
                    <LinearGradient
                      colors={stat.gradient}
                      style={styles.statCardGradient}
                    />
                    <View style={[styles.statIcon, { backgroundColor: `${stat.color}20`, borderWidth: 1, borderColor: stat.color }]}>
                      <stat.icon color={stat.color} size={18} strokeWidth={2} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Top 3 Podium */}
            <Animated.View entering={FadeInUp.delay(800)} style={styles.topStudentsSection}>
              <Text style={styles.sectionTitle}>Champions</Text>
              <View style={styles.podiumContainer}>
                {[topStudents[0], topStudents[1], topStudents[2]].map((student, index) => (
                  <Animated.View
                    key={student.rank}
                    entering={FadeInUp.delay(1000 + index * 200)}
                    style={styles.podiumPlace}
                  >
                    <View style={styles.podiumStudent}>
                      <View style={[styles.studentAvatar, { borderColor: student.color }]}>
                        <User color={student.color} size={20} strokeWidth={2} />
                      </View>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={[styles.studentScore, { color: student.color }]}>{student.score}</Text>
                    </View>
                    <View style={[
                      styles.podiumBase,
                      student.rank === 1 ? styles.firstPlace : 
                      student.rank === 2 ? styles.secondPlace : styles.thirdPlace,
                      { borderColor: student.color, borderWidth: 2 }
                    ]}>
                      <LinearGradient
                        colors={[student.color, `${student.color}80`]}
                        style={styles.podiumGradient}
                      />
                      <Text style={styles.podiumRank}>#{student.rank}</Text>
                      {student.achievements.map((achievement, idx) => (
                        <AchievementBadge key={idx} achievement={achievement} />
                      ))}
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Search & Filter */}
            <Animated.View entering={FadeInUp.delay(1200)} style={styles.filterSection}>
              <View style={styles.filterContainer}>
                <Search color="#6b7280" size={18} strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search students..."
                  placeholderTextColor="#6b7280"
                  value={filterText}
                  onChangeText={setFilterText}
                />
                <Pressable style={styles.filterButton}>
                  <Filter color="#8b5cf6" size={16} strokeWidth={2} />
                </Pressable>
              </View>
            </Animated.View>

            {/* Full Leaderboard */}
            <Animated.View entering={FadeInUp.delay(1400)} style={styles.leaderboardSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Full Rankings</Text>
                <Pressable style={styles.sortButton}>
                  <Text style={styles.sortButtonText}>Sort by</Text>
                  <MoreVertical color="#9ca3af" size={14} strokeWidth={2} />
                </Pressable>
              </View>
              
              {students.map((student, index) => (
                <Animated.View
                  key={student.rank}
                  entering={FadeInLeft.delay(1600 + index * 100)}
                  style={styles.studentCard}
                >
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed']}
                    style={styles.studentCardGradient}
                  />
                  
                  <View style={styles.studentCardContent}>
                    <View style={styles.studentRankContainer}>
                      <Text style={styles.rankNumber}>#{student.rank}</Text>
                      <RankingBadge rank={student.rank} />
                    </View>
                    
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentNameMain}>{student.name}</Text>
                      <Text style={styles.studentId}>{student.studentId}</Text>
                      <View style={styles.studentMeta}>
                        <View style={styles.studentMetaItem}>
                          <Target color="#6b7280" size={9} strokeWidth={2} />
                          <Text style={styles.studentMetaText}>Level {student.level}</Text>
                        </View>
                        <View style={styles.studentMetaItem}>
                          <Flame color="#6b7280" size={9} strokeWidth={2} />
                          <Text style={styles.studentMetaText}>{student.streak} day streak</Text>
                        </View>
                        {student.achievements.map((achievement, idx) => (
                          <AchievementBadge key={idx} achievement={achievement} />
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.studentStats}>
                      <Text style={styles.studentScore}>{student.score}</Text>
                      <View style={styles.studentChange}>
                        {student.change > 0 ? (
                          <ChevronUp color="#10b981" size={12} strokeWidth={2} />
                        ) : student.change < 0 ? (
                          <ChevronDown color="#ef4444" size={12} strokeWidth={2} />
                        ) : (
                          <Minus color="#6b7280" size={12} strokeWidth={2} />
                        )}
                        <Text style={[
                          styles.changeText,
                          student.change > 0 ? styles.changePositive : 
                          student.change < 0 ? styles.changeNegative : styles.changeNeutral
                        ]}>
                          {student.change > 0 ? '+' : ''}{student.change}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
} 