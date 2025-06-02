import { View, Text, ScrollView, Pressable, Alert, StatusBar, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  User,
  Tag,
  Edit3
} from 'lucide-react-native';
import ApiService from '../services/ApiService';
import { ProfessionalBackground } from '../components/LoadingComponents';

// Color Palette
const colors = {
  primaryBg: '#F5F5F5',
  secondaryBg: '#EAEAEA',
  primaryText: '#333333',
  secondaryText: '#555555',
  accent: '#3EB489',
  highlight: '#E1C3AD',
  error: '#D9534F',
  white: '#FFFFFF',
  lightAccent: '#3EB48920',
  lightHighlight: '#E1C3AD30',
  cardBorder: '#E0E0E0',
  shadow: '#00000015',
  success: '#059669',
  warning: '#d97706',
  info: '#2563eb',
  muted: '#9ca3af'
};

// Form Field Component
const FormField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default', icon: Icon, required = false }) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldHeader}>
      <View style={styles.labelContainer}>
        {Icon && <Icon color={colors.accent} size={16} strokeWidth={2} />}
        <Text style={styles.fieldLabel}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
      </View>
    </View>
    <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  </View>
);

// Category Selector Component
const CategorySelector = ({ selectedCategory, onSelect }) => {
  const categories = [
    { id: 'workshop', label: 'Workshop', color: '#3b82f6' },
    { id: 'talk', label: 'Talk', color: '#8b5cf6' },
    { id: 'social', label: 'Social', color: '#10b981' },
    { id: 'other', label: 'Other', color: '#f59e0b' },
  ];

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.labelContainer}>
          <Tag color={colors.accent} size={16} strokeWidth={2} />
          <Text style={styles.fieldLabel}>
            Category <Text style={styles.requiredStar}>*</Text>
          </Text>
        </View>
      </View>
      <View style={styles.categoryGrid}>
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryOption,
              selectedCategory === category.id && styles.categoryOptionSelected,
              { borderColor: category.color }
            ]}
            onPress={() => onSelect(category.id)}
          >
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextSelected
            ]}>
              {category.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default function EditEvent() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    status: ''
  });

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (id) {
      loadEventData();
    }
  }, [id]);

  const loadEventData = async () => {
    try {
      const event = await ApiService.getEventById(id);
      
      // Convert backend data to form format
      const eventDate = new Date(event.time);
      const dateStr = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = eventDate.toTimeString().substr(0, 5); // HH:MM

      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        date: dateStr,
        time: timeStr,
        location: event.location || '',
        capacity: event.maxCapacity?.toString() || '',
        status: event.status || ''
      });
    } catch (error) {
      console.error('Failed to load event:', error);
      Alert.alert('Error', 'Failed to load event data');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
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

    // Validate future date/time (if changing date/time)
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      Alert.alert('Invalid Date/Time', 'Event date and time must be in the future.');
      return;
    }

    try {
      setLoading(true);
      await ApiService.updateEvent(id, formData);
      
      Alert.alert(
        'Event Updated!',
        'The event has been updated successfully.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Failed to update event:', error);
      Alert.alert(
        'Update Failed',
        error.message || 'Failed to update event. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProfessionalBackground />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Edit Event</Text>
            <Text style={styles.headerSubtitle}>Update event details</Text>
          </View>
          <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Save color={colors.white} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formCard}>
            <LinearGradient
              colors={[colors.lightAccent, 'transparent', colors.lightHighlight]}
              style={styles.formGradient}
              locations={[0, 0.5, 1]}
            />

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <FormField
                label="Event Title"
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
                placeholder="Enter event title"
                icon={Edit3}
                required
              />

              <FormField
                label="Description"
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="Describe the event details, objectives, and what participants will learn"
                icon={FileText}
                multiline
                required
              />

              <CategorySelector
                selectedCategory={formData.category}
                onSelect={(category) => updateFormData('category', category)}
              />
            </View>

            {/* Schedule & Logistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule & Logistics</Text>
              
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <FormField
                    label="Date"
                    value={formData.date}
                    onChangeText={(value) => updateFormData('date', value)}
                    placeholder="YYYY-MM-DD"
                    icon={Calendar}
                    required
                  />
                </View>
                <View style={styles.halfField}>
                  <FormField
                    label="Time"
                    value={formData.time}
                    onChangeText={(value) => updateFormData('time', value)}
                    placeholder="HH:MM"
                    icon={Clock}
                    required
                  />
                </View>
              </View>

              <FormField
                label="Location"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                placeholder="Event location (room, building, or virtual link)"
                icon={MapPin}
                required
              />

              <FormField
                label="Maximum Capacity"
                value={formData.capacity}
                onChangeText={(value) => updateFormData('capacity', value)}
                placeholder="50"
                icon={Users}
                keyboardType="numeric"
                required
              />
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: 20,
  },

  // Form Card
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 20,
  },

  // Form Fields
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
  },
  requiredStar: {
    color: colors.error,
  },
  inputContainer: {
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  multilineContainer: {
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Row Fields
  rowFields: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },

  // Category Selector
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: colors.lightAccent,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  categoryTextSelected: {
    color: colors.primaryText,
  },

  bottomSpacer: {
    height: 40,
  },
}); 