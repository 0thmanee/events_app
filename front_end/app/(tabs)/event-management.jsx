import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Eye,
  ChevronRight,
  Code,
  Briefcase,
  BookOpen,
  Heart,
  Award,
  User,
  AlertTriangle,
  RefreshCw,
  Edit3,
  Trash2
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
  muted: '#9ca3af'           // Muted text
};

// Simple Background - minimal distraction
const SimpleBackground = () => {
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.subtleOrb1} />
      <View style={styles.subtleOrb2} />
    </View>
  );
};

// Clean Simple Event Card
const EventCard = ({ event, index, onPress, onApprove, onReject, onEdit, onDelete }) => {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 400, delay: index * 100 });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      case 'completed': return colors.info;
      case 'cancelled': return colors.muted;
      default: return colors.muted;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'workshop': return Code;
      case 'career': return Briefcase;
      case 'coding': return Code;
      case 'social': return Heart;
      case 'competition': return Award;
      default: return BookOpen;
    }
  };

  const statusColor = getStatusColor(event.status);
  const CategoryIcon = getCategoryIcon(event.category);

  const handleApprove = (e) => {
    e.stopPropagation();
    Alert.alert(
      'Approve Event',
      `Are you sure you want to approve "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', style: 'default', onPress: () => onApprove(event.id) }
      ]
    );
  };

  const handleReject = (e) => {
    e.stopPropagation();
    Alert.alert(
      'Reject Event',
      `Are you sure you want to reject "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => onReject(event.id) }
      ]
    );
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(event.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(event.id) }
      ]
    );
  };

  return (
    <Animated.View style={[styles.eventCard, cardStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(event)}
        style={styles.eventCardPressable}
      >
        {/* Status indicator line */}
        <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
        
        <View style={styles.eventCardContent}>
          {/* Header */}
          <View style={styles.eventCardHeader}>
            <View style={styles.categoryContainer}>
              <CategoryIcon color={colors.muted} size={16} strokeWidth={2} />
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Organizer */}
          <View style={styles.organizerRow}>
            <User color={colors.muted} size={14} strokeWidth={2} />
            <Text style={styles.organizerText}>by {event.organizer}</Text>
          </View>

          {/* Key Info */}
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Calendar color={colors.muted} size={14} strokeWidth={2} />
              <Text style={styles.infoText}>
                {event.date} • {event.time}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Users color={colors.muted} size={14} strokeWidth={2} />
              <Text style={styles.infoText}>
                {event.registered}/{event.capacity}
              </Text>
            </View>
          </View>

          {/* Action Buttons for Pending Events */}
          {event.status === 'pending' && (
            <View style={styles.actionButtons}>
              <Pressable style={styles.approveButton} onPress={handleApprove}>
                <CheckCircle color={colors.white} size={16} strokeWidth={2} />
                <Text style={styles.approveButtonText}>Approve</Text>
              </Pressable>
              <Pressable style={styles.rejectButton} onPress={handleReject}>
                <XCircle color={colors.white} size={16} strokeWidth={2} />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </Pressable>
            </View>
          )}

          {/* Edit & Delete buttons for approved/completed events */}
          {(event.status === 'approved' || event.status === 'completed') && (
            <View style={styles.actionButtons}>
              <Pressable style={styles.editButton} onPress={handleEdit}>
                <Edit3 color={colors.white} size={16} strokeWidth={2} />
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Trash2 color={colors.white} size={16} strokeWidth={2} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          )}

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <ChevronRight color={colors.muted} size={16} strokeWidth={2} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Simplified Stats
const QuickStats = ({ events }) => {
  const stats = [
    { 
      label: 'Pending', 
      value: events.filter(e => e.status === 'pending').length, 
      color: colors.warning
    },
    { 
      label: 'Approved', 
      value: events.filter(e => e.status === 'approved').length, 
      color: colors.success
    },
    { 
      label: 'Total', 
      value: events.length, 
      color: colors.info
    },
    { 
      label: 'Active', 
      value: events.filter(e => e.status === 'approved' || e.status === 'ongoing').length, 
      color: colors.accent
    },
  ];

  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <Animated.View 
          key={stat.label}
          style={styles.statCard}
        >
          <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default function EventManagement() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setError(null);
      const filters = selectedFilter !== 'all' ? { status: selectedFilter } : {};
      const backendEvents = await ApiService.getAdminEvents(filters);
      
      // Transform backend data to frontend format
      const transformedEvents = backendEvents.map(event => ApiService.transformEventForAdmin(event));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setLoading(true);
    // Reload events with new filter
    setTimeout(() => loadEvents(), 100);
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await ApiService.approveEvent(eventId);
      Alert.alert('Success', 'Event approved successfully!');
      await loadEvents(); // Reload events
    } catch (error) {
      console.error('Failed to approve event:', error);
      Alert.alert('Error', `Failed to approve event: ${error.message}`);
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await ApiService.rejectEvent(eventId);
      Alert.alert('Success', 'Event rejected successfully!');
      await loadEvents(); // Reload events
    } catch (error) {
      console.error('Failed to reject event:', error);
      Alert.alert('Error', `Failed to reject event: ${error.message}`);
    }
  };

  const handleEditEvent = (eventId) => {
    router.push(`/edit-event?id=${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await ApiService.deleteEvent(eventId);
      Alert.alert('Success', 'Event deleted successfully!');
      await loadEvents(); // Reload events
    } catch (error) {
      console.error('Failed to delete event:', error);
      Alert.alert('Error', `Failed to delete event: ${error.message}`);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEventPress = (event) => {
    router.push(`/event-details?id=${event.id}`);
  };

  // Show loading state
  if (loading && events.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SimpleBackground />
        <SafeAreaView style={styles.safeArea}>
          <AdminHeader title="Event Management" subtitle="Approve and manage events" />
        </SafeAreaView>
      </View>
    );
  }

  // Show error state
  if (error && events.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SimpleBackground />
        <SafeAreaView style={styles.safeArea}>
          <AdminHeader title="Event Management" subtitle="Approve and manage events" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SimpleBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <AdminHeader title="Event Management" subtitle="Approve and manage events" />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <QuickStats events={events} />

          {/* Search */}
          <Animated.View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search color={colors.muted} size={20} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter color={colors.muted} size={18} strokeWidth={2} />
              </Pressable>
            </View>

            {showFilters && (
              <Animated.View style={styles.filterRow}>
                {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange(filter)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive
                    ]}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </Animated.View>
            )}
          </Animated.View>

          {/* Events List */}
          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Events ({filteredEvents.length})
              </Text>
              <Pressable style={styles.addButton} onPress={() => router.push('/create-event')}>
                <Plus color={colors.info} size={16} strokeWidth={2} />
                <Text style={styles.addButtonText}>New</Text>
              </Pressable>
            </View>

            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onPress={handleEventPress}
                onApprove={handleApproveEvent}
                onReject={handleRejectEvent}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}

            {filteredEvents.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Calendar color={colors.muted} size={48} strokeWidth={1.5} />
                <Text style={styles.emptyStateTitle}>No Events Found</Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery ? 'Try adjusting your search criteria' : 'No events match the selected filter'}
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
  
  // Simple Background
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  subtleOrb1: {
    position: 'absolute',
    top: screenHeight * 0.15,
    right: -screenWidth * 0.3,
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: screenWidth * 0.4,
    backgroundColor: colors.lightAccent,
  },
  subtleOrb2: {
    position: 'absolute',
    bottom: screenHeight * 0.3,
    left: -screenWidth * 0.2,
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    borderRadius: screenWidth * 0.3,
    backgroundColor: colors.lightHighlight,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // Simplified Stats
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
    position: 'relative',
    minHeight: 70,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
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
  statIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  // Search
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
    fontWeight: '500',
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
  },

  // Filter Row
  filterRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  // Events Section
  eventsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },

  // Event Card
  eventCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  eventCardPressable: {
    flex: 1,
  },
  statusLine: {
    height: 4,
  },
  eventCardContent: {
    padding: 20,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 8,
    lineHeight: 24,
  },

  // Organizer Row
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  organizerText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },

  // Event Info
  eventInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  approveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },

  // Arrow Container
  arrowContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
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
}); 