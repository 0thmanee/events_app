import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet, TextInput, Alert } from 'react-native';
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
  withSpring
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Trophy,
  Users,
  TrendingUp,
  Award,
  Search,
  Filter,
  Crown,
  Medal,
  Star,
  Target,
  Activity,
  BarChart3,
  Eye,
  UserCheck,
  Calendar,
  Coins,
  ChevronRight,
  Settings,
  Download,
  RefreshCw,
  User
} from 'lucide-react-native';
import AdminHeader from '../../components/AdminHeader';
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

// Ranking Card Component
const RankingCard = ({ student, index, onViewProfile }) => {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 400, delay: index * 50 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handlePressIn = () => {
    cardScale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown color={colors.warning} size={20} strokeWidth={2} />;
    if (rank === 2) return <Medal color={colors.muted} size={20} strokeWidth={2} />;
    if (rank === 3) return <Medal color={colors.error} size={20} strokeWidth={2} />;
    return <Text style={styles.rankNumber}>#{rank}</Text>;
  };

  const getLevelColor = (level) => {
    if (level >= 10) return colors.highlight;
    if (level >= 7) return colors.info;
    if (level >= 5) return colors.success;
    if (level >= 3) return colors.warning;
    return colors.muted;
  };

  return (
    <Animated.View style={[styles.rankingCard, cardStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onViewProfile(student)}
        style={styles.rankingCardPressable}
      >
        {/* Rank indicator */}
        <View style={styles.rankIndicator}>
          {getRankIcon(student.rank)}
        </View>

        {/* Student info */}
        <View style={styles.studentInfo}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{student.name}</Text>
          </View>
          <Text style={styles.studentLogin}>@{student.login}</Text>
          
          <View style={styles.studentStats}>
            <View style={styles.statItem}>
              <Calendar color={colors.secondaryText} size={14} strokeWidth={2} />
              <Text style={styles.statText}>{student.eventsAttended} events</Text>
            </View>
            <View style={styles.statItem}>
              <Coins color={colors.secondaryText} size={14} strokeWidth={2} />
              <Text style={styles.statText}>{student.totalCoins} coins</Text>
            </View>
          </View>
        </View>

        {/* Level Badge */}
        <View style={styles.levelContainer}>
          <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(student.level)}20`, borderColor: getLevelColor(student.level) }]}>
            <Text style={[styles.levelText, { color: getLevelColor(student.level) }]}>Lv.{student.level}</Text>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <ChevronRight color={colors.secondaryText} size={16} strokeWidth={2} />
        </View>
      </Pressable>
    </Animated.View>
  );
};


// Main Component
export default function ManageRanking() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Mock student ranking data
  const students = [
    {
      id: 1,
      rank: 1,
      name: 'Si Yhya',
      login: 'yalami',
      level: 12,
      score: 8750,
      eventsAttended: 45,
      totalCoins: 2340,
      lastActivity: 'active',
      achievements: 18,
      feedback: 42
    },
    {
      id: 2,
      rank: 2,
      name: 'Fatima Zahra El Mansouri',
      login: 'fel-mans',
      level: 11,
      score: 8200,
      eventsAttended: 38,
      totalCoins: 2100,
      lastActivity: 'active',
      achievements: 16,
      feedback: 35
    },
    {
      id: 3,
      rank: 3,
      name: 'Ahmed Benali',
      login: 'abenali',
      level: 10,
      score: 7650,
      eventsAttended: 32,
      totalCoins: 1850,
      lastActivity: 'active',
      achievements: 14,
      feedback: 28
    },
    {
      id: 4,
      rank: 4,
      name: 'Sara Amrani',
      login: 'samrani',
      level: 9,
      score: 6890,
      eventsAttended: 28,
      totalCoins: 1560,
      lastActivity: 'active',
      achievements: 12,
      feedback: 24
    },
    {
      id: 5,
      rank: 5,
      name: 'Omar Tazi',
      login: 'otazi',
      level: 8,
      score: 6120,
      eventsAttended: 25,
      totalCoins: 1340,
      lastActivity: 'idle',
      achievements: 10,
      feedback: 20
    },
    {
      id: 6,
      rank: 6,
      name: 'Nadia Kassimi',
      login: 'nkassimi',
      level: 7,
      score: 5450,
      eventsAttended: 22,
      totalCoins: 1180,
      lastActivity: 'active',
      achievements: 8,
      feedback: 18
    },
    {
      id: 7,
      rank: 7,
      name: 'Karim Bouazza',
      login: 'kbouazza',
      level: 6,
      score: 4780,
      eventsAttended: 19,
      totalCoins: 980,
      lastActivity: 'idle',
      achievements: 7,
      feedback: 15
    },
    {
      id: 8,
      rank: 8,
      name: 'Malika Idrissi',
      login: 'midrissi',
      level: 5,
      score: 4120,
      eventsAttended: 16,
      totalCoins: 820,
      lastActivity: 'active',
      achievements: 6,
      feedback: 12
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.login.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && student.lastActivity === 'active') ||
                         (selectedFilter === 'high-level' && student.level >= 8) ||
                         (selectedFilter === 'top-10' && student.rank <= 10);
    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (student) => {
    Alert.alert(
      `${student.name}'s Profile`,
      `Rank: #${student.rank}\nLevel: ${student.level}\nScore: ${student.score} XP\nEvents: ${student.eventsAttended}\nCoins: ${student.totalCoins}\nAchievements: ${student.achievements}\nFeedback Given: ${student.feedback}`,
      [{ text: 'Close' }]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Ranking data has been exported to CSV format.');
  };

  const handleResetRankings = () => {
    Alert.alert(
      'Reset Rankings',
      'This will reset all student rankings and scores. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => Alert.alert('Success', 'Rankings have been reset.') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <AdminHeader />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.actionsContainer}>
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={handleExportData}>
                <Download color={colors.info} size={16} strokeWidth={2} />
                <Text style={styles.actionButtonText}>Export</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={handleResetRankings}>
                <RefreshCw color={colors.error} size={16} strokeWidth={2} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>Reset</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Search */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search color={colors.secondaryText} size={20} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search students..."
                placeholderTextColor={colors.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter color={colors.secondaryText} size={18} strokeWidth={2} />
              </Pressable>
            </View>

            {showFilters && (
              <Animated.View 
                entering={FadeInDown.duration(200)}
                style={styles.filterRow}
              >
                {['all', 'active', 'high-level', 'top-10'].map((filter) => (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive
                    ]}>
                      {filter === 'all' ? 'All' : 
                       filter === 'active' ? 'Active' :
                       filter === 'high-level' ? 'High Level' : 'Top 10'}
                    </Text>
                  </Pressable>
                ))}
              </Animated.View>
            )}
          </Animated.View>

          {/* Rankings List */}
          <View style={styles.rankingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Student Rankings ({filteredStudents.length})
              </Text>
            </View>

            {filteredStudents.map((student, index) => (
              <RankingCard
                key={student.id}
                student={student}
                index={index}
                onViewProfile={handleViewProfile}
              />
            ))}

            {filteredStudents.length === 0 && (
              <View style={styles.emptyState}>
                <Trophy color={colors.secondaryText} size={48} strokeWidth={1.5} />
                <Text style={styles.emptyStateTitle}>No Students Found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your search criteria
                </Text>
              </View>
            )}
          </View>

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

  scrollContent: {
    paddingBottom: 120,
  },

  // Stats Overview
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minHeight: 85,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.info,
    fontWeight: '600',
  },

  // Search
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: '500',
  },
  filterButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterChip: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: colors.lightAccent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.accent,
  },

  // Rankings Section
  rankingsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },

  // Ranking Cards
  rankingCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  rankingCardPressable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    position: 'relative',
  },
  rankIndicator: {
    width: 40,
    alignItems: 'center',
    paddingTop: 4,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondaryText,
    fontFamily: 'monospace',
  },
  studentInfo: {
    flex: 1,
    paddingRight: 32,
  },
  studentHeader: {
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
  studentLogin: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 8,
  },
  studentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.info,
    fontFamily: 'monospace',
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '600',
  },

  // Arrow positioning
  arrowContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: 40,
  },

  // Level Badge
  levelContainer: {
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
}); 