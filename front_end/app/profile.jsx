import { View, Text, ScrollView, Pressable, StatusBar, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Save,
  Camera,
  Edit3,
  Check,
  X,
  Bell,
  Send
} from 'lucide-react-native';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';
import ApiService from '../services/ApiService';
import NotificationService from '../services/NotificationService';

// Student Header Component
const StudentHeader = ({ onBack, onSave, hasChanges }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>Edit</Text>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            style={[styles.saveButton, hasChanges && styles.saveButtonActive]} 
            onPress={onSave}
            disabled={!hasChanges}
          >
            <Save color={hasChanges ? "#ffffff" : "#6b7280"} size={18} strokeWidth={1.5} />
            <Text style={[styles.saveButtonText, hasChanges && styles.saveButtonTextActive]}>
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Form Section Component
const FormSection = ({ title, children, delay = 0 }) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.formSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </Animated.View>
  );
};

// Input Field Component
const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }) => {
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
          style={[styles.textInput, multiline && styles.textInputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

// Profile Avatar Component
const ProfileAvatar = ({ name, onEditPress }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)']}
          style={styles.avatarGradient}
        />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <Pressable style={styles.editAvatarButton} onPress={onEditPress}>
          <Camera color="#ffffff" size={16} strokeWidth={1.5} />
        </Pressable>
      </View>
      <Text style={styles.avatarLabel}>Profile Picture</Text>
      <Text style={styles.avatarSubtitle}>Tap the camera icon to change</Text>
    </Animated.View>
  );
};

export default function Profile() {
  const router = useRouter();
  
  // Initial user data
  const initialUserData = {
    name: 'Si Yhya',
    email: 'si.yhya@1337.ma',
    phone: '+212 6 12 34 56 78',
    program: 'Software Engineering',
    year: '3rd Year',
    location: 'Khouribga, Morocco',
    bio: 'Passionate software engineering student with a focus on mobile development and AI.',
    github: 'si-yhya',
    linkedin: 'si-yhya'
  };

  const [userData, setUserData] = useState(initialUserData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    // Check if any data has changed
    const dataChanged = JSON.stringify(userData) !== JSON.stringify(initialUserData);
    setHasChanges(dataChanged);
  }, [userData]);

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleEditAvatar = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const updateField = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestPushNotification = async () => {
    try {
      Alert.alert(
        'Send Test Notification',
        'This will send a test push notification to your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send', 
            onPress: async () => {
              try {
                const result = await ApiService.testPushNotification(
                  'Test Notification 🔔',
                  'This is a test push notification from your Events app!'
                );
                Alert.alert('Success', 'Test notification sent! Check your notifications.');
              } catch (error) {
                console.error('Test notification error:', error);
                Alert.alert('Error', error.message || 'Failed to send test notification');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Test notification error:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleCheckDeviceTokens = async () => {
    try {
      const result = await ApiService.getDeviceTokens();
      Alert.alert(
        'Device Tokens',
        `You have ${result.tokens?.length || 0} registered device tokens.\n\nActive tokens: ${result.activeTokens?.length || 0}\nInactive tokens: ${result.inactiveTokens?.length || 0}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch device tokens: ' + error.message);
    }
  };

  const handleTestEventNotification = async () => {
    try {
      Alert.alert(
        'Test Event Notification',
        'This will send an event notification to ALL users in the app. Are you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send to All Users', 
            style: 'destructive',
            onPress: async () => {
              try {
                // Get the first available event to test with
                const events = await ApiService.getEvents({ limit: 1 });
                if (events.length === 0) {
                  Alert.alert('Error', 'No events found to test with. Please create an event first.');
                  return;
                }
                
                const eventId = events[0]._id;
                const result = await ApiService.testEventNotification(eventId);
                Alert.alert(
                  'Success!', 
                  `Event notification sent to ${result.notification.recipientCount} users!\n\nPush notifications: ${result.notification.pushSent ? 'Sent' : 'Failed'}`
                );
              } catch (error) {
                Alert.alert('Error', 'Failed to send event notification: ' + error.message);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare test: ' + error.message);
    }
  };

  const handleDebugPushNotifications = async () => {
    try {
      const debugInfo = await ApiService.debugPushNotifications();
      const status = debugInfo.firebaseStatus;
      
      let message = `🔍 Push Notification Debug Info:\n\n`;
      message += `Mode: ${debugInfo.serviceStatus.mode}\n`;
      message += `Firebase Initialized: ${status.initialized ? '✅' : '❌'}\n`;
      message += `Has Messaging: ${status.hasMessaging ? '✅' : '❌'}\n`;
      message += `Has SendMulticast: ${status.hasSendMulticast ? '✅' : '❌'}\n\n`;
      message += `Environment Variables:\n`;
      message += `PROJECT_ID: ${status.envVarStatus.FIREBASE_PROJECT_ID ? '✅' : '❌'}\n`;
      message += `PRIVATE_KEY: ${status.envVarStatus.FIREBASE_PRIVATE_KEY ? '✅' : '❌'}\n`;
      message += `CLIENT_EMAIL: ${status.envVarStatus.FIREBASE_CLIENT_EMAIL ? '✅' : '❌'}\n\n`;
      message += `Your Device Tokens: ${debugInfo.user.activeTokens}/${debugInfo.user.totalTokens}\n`;
      message += `Push Enabled: ${debugInfo.user.pushEnabled ? '✅' : '❌'}\n`;
      message += `Quiet Hours: ${debugInfo.user.quietHours ? '🔇' : '🔊'}`;
      
      Alert.alert('Debug Info', message, [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get debug info: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} onSave={handleSave} hasChanges={hasChanges} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Avatar */}
          <ProfileAvatar name={userData.name} onEditPress={handleEditAvatar} />

          {/* Basic Information */}
          <FormSection title="Basic Information" delay={400}>
            <InputField
              icon={User}
              label="Full Name"
              value={userData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter your full name"
            />
            <InputField
              icon={Mail}
              label="Email Address"
              value={userData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <InputField
              icon={Phone}
              label="Phone Number"
              value={userData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </FormSection>

          {/* Academic Information */}
          <FormSection title="Academic Information" delay={600}>
            <InputField
              icon={GraduationCap}
              label="Program"
              value={userData.program}
              onChangeText={(value) => updateField('program', value)}
              placeholder="Your program of study"
            />
            <InputField
              icon={Calendar}
              label="Academic Year"
              value={userData.year}
              onChangeText={(value) => updateField('year', value)}
              placeholder="Current academic year"
            />
            <InputField
              icon={MapPin}
              label="Location"
              value={userData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Your current location"
            />
          </FormSection>

          {/* Personal Information */}
          <FormSection title="Personal Information" delay={800}>
            <InputField
              icon={Edit3}
              label="Bio"
              value={userData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Tell us about yourself"
              multiline={true}
            />
            <InputField
              icon={User}
              label="GitHub Username"
              value={userData.github}
              onChangeText={(value) => updateField('github', value)}
              placeholder="Your GitHub username"
            />
            <InputField
              icon={User}
              label="LinkedIn Username"
              value={userData.linkedin}
              onChangeText={(value) => updateField('linkedin', value)}
              placeholder="Your LinkedIn username"
            />
          </FormSection>

          {/* Push Notification Testing */}
          <FormSection title="Push Notifications" delay={1000}>
            <View style={styles.notificationTestContainer}>
              <Text style={styles.notificationTestDescription}>
                Test push notifications to make sure they're working properly on your device.
              </Text>
              
              <Pressable 
                style={styles.testNotificationButton}
                onPress={handleTestPushNotification}
              >
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                  style={styles.testButtonGradient}
                />
                <View style={styles.testButtonContent}>
                  <View style={styles.testButtonIcon}>
                    <Bell color="#6366f1" size={20} strokeWidth={1.5} />
                  </View>
                  <View style={styles.testButtonText}>
                    <Text style={styles.testButtonTitle}>Test Push Notification</Text>
                    <Text style={styles.testButtonSubtitle}>Send a test notification to this device</Text>
                  </View>
                  <Send color="#6366f1" size={16} strokeWidth={1.5} />
                </View>
              </Pressable>
              
              <View style={styles.checkTokenContainer}>
                <Pressable 
                  style={styles.checkTokenButton}
                  onPress={handleCheckDeviceTokens}
                >
                  <Text style={styles.checkTokenButtonText}>Check Device Tokens</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.debugButton}
                  onPress={handleDebugPushNotifications}
                >
                  <Text style={styles.debugButtonText}>🔍 Debug Push Notifications</Text>
                </Pressable>
              </View>
            </View>
          </FormSection>

          {/* Event Notification Testing */}
          <FormSection title="Event Notifications" delay={1200}>
            <View style={styles.eventTestContainer}>
              <Text style={styles.eventTestDescription}>
                Test event notifications to make sure they're working properly in the app.
              </Text>
              
              <Pressable 
                style={styles.testEventButton}
                onPress={handleTestEventNotification}
              >
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                  style={styles.eventButtonGradient}
                />
                <View style={styles.eventButtonContent}>
                  <View style={styles.eventButtonIcon}>
                    <Bell color="#6366f1" size={20} strokeWidth={1.5} />
                  </View>
                  <View style={styles.eventButtonText}>
                    <Text style={styles.eventButtonTitle}>Test Event Notification</Text>
                    <Text style={styles.eventButtonSubtitle}>Send a test event notification to all users</Text>
                  </View>
                  <Send color="#6366f1" size={16} strokeWidth={1.5} />
                </View>
              </Pressable>
            </View>
          </FormSection>

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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  saveButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButtonTextActive: {
    color: '#ffffff',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#0f1419',
    borderWidth: 3,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366f1',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  avatarSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // Form Sections
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  sectionContent: {
    gap: 16,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 4,
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
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    padding: 0,
  },
  textInputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },

  bottomSpacer: {
    height: 40,
  },

  // Notification Testing
  notificationTestContainer: {
    padding: 20,
    gap: 20,
  },
  notificationTestDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  testButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  testButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a0f1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    flex: 1,
  },
  testButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  testButtonSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  checkTokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    padding: 16,
  },
  checkTokenButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    padding: 16,
  },
  debugButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Event Testing
  eventTestContainer: {
    padding: 20,
    gap: 20,
  },
  eventTestDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  testEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  eventButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a0f1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventButtonText: {
    flex: 1,
  },
  eventButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  eventButtonSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
}; 