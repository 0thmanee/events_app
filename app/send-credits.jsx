import { View, Text, ScrollView, Pressable, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Send,
  User,
  Coins,
  Search,
  CheckCircle,
  AlertCircle,
  Users,
  Star
} from 'lucide-react-native';

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
            <Text style={styles.headerGreeting}>Send</Text>
            <Text style={styles.headerTitle}>Credits</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Balance Summary Component
const BalanceSummary = ({ balance }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.balanceCard}>
      <LinearGradient
        colors={['rgba(245, 158, 11, 0.1)', 'transparent']}
        style={styles.balanceGradient}
      />
      <View style={styles.balanceContent}>
        <Coins color="#f59e0b" size={24} strokeWidth={1.5} />
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{balance.toLocaleString()} Credits</Text>
      </View>
    </Animated.View>
  );
};

// Recent Contacts Component
const RecentContact = ({ contact, onSelect }) => {
  return (
    <Pressable style={styles.contactItem} onPress={() => onSelect(contact)}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.contactGradient}
      />
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactProgram}>{contact.program}</Text>
      </View>
      <View style={styles.contactBadge}>
        <Star color="#f59e0b" size={12} strokeWidth={1.5} />
      </View>
    </Pressable>
  );
};

// Input Field Component
const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, keyboardType = 'default' }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
          style={styles.inputGradient}
        />
        <View style={styles.inputIconContainer}>
          <Icon color="#6b7280" size={18} strokeWidth={1.5} />
        </View>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

export default function SendCredits() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const userBalance = 2500;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const recentContacts = [
    { id: 1, name: 'Sarah Kim', program: 'Computer Science' },
    { id: 2, name: 'Ahmed Benali', program: 'Software Engineering' },
    { id: 3, name: 'Maria Garcia', program: 'Data Science' },
    { id: 4, name: 'John Smith', program: 'AI Engineering' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setRecipient(contact.name);
  };

  const handleSend = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const transferAmount = parseInt(amount);
    if (transferAmount > userBalance) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough credits for this transfer.');
      return;
    }

    if (transferAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Send ${transferAmount} credits to ${recipient}?${message ? `\n\nMessage: "${message}"` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Transfer Successful!',
              `${transferAmount} credits sent to ${recipient}`,
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Balance Summary */}
          <BalanceSummary balance={userBalance} />

          {/* Send Form */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.formSection}>
            <Text style={styles.sectionTitle}>Transfer Details</Text>
            
            <InputField
              icon={User}
              label="Recipient"
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter student name or email"
            />

            <InputField
              icon={Coins}
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount to send"
              keyboardType="numeric"
            />

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountContainer}>
              <Text style={styles.quickAmountLabel}>Quick Amounts</Text>
              <View style={styles.quickAmountButtons}>
                {quickAmounts.map((quickAmount) => (
                  <Pressable
                    key={quickAmount}
                    style={[
                      styles.quickAmountButton,
                      amount === quickAmount.toString() && styles.quickAmountButtonActive
                    ]}
                    onPress={() => setAmount(quickAmount.toString())}
                  >
                    <Text style={[
                      styles.quickAmountButtonText,
                      amount === quickAmount.toString() && styles.quickAmountButtonTextActive
                    ]}>
                      {quickAmount}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <InputField
              icon={Send}
              label="Message (Optional)"
              value={message}
              onChangeText={setMessage}
              placeholder="Add a message"
            />
          </Animated.View>

          {/* Recent Contacts */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.contactsSection}>
            <Text style={styles.sectionTitle}>Recent Contacts</Text>
            <View style={styles.contactsList}>
              {recentContacts.map((contact, index) => (
                <RecentContact
                  key={contact.id}
                  contact={contact}
                  onSelect={handleContactSelect}
                />
              ))}
            </View>
          </Animated.View>

          {/* Send Button */}
          <Animated.View entering={FadeInUp.delay(800)} style={styles.sendButtonContainer}>
            <Pressable style={styles.sendButton} onPress={handleSend}>
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={styles.sendButtonGradient}
              />
              <Send color="#ffffff" size={20} strokeWidth={1.5} />
              <Text style={styles.sendButtonText}>Send Credits</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

  // Background
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientBase: {
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

  scrollContent: {
    paddingBottom: 40,
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    overflow: 'hidden',
  },
  balanceGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceContent: {
    padding: 20,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Form Section
  formSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2332',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: '#6366f1',
  },
  inputGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },

  // Quick Amount
  quickAmountContainer: {
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#0a0f1c',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  quickAmountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  quickAmountButtonTextActive: {
    color: '#ffffff',
  },

  // Contacts
  contactsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
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
  contactGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  contactProgram: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  contactBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#0f1419',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Send Button
  sendButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sendButton: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  sendButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  bottomSpacer: {
    height: 40,
  },
}; 