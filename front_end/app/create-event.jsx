import { View, Text, ScrollView, TextInput, Pressable, StatusBar, Alert, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Type,
  FileText,
  User,
  Send,
  CheckCircle,
  ChevronDown
} from 'lucide-react-native';
import ApiService from '../services/ApiService';
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
            <Text style={styles.headerGreeting}>Create</Text>
            <Text style={styles.headerTitle}>Event Request</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Form Card Component
const FormCard = ({ title, children, delay = 0 }) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.formCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.formGradient}
      />
      <Text style={styles.formCardTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
};

// Input Field Component
const InputField = ({ icon: Icon, label, placeholder, value, onChangeText, multiline = false, required = false }) => {
  return (
    <View style={styles.inputField}>
      <View style={styles.inputLabel}>
        <Icon color={colors.accent} size={16} strokeWidth={1.5} />
        <Text style={styles.inputLabelText}>
          {label}{required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
};

// Date Picker Field Component
const DatePickerField = ({ label, value, onChange, required = false }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      onChange(formatDate(date));
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.inputField}>
      <View style={styles.inputLabel}>
        <Calendar color={colors.accent} size={16} strokeWidth={1.5} />
        <Text style={styles.inputLabelText}>
          {label}{required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <Pressable style={styles.pickerButton} onPress={openPicker}>
        <Text style={[styles.pickerButtonText, value && styles.pickerButtonTextSelected]}>
          {value ? formatDisplayDate(selectedDate) : 'Select date'}
        </Text>
        <ChevronDown color={colors.secondaryText} size={16} strokeWidth={1.5} />
      </Pressable>
      
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
        />
      )}
      
      {Platform.OS === 'ios' && showPicker && (
        <View style={styles.iosPickerActions}>
          <Pressable style={styles.pickerActionButton} onPress={() => setShowPicker(false)}>
            <Text style={styles.pickerActionText}>Done</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// Time Picker Field Component
const TimePickerField = ({ label, value, onChange, required = false }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    }
    const date = new Date();
    date.setHours(9, 0, 0, 0); // Default to 9:00 AM
    return date;
  });

  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5); // HH:MM format
  };

  const formatDisplayTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleTimeChange = (event, time) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (time) {
      setSelectedTime(time);
      onChange(formatTime(time));
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.inputField}>
      <View style={styles.inputLabel}>
        <Clock color={colors.accent} size={16} strokeWidth={1.5} />
        <Text style={styles.inputLabelText}>
          {label}{required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <Pressable style={styles.pickerButton} onPress={openPicker}>
        <Text style={[styles.pickerButtonText, value && styles.pickerButtonTextSelected]}>
          {value ? formatDisplayTime(selectedTime) : 'Select time'}
        </Text>
        <ChevronDown color={colors.secondaryText} size={16} strokeWidth={1.5} />
      </Pressable>
      
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
        />
      )}
      
      {Platform.OS === 'ios' && showPicker && (
        <View style={styles.iosPickerActions}>
          <Pressable style={styles.pickerActionButton} onPress={() => setShowPicker(false)}>
            <Text style={styles.pickerActionText}>Done</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// Capacity Picker Component
const CapacityPicker = ({ label, value, onChange, required = false }) => {
  const capacityOptions = [
    { value: '10', label: '10 people (Small)' },
    { value: '20', label: '20 people' },
    { value: '30', label: '30 people' },
    { value: '50', label: '50 people (Medium)' },
    { value: '100', label: '100 people (Large)' },
    { value: '200', label: '200 people (Extra Large)' },
  ];

  return (
    <View style={styles.inputField}>
      <View style={styles.inputLabel}>
        <Users color={colors.accent} size={16} strokeWidth={1.5} />
        <Text style={styles.inputLabelText}>
          {label}{required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <View style={styles.capacityGrid}>
        {capacityOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.capacityOption,
              value === option.value && styles.capacityOptionSelected
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[
              styles.capacityOptionText,
              value === option.value && styles.capacityOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// Category Selector Component
const CategorySelector = ({ selectedCategory, onSelect }) => {
  const categories = [
    { id: 'workshop', name: 'Workshop', color: colors.info },
    { id: 'talk', name: 'Talk', color: colors.success },
    { id: 'social', name: 'Social', color: colors.highlight },
    { id: 'other', name: 'Other', color: colors.muted },
  ];

  return (
    <View style={styles.categorySelector}>
      <Text style={styles.categorySelectorLabel}>Event Category*</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryOption,
              { borderColor: category.color },
              selectedCategory === category.id && { backgroundColor: `${category.color}20` }
            ]}
            onPress={() => onSelect(category.id)}
          >
            <Text style={[
              styles.categoryOptionText,
              { color: selectedCategory === category.id ? category.color : colors.muted }
            ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    requirements: '',
    agenda: '',
    speaker: '',
    speakerBio: '',
  });

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'date', 'time', 'location', 'capacity'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Validate capacity is a number
    if (isNaN(parseInt(formData.capacity)) || parseInt(formData.capacity) < 1) {
      Alert.alert('Invalid Capacity', 'Please enter a valid capacity number.');
      return;
    }

    // Validate future date/time
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      Alert.alert('Invalid Date/Time', 'Event date and time must be in the future.');
      return;
    }

    try {
      setLoading(true);
      await ApiService.submitEventRequest(formData);
      
      Alert.alert(
        'Event Request Submitted!',
        'Your event request has been submitted successfully and is now pending admin approval. You will be notified once it has been reviewed.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Failed to submit event request:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit event request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          {/* Form Introduction */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.introSection}>
            <View style={styles.introCard}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
                style={styles.introGradient}
              />
              <Text style={styles.introTitle}>Submit Event Request</Text>
              <Text style={styles.introDescription}>
                Fill out the form below to submit your event for admin review. All events require approval before being published.
              </Text>
            </View>
          </Animated.View>

          {/* Basic Information */}
          <View style={styles.section}>
            <FormCard title="Basic Information" delay={400}>
              <InputField
                icon={Type}
                label="Event Title"
                placeholder="Enter event title"
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
                required
              />
              <InputField
                icon={FileText}
                label="Description"
                placeholder="Enter event description"
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                multiline
                required
              />
              <CategorySelector
                selectedCategory={formData.category}
                onSelect={(category) => updateFormData('category', category)}
              />
            </FormCard>
          </View>

          {/* Event Details */}
          <View style={styles.section}>
            <FormCard title="Event Details" delay={600}>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <DatePickerField
                    label="Date"
                    value={formData.date}
                    onChange={(value) => updateFormData('date', value)}
                    required
                  />
                </View>
                <View style={styles.inputHalf}>
                  <TimePickerField
                    label="Time"
                    value={formData.time}
                    onChange={(value) => updateFormData('time', value)}
                    required
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <InputField
                    icon={MapPin}
                    label="Location"
                    placeholder="Event location"
                    value={formData.location}
                    onChangeText={(value) => updateFormData('location', value)}
                    required
                  />
                </View>
                <View style={styles.inputHalf}>
                  <CapacityPicker
                    label="Capacity"
                    value={formData.capacity}
                    onChange={(value) => updateFormData('capacity', value)}
                    required
                  />
                </View>
              </View>
            </FormCard>
          </View>

          {/* Additional Information */}
          <View style={styles.section}>
            <FormCard title="Additional Information" delay={800}>
              <InputField
                icon={FileText}
                label="Requirements"
                placeholder="Prerequisites or requirements for attendees"
                value={formData.requirements}
                onChangeText={(value) => updateFormData('requirements', value)}
                multiline
              />
              <InputField
                icon={FileText}
                label="Agenda"
                placeholder="Event schedule and agenda"
                value={formData.agenda}
                onChangeText={(value) => updateFormData('agenda', value)}
                multiline
              />
            </FormCard>
          </View>

          {/* Speaker Information */}
          <View style={styles.section}>
            <FormCard title="Speaker Information" delay={1000}>
              <InputField
                icon={User}
                label="Speaker Name"
                placeholder="Name of the speaker or organizer"
                value={formData.speaker}
                onChangeText={(value) => updateFormData('speaker', value)}
              />
              <InputField
                icon={FileText}
                label="Speaker Bio"
                placeholder="Brief biography of the speaker"
                value={formData.speakerBio}
                onChangeText={(value) => updateFormData('speakerBio', value)}
                multiline
              />
            </FormCard>
          </View>

          {/* Submit Button */}
          <Animated.View entering={FadeInUp.delay(1200)} style={styles.submitSection}>
            <Pressable 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={colors.white} style={styles.loadingSpinner} />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </>
              ) : (
                <>
                  <Send color={colors.white} size={18} strokeWidth={1.5} />
                  <Text style={styles.submitButtonText}>Submit Event Request</Text>
                </>
              )}
            </Pressable>
          </Animated.View>

          {/* Loading Overlay */}
          {loading && (
            <DataLoadingOverlay 
              visible={loading}
              message="Submitting Request"
              subMessage="Creating your event request for admin review"
              icon={Send}
            />
          )}

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

  // Intro Section
  introSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  introCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  introGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Form Card
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  formGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  formCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 20,
  },

  // Input Field
  inputField: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
  },
  required: {
    color: colors.error,
  },
  textInput: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primaryText,
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Input Row
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },

  // Category Selector
  categorySelector: {
    marginBottom: 20,
  },
  categorySelectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Submit Section
  submitSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  bottomSpacer: {
    height: 40,
  },

  // Loading Overlay
  loadingSpinner: {
    marginRight: 8,
  },

  // Disabled Submit Button
  submitButtonDisabled: {
    backgroundColor: colors.muted,
  },

  // Date Picker Field
  pickerButton: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
  },
  pickerButtonTextSelected: {
    color: colors.accent,
  },

  // Time Picker Field
  iosPicker: {
    width: 200,
    height: 200,
  },
  iosPickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  pickerActionButton: {
    padding: 12,
  },
  pickerActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },

  // Capacity Picker
  capacityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capacityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  capacityOptionSelected: {
    backgroundColor: colors.lightAccent,
    borderColor: colors.accent,
  },
  capacityOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  capacityOptionTextSelected: {
    color: colors.accent,
  },
}; 