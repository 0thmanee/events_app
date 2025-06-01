import { View, Text, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  CreditCard,
  Coins,
  Smartphone,
  Building,
  CheckCircle,
  Plus,
  Star,
  Zap,
  Gift
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
            <Text style={styles.headerGreeting}>Add</Text>
            <Text style={styles.headerTitle}>Funds</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Credit Package Component
const CreditPackage = ({ package: pkg, onSelect, isSelected }) => {
  const savingsPercent = pkg.bonus > 0 ? Math.round((pkg.bonus / pkg.credits) * 100) : 0;

  return (
    <Pressable
      style={[styles.packageCard, isSelected && styles.packageCardSelected]}
      onPress={() => onSelect(pkg)}
    >
      <LinearGradient
        colors={isSelected ? ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)'] : ['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.packageGradient}
      />
      
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Star color="#f59e0b" size={12} strokeWidth={1.5} />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      <View style={styles.packageHeader}>
        <View style={[styles.packageIconContainer, { backgroundColor: pkg.color + '20' }]}>
          <Coins color={pkg.color} size={24} strokeWidth={1.5} />
        </View>
        <Text style={styles.packageCredits}>{pkg.credits.toLocaleString()}</Text>
        <Text style={styles.packageCreditsLabel}>Credits</Text>
      </View>

      {pkg.bonus > 0 && (
        <View style={styles.bonusSection}>
          <Text style={styles.bonusText}>+{pkg.bonus} Bonus Credits</Text>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>{savingsPercent}% Extra</Text>
          </View>
        </View>
      )}

      <View style={styles.packagePrice}>
        <Text style={styles.priceAmount}>${pkg.price}</Text>
        <Text style={styles.priceLabel}>USD</Text>
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <CheckCircle color="#6366f1" size={20} strokeWidth={1.5} />
        </View>
      )}
    </Pressable>
  );
};

// Payment Method Component
const PaymentMethod = ({ method, onSelect, isSelected }) => {
  return (
    <Pressable
      style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
      onPress={() => onSelect(method)}
    >
      <LinearGradient
        colors={isSelected ? ['rgba(99, 102, 241, 0.1)', 'transparent'] : ['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.paymentGradient}
      />
      
      <View style={[styles.paymentIconContainer, { backgroundColor: method.color + '20' }]}>
        <method.icon color={method.color} size={20} strokeWidth={1.5} />
      </View>
      
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentName}>{method.name}</Text>
        <Text style={styles.paymentDescription}>{method.description}</Text>
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <CheckCircle color="#6366f1" size={20} strokeWidth={1.5} />
        </View>
      )}
    </Pressable>
  );
};

export default function AddFunds() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const creditPackages = [
    {
      id: 1,
      credits: 100,
      bonus: 0,
      price: 4.99,
      color: '#10b981',
      popular: false
    },
    {
      id: 2,
      credits: 250,
      bonus: 25,
      price: 9.99,
      color: '#3b82f6',
      popular: true
    },
    {
      id: 3,
      credits: 500,
      bonus: 75,
      price: 19.99,
      color: '#8b5cf6',
      popular: false
    },
    {
      id: 4,
      credits: 1000,
      bonus: 200,
      price: 34.99,
      color: '#f59e0b',
      popular: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      name: 'Credit Card',
      description: 'Visa, Mastercard, Amex',
      icon: CreditCard,
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Mobile Payment',
      description: 'Apple Pay, Google Pay',
      icon: Smartphone,
      color: '#10b981'
    },
    {
      id: 3,
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Building,
      color: '#8b5cf6'
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    if (!selectedPackage || !selectedPayment) {
      Alert.alert('Incomplete Selection', 'Please select both a credit package and payment method.');
      return;
    }

    const totalCredits = selectedPackage.credits + selectedPackage.bonus;
    
    Alert.alert(
      'Confirm Purchase',
      `Purchase ${selectedPackage.credits.toLocaleString()} credits${selectedPackage.bonus > 0 ? ` (+${selectedPackage.bonus} bonus)` : ''} for $${selectedPackage.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Purchase Successful!',
              `${totalCredits.toLocaleString()} credits added to your wallet`,
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Credit Packages */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Credit Package</Text>
            <View style={styles.packagesGrid}>
              {creditPackages.map((pkg, index) => (
                <CreditPackage
                  key={pkg.id}
                  package={pkg}
                  onSelect={setSelectedPackage}
                  isSelected={selectedPackage?.id === pkg.id}
                />
              ))}
            </View>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method, index) => (
                <PaymentMethod
                  key={method.id}
                  method={method}
                  onSelect={setSelectedPayment}
                  isSelected={selectedPayment?.id === method.id}
                />
              ))}
            </View>
          </Animated.View>

          {/* Purchase Summary */}
          {selectedPackage && (
            <Animated.View entering={FadeInUp.delay(600)} style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Purchase Summary</Text>
              <View style={styles.summaryCard}>
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
                  style={styles.summaryGradient}
                />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Credits</Text>
                  <Text style={styles.summaryValue}>{selectedPackage.credits.toLocaleString()}</Text>
                </View>
                {selectedPackage.bonus > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Bonus Credits</Text>
                    <Text style={[styles.summaryValue, { color: '#10b981' }]}>+{selectedPackage.bonus}</Text>
                  </View>
                )}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total Credits</Text>
                  <Text style={styles.summaryTotalValue}>
                    {(selectedPackage.credits + selectedPackage.bonus).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Amount</Text>
                  <Text style={styles.summaryTotalValue}>${selectedPackage.price}</Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Purchase Button */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.purchaseButtonContainer}>
            <Pressable 
              style={[
                styles.purchaseButton,
                (!selectedPackage || !selectedPayment) && styles.purchaseButtonDisabled
              ]} 
              onPress={handlePurchase}
              disabled={!selectedPackage || !selectedPayment}
            >
              <LinearGradient
                colors={selectedPackage && selectedPayment ? ['#6366f1', '#4f46e5'] : ['#374151', '#374151']}
                style={styles.purchaseButtonGradient}
              />
              <Plus color="#ffffff" size={20} strokeWidth={1.5} />
              <Text style={styles.purchaseButtonText}>
                {selectedPackage && selectedPayment ? `Purchase for $${selectedPackage.price}` : 'Select Package & Payment'}
              </Text>
            </Pressable>
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

  scrollContent: {
    paddingBottom: 40,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },

  // Credit Packages
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  packageCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  packageCardSelected: {
    borderColor: '#6366f1',
  },
  packageGradient: {
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
  packageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  packageCredits: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  packageCreditsLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  bonusSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 6,
  },
  savingsBadge: {
    backgroundColor: '#10b981' + '20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  packagePrice: {
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  priceLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Payment Methods
  paymentMethods: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2332',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  paymentCardSelected: {
    borderColor: '#6366f1',
  },
  paymentGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Summary
  summarySection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  summaryCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  summaryGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#1a2332',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '800',
  },

  // Selected Indicator
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  // Purchase Button
  purchaseButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  purchaseButton: {
    borderRadius: 16,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },

  bottomSpacer: {
    height: 40,
  },
}; 