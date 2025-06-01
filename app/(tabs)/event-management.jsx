import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, StatusBar, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SlideInRight
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
  User
} from 'lucide-react-native';
import AdminHeader from '../../components/AdminHeader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
const EventCard = ({ event, index, onPress }) => {
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
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
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
              <CategoryIcon color="#9ca3af" size={16} strokeWidth={2} />
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>

          {/* Title */}
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Key Info */}
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Calendar color="#6b7280" size={14} strokeWidth={2} />
              <Text style={styles.infoText}>
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} • {event.time}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Users color="#6b7280" size={14} strokeWidth={2} />
              <Text style={styles.infoText}>
                {event.registered}/{event.capacity}
              </Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <ChevronRight color="#6b7280" size={16} strokeWidth={2} />
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
      color: '#f59e0b' 
    },
    { 
      label: 'Approved', 
      value: events.filter(e => e.status === 'approved').length, 
      color: '#10b981' 
    },
    { 
      label: 'Total', 
      value: events.length, 
      color: '#3b82f6' 
    },
    { 
      label: 'Active', 
      value: events.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.registered, 0), 
      color: '#8b5cf6' 
    },
  ];

  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <Animated.View
          key={stat.label}
          entering={FadeInUp.delay(200 + index * 100)}
          style={styles.statCard}
        >
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
        </Animated.View>
      ))}
    </View>
  );
};

// Main Component
export default function EventManagement() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Mock event data
  const events = [
    {
      id: 1,
      title: 'Advanced Algorithms & Data Structures Masterclass',
      organizer: 'Prof. Ahmed Benali',
      category: 'Workshop',
      status: 'pending',
      date: '2024-12-30',
      time: '14:00',
      location: 'Innovation Lab - Building A',
      capacity: 50,
      registered: 47,
    },
    {
      id: 2,
      title: 'Tech Giants Career Fair 2025',
      organizer: '1337 Career Services',
      category: 'career',
      status: 'pending',
      date: '2025-01-15',
      time: '09:00',
      location: 'Main Auditorium',
      capacity: 500,
      registered: 489,
    },
    {
      id: 3,
      title: 'React Native Cross-Platform Development',
      organizer: 'Student Innovation Club',
      category: 'coding',
      status: 'approved',
      date: '2025-01-08',
      time: '16:00',
      location: 'Development Hub',
      capacity: 80,
      registered: 71,
    },
    {
      id: 4,
      title: 'Cybersecurity & Ethical Hacking Workshop',
      organizer: '1337 Security Team',
      category: 'workshop',
      status: 'approved',
      date: '2025-01-12',
      time: '10:00',
      location: 'Security Lab',
      capacity: 40,
      registered: 38,
    },
    {
      id: 5,
      title: 'AI/ML Research Symposium',
      organizer: '1337 Research Department',
      category: 'workshop',
      status: 'rejected',
      date: '2025-01-25',
      time: '13:30',
      location: 'Research Center',
      capacity: 60,
      registered: 23,
    },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEventPress = (event) => {
    router.push(`/event-details?id=${event.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SimpleBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <AdminHeader />

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
          <Animated.View entering={FadeInUp.delay(400)} style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search color="#6b7280" size={20} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter color="#6b7280" size={18} strokeWidth={2} />
              </Pressable>
            </View>

            {showFilters && (
              <Animated.View 
                entering={FadeInDown.duration(200)}
                style={styles.filterRow}
              >
                {['all', 'pending', 'approved', 'rejected'].map((filter) => (
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
                <Plus color="#3b82f6" size={16} strokeWidth={2} />
                <Text style={styles.addButtonText}>New</Text>
              </Pressable>
            </View>

            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onPress={handleEventPress}
              />
            ))}

            {filteredEvents.length === 0 && (
              <View style={styles.emptyState}>
                <Calendar color="#6b7280" size={48} strokeWidth={1.5} />
                <Text style={styles.emptyStateTitle}>No Events Found</Text>
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
    backgroundColor: '#0a0a0a',
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
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  subtleOrb2: {
    position: 'absolute',
    bottom: screenHeight * 0.3,
    left: -screenWidth * 0.2,
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    borderRadius: screenWidth * 0.3,
    backgroundColor: 'rgba(139, 92, 246, 0.015)',
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
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    minHeight: 70,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
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
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
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
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#3b82f6',
  },

  // Events Section
  eventsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
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
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  addButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },

  // Clean Event Cards
  eventCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.4)',
  },
  eventCardPressable: {
    position: 'relative',
  },
  statusLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  eventCardContent: {
    padding: 16,
    paddingLeft: 20,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 22,
    paddingRight: 32,
  },
  eventInfo: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#d1d5db',
    fontWeight: '500',
  },
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
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },

  bottomSpacer: {
    height: 40,
  },
}); 