import { View, Text, ScrollView, Pressable, TextInput, Dimensions, StatusBar, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Coins,
  ChevronRight,
  Code,
  Briefcase,
  Coffee,
  Trophy,
  BookOpen,
  Heart,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  UserPlus,
  TrendingUp,
  Settings,
  Bell,
  MoreHorizontal,
  Plus
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Discover</Text>
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton} onPress={() => router.push('/create-event')}>
            <Plus color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
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

// Search and Filter Section
const SearchFilterSection = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#9ca3af" size={18} strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Filter color="#9ca3af" size={18} strokeWidth={1.5} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.categoriesSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => onSelect(category.id)}
          >
            <View style={styles.categoryIconContainer}>
              <View style={[styles.categoryIconBackdrop, { backgroundColor: category.color + '10' }]} />
              <category.icon 
                color={selectedCategory === category.id ? '#ffffff' : category.color} 
                size={16} 
                strokeWidth={2} 
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryBadgeText}>{category.count}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'registered':
        return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle, text: 'Enrolled' };
      case 'available':
        return { color: '#2563eb', bg: '#eff6ff', icon: Clock, text: 'Available' };
      case 'full':
        return { color: '#dc2626', bg: '#fef2f2', icon: XCircle, text: 'Full' };
      case 'upcoming':
        return { color: '#d97706', bg: '#fef3c7', icon: AlertCircle, text: 'Upcoming' };
      default:
        return { color: '#6b7280', bg: '#f9fafb', icon: Eye, text: 'View' };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
      <StatusIcon color={statusConfig.color} size={12} strokeWidth={1.5} />
      <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
        {statusConfig.text}
      </Text>
    </View>
  );
};

// Professional Event Card Component
const EventCard = ({ event, index, onPress }) => {
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'registered':
        return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle, text: 'Enrolled' };
      case 'available':
        return { color: '#2563eb', bg: '#eff6ff', icon: Clock, text: 'Available' };
      case 'full':
        return { color: '#dc2626', bg: '#fef2f2', icon: XCircle, text: 'Full' };
      case 'upcoming':
        return { color: '#d97706', bg: '#fef3c7', icon: AlertCircle, text: 'Upcoming' };
      default:
        return { color: '#6b7280', bg: '#f9fafb', icon: Eye, text: 'View' };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Animated.View style={[styles.eventCard, cardStyle]}>
      <Pressable style={styles.eventCardContent} onPress={() => onPress(event)}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent', 'rgba(0, 0, 0, 0.1)']}
          style={styles.cardGradientOverlay}
          locations={[0, 0.5, 1]}
        />
        
        <View style={styles.eventHeader}>
          <View style={styles.eventMeta}>
            <Text style={styles.eventCategory}>{event.category}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
          <StatusBadge status={event.status} />
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Clock color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <MapPin color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Users color="#9ca3af" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.registered}/{event.capacity}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventCredits}>
            <Text style={styles.creditsText}>{event.credits} Credits</Text>
          </View>
          <ChevronRight color="#9ca3af" size={16} strokeWidth={1.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Featured Event Component
const FeaturedEvent = ({ event, onPress }) => {
  return (
    <Animated.View entering={FadeInUp.delay(600)} style={styles.featuredSection}>
      <Text style={styles.sectionTitle}>Featured Event</Text>
      <View style={styles.featuredCard}>
        <Pressable style={styles.featuredCardContent} onPress={() => onPress(event)}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'transparent']}
            style={styles.featuredGradient}
          />
          
          <View style={styles.featuredHeader}>
            <View style={styles.featuredBadge}>
              <Star color="#f59e0b" size={14} strokeWidth={1.5} />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            <Text style={styles.featuredCredits}>{event.credits} Credits</Text>
          </View>

          <Text style={styles.featuredTitle}>{event.title}</Text>
          <Text style={styles.featuredDescription}>{event.description}</Text>

          <View style={styles.featuredDetails}>
            <View style={styles.featuredDetailItem}>
              <Calendar color="#6366f1" size={16} strokeWidth={1.5} />
              <Text style={styles.featuredDetailText}>{event.date} • {event.time}</Text>
            </View>
            <View style={styles.featuredDetailItem}>
              <MapPin color="#6366f1" size={16} strokeWidth={1.5} />
              <Text style={styles.featuredDetailText}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.featuredFooter}>
            <View style={styles.featuredProgress}>
              <View style={styles.featuredProgressBar}>
                <View style={[styles.featuredProgressFill, { width: `${event.attendance}%` }]} />
              </View>
              <Text style={styles.featuredProgressText}>{event.registered}/{event.capacity} registered</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default function EventsDiscovery() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const categories = [
    { id: 'all', name: 'All', icon: Target, color: '#6b7280', count: 24 },
    { id: 'programming', name: 'Programming', icon: Code, color: '#3b82f6', count: 12 },
    { id: 'design', name: 'Design', icon: Heart, color: '#ec4899', count: 8 },
    { id: 'workshop', name: 'Workshop', icon: Coffee, color: '#f59e0b', count: 6 },
    { id: 'networking', name: 'Networking', icon: Users, color: '#10b981', count: 4 },
  ];

  const featuredEvent = {
    id: 'featured',
    title: 'Advanced React Native Workshop',
    description: 'Master the latest React Native features with hands-on coding sessions and real-world projects.',
    category: 'Programming',
    date: 'Tomorrow',
    time: '2:00 PM - 6:00 PM',
    location: 'Innovation Lab',
    registered: 34,
    capacity: 40,
    attendance: 85,
    credits: 50,
    status: 'available'
  };

  const events = [
    {
      id: 1,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and experience design.',
      category: 'Design',
      date: 'Today',
      time: '3:00 PM - 5:00 PM',
      location: 'Design Studio',
      registered: 18,
      capacity: 25,
      credits: 30,
      status: 'available'
    },
    {
      id: 2,
      title: 'Machine Learning Bootcamp',
      description: 'Intensive introduction to ML algorithms and implementation.',
      category: 'Programming',
      date: 'Jan 15',
      time: '9:00 AM - 5:00 PM',
      location: 'Tech Lab',
      registered: 40,
      capacity: 40,
      credits: 75,
      status: 'full'
    },
    {
      id: 3,
      title: 'Startup Pitch Competition',
      description: 'Present your startup ideas to industry experts.',
      category: 'Networking',
      date: 'Jan 18',
      time: '6:00 PM - 9:00 PM',
      location: 'Main Auditorium',
      registered: 15,
      capacity: 50,
      credits: 25,
      status: 'registered'
    },
  ];

  const handleEventPress = (event) => {
    console.log('Event pressed:', event.title);
    // router.push(`/event-details?id=${event.id}`);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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
          <SearchFilterSection 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />

          <FeaturedEvent 
            event={featuredEvent}
            onPress={handleEventPress}
          />

          <Animated.View entering={FadeInUp.delay(800)} style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Events</Text>
              <Text style={styles.sectionSubtitle}>{events.length} events available</Text>
            </View>

            <View style={styles.eventsContainer}>
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onPress={handleEventPress}
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

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories Section
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    minWidth: 120,
  },
  categoryButtonActive: {
    backgroundColor: '#1a2332',
    borderColor: '#334155',
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryIconBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    opacity: 0.6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    flex: 1,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Featured Section
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  featuredCardContent: {
    padding: 24,
    position: 'relative',
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  featuredCredits: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuredDetails: {
    gap: 12,
    marginBottom: 20,
  },
  featuredDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredDetailText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  featuredFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a2332',
  },
  featuredProgress: {
    gap: 8,
  },
  featuredProgressBar: {
    height: 6,
    backgroundColor: '#0f1419',
    borderRadius: 3,
    overflow: 'hidden',
  },
  featuredProgressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  featuredProgressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Events Section
  eventsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
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
  eventCardContent: {
    padding: 20,
    position: 'relative',
  },
  cardGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventMeta: {
    flex: 1,
  },
  eventCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  eventDetailText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textAlign: 'center',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a2332',
  },
  eventCredits: {
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
  creditsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 0.5,
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },
}); 