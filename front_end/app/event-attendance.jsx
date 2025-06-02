import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeInRight,
  SlideInRight
} from 'react-native-reanimated';
import { useState as useStateAsync, useEffect as useEffectAsync } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  QrCode,
  Download,
  Share2,
  MoreVertical,
  UserCheck,
  UserX,
  AlertTriangle,
  Calendar,
  MapPin,
  Trophy,
  Star
} from 'lucide-react-native';
import ApiService from '../services/ApiService';
import { ProfessionalBackground, DataLoadingOverlay, IconLoadingState } from '../components/LoadingComponents';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color Palette - Minimalist Luxe Light Theme
const colors = {
  primaryBg: '#F5F5F5',
  secondaryBg: '#EAEAEA',
  primaryText: '#333333',
  secondaryText: '#555555',
  accent: '#3EB489',
  white: '#FFFFFF',
  cardBorder: '#E0E0E0',
  success: '#059669',
  warning: '#d97706',
  error: '#D9534F',
  info: '#2563eb',
  muted: '#9ca3af',
  shadow: '#00000015',
};

// Attendance Stats Card
const AttendanceStatsCard = ({ attendees }) => {
  const totalRegistered = attendees.length;
  const checkedIn = attendees.filter(a => a.checkedIn).length;
  const noShows = totalRegistered - checkedIn;
  const attendanceRate = totalRegistered > 0 ? Math.round((checkedIn / totalRegistered) * 100) : 0;

  const stats = [
    { 
      label: 'Registered', 
      value: totalRegistered, 
      color: colors.info,
      icon: Users
    },
    { 
      label: 'Checked In', 
      value: checkedIn, 
      color: colors.success,
      icon: UserCheck
    },
    { 
      label: 'No Shows', 
      value: noShows, 
      color: colors.warning,
      icon: UserX
    },
    { 
      label: 'Attendance', 
      value: `${attendanceRate}%`, 
      color: colors.accent,
      icon: Trophy
    },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.statsCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.statsGradient}
      />
      <Text style={styles.statsTitle}>Attendance Overview</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Animated.View 
              key={stat.label} 
              entering={FadeInUp.delay(600 + index * 100)}
              style={styles.statItem}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <StatIcon color={stat.color} size={20} strokeWidth={1.5} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

// Search and Filter Bar
const SearchFilterBar = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) => {
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Checked In', value: 'checked_in' },
    { label: 'Not Checked In', value: 'not_checked_in' },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(600)} style={styles.searchFilterContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color={colors.muted} size={20} strokeWidth={1.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search attendees..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersContainer}>
          {filterOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.filterButton,
                filterStatus === option.value && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus(option.value)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === option.value && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

// Attendee Card Component
const AttendeeCard = ({ attendee, index, onCheckIn }) => {
  const getStatusConfig = () => {
    if (attendee.checkedIn) {
      return {
        color: colors.success,
        icon: CheckCircle,
        text: 'Checked In',
        time: attendee.checkInTime ? new Date(attendee.checkInTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }) : ''
      };
    } else {
      return {
        color: colors.warning,
        icon: Clock,
        text: 'Not Checked In',
        time: ''
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Animated.View 
      entering={SlideInRight.delay(800 + index * 50)}
      style={styles.attendeeCard}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.attendeeGradient}
      />
      
      <View style={styles.attendeeMain}>
        {/* Avatar */}
        <View style={styles.attendeeAvatar}>
          <Text style={styles.attendeeAvatarText}>
            {(attendee.name || attendee.nickname || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.attendeeInfo}>
          <Text style={styles.attendeeName}>{attendee.name || attendee.nickname || 'Unknown'}</Text>
          <Text style={styles.attendeeLogin}>{attendee.login || attendee.intraUsername || 'unknown'}</Text>
          {attendee.email && (
            <Text style={styles.attendeeEmail}>{attendee.email}</Text>
          )}
        </View>

        {/* Status */}
        <View style={styles.attendeeStatus}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <StatusIcon color={statusConfig.color} size={16} strokeWidth={1.5} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
          {statusConfig.time && (
            <Text style={styles.checkInTime}>{statusConfig.time}</Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.attendeeActions}>
        {!attendee.checkedIn && (
          <Pressable 
            style={styles.checkInButton}
            onPress={() => onCheckIn(attendee)}
          >
            <UserCheck color={colors.white} size={16} strokeWidth={1.5} />
            <Text style={styles.checkInButtonText}>Check In</Text>
          </Pressable>
        )}
        
        <Pressable style={styles.moreButton}>
          <MoreVertical color={colors.muted} size={16} strokeWidth={1.5} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

// Main Component
export default function EventAttendance() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (eventId) {
      loadAttendanceData();
    }
  }, [eventId]);

  const loadAttendanceData = async () => {
    try {
      setError(null);
      const [eventData, attendanceData] = await Promise.all([
        ApiService.getEventById(eventId),
        ApiService.getEventAttendance(eventId)
      ]);
      
      setEvent(eventData);
      setAttendees(attendanceData.attendees || []);
    } catch (err) {
      console.error('Failed to load attendance data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceData();
    setRefreshing(false);
  };

  const handleCheckIn = async (attendee) => {
    try {
      // For manual check-in, we'll create a mock QR data
      const mockQRData = JSON.stringify({
        userId: attendee.userId || attendee._id,
        eventId: eventId,
        timestamp: Date.now(),
        manualCheckIn: true
      });

      await ApiService.checkInStudentByQR(eventId, mockQRData);
      
      // Update local state
      setAttendees(prev => prev.map(a => 
        a._id === attendee._id 
          ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() }
          : a
      ));

      Alert.alert('Success', `${attendee.name || attendee.nickname} has been checked in manually.`);
    } catch (error) {
      console.error('Manual check-in failed:', error);
      Alert.alert('Error', 'Failed to check in attendee manually.');
    }
  };

  // Filter attendees based on search and status
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = !searchQuery || 
      (attendee.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attendee.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attendee.login || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attendee.intraUsername || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'checked_in' && attendee.checkedIn) ||
      (filterStatus === 'not_checked_in' && !attendee.checkedIn);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Attendance"
          subMessage="Fetching attendee data and check-in status"
          icon={Users}
        />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={AlertTriangle}
          message="Failed to Load Attendance"
          subMessage={error || "Unable to load attendance data for this event."}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Event Attendance</Text>
              <Text style={styles.headerSubtitle}>{event.title}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton}>
                <Download color={colors.secondaryText} size={20} strokeWidth={1.5} />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Share2 color={colors.secondaryText} size={20} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.muted}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Event Info */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.eventInfoCard}>
            <View style={styles.eventInfoHeader}>
              <Calendar color={colors.info} size={18} strokeWidth={1.5} />
              <Text style={styles.eventInfoDate}>
                {new Date(event.time).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Clock color={colors.muted} size={16} strokeWidth={1.5} />
              <Text style={styles.eventInfoText}>
                {new Date(event.time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </Text>
            </View>
            <View style={styles.eventInfoRow}>
              <MapPin color={colors.muted} size={16} strokeWidth={1.5} />
              <Text style={styles.eventInfoText}>{event.location}</Text>
            </View>
          </Animated.View>

          {/* Attendance Stats */}
          <AttendanceStatsCard attendees={attendees} />

          {/* Search and Filters */}
          <SearchFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Attendees List */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.attendeesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Attendees ({filteredAttendees.length})
              </Text>
              {filteredAttendees.length > 0 && (
                <Pressable style={styles.selectAllButton}>
                  <Text style={styles.selectAllText}>Select All</Text>
                </Pressable>
              )}
            </View>

            {filteredAttendees.length === 0 ? (
              <View style={styles.emptyState}>
                <Users color={colors.muted} size={48} strokeWidth={1} />
                <Text style={styles.emptyStateTitle}>
                  {searchQuery || filterStatus !== 'all' ? 'No attendees match your criteria' : 'No attendees registered'}
                </Text>
                <Text style={styles.emptyStateMessage}>
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter settings'
                    : 'Attendees will appear here once they register for the event'
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.attendeesList}>
                {filteredAttendees.map((attendee, index) => (
                  <AttendeeCard
                    key={attendee._id || index}
                    attendee={attendee}
                    index={index}
                    onCheckIn={handleCheckIn}
                  />
                ))}
              </View>
            )}
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

  // Header
  header: {
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
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
    paddingBottom: 100,
  },

  // Event Info Card
  eventInfoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  eventInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventInfoDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginLeft: 8,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventInfoText: {
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: 8,
  },

  // Stats Card
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  statsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Search and Filter
  searchFilterContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryText,
    marginLeft: 12,
  },
  filtersScroll: {
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  filterButtonTextActive: {
    color: colors.white,
  },

  // Attendees Section
  attendeesSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.accent + '20',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },

  // Attendee Card
  attendeesList: {
    gap: 12,
  },
  attendeeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  attendeeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  attendeeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent + '20',
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendeeAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 2,
  },
  attendeeLogin: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 2,
  },
  attendeeEmail: {
    fontSize: 12,
    color: colors.muted,
  },
  attendeeStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkInTime: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
  },

  // Actions
  attendeeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 40,
  },
}); 