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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
      <Coins color="#f59e0b" size={size} strokeWidth={2} />
    </Animated.View>
  );
};

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Your</Text>
          <Text style={styles.headerTitle}>Wallet</Text>
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

// Professional Background
const ProfessionalBackground = () => {
  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.gradientBase}
      />
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
            <View style={[styles.balanceIconBackdrop, { backgroundColor: '#f59e0b' + '20' }]} />
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
              <TrendingUp color="#10b981" size={16} strokeWidth={2} />
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
        <Icon color="#ffffff" size={20} strokeWidth={1.5} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
      </View>
      <ChevronRight color="#6b7280" size={16} strokeWidth={1.5} />
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
      case 'earned': return '#10b981';
      case 'spent': return '#ef4444';
      case 'bonus': return '#f59e0b';
      case 'reward': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'completed': return { color: '#10b981', text: 'Completed' };
      case 'pending': return { color: '#f59e0b', text: 'Pending' };
      case 'failed': return { color: '#ef4444', text: 'Failed' };
      default: return { color: '#6b7280', text: 'Unknown' };
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
            <Clock color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.opportunityMetaText}>{opportunity.timeEstimate}</Text>
          </View>
          <ChevronRight color="#9ca3af" size={16} strokeWidth={1.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Main Wallet Component
export default function StudentWallet() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recent');
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const walletData = {
    balance: 1875,
    weeklyEarnings: 245,
    monthlyEarnings: 1200,
    totalEarned: 5640,
  };

  const quickActions = [
    {
      icon: Store,
      title: 'Visit Store',
      subtitle: 'Browse items & rewards',
      color: '#3b82f6',
    },
    {
      icon: History,
      title: 'Transaction History',
      subtitle: 'View all transactions',
      color: '#8b5cf6',
    },
    {
      icon: Gift,
      title: 'Redeem Code',
      subtitle: 'Enter promotional code',
      color: '#10b981',
    },
    {
      icon: Target,
      title: 'Earning Goals',
      subtitle: 'Set monthly targets',
      color: '#f59e0b',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      title: 'React Workshop Completion',
      amount: 50,
      date: '2 hours ago',
      type: 'earned',
      status: 'completed',
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Premium Course Access',
      amount: 150,
      date: 'Yesterday',
      type: 'spent',
      status: 'completed',
      category: 'Education'
    },
    {
      id: 3,
      title: 'Weekly Challenge Bonus',
      amount: 25,
      date: '2 days ago',
      type: 'bonus',
      status: 'completed',
      category: 'Challenge'
    },
    {
      id: 4,
      title: 'Event Participation',
      amount: 30,
      date: '3 days ago',
      type: 'earned',
      status: 'pending',
      category: 'Event'
    },
    {
      id: 5,
      title: 'Leaderboard Reward',
      amount: 100,
      date: '1 week ago',
      type: 'reward',
      status: 'completed',
      category: 'Achievement'
    },
  ];

  const earningOpportunities = [
    {
      id: 1,
      title: 'Complete Python Course',
      description: 'Finish the advanced Python programming course',
      credits: 75,
      timeEstimate: '3-4 hours',
      icon: Code,
      color: '#3b82f6',
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'Attend Networking Event',
      description: 'Join tomorrow\'s professional networking session',
      credits: 40,
      timeEstimate: '2 hours',
      icon: Coffee,
      color: '#10b981',
      difficulty: 'Easy'
    },
    {
      id: 3,
      title: 'Submit Project Review',
      description: 'Review and rate 3 peer projects',
      credits: 25,
      timeEstimate: '1 hour',
      icon: Heart,
      color: '#ec4899',
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
          {/* Balance Card */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.balanceSection}>
            <BalanceCard 
              balance={walletData.balance}
              weeklyEarnings={walletData.weeklyEarnings}
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
                <ChevronRight color="#9ca3af" size={14} strokeWidth={1.5} />
              </Pressable>
            </View>

            <View style={styles.transactionsContainer}>
              {recentTransactions.slice(0, 5).map((transaction, index) => (
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
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
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
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
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
    backgroundColor: '#0a0f1c',
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
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
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
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
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8892b0',
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
    color: '#cbd5e1',
    fontWeight: '600',
  },
  balanceStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  balanceStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  balanceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },

  // Quick Actions Section
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
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
    color: '#9ca3af',
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    position: 'relative',
    overflow: 'hidden',
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
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
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
    color: '#ffffff',
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
    color: '#9ca3af',
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
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  opportunitiesContainer: {
    gap: 16,
  },
  opportunityCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
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
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  opportunityIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 11,
    opacity: 0.4,
  },
  opportunityBadge: {
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  opportunityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 0.5,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 22,
  },
  opportunityDescription: {
    fontSize: 14,
    color: '#9ca3af',
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
    color: '#9ca3af',
    fontWeight: '500',
  },

  bottomSpacer: {
    height: 40,
  },
}); 