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

// Transaction Type Badge
const TransactionTypeBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    switch (type.toLowerCase()) {
      case 'earned':
        return { color: colors.success, gradient: [colors.success, colors.success], icon: ArrowUpRight };
      case 'spent':
        return { color: colors.error, gradient: [colors.error, colors.error], icon: ArrowDownLeft };
      case 'awarded':
        return { color: colors.accent, gradient: [colors.accent, colors.accent], icon: Award };
      case 'bonus':
        return { color: colors.warning, gradient: [colors.warning, colors.warning], icon: Gift };
      default:
        return { color: colors.muted, gradient: [colors.muted, colors.muted], icon: Coins };
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
    backgroundColor: colors.primaryBg,
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Wallet Overview Section
  overviewSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    letterSpacing: 0.5,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.success,
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
    color: colors.secondaryText,
    fontWeight: '600',
    marginBottom: 8,
  },
  counterText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.success,
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
    color: colors.primaryText,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    textAlign: 'center',
  },
  statTrend: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  trendPositive: {
    color: colors.success,
  },
  trendNegative: {
    color: colors.error,
  },
  
  // Quick Actions Section
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (screenWidth - 60) / 3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 10,
    color: colors.secondaryText,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryText,
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.success,
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
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    marginRight: 4,
  },
  
  // Transaction Cards
  transactionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    color: colors.primaryText,
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
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  transactionMetaText: {
    fontSize: 10,
    color: colors.secondaryText,
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
    color: colors.success,
  },
  amountNegative: {
    color: colors.error,
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
    StatusBar.setBarStyle('dark-content');
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
      color: colors.accent,
      gradient: [colors.accent, colors.accent],
    },
    {
      title: 'Analytics',
      subtitle: 'View stats',
      icon: BarChart3,
      color: colors.info,
      gradient: [colors.info, colors.info],
    },
    {
      title: 'Settings',
      subtitle: 'Configure',
      icon: Settings,
      color: colors.muted,
      gradient: [colors.muted, colors.muted],
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Header */}
          <AdminHeader title="Wallet System" subtitle="Manage coins and transactions" />

          {/* Wallet Overview */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.overviewSection}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={[colors.success, colors.success]}
                style={styles.overviewGradient}
              />
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Total Coins in Circulation</Text>
                <View style={styles.overviewIcon}>
                  <Wallet color={colors.success} size={24} strokeWidth={2} />
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
              <Search color={colors.muted} size={18} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search transactions..."
                placeholderTextColor={colors.muted}
                value={filterText}
                onChangeText={setFilterText}
              />
              <Pressable style={styles.filterButton}>
                <Filter color={colors.success} size={16} strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort by</Text>
                <MoreVertical color={colors.secondaryText} size={14} strokeWidth={2} />
              </Pressable>
            </View>
            
            {transactions.map((transaction, index) => (
              <Animated.View
                key={transaction.id}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={styles.transactionCard}
              >
                <LinearGradient
                  colors={transaction.amount > 0 ? [colors.success, colors.success] : [colors.error, colors.error]}
                  style={styles.transactionCardGradient}
                />
                
                <View style={styles.transactionCardContent}>
                  <View style={[
                    styles.transactionIcon, 
                    { 
                      backgroundColor: transaction.amount > 0 ? colors.lightAccent : colors.error + '20', 
                      borderWidth: 1, 
                      borderColor: transaction.amount > 0 ? colors.success : colors.error 
                    }
                  ]}>
                    {transaction.amount > 0 ? (
                      <ArrowUpRight color={transaction.amount > 0 ? colors.success : colors.error} size={20} strokeWidth={2} />
                    ) : (
                      <ArrowDownLeft color={transaction.amount > 0 ? colors.success : colors.error} size={20} strokeWidth={2} />
                    )}
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.studentName}</Text>
                    <View style={styles.transactionMeta}>
                      <View style={styles.transactionMetaItem}>
                        <Clock color={colors.secondaryText} size={9} strokeWidth={2} />
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