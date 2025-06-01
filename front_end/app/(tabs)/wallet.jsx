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
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Coins,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Calendar,
  Trophy,
  Star,
  Gift,
  Target,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Zap,
  Heart,
  Code,
  Coffee,
  Store,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  CreditCard,
  Wallet as WalletIcon,
  History,
  TrendingDown as Decrease,
  Settings,
  Bell,
  MoreHorizontal
} from 'lucide-react-native';
import AdminHeader from '../../components/AdminHeader';
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
  muted: '#9ca3af',          // Muted text
  gold: '#f59e0b'            // Gold for coins
};

// Animated Coin Component
const AnimatedCoin = ({ size = 24, delay = 0 }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000 }),
        -1,
        false
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
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
      <Coins color={colors.gold} size={size} strokeWidth={2} />
    </Animated.View>
  );
};

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={[styles.studentHeader, { backgroundColor: colors.white }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerGreeting, { color: colors.secondaryText }]}>Your</Text>
          <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Wallet</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={[styles.headerButton, { backgroundColor: colors.secondaryBg }]} onPress={() => router.push('/notifications')}>
            <Bell color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={[styles.headerButton, { backgroundColor: colors.secondaryBg }]} onPress={() => router.push('/settings')}>
            <Settings color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Balance Card Component
const BalanceCard = ({ balance, weeklyEarnings, onPress }) => {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  return (
    <Animated.View style={[styles.balanceCard, cardStyle]}>
      <Pressable style={styles.balanceCardContent} onPress={onPress}>
        {/* Enhanced gradient overlay */}
        <LinearGradient
          colors={['rgba(245, 158, 11, 0.15)', 'rgba(16, 185, 129, 0.05)', 'rgba(0, 0, 0, 0.1)']}
          style={styles.balanceGradientOverlay}
          locations={[0, 0.6, 1]}
        />
        
        <View style={styles.balanceHeader}>
          <View style={styles.balanceIconContainer}>
            <View style={[styles.balanceIconBackdrop, { backgroundColor: colors.gold + '20' }]} />
            <AnimatedCoin size={28} />
          </View>
        </View>

        <View style={styles.balanceAmount}>
          <Text style={styles.balanceValue}>{balance.toLocaleString()}</Text>
          <Text style={styles.balanceCurrency}>CREDITS</Text>
        </View>

        <View style={styles.balanceStats}>
          <View style={styles.balanceStatContainer}>
            <View style={styles.trendingIconContainer}>
              <TrendingUp color={colors.success} size={16} strokeWidth={2} />
            </View>
            <Text style={styles.balanceStatText}>+{weeklyEarnings} this week</Text>
          </View>
          <View style={styles.balanceStatusBadge}>
            <View style={styles.balanceStatusDot} />
            <Text style={styles.balanceStatusText}>Active</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Quick Action Component
const QuickActionItem = ({ icon: Icon, title, onPress }) => {
  const { router } = useRouter();
  
  const handlePress = () => {
    switch (title) {
      case 'Send Credits':
        router.push('/send-credits');
        break;
      case 'Add Funds':
        router.push('/add-funds');
        break;
      case 'Event Rewards':
        router.push('/event-rewards');
        break;
      case 'Shop':
        router.push('/shop');
        break;
      default:
        onPress && onPress();
    }
  };

  return (
    <Pressable style={styles.quickActionItem} onPress={handlePress}>
      <View style={styles.quickActionIcon}>
        <Icon color={colors.white} size={20} strokeWidth={1.5} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
      </View>
      <ChevronRight color={colors.muted} size={16} strokeWidth={1.5} />
    </Pressable>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction, index }) => {
  const itemOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      itemOpacity.value = withTiming(1, { duration: 600 });
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
  }));

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earned': return ArrowUpRight;
      case 'spent': return ArrowDownLeft;
      case 'bonus': return Gift;
      case 'reward': return Trophy;
      default: return Coins;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'earned': return colors.success;
      case 'spent': return colors.error;
      case 'bonus': return colors.gold;
      case 'reward': return colors.info;
      default: return colors.muted;
    }
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'completed': return { color: colors.success, text: 'Completed' };
      case 'pending': return { color: colors.warning, text: 'Pending' };
      case 'failed': return { color: colors.error, text: 'Failed' };
      default: return { color: colors.muted, text: 'Unknown' };
    }
  };

  const TransactionIcon = getTransactionIcon(transaction.type);
  const transactionColor = getTransactionColor(transaction.type);
  const statusConfig = getTransactionStatus(transaction.status);

  return (
    <Animated.View style={[styles.transactionItem, itemStyle]}>
      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.01)', 'transparent']}
        style={styles.transactionGradient}
      />
      
      <View style={styles.transactionIconContainer}>
        <View style={[styles.transactionIconBackdrop, { backgroundColor: transactionColor + '10' }]} />
        <TransactionIcon color={transactionColor} size={18} strokeWidth={1.8} />
      </View>

      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={[styles.transactionAmount, { color: transactionColor }]}>
            {transaction.type === 'spent' ? '-' : '+'}{transaction.amount}
          </Text>
        </View>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <View style={[styles.transactionStatus, { backgroundColor: statusConfig.color + '20' }]}>
            <Text style={[styles.transactionStatusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Earning Opportunity Component
const EarningOpportunity = ({ opportunity, index, onPress }) => {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 500 });
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  return (
    <Animated.View style={[styles.opportunityCard, cardStyle]}>
      <Pressable style={styles.opportunityCardContent} onPress={() => onPress(opportunity)}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent', 'rgba(0, 0, 0, 0.1)']}
          style={styles.opportunityGradient}
          locations={[0, 0.5, 1]}
        />
        
        <View style={styles.opportunityHeader}>
          <View style={styles.opportunityIconContainer}>
            <View style={[styles.opportunityIconBackdrop, { backgroundColor: opportunity.color + '10' }]} />
            <opportunity.icon color={opportunity.color} size={20} strokeWidth={1.8} />
          </View>
          <View style={styles.opportunityBadge}>
            <Text style={styles.opportunityBadgeText}>{opportunity.credits} Credits</Text>
          </View>
        </View>

        <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
        <Text style={styles.opportunityDescription}>{opportunity.description}</Text>

        <View style={styles.opportunityFooter}>
          <View style={styles.opportunityMeta}>
            <Clock color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={styles.opportunityMetaText}>{opportunity.timeEstimate}</Text>
          </View>
          <ChevronRight color={colors.muted} size={16} strokeWidth={1.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Main Wallet Component
export default function StudentWallet() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('recent');
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setError(null);
      const data = await ApiService.getWalletData();
      setWalletData(data);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  // Show loading state
  if (loading && !walletData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Wallet"
          subMessage="Fetching your balance and transactions"
          icon={WalletIcon}
        />
      </View>
    );
  }

  // Show error state
  if (error && !walletData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={WalletIcon}
          message="Unable to Load Wallet"
          subMessage={error}
        />
      </View>
    );
  }

  const balance = walletData?.balance || 0;
  const weeklyEarnings = Math.round(balance * 0.1); // Estimate weekly earnings as 10% of total

  const quickActions = [
    {
      icon: Store,
      title: 'Visit Store',
      subtitle: 'Browse items & rewards',
      color: colors.info,
    },
    {
      icon: History,
      title: 'Transaction History',
      subtitle: 'View all transactions',
      color: colors.highlight,
    },
    {
      icon: Gift,
      title: 'Redeem Code',
      subtitle: 'Enter promotional code',
      color: colors.success,
    },
    {
      icon: Target,
      title: 'Earning Goals',
      subtitle: 'Set monthly targets',
      color: colors.warning,
    },
  ];

  // Transform transactions for display
  const recentTransactions = transactions.slice(0, 5).map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount,
    date: formatTransactionDate(transaction.date),
    type: transaction.type,
    status: transaction.status,
    category: transaction.category
  }));

  // Format transaction date
  function formatTransactionDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  const earningOpportunities = [
    {
      id: 1,
      title: 'Complete Python Course',
      description: 'Finish the advanced Python programming course',
      credits: 75,
      timeEstimate: '3-4 hours',
      icon: Code,
      color: colors.info,
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'Attend Networking Event',
      description: 'Join tomorrow\'s professional networking session',
      credits: 40,
      timeEstimate: '2 hours',
      icon: Coffee,
      color: colors.success,
      difficulty: 'Easy'
    },
    {
      id: 3,
      title: 'Submit Project Review',
      description: 'Review and rate 3 peer projects',
      credits: 25,
      timeEstimate: '1 hour',
      icon: Heart,
      color: colors.error,
      difficulty: 'Easy'
    },
  ];

  const handleQuickAction = (action) => {
    console.log('Quick action:', action.title);
    switch (action.title) {
      case 'Visit Store':
        // router.push('/store');
        break;
      case 'Transaction History':
        // router.push('/wallet/history');
        break;
      case 'Redeem Code':
        // Show redeem code modal
        break;
      case 'Earning Goals':
        // router.push('/wallet/goals');
        break;
    }
  };

  const handleOpportunityPress = (opportunity) => {
    console.log('Opportunity pressed:', opportunity.title);
    // router.push(`/opportunity/${opportunity.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryBg }]}>
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
          {/* Balance Card */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.balanceSection}>
            <BalanceCard 
              balance={balance}
              weeklyEarnings={weeklyEarnings}
              onPress={() => console.log('Balance card pressed')}
            />
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <QuickActionItem
                  key={action.title}
                  icon={action.icon}
                  title={action.title}
                  onPress={() => handleQuickAction(action)}
                />
              ))}
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight color={colors.muted} size={14} strokeWidth={1.5} />
              </Pressable>
            </View>

            <View style={styles.transactionsContainer}>
              {recentTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </View>
          </Animated.View>

          {/* Earning Opportunities */}
          <Animated.View entering={FadeInUp.delay(1000)} style={styles.opportunitiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Earning Opportunities</Text>
              <Text style={styles.sectionSubtitle}>{earningOpportunities.length} available</Text>
            </View>

            <View style={styles.opportunitiesContainer}>
              {earningOpportunities.map((opportunity, index) => (
                <EarningOpportunity
                  key={opportunity.id}
                  opportunity={opportunity}
                  index={index}
                  onPress={handleOpportunityPress}
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
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Background
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientBase: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // Balance Section
  balanceSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 32,
  },
  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 16,
    overflow: 'hidden',
  },
  balanceCardContent: {
    padding: 24,
    position: 'relative',
  },
  balanceGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  balanceIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    opacity: 0.6,
  },
  balanceAmount: {
    marginBottom: 20,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primaryText,
    letterSpacing: -1,
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondaryText,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceStatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  balanceStatText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '600',
  },
  balanceStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  balanceStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  balanceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success,
  },

  // Quick Actions Section
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 20,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryText,
  },

  // Transactions Section
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  transactionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  transactionIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 11,
    opacity: 0.4,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  transactionStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transactionStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Opportunities Section
  opportunitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
    marginTop: 4,
  },
  opportunitiesContainer: {
    gap: 16,
  },
  opportunityCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  opportunityCardContent: {
    padding: 20,
    position: 'relative',
  },
  opportunityGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  opportunityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  opportunityIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 11,
    opacity: 0.4,
  },
  opportunityBadge: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  opportunityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 6,
    lineHeight: 22,
  },
  opportunityDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 16,
  },
  opportunityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opportunityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  opportunityMetaText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },

  bottomSpacer: {
    height: 40,
  },
}); 