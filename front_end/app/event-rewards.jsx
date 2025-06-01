import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Trophy,
  Coins,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Zap,
  Target,
  Gift,
  Code,
  Coffee,
  Briefcase,
  Award
} from 'lucide-react-native';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

// Student Header Component
const StudentHeader = ({ onBack }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>Event</Text>
            <Text style={styles.headerTitle}>Rewards</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Reward Event Card Component
const RewardEventCard = ({ event, index, onPress }) => {
  const getEventIcon = (category) => {
    switch (category) {
      case 'coding': return { icon: Code, color: '#3b82f6' };
      case 'workshop': return { icon: Coffee, color: '#10b981' };
      case 'competition': return { icon: Trophy, color: '#f59e0b' };
      case 'networking': return { icon: Users, color: '#8b5cf6' };
      case 'career': return { icon: Briefcase, color: '#ec4899' };
      default: return { icon: Calendar, color: '#6b7280' };
    }
  };

  const { icon: EventIcon, color } = getEventIcon(event.category);

  return (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.eventCard}>
      <Pressable style={styles.eventContent} onPress={() => onPress(event)}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
          style={styles.eventGradient}
        />
        
        <View style={styles.eventHeader}>
          <View style={[styles.eventIconContainer, { backgroundColor: color + '20' }]}>
            <EventIcon color={color} size={20} strokeWidth={1.5} />
          </View>
          <View style={styles.eventReward}>
            <Coins color="#f59e0b" size={16} strokeWidth={1.5} />
            <Text style={styles.rewardText}>{event.reward} Credits</Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Calendar color="#6b7280" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.date}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Clock color="#6b7280" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.duration}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <MapPin color="#6b7280" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventProgress}>
            <Text style={styles.progressText}>{event.registered}/{event.maxParticipants} registered</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(event.registered / event.maxParticipants) * 100}%`,
                    backgroundColor: color 
                  }
                ]} 
              />
            </View>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: event.difficulty === 'Beginner' ? '#10b981' + '20' : event.difficulty === 'Intermediate' ? '#f59e0b' + '20' : '#ef4444' + '20' }]}>
            <Text style={[
              styles.difficultyText,
              { color: event.difficulty === 'Beginner' ? '#10b981' : event.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444' }
            ]}>
              {event.difficulty}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Filter Tab Component
const FilterTab = ({ tabs, selectedTab, onSelect }) => {
  return (
    <View style={styles.filterTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.filterTab, selectedTab === tab.id && styles.filterTabActive]}
            onPress={() => onSelect(tab.id)}
          >
            <tab.icon color={selectedTab === tab.id ? "#ffffff" : "#9ca3af"} size={16} strokeWidth={1.5} />
            <Text style={[styles.filterTabText, selectedTab === tab.id && styles.filterTabTextActive]}>
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

// Earnings Summary Component
const EarningsSummary = ({ totalEarned, thisWeek, upcoming }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.summaryCard}>
      <LinearGradient
        colors={['rgba(245, 158, 11, 0.1)', 'transparent']}
        style={styles.summaryGradient}
      />
      <View style={styles.summaryContent}>
        <View style={styles.summaryHeader}>
          <Trophy color="#f59e0b" size={24} strokeWidth={1.5} />
          <Text style={styles.summaryTitle}>Your Earnings</Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalEarned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>+{thisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{upcoming}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function EventRewards() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const filterTabs = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'coding', name: 'Coding', icon: Code },
    { id: 'workshop', name: 'Workshops', icon: Coffee },
    { id: 'competition', name: 'Competitions', icon: Trophy },
    { id: 'networking', name: 'Networking', icon: Users },
  ];

  const rewardEvents = [
    {
      id: 1,
      title: 'React Native Workshop',
      description: 'Build your first mobile app with React Native. Perfect for beginners.',
      category: 'workshop',
      reward: 150,
      date: 'Dec 15, 2024',
      duration: '3 hours',
      location: 'Innovation Lab',
      registered: 45,
      maxParticipants: 60,
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Coding Challenge: Algorithms',
      description: 'Test your problem-solving skills with advanced algorithm challenges.',
      category: 'competition',
      reward: 300,
      date: 'Dec 18, 2024',
      duration: '4 hours',
      location: 'Tech Center',
      registered: 32,
      maxParticipants: 40,
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'AI & Machine Learning Symposium',
      description: 'Industry experts share insights on the latest AI trends and technologies.',
      category: 'networking',
      reward: 200,
      date: 'Dec 20, 2024',
      duration: '6 hours',
      location: 'Main Auditorium',
      registered: 88,
      maxParticipants: 120,
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      title: 'Full-Stack Development Bootcamp',
      description: 'Intensive 2-day bootcamp covering frontend and backend development.',
      category: 'coding',
      reward: 500,
      date: 'Dec 22-23, 2024',
      duration: '2 days',
      location: 'Computer Lab A',
      registered: 24,
      maxParticipants: 30,
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      title: 'Career Fair & Tech Talks',
      description: 'Meet potential employers and learn about career opportunities in tech.',
      category: 'career',
      reward: 100,
      date: 'Dec 25, 2024',
      duration: '5 hours',
      location: 'Student Center',
      registered: 156,
      maxParticipants: 200,
      difficulty: 'Beginner'
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleEventPress = (event) => {
    router.push(`/event-details/${event.id}`);
  };

  const filteredEvents = selectedTab === 'all' 
    ? rewardEvents 
    : rewardEvents.filter(event => event.category === selectedTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <FilterTab 
          tabs={filterTabs}
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Earnings Summary */}
          <EarningsSummary 
            totalEarned={2450}
            thisWeek={350}
            upcoming={850}
          />

          {/* Events List */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>Available Events</Text>
            <View style={styles.eventsList}>
              {filteredEvents.map((event, index) => (
                <RewardEventCard
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

const styles = {
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: 16,
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

  // Filter Tabs
  filterTabs: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2332',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    overflow: 'hidden',
  },
  summaryGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  summaryContent: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
  },

  // Events Section
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  eventsList: {
    gap: 16,
  },

  // Event Cards
  eventCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  eventContent: {
    padding: 20,
    position: 'relative',
  },
  eventGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b' + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventProgress: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a2332',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  difficultyBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },
}; 