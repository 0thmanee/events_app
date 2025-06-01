import { View, Text, ScrollView, Pressable, StatusBar, Dimensions, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
  Heart
} from 'lucide-react-native';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';

const { width: screenWidth } = Dimensions.get('window');

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
const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightComponent, hasArrow = true, color = '#6b7280' }) => {
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
        {hasArrow && <ChevronRight color="#6b7280" size={16} strokeWidth={1.5} />}
      </View>
    </Pressable>
  );
};

// Toggle Item Component
const ToggleItem = ({ icon: Icon, title, subtitle, value, onValueChange, color = '#6b7280' }) => {
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
        trackColor={{ false: '#1a2332', true: '#6366f1' }}
        thumbColor={value ? '#ffffff' : '#9ca3af'}
      />
    </View>
  );
};

// Profile Card Component
const ProfileCard = ({ user, onEditPress }) => {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.profileCard}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={styles.profileGradient}
      />
      
      <View style={styles.profileContent}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{user.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profileProgram}>{user.program}</Text>
        </View>
        <Pressable style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default function Settings() {
  const router = useRouter();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleBack = () => {
    router.back();
  };

  const user = {
    name: 'Si Yhya',
    email: 'si.yhya@1337.ma',
    program: 'Software Engineering',
  };

  const handleAccountPress = () => {
    router.push('/profile');
  };

  const handlePrivacyPress = () => {
    console.log('Privacy settings');
  };

  const handleSecurityPress = () => {
    console.log('Security settings');
  };

  const handleLanguagePress = () => {
    console.log('Language settings');
  };

  const handleHelpPress = () => {
    console.log('Help & Support');
  };

  const handleAboutPress = () => {
    console.log('About app');
  };

  const handleLogoutPress = () => {
    console.log('Logout');
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
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <ProfileCard user={user} onEditPress={handleAccountPress} />
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
              onValueChange={setPushNotifications}
              color="#f59e0b"
            />
            <ToggleItem
              icon={Mail}
              title="Email Notifications"
              subtitle="Receive updates via email"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              color="#3b82f6"
            />
            <ToggleItem
              icon={Volume2}
              title="Sound"
              subtitle="Play sound for notifications"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              color="#10b981"
            />
            <ToggleItem
              icon={Vibrate}
              title="Vibration"
              subtitle="Vibrate for notifications"
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              color="#8b5cf6"
            />
          </SettingsSection>

          {/* App Preferences */}
          <SettingsSection title="App Preferences" delay={800}>
            <ToggleItem
              icon={Moon}
              title="Dark Mode"
              subtitle="Use dark theme"
              value={darkMode}
              onValueChange={setDarkMode}
              color="#6b7280"
            />
            <SettingsItem
              icon={Globe}
              title="Language"
              subtitle="English"
              onPress={handleLanguagePress}
              color="#ec4899"
            />
            <ToggleItem
              icon={Download}
              title="Auto Download"
              subtitle="Download content automatically"
              value={autoDownload}
              onValueChange={setAutoDownload}
              color="#10b981"
            />
          </SettingsSection>

          {/* Support */}
          <SettingsSection title="Support" delay={1000}>
            <SettingsItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={handleHelpPress}
              color="#3b82f6"
            />
            <SettingsItem
              icon={Star}
              title="Rate App"
              subtitle="Rate us on the app store"
              onPress={() => console.log('Rate app')}
              color="#f59e0b"
            />
            <SettingsItem
              icon={Heart}
              title="Send Feedback"
              subtitle="Help us improve the app"
              onPress={() => console.log('Send feedback')}
              color="#ec4899"
            />
            <SettingsItem
              icon={Info}
              title="About"
              subtitle="App version and information"
              onPress={handleAboutPress}
              color="#6b7280"
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

  // Profile Section
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
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
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0f1419',
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 2,
  },
  profileProgram: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Settings Sections
  settingsSection: {
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
    backgroundColor: '#0a0f1c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a2332',
    overflow: 'hidden',
  },

  // Settings Items
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2332',
    position: 'relative',
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
    color: '#ffffff',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
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