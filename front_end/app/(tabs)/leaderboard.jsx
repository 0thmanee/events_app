import { View, Text, ScrollView, Pressable, Dimensions, StatusBar, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  Target,
  TrendingUp,
  ChevronRight,
  Award,
  Zap,
  Users,
  Calendar,
  Coins,
  BookOpen,
  Code,
  Coffee,
  Heart,
  Shield,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Filter,
  Search,
  Settings,
  Bell,
  MoreHorizontal,
  TrendingDown
} from 'lucide-react-native';
import ApiService from '../../services/ApiService';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../../components/LoadingComponents';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Leaderboard</Text>
          <Text style={styles.headerTitle}>Compete with your peers and climb the ranks</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/notifications')}>
            <Bell color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push('/settings')}>
            <Settings color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Animated Crown Component for Top Performers
const AnimatedCrown = ({ size = 24, delay = 0 }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 1000 }),
          withTiming(5, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Crown color="#f59e0b" size={size} strokeWidth={2} />
    </Animated.View>
  );
};

// Top 3 Podium Component
const PodiumCard = ({ student, position, onPress }) => {
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 800 });
      cardTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    }, position * 200);

    return () => clearTimeout(timer);
  }, [position]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const getPodiumColor = (pos) => {
    switch (pos) {
      case 1: return { gradient: ['#f59e0b', '#d97706'], icon: Crown, bg: '#f59e0b' };
      case 2: return { gradient: ['#6b7280', '#4b5563'], icon: Medal, bg: '#6b7280' };
      case 3: return { gradient: ['#92400e', '#78350f'], icon: Award, bg: '#92400e' };
      default: return { gradient: ['#3b82f6', '#1d4ed8'], icon: Trophy, bg: '#3b82f6' };
    }
  };

  const podiumMeta = getPodiumColor(position);
  const PodiumIcon = podiumMeta.icon;

  const podiumHeight = position === 1 ? 120 : position === 2 ? 100 : 80;

  return (
    <Animated.View style={[styles.podiumCard, cardStyle]}>
      <Pressable style={styles.podiumPressable} onPress={() => onPress(student)}>
        {/* Student Avatar */}
        <View style={[styles.podiumAvatar, { backgroundColor: `${podiumMeta.bg}20`, borderColor: podiumMeta.bg }]}>
          <Text style={[styles.podiumAvatarText, { color: podiumMeta.bg }]}>
            {student.name.charAt(0)}
          </Text>
        </View>

        {/* Position Badge */}
        <View style={[styles.positionBadge, { backgroundColor: podiumMeta.bg }]}>
          {position === 1 ? (
            <Crown color="#ffffff" size={16} strokeWidth={2} />
          ) : (
            <PodiumIcon color="#ffffff" size={16} strokeWidth={2} />
          )}
          <Text style={styles.positionText}>{position}</Text>
        </View>

        {/* Student Info */}
        <Text style={styles.podiumName} numberOfLines={1}>{student.name}</Text>
        <Text style={styles.podiumLogin}>@{student.login}</Text>

        {/* Stats */}
        <View style={styles.podiumStats}>
          <View style={styles.podiumStat}>
            <Star color="#f59e0b" size={12} strokeWidth={2} />
            <Text style={styles.podiumStatText}>{student.xp.toLocaleString()}</Text>
          </View>
          <View style={styles.podiumStat}>
            <Trophy color="#8b5cf6" size={12} strokeWidth={2} />
            <Text style={styles.podiumStatText}>Lv.{student.level}</Text>
          </View>
        </View>

        {/* Podium Base */}
        <LinearGradient
          colors={podiumMeta.gradient}
          style={[styles.podiumBase, { height: podiumHeight }]}
        >
          <Text style={styles.podiumPosition}>{position}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

// Leaderboard Row Component
const LeaderboardRow = ({ student, index, onPress }) => {
  const rowOpacity = useSharedValue(0);
  const rowTranslateX = useSharedValue(30);

  useEffect(() => {
    const timer = setTimeout(() => {
      rowOpacity.value = withTiming(1, { duration: 600 });
      rowTranslateX.value = withTiming(0, { duration: 800 });
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
    transform: [{ translateX: rowTranslateX.value }],
  }));

  const getRankIcon = (rank) => {
    if (rank <= 10) return { icon: Trophy, color: '#f59e0b' };
    if (rank <= 25) return { icon: Medal, color: '#6b7280' };
    if (rank <= 50) return { icon: Award, color: '#92400e' };
    return { icon: Target, color: '#6b7280' };
  };

  const getRankChange = (change) => {
    if (change > 0) return { icon: ArrowUp, color: '#10b981', text: `+${change}` };
    if (change < 0) return { icon: ArrowDown, color: '#ef4444', text: change.toString() };
    return { icon: Minus, color: '#6b7280', text: '0' };
  };

  const rankMeta = getRankIcon(student.rank);
  const changeMeta = getRankChange(student.rankChange);
  const RankIcon = rankMeta.icon;
  const ChangeIcon = changeMeta.icon;

  return (
    <Animated.View style={[styles.leaderboardRow, rowStyle]}>
      <Pressable style={styles.leaderboardRowPressable} onPress={() => onPress(student)}>
        {/* Rank */}
        <View style={styles.rankSection}>
          <Text style={styles.rankNumber}>{student.rank}</Text>
          <View style={[styles.rankIcon, { backgroundColor: `${rankMeta.color}20` }]}>
            <RankIcon color={rankMeta.color} size={9} strokeWidth={2} />
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.studentInfo}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>{student.name.charAt(0)}</Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentLogin}>@{student.login}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.studentStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{student.xp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Lv.{student.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Rank Change */}
        <View style={[styles.rankChange, { backgroundColor: `${changeMeta.color}15` }]}>
          <ChangeIcon color={changeMeta.color} size={12} strokeWidth={2} />
          <Text style={[styles.rankChangeText, { color: changeMeta.color }]}>
            {changeMeta.text}
          </Text>
        </View>

        <ChevronRight color="#6b7280" size={16} strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category, index) => (
        <Animated.View
          key={category.id}
          entering={FadeInDown.delay(index * 100)}
        >
          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => onSelect(category.id)}
          >
            <View style={styles.categoryIconContainer}>
              <View style={[styles.categoryIconBackdrop, { backgroundColor: category.color + '10' }]} />
              <category.icon 
                color={selectedCategory === category.id ? '#ffffff' : category.color} 
                size={16} 
                strokeWidth={2} 
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

// Current User Stats Component
const UserStatsCard = ({ userStats }) => {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  return (
    <Animated.View style={[styles.userStatsCard, cardStyle]}>
      <View style={styles.userStatsCardContainer}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={['rgba(245, 158, 11, 0.1)', 'transparent', 'rgba(0, 0, 0, 0.1)']}
          style={styles.statsGradientOverlay}
          locations={[0, 0.5, 1]}
        />
        
        <View style={styles.statsHeader}>
          <View style={styles.userProfile}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{userStats.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userStats.name}</Text>
              <Text style={styles.userLevel}>Level {userStats.level} • {userStats.program}</Text>
            </View>
          </View>
          <View style={styles.userRankBadge}>
            <Text style={styles.userRankText}>#{userStats.rank}</Text>
            <ChevronRight color="#f59e0b" size={14} strokeWidth={1.5} />
          </View>
        </View>

        <View style={styles.statsMetrics}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.xp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>

          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.monthlyXp}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to Level {userStats.level + 1}</Text>
            <Text style={styles.progressPercent}>{userStats.progressPercent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${userStats.progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubtext}>
            {userStats.xpToNext} XP needed for next level
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Main Leaderboard Component
export default function StudentLeaderboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userRanking, setUserRanking] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadLeaderboardData();
  }, [selectedCategory]);

  const loadLeaderboardData = async () => {
    try {
      setError(null);
      
      // Prepare filters based on selected category
      const filters = {};
      if (selectedCategory === 'monthly') {
        filters.period = 'month';
      } else if (selectedCategory === 'weekly') {
        filters.period = 'week';  
      } else if (selectedCategory === 'daily') {
        filters.period = 'day';
      }
      // 'all' doesn't need filters (all-time leaderboard)
      
      console.log('Loading leaderboard with filters:', filters);
      
      const [leaderboard, ranking, profile, stats, achievements] = await Promise.all([
        ApiService.getLeaderboard(filters),
        ApiService.getUserRanking(selectedCategory !== 'all' ? { period: filters.period } : {}),
        ApiService.getUserProfile(),
        ApiService.getUserStats(),
        ApiService.getUserAchievements().catch(() => []) // Optional, might not exist
      ]);

      console.log('Leaderboard Data:', leaderboard.length, 'users');
      console.log('User Ranking:', ranking);
      console.log('User Profile:', profile.nickname, 'Level:', profile.level);

      // Transform leaderboard data
      const transformedData = ApiService.transformLeaderboardData(leaderboard);
      
      // Mark current user in leaderboard
      const currentUserId = profile._id || profile.id;
      transformedData.forEach(user => {
        if (user.id === currentUserId) {
          user.isCurrentUser = true;
        }
      });

      console.log('Transformed Data:', transformedData.length, 'users');

      setLeaderboardData(transformedData);
      setUserRanking(ranking);
      
      // Calculate level progress using the same method as dashboard
      const levelProgress = ApiService.calculateLevelProgress(profile.level, stats);
      
      // Calculate monthly XP estimate (events attended this month * average XP)
      const monthlyEventsEstimate = Math.round((stats.eventsAttended || 0) * 0.3); // 30% of total events this month
      const monthlyXpEstimate = monthlyEventsEstimate * 15; // Average 15 XP per event
      
      // Calculate activity streak (simplified - could be enhanced with real data)
      const streak = Math.min(Math.max(Math.floor((stats.eventsAttended || 0) / 2), 1), 30);
      
      console.log('Level Progress:', levelProgress);
      console.log('User Stats:', stats);
      
      // Set user stats with real calculated data
      setUserStats({
        name: profile.nickname || 'Student',
        level: profile.level || 1,
        program: ApiService.getProgramFromEmail(profile.email || ''),
        rank: (ranking && ranking.userRank) || 999,
        xp: profile.wallet || 0,
        streak: streak,
        monthlyXp: monthlyXpEstimate,
        progressPercent: levelProgress.percentage || 0,
        xpToNext: levelProgress.creditsNeeded || 0,
        eventsAttended: stats.eventsAttended || 0,
        feedbacksGiven: stats.feedbacksGiven || 0,
        achievements: achievements.length || 0
      });
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
      setError(err.message || 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboardData();
    setRefreshing(false);
  };

  // Show loading state
  if (loading && !userStats) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Leaderboard"
          subMessage="Fetching rankings and achievements"
          icon={Trophy}
        />
      </View>
    );
  }

  // Show error state
  if (error && !userStats) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={Trophy}
          message="Unable to Load Leaderboard"
          subMessage={error}
        />
      </View>
    );
  }

  const categories = [
    { id: 'all', name: 'All Time', icon: Trophy, color: '#f59e0b' },
    { id: 'monthly', name: 'This Month', icon: Calendar, color: '#3b82f6' },
    { id: 'weekly', name: 'This Week', icon: Zap, color: '#10b981' },
    { id: 'daily', name: 'Today', icon: Target, color: '#ec4899' },
  ];

  // Get top 3 from leaderboard
  const topThree = leaderboardData.slice(0, 3);
  
  // Get remaining users (4th place and below)
  const remainingUsers = leaderboardData.slice(3);

  const handleStudentPress = (student) => {
    console.log('Student pressed:', student.name);
    // router.push(`/profile/${student.id}`);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#9ca3af"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Stats */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.userStatsSection}>
            <UserStatsCard userStats={userStats} />
          </Animated.View>

          {/* Categories */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </Animated.View>

          {/* Top 3 Podium */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.podiumSection}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <View style={styles.podiumContainer}>
              {topThree.map((student, index) => (
                <PodiumCard
                  key={student.id}
                  student={student}
                  position={student.rank}
                  onPress={handleStudentPress}
                />
              ))}
            </View>
          </Animated.View>

          {/* Full Leaderboard */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.leaderboardSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Full Rankings</Text>
                <Text style={styles.sectionSubtitle}>{leaderboardData.length} students</Text>
              </View>
            </View>

            <View style={styles.leaderboardContainer}>
              {remainingUsers.map((student, index) => (
                <LeaderboardRow
                  key={student.id}
                  student={student}
                  index={index}
                  onPress={handleStudentPress}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },

  // Student Header
  studentHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2332',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  headerGreeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    lineHeight: 20,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // User Stats Section
  userStatsSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 32,
  },
  userStatsCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  userStatsCardContainer: {
    padding: 24,
  },
  statsGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0f1419',
    borderWidth: 2,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f59e0b',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  userRankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  userRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
  statsMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 14,
  },
  statLabel: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 10,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0f1419',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Categories
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    minWidth: 120,
  },
  categoryButtonActive: {
    backgroundColor: '#1a2332',
    borderColor: '#334155',
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    opacity: 0.6,
  },
  categoryText: {
    fontSize: 13,
    color: '#d1d5db',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },

  // Podium
  podiumSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  podiumCard: {
    width: (screenWidth - 60) / 3,
    alignItems: 'center',
  },
  podiumPressable: {
    alignItems: 'center',
    width: '100%',
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  podiumAvatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  positionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    marginBottom: 8,
  },
  positionText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumLogin: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  podiumStats: {
    gap: 4,
    marginBottom: 16,
  },
  podiumStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  podiumStatText: {
    fontSize: 10,
    color: '#d1d5db',
    fontWeight: '600',
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumPosition: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },

  // Leaderboard
  leaderboardSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  leaderboardContainer: {
    gap: 6,
  },
  leaderboardRow: {
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  leaderboardRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    minHeight: 64,
  },
  rankSection: {
    alignItems: 'center',
    width: 32,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginBottom: 1,
  },
  rankIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  studentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 1,
  },
  studentLogin: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  studentStats: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rankChange: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
    gap: 1,
    minWidth: 24,
  },
  rankChangeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: 40,
  },
}); 