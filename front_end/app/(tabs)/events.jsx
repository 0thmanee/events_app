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
import ApiService from '../../services/ApiService';
import { 
  ProfessionalBackground, 
  EventCardSkeleton, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../../components/LoadingComponents';
import usePageTransition from '../../hooks/usePageTransition';

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

// Student Header Component
const StudentHeader = () => {
  const router = useRouter();

  return (
    <View style={[styles.studentHeader, { backgroundColor: colors.white }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerGreeting, { color: colors.secondaryText }]}>Discover</Text>
          <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Events</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={[styles.headerButton, { backgroundColor: colors.secondaryBg }]} onPress={() => router.push('/create-event')}>
            <Plus color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
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

// Search and Filter Section
const SearchFilterSection = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, {
          backgroundColor: colors.white,
          borderColor: colors.cardBorder
        }]}>
          <Search color={colors.secondaryText} size={18} strokeWidth={1.5} />
          <TextInput
            style={[styles.searchInput, { color: colors.primaryText }]}
            placeholder="Search events..."
            placeholderTextColor={colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={[styles.filterButton, {
          backgroundColor: colors.white,
          borderColor: colors.cardBorder
        }]}>
          <Filter color={colors.secondaryText} size={18} strokeWidth={1.5} />
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
                color={selectedCategory === category.id ? colors.white : category.color} 
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

// Professional Event Card Component (same as dashboard)
const ProfessionalEventCard = ({ event, index, onPress }) => {
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
        return { color: colors.success, bg: '#ecfdf5', icon: CheckCircle, text: 'Registered', border: colors.success };
      case 'available':
        return { color: colors.info, bg: '#eff6ff', icon: Clock, text: 'Available', border: colors.info };
      case 'waitlist':
        return { color: colors.warning, bg: '#fef3c7', icon: AlertCircle, text: 'Waitlist', border: colors.warning };
      case 'full':
        return { color: colors.error, bg: '#fef2f2', icon: XCircle, text: 'Full', border: colors.error };
      case 'ended':
        return { color: colors.muted, bg: '#f9fafb', icon: Clock, text: 'Ended', border: colors.muted };
      default:
        return { color: colors.muted, bg: '#f9fafb', icon: Eye, text: 'Unknown', border: colors.muted };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  // Add a subtle border color for registered events
  const cardBorderStyle = event.status === 'enrolled' ? {
    borderLeftWidth: 3,
    borderLeftColor: '#059669'
  } : {};

  return (
    <Animated.View style={[styles.eventCard, cardStyle, cardBorderStyle]}>
      <Pressable style={styles.eventCardContent} onPress={() => onPress(event)}>
        <View style={styles.eventHeader}>
          <View style={styles.eventMeta}>
            <Text style={styles.eventCategory}>{event.category}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
          <View style={[styles.eventStatus, { 
            backgroundColor: statusConfig.bg,
            borderColor: statusConfig.border,
            borderWidth: 1
          }]}>
            <StatusIcon color={statusConfig.color} size={12} strokeWidth={1.5} />
            <Text style={[styles.eventStatusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Clock color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <MapPin color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Users color={colors.muted} size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.enrolled}/{event.capacity}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventCredits}>
            <Text style={styles.creditsText}>{event.credits} Credits</Text>
          </View>
          <View style={styles.registrationIndicator}>
            {event.status === 'enrolled' && (
              <Text style={styles.registrationText}>✓ Registered</Text>
            )}
            <ChevronRight color={colors.muted} size={16} strokeWidth={1.5} />
          </View>
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
              <Star color={colors.warning} size={14} strokeWidth={1.5} />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            <Text style={styles.featuredCredits}>{event.credits} Credits</Text>
          </View>

          <Text style={styles.featuredTitle}>{event.title}</Text>
          <Text style={styles.featuredDescription}>{event.description}</Text>

          <View style={styles.featuredDetails}>
            <View style={styles.featuredDetailItem}>
              <Calendar color={colors.info} size={16} strokeWidth={1.5} />
              <Text style={styles.featuredDetailText}>{event.date} • {event.time}</Text>
            </View>
            <View style={styles.featuredDetailItem}>
              <MapPin color={colors.info} size={16} strokeWidth={1.5} />
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { isNavigating, navigationMessage, navigateWithTransition } = usePageTransition();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadEvents();
  }, [selectedCategory]);

  const loadEvents = async () => {
    try {
      setError(null);
      const filters = {};
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      
      // Get user profile and events data in parallel
      const [eventsData, userProfile] = await Promise.all([
        ApiService.getEvents(filters),
        ApiService.getUserProfile()
      ]);
      
      console.log('User Profile ID:', userProfile._id || userProfile.id);
      console.log('Events Data Count:', eventsData.length);
      
      const transformedEvents = eventsData.map(event => {
        console.log(`Event: ${event.title}, Attendees:`, event.attendees?.map(a => a.user?._id || a.user?.id || a.user));
        return ApiService.transformEventDataWithUserStatus(event, userProfile);
      });
      
      console.log('Transformed Events Status:', transformedEvents.map(e => ({ title: e.title, status: e.status })));
      
      setEvents(transformedEvents);
      
      // Set featured event (first upcoming event with high capacity)
      const featured = transformedEvents.find(event => 
        event.status === 'available' && event.capacity >= 30
      ) || transformedEvents[0];
      
      if (featured) {
        setFeaturedEvent({
          ...featured,
          attendance: Math.round((featured.enrolled / featured.capacity) * 100)
        });
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Show loading state
  if (loading && events.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Events"
          subMessage="Discovering amazing opportunities for you"
          icon={Calendar}
        />
      </View>
    );
  }

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'all', name: 'All', icon: Target, color: '#6b7280', count: events.length },
    { id: 'workshop', name: 'Workshop', icon: Code, color: '#3b82f6', count: events.filter(e => e.category === 'workshop').length },
    { id: 'talk', name: 'Talk', icon: Heart, color: '#ec4899', count: events.filter(e => e.category === 'talk').length },
    { id: 'social', name: 'Social', icon: Users, color: '#10b981', count: events.filter(e => e.category === 'social').length },
  ];

  const handleEventPress = (event) => {
    console.log('Event pressed:', event.title);
    router.push(`/event-details?id=${event.id}`);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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

          {featuredEvent && (
            <FeaturedEvent 
              event={featuredEvent}
              onPress={handleEventPress}
            />
          )}

          <Animated.View entering={FadeInUp.delay(800)} style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Events</Text>
              <Text style={styles.sectionSubtitle}>{filteredEvents.length} events available</Text>
            </View>

            <View style={styles.eventsContainer}>
              {filteredEvents.map((event, index) => (
                <ProfessionalEventCard
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
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    minWidth: 120,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.secondaryBg,
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
    color: colors.secondaryText,
    flex: 1,
  },
  categoryTextActive: {
    color: colors.white,
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
    color: colors.white,
  },

  // Featured Section
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: colors.white,
    marginTop: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
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
    borderColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
  },
  featuredCredits: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredDescription: {
    fontSize: 14,
    color: colors.secondaryText,
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
    color: colors.primaryText,
    fontWeight: '500',
  },
  featuredFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  featuredProgress: {
    gap: 8,
  },
  featuredProgressBar: {
    height: 6,
    backgroundColor: colors.secondaryBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  featuredProgressFill: {
    height: '100%',
    backgroundColor: colors.info,
    borderRadius: 3,
  },
  featuredProgressText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  // Events
  eventsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginTop: 4,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  eventCardContent: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
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
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  eventStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 6,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.secondaryText,
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
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  eventCredits: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.5,
    backgroundColor: 'inherit'
  },
  registrationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registrationText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
    letterSpacing: 0.3,
  },

  bottomSpacer: {
    height: 40,
  },

  featuredAccentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderColor: colors.success,
  },
  featuredStarIcon: {
    color: colors.warning,
  },
  featuredBadgeText: {
    color: colors.accent,
  },
}); 