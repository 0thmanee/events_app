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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Request Status Badge
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Clock };
      case 'approved':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: CheckCircle };
      case 'rejected':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: XCircle };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Clock };
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
        return { color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'], icon: User };
      case 'avatar':
        return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], icon: ImageIcon };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: Edit };
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#f59e0b',
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
  
  // Overview Section
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
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: '#f59e0b',
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#f59e0b',
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
  
  // Request Cards
  requestCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  requestId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  requestStatusContainer: {
    alignItems: 'flex-end',
  },
  requestDetails: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
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
    color: '#ffffff',
    marginLeft: 8,
  },
  requestChange: {
    marginBottom: 8,
  },
  requestChangeLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
  },
  requestChangeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  requestCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  requestCostText: {
    fontSize: 12,
    color: '#f59e0b',
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
    color: '#6b7280',
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  detailsButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
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
    StatusBar.setBarStyle('light-content');
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
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      title: 'Analytics',
      subtitle: 'Insights',
      icon: BarChart3,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      title: 'Settings',
      subtitle: 'Configure',
      icon: Settings,
      color: '#6b7280',
      gradient: ['#6b7280', '#4b5563'],
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
              colors={['rgba(245, 158, 11, 0.1)', 'transparent']}
              style={styles.headerBackground}
            />
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Pressable 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft color="#f59e0b" size={20} strokeWidth={2} />
                </Pressable>
                
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>Shop Requests</Text>
                  <Text style={styles.headerSubtitle}>Manage profile customization requests</Text>
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

          {/* Overview */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.overviewSection}>
            <View style={styles.overviewCard}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.overviewGradient}
              />
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Shop Overview</Text>
                <View style={styles.overviewIcon}>
                  <ShoppingBag color="#f59e0b" size={24} strokeWidth={2} />
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
              <Search color="#6b7280" size={18} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search requests..."
                placeholderTextColor="#6b7280"
                value={filterText}
                onChangeText={setFilterText}
              />
              <Pressable style={styles.filterButton}>
                <Filter color="#f59e0b" size={16} strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Requests */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.requestsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort by</Text>
                <MoreVertical color="#9ca3af" size={14} strokeWidth={2} />
              </Pressable>
            </View>
            
            {requests.map((request, index) => (
              <Animated.View
                key={request.id}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={styles.requestCard}
              >
                <LinearGradient
                  colors={request.status === 'pending' ? ['#f59e0b', '#d97706'] : 
                         request.status === 'approved' ? ['#10b981', '#059669'] :
                         ['#ef4444', '#dc2626']}
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
                      <Coins color="#f59e0b" size={12} strokeWidth={2} />
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
                      <CheckCircle color="#10b981" size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Approve</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}
                    >
                      <XCircle color="#ef4444" size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Reject</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.detailsButton]}
                      onPress={() => handleViewDetails(request.id)}
                    >
                      <Eye color="#3b82f6" size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: '#3b82f6' }]}>Details</Text>
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