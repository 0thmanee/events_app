import { View, Text, ScrollView, Pressable, StatusBar, Dimensions, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings as SettingsIcon,
  Eye,
  Lock,
  Smartphone,
  Volume2,
  Vibrate,
  Mail,
  MessageSquare,
  Download,
  Trash2,
  Info,
  ExternalLink,
  Star,
  Heart,
  QrCode,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react-native';
import ApiService from '../services/ApiService';
import ProfileImage from '../components/ProfileImage';
import NotificationService from '../services/NotificationService';
import CalendarService from '../services/CalendarService';
import RecommendationService from '../services/RecommendationService';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

const { width: screenWidth } = Dimensions.get('window');

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
const StudentHeader = ({ onBack }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerGreeting}>App</Text>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Settings Section Component
const SettingsSection = ({ title, children, delay = 0 }) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </Animated.View>
  );
};

// Settings Item Component
const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightComponent, hasArrow = true, color = colors.secondaryText }) => {
  return (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.itemGradient}
      />
      
      <View style={styles.itemLeft}>
        <View style={[styles.itemIconContainer, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={18} strokeWidth={1.5} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.itemRight}>
        {rightComponent}
        {hasArrow && <ChevronRight color={colors.secondaryText} size={16} strokeWidth={1.5} />}
      </View>
    </Pressable>
  );
};

// Toggle Item Component
const ToggleItem = ({ icon: Icon, title, subtitle, value, onValueChange, color = colors.secondaryText }) => {
  return (
    <View style={styles.settingsItem}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.itemGradient}
      />
      
      <View style={styles.itemLeft}>
        <View style={[styles.itemIconContainer, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={18} strokeWidth={1.5} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.secondaryBg, true: colors.lightAccent }}
        thumbColor={value ? colors.accent : colors.muted}
        ios_backgroundColor={colors.secondaryBg}
      />
    </View>
  );
};

// Profile Card Component
const ProfileCard = ({ user, onEditPress }) => {
  const getUserName = () => {
    return user.nickname || user.name || 'Student';
  };

  const getUserEmail = () => {
    return user.email || 'No email available';
  };

  const getUserProgram = () => {
    if (user.email && user.email.includes('@student.42')) {
      return 'Software Engineering';
    }
    return 'Computer Science';
  };

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.profileCard}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={styles.profileGradient}
      />
      
      <View style={styles.profileContent}>
        <ProfileImage
          imageUrl={user.picture}
          name={getUserName()}
          size={56}
          backgroundColor={colors.accent}
          textColor={colors.white}
          borderRadius={16}
          borderWidth={2}
          borderColor={colors.accent}
          style={{ 
            marginRight: 16,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{getUserName()}</Text>
          <Text style={styles.profileEmail}>{getUserEmail()}</Text>
        </View>
          <Text style={styles.editButtonText}>Edit</Text>
      </View>
    </Animated.View>
  );
};

export default function Settings() {
  const router = useRouter();
  
  // Loading and user state
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  // New feature settings
  const [eventReminders, setEventReminders] = useState(true);
  const [feedbackPrompts, setFeedbackPrompts] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(true);
  const [qrNotifications, setQrNotifications] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = await ApiService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      // Load settings from AsyncStorage
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNotifications(settings.notifications ?? true);
        setEmailNotifications(settings.emailNotifications ?? false);
        setPushNotifications(settings.pushNotifications ?? true);
        setSoundEnabled(settings.soundEnabled ?? true);
        setVibrationEnabled(settings.vibrationEnabled ?? true);
        setDarkMode(settings.darkMode ?? true);
        setAutoDownload(settings.autoDownload ?? false);
        
        // New feature settings
        setEventReminders(settings.eventReminders ?? true);
        setFeedbackPrompts(settings.feedbackPrompts ?? true);
        setCalendarSync(settings.calendarSync ?? true);
        setRecommendationsEnabled(settings.recommendationsEnabled ?? true);
        setQrNotifications(settings.qrNotifications ?? true);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const currentSettings = {
        notifications,
        emailNotifications,
        pushNotifications,
        soundEnabled,
        vibrationEnabled,
        darkMode,
        autoDownload,
        eventReminders,
        feedbackPrompts,
        calendarSync,
        recommendationsEnabled,
        qrNotifications,
        ...newSettings
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAccountPress = () => {
    router.push('/profile');
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy settings help you control how your information is used and shared.',
      [{ text: 'OK' }]
    );
  };

  const handleSecurityPress = () => {
    Alert.alert(
      'Security Settings',
      'Review and manage your account security settings.',
      [{ text: 'OK' }]
    );
  };

  const handleLanguagePress = () => {
    Alert.alert(
      'Language Settings',
      'Currently, only English is supported. More languages coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleHelpPress = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Contact support at support@1337.ma or visit our FAQ section.',
      [{ text: 'OK' }]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      'About 1337 Event Hub',
      'Version 1.0.0\n\nDeveloped for 1337 students and staff to manage events and activities.',
      [{ text: 'OK' }]
    );
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will need to authenticate again to access the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored data
              await AsyncStorage.multiRemove([
                'appToken',
                'userData',
                'userRole',
                'userSettings',
                'oauth_state'
              ]);
              // Navigate to login
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleNotificationsChange = async (value) => {
    setNotifications(value);
    await saveSettings({ notifications: value });
  };

  const handleEmailNotificationsChange = async (value) => {
    setEmailNotifications(value);
    await saveSettings({ emailNotifications: value });
  };

  const handlePushNotificationsChange = async (value) => {
    setPushNotifications(value);
    await saveSettings({ pushNotifications: value });
    
    // Update notification service settings
    if (value) {
      await NotificationService.requestPermissions();
    } else {
      await NotificationService.disableNotifications();
    }
  };

  const handleSoundChange = async (value) => {
    setSoundEnabled(value);
    await saveSettings({ soundEnabled: value });
  };

  const handleVibrationChange = async (value) => {
    setVibrationEnabled(value);
    await saveSettings({ vibrationEnabled: value });
  };

  const handleDarkModeChange = async (value) => {
    setDarkMode(value);
    await saveSettings({ darkMode: value });
    Alert.alert(
      'Theme Changed',
      'Theme changes will take effect on the next app launch.',
      [{ text: 'OK' }]
    );
  };

  const handleAutoDownloadChange = async (value) => {
    setAutoDownload(value);
    await saveSettings({ autoDownload: value });
  };

  // New feature handlers
  const handleEventRemindersChange = async (value) => {
    setEventReminders(value);
    await saveSettings({ eventReminders: value });
    await NotificationService.updatePreferences({ eventReminders: value });
  };

  const handleFeedbackPromptsChange = async (value) => {
    setFeedbackPrompts(value);
    await saveSettings({ feedbackPrompts: value });
    await NotificationService.updatePreferences({ feedbackPrompts: value });
  };

  const handleCalendarSyncChange = async (value) => {
    setCalendarSync(value);
    await saveSettings({ calendarSync: value });
    if (value) {
      await CalendarService.requestPermissions();
    }
  };

  const handleRecommendationsChange = async (value) => {
    setRecommendationsEnabled(value);
    await saveSettings({ recommendationsEnabled: value });
    await RecommendationService.updateSettings({ enabled: value });
  };

  const handleQrNotificationsChange = async (value) => {
    setQrNotifications(value);
    await saveSettings({ qrNotifications: value });
    await NotificationService.updatePreferences({ qrNotifications: value });
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Settings"
          subMessage="Getting your preferences"
          icon={SettingsIcon}
        />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={SettingsIcon}
          message="Unable to Load Settings"
          subMessage="Please try again later"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <ProfileCard user={userProfile} onEditPress={handleAccountPress} />
          </View>

          {/* Account Settings */}
          <SettingsSection title="Account" delay={400}>
            <SettingsItem
              icon={User}
              title="Personal Information"
              subtitle="Update your profile details"
              onPress={handleAccountPress}
              color="#3b82f6"
            />
            <SettingsItem
              icon={Lock}
              title="Privacy"
              subtitle="Manage your privacy preferences"
              onPress={handlePrivacyPress}
              color="#8b5cf6"
            />
            <SettingsItem
              icon={Shield}
              title="Security"
              subtitle="Password and authentication"
              onPress={handleSecurityPress}
              color="#10b981"
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications" delay={600}>
            <ToggleItem
              icon={Bell}
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              value={pushNotifications}
              onValueChange={handlePushNotificationsChange}
              color="#f59e0b"
            />
            <ToggleItem
              icon={Mail}
              title="Email Notifications"
              subtitle="Receive updates via email"
              value={emailNotifications}
              onValueChange={handleEmailNotificationsChange}
              color="#3b82f6"
            />
            <ToggleItem
              icon={Volume2}
              title="Sound"
              subtitle="Play sound for notifications"
              value={soundEnabled}
              onValueChange={handleSoundChange}
              color="#10b981"
            />
            <ToggleItem
              icon={Vibrate}
              title="Vibration"
              subtitle="Vibrate for notifications"
              value={vibrationEnabled}
              onValueChange={handleVibrationChange}
              color="#8b5cf6"
            />
          </SettingsSection>

          {/* Features */}
          <SettingsSection title="Features" delay={700}>
            <ToggleItem
              icon={Bell}
              title="Event Reminders"
              subtitle="Get notified before events start"
              value={eventReminders}
              onValueChange={handleEventRemindersChange}
              color="#6366f1"
            />
            <ToggleItem
              icon={MessageSquare}
              title="Feedback Prompts"
              subtitle="Receive prompts to provide event feedback"
              value={feedbackPrompts}
              onValueChange={handleFeedbackPromptsChange}
              color="#8b5cf6"
            />
            <ToggleItem
              icon={Calendar}
              title="Calendar Sync"
              subtitle="Sync events with device calendar"
              value={calendarSync}
              onValueChange={handleCalendarSyncChange}
              color="#10b981"
            />
          </SettingsSection>

          {/* App Preferences */}
          <SettingsSection title="App Preferences" delay={800}>
            <SettingsItem
              icon={Globe}
              title="Language"
              subtitle="English"
              onPress={handleLanguagePress}
              color="#ec4899"
            />
          </SettingsSection>

          

          {/* Danger Zone */}
          <SettingsSection title="Account Actions" delay={1200}>
            <SettingsItem
              icon={Trash2}
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={() => console.log('Clear cache')}
              color="#f59e0b"
            />
            <SettingsItem
              icon={LogOut}
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleLogoutPress}
              color="#ef4444"
            />
          </SettingsSection>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = {
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    marginLeft: 16,
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

  scrollContent: {
    paddingBottom: 40,
  },

  // Profile Section
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Settings Sections
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Settings Items
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    position: 'relative',
    backgroundColor: colors.white,
  },
  itemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  bottomSpacer: {
    height: 40,
  },
}; 