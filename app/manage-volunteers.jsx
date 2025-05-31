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
  HeartHandshake,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
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
  UserPlus,
  UserX,
  Activity,
  BarChart3
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Application Status Badge
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Clock };
      case 'approved':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: CheckCircle };
      case 'rejected':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: XCircle };
      case 'active':
        return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'], icon: UserCheck };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: AlertTriangle };
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

// Event Type Badge
const EventTypeBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    switch (type.toLowerCase()) {
      case 'workshop':
        return { color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'] };
      case 'career':
        return { color: '#10b981', gradient: ['#10b981', '#059669'] };
      case 'coding':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] };
      case 'tech':
        return { color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'] };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'] };
    }
  };

  const config = getTypeConfig(type);

  return (
    <View style={[styles.typeBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
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
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  
  // Applications Section
  applicationsSection: {
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
  
  // Application Cards
  applicationCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  applicationCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  applicationCardContent: {
    padding: 20,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  applicationInfo: {
    flex: 1,
    marginRight: 16,
  },
  applicationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  applicationId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  applicationStatusContainer: {
    alignItems: 'flex-end',
  },
  applicationEventInfo: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventDetailText: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '600',
  },
  applicationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  applicationTime: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  applicationActions: {
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
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

export default function VolunteersManagement() {
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

  const handleApprove = (applicationId) => {
    Alert.alert('Success', `Application ${applicationId} approved!`);
  };

  const handleReject = (applicationId) => {
    Alert.alert('Rejected', `Application ${applicationId} rejected.`);
  };

  const handleViewDetails = (applicationId) => {
    Alert.alert('Details', `Viewing details for application ${applicationId}`);
  };

  // Sample data
  const totalApplications = 47;
  const pendingApplications = 12;
  const approvedToday = 8;
  const activeVolunteers = 35;

  const quickActions = [
    {
      title: 'Review',
      subtitle: 'Applications',
      icon: Eye,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
    },
    {
      title: 'Add Event',
      subtitle: 'Opportunity',
      icon: Plus,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
    },
    {
      title: 'Analytics',
      subtitle: 'Performance',
      icon: BarChart3,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
    },
  ];

  // Sample applications data
  const applications = [
    {
      id: 'VOL-001',
      studentName: 'Amina Benjelloun',
      studentId: '#2024001',
      status: 'pending',
      appliedAt: '2 hours ago',
      eventTitle: 'Tech Career Fair 2024',
      eventType: 'career',
      eventDate: 'Dec 20, 2024',
      eventLocation: 'Campus Auditorium',
      reason: 'Passionate about helping fellow students explore tech careers and opportunities.',
    },
    {
      id: 'VOL-002',
      studentName: 'Youssef Alami',
      studentId: '#2024002',
      status: 'approved',
      appliedAt: '1 day ago',
      eventTitle: 'React Workshop Series',
      eventType: 'workshop',
      eventDate: 'Dec 22, 2024',
      eventLocation: 'Lab 301',
      reason: 'Experienced React developer eager to mentor beginners.',
    },
    {
      id: 'VOL-003',
      studentName: 'Fatima Zahra El Ouali',
      studentId: '#2024003',
      status: 'active',
      appliedAt: '3 days ago',
      eventTitle: 'Coding Bootcamp',
      eventType: 'coding',
      eventDate: 'Dec 18, 2024',
      eventLocation: 'Main Hall',
      reason: 'Love teaching programming fundamentals to new students.',
    },
    {
      id: 'VOL-004',
      studentName: 'Omar Chakir',
      studentId: '#2024004',
      status: 'rejected',
      appliedAt: '5 days ago',
      eventTitle: 'AI/ML Workshop',
      eventType: 'tech',
      eventDate: 'Dec 25, 2024',
      eventLocation: 'Lab 205',
      reason: 'Interested in AI research and sharing knowledge.',
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
              colors={['rgba(239, 68, 68, 0.1)', 'transparent']}
              style={styles.headerBackground}
            />
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Pressable 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft color="#ef4444" size={20} strokeWidth={2} />
                </Pressable>
                
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>Volunteers</Text>
                  <Text style={styles.headerSubtitle}>Manage volunteer applications and opportunities</Text>
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
                colors={['#ef4444', '#dc2626']}
                style={styles.overviewGradient}
              />
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Volunteer Overview</Text>
                <View style={styles.overviewIcon}>
                  <HeartHandshake color="#ef4444" size={24} strokeWidth={2} />
                </View>
              </View>
              
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{totalApplications}</Text>
                  <Text style={styles.statLabel}>Total Applications</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+5 this week</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{pendingApplications}</Text>
                  <Text style={styles.statLabel}>Pending Review</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+3 today</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.statValue}>{activeVolunteers}</Text>
                  <Text style={styles.statLabel}>Active Volunteers</Text>
                  <Text style={[styles.statTrend, styles.trendPositive]}>+12% growth</Text>
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
                placeholder="Search applications..."
                placeholderTextColor="#6b7280"
                value={filterText}
                onChangeText={setFilterText}
              />
              <Pressable style={styles.filterButton}>
                <Filter color="#ef4444" size={16} strokeWidth={2} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Applications */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.applicationsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort by</Text>
                <MoreVertical color="#9ca3af" size={14} strokeWidth={2} />
              </Pressable>
            </View>
            
            {applications.map((application, index) => (
              <Animated.View
                key={application.id}
                entering={FadeInLeft.delay(1400 + index * 100)}
                style={styles.applicationCard}
              >
                <LinearGradient
                  colors={application.status === 'pending' ? ['#f59e0b', '#d97706'] : 
                         application.status === 'approved' ? ['#10b981', '#059669'] :
                         application.status === 'active' ? ['#8b5cf6', '#7c3aed'] :
                         ['#ef4444', '#dc2626']}
                  style={styles.applicationCardGradient}
                />
                
                <View style={styles.applicationCardContent}>
                  <View style={styles.applicationHeader}>
                    <View style={styles.applicationInfo}>
                      <Text style={styles.applicationName}>{application.studentName}</Text>
                      <Text style={styles.applicationId}>{application.studentId}</Text>
                    </View>
                    <View style={styles.applicationStatusContainer}>
                      <StatusBadge status={application.status} />
                    </View>
                  </View>
                  
                  <View style={styles.applicationEventInfo}>
                    <Text style={styles.eventTitle}>{application.eventTitle}</Text>
                    <View style={styles.eventDetails}>
                      <EventTypeBadge type={application.eventType} />
                      <View style={styles.eventDetail}>
                        <Calendar color="#6b7280" size={10} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{application.eventDate}</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <MapPin color="#6b7280" size={10} strokeWidth={2} />
                        <Text style={styles.eventDetailText}>{application.eventLocation}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.applicationMeta}>
                    <Text style={styles.applicationTime}>Applied {application.appliedAt}</Text>
                  </View>
                  
                  <View style={styles.applicationActions}>
                    <Pressable 
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(application.id)}
                    >
                      <CheckCircle color="#10b981" size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Approve</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(application.id)}
                    >
                      <XCircle color="#ef4444" size={14} strokeWidth={2} />
                      <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Reject</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionButton, styles.detailsButton]}
                      onPress={() => handleViewDetails(application.id)}
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