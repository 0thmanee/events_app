import { View, Text, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Store,
  Coins,
  Star,
  Gift,
  Coffee,
  Shirt,
  Award,
  Palette,
  Crown,
  Gem,
  Trophy,
  Zap,
  Heart,
  Bookmark,
  ShoppingCart
} from 'lucide-react-native';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

// Student Header Component
const StudentHeader = ({ onBack, balance }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>Credit</Text>
            <Text style={styles.headerTitle}>Shop</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.balanceContainer}>
            <Coins color="#f59e0b" size={18} strokeWidth={1.5} />
            <Text style={styles.balanceText}>{balance.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Shop Item Component
const ShopItem = ({ item, index, onPurchase, userBalance }) => {
  const canAfford = userBalance >= item.price;
  const getItemIcon = (category) => {
    switch (category) {
      case 'customization': return { icon: Palette, color: '#8b5cf6' };
      case 'premium': return { icon: Crown, color: '#f59e0b' };
      case 'merchandise': return { icon: Shirt, color: '#10b981' };
      case 'rewards': return { icon: Gift, color: '#ec4899' };
      case 'food': return { icon: Coffee, color: '#6b7280' };
      default: return { icon: Store, color: '#3b82f6' };
    }
  };

  const { icon: ItemIcon, color } = getItemIcon(item.category);

  return (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.itemCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.itemGradient}
      />
      
      {item.popular && (
        <View style={styles.popularBadge}>
          <Star color="#f59e0b" size={12} strokeWidth={1.5} />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      {item.limited && (
        <View style={styles.limitedBadge}>
          <Gem color="#8b5cf6" size={12} strokeWidth={1.5} />
          <Text style={styles.limitedText}>Limited</Text>
        </View>
      )}

      <View style={styles.itemHeader}>
        <View style={[styles.itemIconContainer, { backgroundColor: color + '20' }]}>
          <ItemIcon color={color} size={24} strokeWidth={1.5} />
        </View>
        <View style={styles.itemPrice}>
          <Coins color="#f59e0b" size={16} strokeWidth={1.5} />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>

      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>

      {item.benefits && (
        <View style={styles.benefitsSection}>
          {item.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      )}

      <Pressable 
        style={[
          styles.purchaseButton,
          !canAfford && styles.purchaseButtonDisabled
        ]} 
        onPress={() => onPurchase(item)}
        disabled={!canAfford}
      >
        <LinearGradient
          colors={canAfford ? ['#6366f1', '#4f46e5'] : ['#374151', '#374151']}
          style={styles.purchaseButtonGradient}
        />
        <ShoppingCart color="#ffffff" size={16} strokeWidth={1.5} />
        <Text style={styles.purchaseButtonText}>
          {canAfford ? 'Purchase' : 'Insufficient Credits'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <View style={styles.filterTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[styles.filterTab, selectedCategory === category.id && styles.filterTabActive]}
            onPress={() => onSelect(category.id)}
          >
            <category.icon color={selectedCategory === category.id ? "#ffffff" : "#9ca3af"} size={16} strokeWidth={1.5} />
            <Text style={[styles.filterTabText, selectedCategory === category.id && styles.filterTabTextActive]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default function Shop() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const userBalance = 2500;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: Store },
    { id: 'customization', name: 'Customization', icon: Palette },
    { id: 'premium', name: 'Premium', icon: Crown },
    { id: 'merchandise', name: 'Merch', icon: Shirt },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'food', name: 'Food & Drinks', icon: Coffee },
  ];

  const shopItems = [
    {
      id: 1,
      name: 'Custom Profile Badge',
      description: 'Personalize your profile with a unique badge that shows your achievements.',
      category: 'customization',
      price: 500,
      popular: true,
      limited: false,
      benefits: ['Unique profile appearance', 'Stand out in leaderboards', 'Show your personality']
    },
    {
      id: 2,
      name: 'Premium Theme Pack',
      description: 'Access to exclusive app themes and customization options.',
      category: 'premium',
      price: 750,
      popular: false,
      limited: true,
      benefits: ['5 exclusive themes', 'Custom accent colors', 'Priority support']
    },
    {
      id: 3,
      name: 'Campus Hoodie',
      description: 'Official university hoodie with custom embroidery.',
      category: 'merchandise',
      price: 1200,
      popular: true,
      limited: false,
      benefits: ['High-quality material', 'Custom embroidery', 'Available in all sizes']
    },
    {
      id: 4,
      name: 'Free Coffee Voucher',
      description: 'Enjoy a free coffee from the campus café.',
      category: 'food',
      price: 150,
      popular: true,
      limited: false,
      benefits: ['Valid for any coffee size', 'No expiration date', 'Can be gifted']
    },
    {
      id: 5,
      name: 'VIP Event Access',
      description: 'Skip the line and get priority access to all campus events.',
      category: 'premium',
      price: 2000,
      popular: false,
      limited: true,
      benefits: ['Priority registration', 'Exclusive VIP seating', 'Meet & greet opportunities']
    },
    {
      id: 6,
      name: 'Achievement Booster',
      description: 'Double your credit earnings from events for one week.',
      category: 'rewards',
      price: 800,
      popular: false,
      limited: false,
      benefits: ['2x credit multiplier', 'Works on all events', 'Stackable with other bonuses']
    },
    {
      id: 7,
      name: 'Custom Username',
      description: 'Get a personalized username that reflects your style.',
      category: 'customization',
      price: 300,
      popular: true,
      limited: false,
      benefits: ['Any available username', 'Change anytime', 'Stand out in chat']
    },
    {
      id: 8,
      name: 'Lunch Combo Deal',
      description: 'Complete lunch meal from the campus restaurant.',
      category: 'food',
      price: 400,
      popular: false,
      limited: false,
      benefits: ['Main course + drink', 'Healthy options available', 'Valid for 30 days']
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = (item) => {
    Alert.alert(
      'Confirm Purchase',
      `Purchase "${item.name}" for ${item.price} credits?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Purchase Successful!',
              `You have successfully purchased "${item.name}". Check your inventory to use it.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} balance={userBalance} />

        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Shop Items */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <View style={styles.itemsList}>
              {filteredItems.map((item, index) => (
                <ShopItem
                  key={item.id}
                  item={item}
                  index={index}
                  onPurchase={handlePurchase}
                  userBalance={userBalance}
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

  // Header
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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
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

  // Items Section
  itemsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  itemsList: {
    gap: 16,
  },

  // Shop Items
  itemCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  itemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  limitedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  limitedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b' + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  benefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
  benefitText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  bottomSpacer: {
    height: 40,
  },
}; 