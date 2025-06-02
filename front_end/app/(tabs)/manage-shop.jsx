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
  ShoppingBag,
  User,
  Image as ImageIcon,
  Coins,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Plus,
  Edit,
  Trash2,
  Settings,
  Bell,
  Award,
  Star,
  Trophy,
  UserCheck,
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

// Request Status Badge
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: colors.warning, gradient: [colors.warning, colors.warning], icon: Clock };
      case 'approved':
        return { color: colors.success, gradient: [colors.success, colors.success], icon: CheckCircle };
      case 'rejected':
        return { color: colors.error, gradient: [colors.error, colors.error], icon: XCircle };
      default:
        return { color: colors.muted, gradient: [colors.muted, colors.muted], icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <StatusIcon color={config.color} size={12} strokeWidth={2} />
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{status}</Text>
    </View>
  );
};

// Request Type Badge
const RequestTypeBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    switch (type.toLowerCase()) {
      case 'nickname':
        return { color: colors.info, gradient: [colors.info, colors.info], icon: User };
      case 'avatar':
        return { color: colors.accent, gradient: [colors.accent, colors.accent], icon: ImageIcon };
      default:
        return { color: colors.muted, gradient: [colors.muted, colors.muted], icon: Edit };
    }
  };

  const config = getTypeConfig(type);
  const TypeIcon = config.icon;

  return (
    <View style={[styles.typeBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <TypeIcon color={config.color} size={10} strokeWidth={2} />
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
  
  // Overview Section
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
    borderColor: colors.accent,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 24,
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
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  
  // Requests Section
  requestsSection: {
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
  
  // Request Cards
  requestCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  requestCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  requestCardContent: {
    padding: 20,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestInfo: {
    flex: 1,
    marginRight: 16,
  },
  requestName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 4,
  },
  requestId: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  requestStatusContainer: {
    alignItems: 'flex-end',
  },
  requestDetails: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
    marginLeft: 8,
  },
  requestChange: {
    marginBottom: 8,
  },
  requestChangeLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestChangeText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '600',
  },
  requestCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  requestCostText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
    marginLeft: 4,
  },
  requestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestTime: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  approveButton: {
    backgroundColor: colors.lightAccent,
    borderColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  detailsButton: {
    backgroundColor: colors.info + '20',
    borderColor: colors.info,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Badge Styles
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
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

export default function ShopRequestsManagement() {
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

  const handleApprove = (requestId) => {
    Alert.alert('Success', `Request ${requestId} approved!`);
  };

  const handleReject = (requestId) => {
    Alert.alert('Rejected', `Request ${requestId} rejected.`);
  };

  const handleViewDetails = (requestId) => {
    Alert.alert('Details', `Viewing details for request ${requestId}`);
  };

  // Sample data
  const totalRequests = 23;
  const pendingRequests = 8;
  const approvedToday = 5;
  const totalCoinsSpent = 1420;

  const quickActions = [
    {
      title: 'Review',
      subtitle: 'Requests',
      icon: Eye,
      color: colors.info,
      gradient: [colors.info, colors.info],
    },
    {
      title: 'Analytics',
      subtitle: 'Insights',
      icon: BarChart3,
      color: colors.accent,
      gradient: [colors.accent, colors.accent],
    },
    {
      title: 'Settings',
      subtitle: 'Configure',
      icon: Settings,
      color: colors.muted,
      gradient: [colors.muted, colors.muted],
    },
  ];

  // Sample requests data
  const requests = [
    {
      id: 'REQ-001',
      studentName: 'Khalid Benjelloun',
      studentId: '#2024001',
      type: 'nickname',
      status: 'pending',
      requestedAt: '1 hour ago',
      currentValue: 'khalid_b',
      newValue: 'code_master_kh',
      cost: 100,
    },
    {
      id: 'REQ-002',
      studentName: 'Meriem El Fassi',
      studentId: '#2024002',
      type: 'avatar',
      status: 'approved',
      requestedAt: '3 hours ago',
      currentValue: 'default_avatar.png',
      newValue: 'custom_avatar_tech.png',
      cost: 200,
    },
    {
      id: 'REQ-003',
      studentName: 'Adnane Alaoui',
      studentId: '#2024003',
      type: 'nickname',
      status: 'pending',
      requestedAt: '5 hours ago',
      currentValue: 'adnane123',
      newValue: 'algorithm_ninja',
      cost: 100,
    },
    {
      id: 'REQ-004',
      studentName: 'Nora Chakir',
      studentId: '#2024004',
      type: 'avatar',
      status: 'rejected',
      requestedAt: '1 day ago',
      currentValue: 'profile_1.png',
      newValue: 'custom_inappropriate.png',
      cost: 200,
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
          <AdminHeader title="Shop Requests" subtitle="Manage profile customization requests" />

          {/* Overview */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.overviewSection}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={[colors.warning, colors.warning]}
                style={styles.overviewGradient}
              />
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Shop Overview</Text>
                <View style={styles.overviewIcon}>
                  <ShoppingBag color={colors.accent} size={24} strokeWidth={2} />
                </View>
              </View>
              
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{totalRequests}</Text>
                  <Text style={styles.statLabel}>Total Requests</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+3 today</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{pendingRequests}</Text>
                  <Text style={styles.statLabel}>Pending Review</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+2 new</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{totalCoinsSpent}</Text>
                  <Text style={styles.statLabel}>Coins Spent</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+15% growth</Text>
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
                placeholder="Search requests..."
                placeholderTextColor={colors.muted}
                value={filterText}
                onChangeText={setFilterText}
              />
              <Pressable style={styles.filterButton}>
                <Filter color={colors.accent} size={16} strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Requests */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.requestsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort by</Text>
                <MoreVertical color={colors.secondaryText} size={14} strokeWidth={2} />
              </Pressable>
            </View>
            
            {requests.map((request, index) => (
              <Animated.View
                key={request.id}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={styles.requestCard}
              >
                <LinearGradient
                  colors={request.status === 'pending' ? [colors.warning, colors.warning] : 
                         request.status === 'approved' ? [colors.success, colors.success] :
                         [colors.error, colors.error]}
                  style={styles.requestCardGradient}
                />
                
                <View style={styles.requestCardContent}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{request.studentName}</Text>
                      <Text style={styles.requestId}>{request.studentId}</Text>
                    </View>
                    <View style={styles.requestStatusContainer}>
                      <StatusBadge status={request.status} />
                    </View>
                  </View>
                  
                  <View style={styles.requestDetails}>
                    <View style={styles.requestType}>
                      <RequestTypeBadge type={request.type} />
                      <Text style={styles.requestTypeText}>{request.type.charAt(0).toUpperCase() + request.type.slice(1)} Change</Text>
                    </View>
                    
                    <View style={styles.requestChange}>
                      <Text style={styles.requestChangeLabel}>From:</Text>
                      <Text style={styles.requestChangeText}>{request.currentValue}</Text>
                    </View>
                    
                    <View style={styles.requestChange}>
                      <Text style={styles.requestChangeLabel}>To:</Text>
                      <Text style={styles.requestChangeText}>{request.newValue}</Text>
                    </View>
                    
                    <View style={styles.requestCost}>
                      <Coins color={colors.warning} size={12} strokeWidth={2} />
                      <Text style={styles.requestCostText}>{request.cost} coins</Text>
                    </View>
                  </View>
                  
                  <View style={styles.requestMeta}>
                    <Text style={styles.requestTime}>Requested {request.requestedAt}</Text>
                  </View>
                  
                  <View style={styles.requestActions}>
                    <Pressable 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(request.id)}
                    >
                      <CheckCircle color={colors.success} size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: colors.success }]}>Approve</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}
                    >
                      <XCircle color={colors.error} size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: colors.error }]}>Reject</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.detailsButton]}
                      onPress={() => handleViewDetails(request.id)}
                    >
                      <Eye color={colors.info} size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: colors.info }]}>Details</Text>
                    </Pressable>
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