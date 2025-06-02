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
  Github,
  Linkedin
} from 'lucide-react-native';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay,
  PageTransitionLoading
} from '../components/LoadingComponents';
import ApiService from '../services/ApiService';
import ProfileImage from '../components/ProfileImage';

// Color Palette - Minimalist Luxe Light Theme (matching the app)
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
const StudentHeader = ({ onBack, onSave, hasChanges }) => {
  return (
    <View style={styles.studentHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
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
            <Save color={hasChanges ? colors.white : colors.muted} size={18} strokeWidth={1.5} />
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
const InputField = ({ icon: Icon, label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, editable = true }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, !editable && styles.inputWrapperDisabled]}>
        <LinearGradient
          colors={[colors.lightAccent, 'transparent']}
          style={styles.inputGradient}
        />
        <View style={styles.inputIconContainer}>
          <Icon color={colors.accent} size={18} strokeWidth={1.5} />
        </View>
        <TextInput
          style={[styles.textInput, multiline && styles.textInputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
        />
      </View>
    </View>
  );
};

// Profile Avatar Component
const ProfileAvatar = ({ user, onEditPress }) => {
  const getUserName = () => {
    return user?.nickname || user?.name || 'User';
  };

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[colors.lightAccent, colors.lightHighlight]}
          style={styles.avatarGradient}
        />
        <ProfileImage
          imageUrl={user?.picture}
          name={getUserName()}
          size={92}
          backgroundColor={colors.accent}
          textColor={colors.white}
          borderRadius={46}
          borderWidth={3}
          borderColor={colors.accent}
          showGradient={false}
        />
        <Pressable style={styles.editAvatarButton} onPress={onEditPress}>
          <Camera color={colors.white} size={16} strokeWidth={1.5} />
        </Pressable>
      </View>
      <Text style={styles.avatarLabel}>Profile Picture</Text>
      <Text style={styles.avatarSubtitle}>Managed through your 42 account</Text>
    </Animated.View>
  );
};

export default function Profile() {
  const router = useRouter();
  
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await ApiService.getUserProfile();
      const profileData = {
        name: profile.nickname || '',
        email: profile.email || '',
        phone: '', // Not available in current API
        picture: profile.picture || null,
        program: profile.email?.includes('@student.42') ? 'Software Engineering' : 'Computer Science',
        year: `Level ${profile.level || 1}`,
        location: 'Khouribga, Morocco', // Default for 1337
        bio: '', // Not available in current API
        github: profile.github || '',
        linkedin: profile.linkedin || ''
      };
      setUserData(profileData);
      setOriginalUserData(JSON.parse(JSON.stringify(profileData)));
    } catch (error) {
      console.error('Failed to load user profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && originalUserData) {
      // Check if any data has changed
      const dataChanged = JSON.stringify(userData) !== JSON.stringify(originalUserData);
      setHasChanges(dataChanged);
    }
  }, [userData, originalUserData]);

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

  const handleSave = async () => {
    try {
      // Update only the fields that are supported by the API
      const updates = {
        nickname: userData.name
      };
      
      await ApiService.updateUserProfile(updates);
      setOriginalUserData(JSON.parse(JSON.stringify(userData)));
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleEditAvatar = () => {
    Alert.alert(
      'Change Profile Picture',
      'Profile picture changes are managed through your 42 account.',
      [{ text: 'OK' }]
    );
  };

  const updateField = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProfessionalBackground />
        <SafeAreaView style={styles.safeArea}>
          <DataLoadingOverlay 
            visible={true}
            message="Loading Profile"
            subMessage="Getting your information"
            icon={User}
          />
        </SafeAreaView>
      </View>
    );
  }

  // Show error state if no data
  if (!userData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProfessionalBackground />
        <SafeAreaView style={styles.safeArea}>
          <IconLoadingState 
            icon={User}
            message="Unable to Load Profile"
            subMessage="Please try again later"
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} onSave={handleSave} hasChanges={hasChanges} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Avatar */}
          <ProfileAvatar user={userData} onEditPress={handleEditAvatar} />

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
              editable={false}
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
              placeholder="Your study program"
              editable={false}
            />
            <InputField
              icon={Calendar}
              label="Current Level"
              value={userData.year}
              onChangeText={(value) => updateField('year', value)}
              placeholder="Your current year/level"
              editable={false}
            />
            <InputField
              icon={MapPin}
              label="Campus Location"
              value={userData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Your campus location"
              editable={false}
            />
          </FormSection>

          {/* Personal Information */}
          <FormSection title="About You" delay={800}>
            <InputField
              icon={Edit3}
              label="Bio"
              value={userData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Tell us about yourself"
              multiline={true}
            />
            <InputField
              icon={Github}
              label="GitHub Username"
              value={userData.github}
              onChangeText={(value) => updateField('github', value)}
              placeholder="Your GitHub username"
            />
            <InputField
              icon={Linkedin}
              label="LinkedIn Username"
              value={userData.linkedin}
              onChangeText={(value) => updateField('linkedin', value)}
              placeholder="Your LinkedIn username"
            />
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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  saveButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  saveButtonTextActive: {
    color: colors.white,
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
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  avatarSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },

  // Form Sections
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
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

  // Input Fields
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: colors.accent,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.secondaryBg,
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
    color: colors.primaryText,
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
}; 