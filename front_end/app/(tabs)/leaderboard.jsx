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

// Color Palette - Minimalist Luxe Light Theme
const colors = {
  primaryBg: '#F5F5F5',      // Soft Off-White
  secondaryBg: '#EAEAEA',    // Light Gray
  primaryText: '#333333',    // Dark Gray
  secondaryText: '#555555',  // Medium Gray
  accent: '#3EB489',         // Mint Green
  highlight: '#E1C3AD',      // Soft Beige
  error: '#D9534F',          // Muted Red
  white: '#FFFFFF',
  lightAccent: '#3EB48920',  // Mint Green with opacity
  lightHighlight: '#E1C3AD30', // Soft Beige with opacity
  cardBorder: '#E0E0E0',     // Light border
  shadow: '#00000015',       // Subtle shadow
  success: '#059669',        // Success green
  warning: '#d97706',        // Warning orange
  info: '#2563eb',           // Info blue
  muted: '#9ca3af'           // Muted text
};

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Leaderboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/notifications')}>
            <Bell color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push('/settings')}>
            <Settings color={colors.accent} size={20} strokeWidth={1.5} />
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
      <Crown color={colors.warning} size={size} strokeWidth={2} />
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
      case 1: return { gradient: [colors.warning, colors.warning], icon: Crown, bg: colors.warning };
      case 2: return { gradient: [colors.muted, colors.muted], icon: Medal, bg: colors.muted };
      case 3: return { gradient: [colors.error, colors.error], icon: Award, bg: colors.error };
      default: return { gradient: [colors.info, colors.info], icon: Trophy, bg: colors.info };
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
            <Crown color={colors.white} size={16} strokeWidth={2} />
          ) : (
            <PodiumIcon color={colors.white} size={16} strokeWidth={2} />
          )}
          <Text style={styles.positionText}>{position}</Text>
        </View>

        {/* Student Info */}
        <Text style={styles.podiumName} numberOfLines={1}>{student.name}</Text>
        <Text style={styles.podiumLogin}>@{student.login}</Text>

        {/* Stats */}
        <View style={styles.podiumStats}>
          <View style={styles.podiumStat}>
            <Star color={colors.warning} size={12} strokeWidth={2} />
            <Text style={styles.podiumStatText}>{student.xp.toLocaleString()}</Text>
          </View>
          <View style={styles.podiumStat}>
            <Trophy color={colors.info} size={12} strokeWidth={2} />
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
    if (rank <= 10) return { icon: Trophy, color: colors.warning };
    if (rank <= 25) return { icon: Medal, color: colors.muted };
    if (rank <= 50) return { icon: Award, color: colors.error };
    return { icon: Target, color: colors.muted };
  };

  const getRankChange = (change) => {
    if (change > 0) return { icon: ArrowUp, color: colors.success, text: `+${change}` };
    if (change < 0) return { icon: ArrowDown, color: colors.error, text: change.toString() };
    return { icon: Minus, color: colors.muted, text: '0' };
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

        <ChevronRight color={colors.warning} size={16} strokeWidth={2} />
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
                color={selectedCategory === category.id ? colors.white : category.color} 
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
            <ChevronRight color={colors.warning} size={14} strokeWidth={1.5} />
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
    StatusBar.setBarStyle('dark-content');
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
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={Trophy}
          message="Unable to Load Leaderboard"
          subMessage={error}
        />
      </View>
    );
  }

  const categories = [
    { id: 'all', name: 'All Time', icon: Trophy, color: colors.warning },
    { id: 'monthly', name: 'This Month', icon: Calendar, color: colors.info },
    { id: 'weekly', name: 'This Week', icon: Zap, color: colors.success },
    { id: 'daily', name: 'Today', icon: Target, color: colors.error },
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
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
    backgroundColor: colors.primaryBg,
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
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.white,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    color: colors.primaryText,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.secondaryText,
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
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
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
    backgroundColor: colors.lightAccent,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 2,
  },
  userLevel: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  userRankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  userRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
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
    color: colors.primaryText,
    lineHeight: 14,
  },
  statLabel: {
    fontSize: 9,
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 10,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.cardBorder,
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
    color: colors.primaryText,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.secondaryBg,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  progressSubtext: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  // Categories
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    minWidth: 120,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.secondaryBg,
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
    color: colors.primaryText,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.white,
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
    color: colors.white,
    fontWeight: '700',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumLogin: {
    fontSize: 10,
    color: colors.secondaryText,
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
    color: colors.primaryText,
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
    color: colors.white,
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
    color: colors.secondaryText,
    fontWeight: '500',
    marginTop: 4,
  },
  leaderboardContainer: {
    gap: 6,
  },
  leaderboardRow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
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
    color: colors.primaryText,
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
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 1,
  },
  studentLogin: {
    fontSize: 10,
    color: colors.secondaryText,
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