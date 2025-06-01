import { View, Text, ScrollView, TextInput, Pressable, StatusBar, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
  CheckCircle
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

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
        <Icon color="#6366f1" size={16} strokeWidth={1.5} />
        <Text style={styles.inputLabelText}>
          {label}{required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
};

// Category Selector Component
const CategorySelector = ({ selectedCategory, onSelect }) => {
  const categories = [
    { id: 'workshop', name: 'Workshop', color: '#3b82f6' },
    { id: 'career', name: 'Career', color: '#10b981' },
    { id: 'coding', name: 'Coding', color: '#f59e0b' },
    { id: 'social', name: 'Social', color: '#8b5cf6' },
    { id: 'competition', name: 'Competition', color: '#ef4444' },
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
              { color: selectedCategory === category.id ? category.color : '#9ca3af' }
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
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'date', 'time', 'location', 'capacity'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Submit the event request
    Alert.alert(
      'Event Request Submitted',
      'Your event request has been submitted for admin review. You will be notified once it has been reviewed.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <InputField
                    icon={Calendar}
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    value={formData.date}
                    onChangeText={(value) => updateFormData('date', value)}
                    required
                  />
                </View>
                <View style={styles.inputHalf}>
                  <InputField
                    icon={Clock}
                    label="Time"
                    placeholder="HH:MM AM/PM"
                    value={formData.time}
                    onChangeText={(value) => updateFormData('time', value)}
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
                  <InputField
                    icon={Users}
                    label="Capacity"
                    placeholder="Max participants"
                    value={formData.capacity}
                    onChangeText={(value) => updateFormData('capacity', value)}
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
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Send color="#ffffff" size={18} strokeWidth={1.5} />
              <Text style={styles.submitButtonText}>Submit Event Request</Text>
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

  // Background
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientBase: {
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

  // Intro Section
  introSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  introCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
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
    color: '#ffffff',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Form Card
  formCard: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
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
    color: '#ffffff',
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
    color: '#ffffff',
  },
  required: {
    color: '#ef4444',
  },
  textInput: {
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#1a2332',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#ffffff',
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
    color: '#ffffff',
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
    backgroundColor: '#0f1419',
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
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  bottomSpacer: {
    height: 40,
  },
}; 