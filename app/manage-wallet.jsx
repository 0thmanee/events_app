import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  FadeInUp,
  FadeInLeft
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Wallet,
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Calendar,
  Clock,
  Users,
  Award,
  Gift,
  ShoppingBag,
  BookOpen,
  Code,
  Trophy,
  Star,
  Zap,
  Settings,
  Bell,
  DollarSign,
  CreditCard,
  PiggyBank,
  Activity,
  BarChart3
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Transaction Type Badge
const TransactionTypeBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    switch (type.toLowerCase()) {
      case 'earned':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: ArrowUpRight };
      case 'spent':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: ArrowDownLeft };
      case 'awarded':
        return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], icon: Award };
      case 'bonus':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Gift };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Coins };
    }
  };

  const config = getTypeConfig(type);
  const TypeIcon = config.icon;

  return (
    <View style={[styles.typeBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <TypeIcon color={config.color} size={12} strokeWidth={2} />
      <Text style={[styles.typeBadgeText, { color: config.color }]}>{type}</Text>
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
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
  
  // Wallet Overview Section
  overviewSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  overviewCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  overviewGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCoinsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalCoinsLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  counterText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#10b981',
    fontFamily: 'monospace',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  statTrend: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  trendPositive: {
    color: '#10b981',
  },
  trendNegative: {
    color: '#ef4444',
  },
  
  // Quick Actions Section
  actionsSection: {
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (screenWidth - 60) / 3,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  actionCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  
  // Transactions Section
  transactionsSection: {
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
  
  // Transaction Cards
  transactionCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  transactionCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  transactionCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  transactionMetaText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '600',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  amountPositive: {
    color: '#10b981',
  },
  amountNegative: {
    color: '#ef4444',
  },
  
  // Badge Styles
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 3,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  bottomSpacer: {
    height: 120,
  },
});

export default function WalletSystem() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Sample wallet data
  const totalCoins = 47230;
  const dailyEarned = 1250;
  const dailySpent = 890;
  const activeWallets = 1247;

  const quickActions = [
    {
      title: 'Distribute',
      subtitle: 'Send coins',
      icon: Gift,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      title: 'Analytics',
      subtitle: 'View stats',
      icon: BarChart3,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      title: 'Settings',
      subtitle: 'Configure',
      icon: Settings,
      color: '#6b7280',
      gradient: ['#6b7280', '#4b5563'],
    },
  ];

  // Sample transactions data
  const transactions = [
    {
      id: 1,
      studentName: 'Ahmed Benali',
      studentId: '#1234',
      type: 'earned',
      amount: 50,
      reason: 'C++ Workshop Attendance',
      timestamp: '2 min ago',
    },
    {
      id: 2,
      studentName: 'Fatima Zahra',
      studentId: '#5678',
      type: 'spent',
      amount: -100,
      reason: 'Nickname Change',
      timestamp: '15 min ago',
    },
    {
      id: 3,
      studentName: 'Omar El Mansouri',
      studentId: '#9012',
      type: 'awarded',
      amount: 200,
      reason: 'Project Excellence',
      timestamp: '1 hour ago',
    },
    {
      id: 4,
      studentName: 'Yasmine Alami',
      studentId: '#3456',
      type: 'bonus',
      amount: 75,
      reason: 'Event Volunteering',
      timestamp: '2 hours ago',
    },
    {
      id: 5,
      studentName: 'Youssef Talib',
      studentId: '#7890',
      type: 'spent',
      amount: -200,
      reason: 'Custom Avatar',
      timestamp: '3 hours ago',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.container}>
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
              colors={['rgba(16, 185, 129, 0.1)', 'transparent']}
              style={styles.headerBackground}
            />
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Pressable 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft color="#10b981" size={20} strokeWidth={2} />
                </Pressable>
                
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>Wallet System</Text>
                  <Text style={styles.headerSubtitle}>Monitor and manage coin transactions</Text>
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

          {/* Wallet Overview */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.overviewSection}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.overviewGradient}
              />
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Total Coins in Circulation</Text>
                <View style={styles.overviewIcon}>
                  <Wallet color="#10b981" size={24} strokeWidth={2} />
                </View>
              </View>
              
              <View style={styles.totalCoinsContainer}>
                <Text style={styles.totalCoinsLabel}>1337 COINS</Text>
                <Text style={styles.counterText}>{totalCoins.toLocaleString()}</Text>
              </View>
              
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>+{dailyEarned}</Text>
                  <Text style={styles.statLabel}>Earned Today</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+12% ↗</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{dailySpent}</Text>
                  <Text style={styles.statLabel}>Spent Today</Text>
                  <Text style={[styles.statTrend, styles.trendNegative]}>-5% ↘</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{activeWallets}</Text>
                  <Text style={styles.statLabel}>Active Wallets</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+23 new</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.title}
                  entering={FadeInUp.delay(800 + index * 100)}
                >
                  <Pressable style={styles.actionCard}>
                    <LinearGradient
                      colors={action.gradient}
                      style={styles.actionCardGradient}
                    />
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}20`, borderWidth: 1, borderColor: action.color }]}>
                      <action.icon color={action.color} size={20} strokeWidth={2} />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Search & Filter */}
          <Animated.View entering={FadeInUp.delay(1000)} style={styles.filterSection}>
            <View style={styles.filterContainer}>
              <Search color="#6b7280" size={18} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search transactions..."
                placeholderTextColor="#6b7280"
                value={filterText}
                onChangeText={setFilterText}
              />
              <Pressable style={styles.filterButton}>
                <Filter color="#10b981" size={16} strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort by</Text>
                <MoreVertical color="#9ca3af" size={14} strokeWidth={2} />
              </Pressable>
            </View>
            
            {transactions.map((transaction, index) => (
              <Animated.View
                key={transaction.id}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={styles.transactionCard}
              >
                <LinearGradient
                  colors={transaction.amount > 0 ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
                  style={styles.transactionCardGradient}
                />
                
                <View style={styles.transactionCardContent}>
                  <View style={[
                    styles.transactionIcon, 
                    { 
                      backgroundColor: transaction.amount > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                      borderWidth: 1, 
                      borderColor: transaction.amount > 0 ? '#10b981' : '#ef4444' 
                    }
                  ]}>
                    {transaction.amount > 0 ? (
                      <ArrowUpRight color={transaction.amount > 0 ? '#10b981' : '#ef4444'} size={20} strokeWidth={2} />
                    ) : (
                      <ArrowDownLeft color={transaction.amount > 0 ? '#10b981' : '#ef4444'} size={20} strokeWidth={2} />
                    )}
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.studentName}</Text>
                    <View style={styles.transactionMeta}>
                      <View style={styles.transactionMetaItem}>
                        <Clock color="#6b7280" size={9} strokeWidth={2} />
                        <Text style={styles.transactionMetaText}>{transaction.timestamp}</Text>
                      </View>
                      <TransactionTypeBadge type={transaction.type} />
                    </View>
                    <Text style={styles.transactionMetaText}>{transaction.reason}</Text>
                  </View>
                  
                  <View style={styles.transactionAmount}>
                    <Text style={[
                      styles.amountValue, 
                      transaction.amount > 0 ? styles.amountPositive : styles.amountNegative
                    ]}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </Text>
                    <TransactionTypeBadge type={transaction.type} />
                  </View>
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 