import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl, Alert, StatusBar, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Share2,
  Heart,
  Star,
  Award,
  Code,
  Briefcase,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  FileText,
  Building,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Settings,
  Bell,
  Copy,
  Download,
  ArrowLeft,
  ChevronRight,
  Target,
  Sparkles,
  Trophy,
  MoreHorizontal,
  QrCode,
  CalendarPlus
} from 'lucide-react-native';
import AdminHeader from '../components/AdminHeader';
import ApiService from '../services/ApiService';
import CalendarService from '../services/CalendarService';
import QRCodeService from '../services/QRCodeService';
import { isStaff } from '../utils/auth';
import { 
  ProfessionalBackground
} from '../components/LoadingComponents';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], icon: Clock, label: 'Pending Review' };
      case 'approved':
        return { color: '#10b981', gradient: ['#10b981', '#059669'], icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], icon: XCircle, label: 'Rejected' };
      default:
        return { color: '#6b7280', gradient: ['#6b7280', '#4b5563'], icon: AlertCircle, label: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <StatusIcon color={config.color} size={14} strokeWidth={2} />
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const getCategoryConfig = (category) => {
    switch (category?.toLowerCase()) {
      case 'workshop':
        return { color: '#3b82f6', icon: Code, label: 'Workshop' };
      case 'career':
        return { color: '#10b981', icon: Briefcase, label: 'Career' };
      case 'coding':
        return { color: '#f59e0b', icon: Code, label: 'Coding' };
      case 'social':
        return { color: '#8b5cf6', icon: Heart, label: 'Social' };
      case 'competition':
        return { color: '#ef4444', icon: Award, label: 'Competition' };
      default:
        return { color: '#6b7280', icon: BookOpen, label: category || 'Event' };
    }
  };

  const config = getCategoryConfig(category);
  const CategoryIcon = config.icon;

  return (
    <View style={[styles.categoryBadge, { backgroundColor: `${config.color}20`, borderColor: config.color }]}>
      <CategoryIcon color={config.color} size={12} strokeWidth={2} />
      <Text style={[styles.categoryBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

// Info Card Component
const InfoCard = ({ icon: Icon, title, value, color = '#6b7280' }) => (
  <View style={styles.infoCard}>
    <View style={[styles.infoCardIcon, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Icon color={color} size={18} strokeWidth={2} />
    </View>
    <View style={styles.infoCardContent}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  </View>
);

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
            <Text style={styles.headerGreeting}>Event</Text>
            <Text style={styles.headerTitle}>Details</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton}>
            <Share2 color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <MoreHorizontal color={colors.secondaryText} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Event Hero Card
const EventHeroCard = ({ event }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle, text: 'Approved' };
      case 'pending':
        return { color: '#d97706', bg: '#fef3c7', icon: Clock, text: 'Pending' };
      case 'rejected':
        return { color: '#dc2626', bg: '#fef2f2', icon: XCircle, text: 'Rejected' };
      default:
        return { color: '#6b7280', bg: '#f9fafb', icon: Eye, text: 'View' };
    }
  };

  const getRegistrationStatusConfig = (status) => {
    switch (status) {
      case 'enrolled':
        return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle, text: 'Registered' };
      case 'full':
        return { color: '#dc2626', bg: '#fef2f2', icon: XCircle, text: 'Full' };
      case 'past':
        return { color: '#6b7280', bg: '#f9fafb', icon: Clock, text: 'Ended' };
      default:
        return { color: '#3b82f6', bg: '#eff6ff', icon: Users, text: 'Available' };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const registrationConfig = getRegistrationStatusConfig(event.registrationStatus);
  const StatusIcon = statusConfig.icon;
  const RegistrationIcon = registrationConfig.icon;

  return (
    <View style={styles.heroCard}>
      {/* Enhanced gradient overlay */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.1)', 'transparent', 'rgba(0, 0, 0, 0.1)']}
        style={styles.heroGradient}
        locations={[0, 0.6, 1]}
      />
      
      <View style={styles.heroHeader}>
        <View style={styles.heroMeta}>
          <Text style={styles.heroCategory}>{event.category}</Text>
          <Text style={styles.heroDate}>{event.date}</Text>
        </View>
        <View style={styles.heroStatusContainer}>
          <View style={[styles.heroStatus, { backgroundColor: statusConfig.bg }]}>
            <StatusIcon color={statusConfig.color} size={12} strokeWidth={1.5} />
            <Text style={[styles.heroStatusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>
          <View style={[styles.heroStatus, { backgroundColor: registrationConfig.bg }]}>
            <RegistrationIcon color={registrationConfig.color} size={12} strokeWidth={1.5} />
            <Text style={[styles.heroStatusText, { color: registrationConfig.color }]}>
              {registrationConfig.text}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.heroTitle}>{event.title}</Text>
      <Text style={styles.heroDescription}>{event.description}</Text>

      <View style={styles.heroDetailsGrid}>
        <View style={styles.heroDetail}>
          <Clock color="#6366f1" size={16} strokeWidth={1.5} />
          <Text style={styles.heroDetailText}>{event.time}</Text>
        </View>
        <View style={styles.heroDetail}>
          <MapPin color="#6366f1" size={16} strokeWidth={1.5} />
          <Text style={styles.heroDetailText}>{event.location}</Text>
        </View>
        <View style={styles.heroDetail}>
          <Users color="#6366f1" size={16} strokeWidth={1.5} />
          <Text style={styles.heroDetailText}>{event.registered}/{event.capacity}</Text>
        </View>
        <View style={styles.heroDetail}>
          <User color="#6366f1" size={16} strokeWidth={1.5} />
          <Text style={styles.heroDetailText}>{event.organizer}</Text>
        </View>
      </View>

      <View style={styles.heroFooter}>
        <View style={styles.heroProgress}>
          <View style={styles.heroProgressBar}>
            <View style={[styles.heroProgressFill, { width: `${(event.registered/event.capacity) * 100}%` }]} />
          </View>
          <Text style={styles.heroProgressText}>
            {event.registered} of {event.capacity} registered • {event.capacity - event.registered} spots left
          </Text>
        </View>
        <View style={styles.heroCredits}>
          <Text style={styles.heroCreditsText}>{event.credits} Credits</Text>
        </View>
      </View>
    </View>
  );
};

// Info Section Card
const InfoSectionCard = ({ title, children, delay = 0 }) => {
  return (
    <View style={styles.infoSectionCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.02)', 'transparent']}
        style={styles.infoSectionGradient}
      />
      <Text style={styles.infoSectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

// Agenda Item Component
const AgendaItem = ({ time, activity, index }) => {
  return (
    <View style={styles.agendaItem}>
      <View style={styles.agendaTimeContainer}>
        <Text style={styles.agendaTime}>{time}</Text>
      </View>
      <View style={styles.agendaContent}>
        <Text style={styles.agendaActivity}>{activity}</Text>
      </View>
    </View>
  );
};

// Volunteer Card Component
const VolunteerCard = ({ volunteer, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const statusColor = getStatusColor(volunteer.status);

  return (
    <View style={styles.volunteerCard}>
      <View style={styles.volunteerAvatar}>
        <Text style={styles.volunteerAvatarText}>{volunteer.name.charAt(0)}</Text>
      </View>
      <View style={styles.volunteerInfo}>
        <Text style={styles.volunteerName}>{volunteer.name}</Text>
        <Text style={styles.volunteerRole}>{volunteer.role}</Text>
      </View>
      <View style={[styles.volunteerStatus, { backgroundColor: `${statusColor}20` }]}>
        <Text style={[styles.volunteerStatusText, { color: statusColor }]}>
          {volunteer.status}
        </Text>
      </View>
    </View>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, title, onPress, variant = 'primary', disabled = false, style }) => {
  const getButtonStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.actionButtonDisabled;
    }
    
    switch (variant) {
      case 'primary':
        return styles.actionButtonPrimary;
      case 'secondary':
        return styles.actionButtonSecondary;
      case 'danger':
        return styles.actionButtonDanger;
      default:
        return styles.actionButtonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.actionButtonTextDisabled;
    }
    if (variant === 'secondary') {
      return styles.actionButtonTextSecondary;
    }
    return styles.actionButtonText;
  };

  const getIconColor = () => {
    if (disabled || variant === 'disabled') {
      return '#6b7280';
    }
    if (variant === 'secondary') {
      return colors.primaryText; // Dark color for secondary buttons
    }
    return '#ffffff';
  };

  return (
    <Pressable 
      style={[styles.actionButton, getButtonStyle(), style]} 
      onPress={onPress}
      disabled={disabled || variant === 'disabled'}
    >
      <Icon color={getIconColor()} size={18} strokeWidth={1.5} />
      <Text style={getTextStyle()}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
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

  scrollContent: {
    paddingBottom: 120,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 32,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
    padding: 28,
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroMeta: {
    flex: 1,
  },
  heroCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroDate: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  heroStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  heroStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 12,
    lineHeight: 30,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 24,
  },
  heroDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  heroDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: '45%',
  },
  heroDetailText: {
    fontSize: 13,
    color: colors.primaryText,
    fontWeight: '500',
  },
  heroFooter: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  heroProgress: {
    gap: 8,
  },
  heroProgressBar: {
    height: 6,
    backgroundColor: colors.secondaryBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: colors.info,
    borderRadius: 3,
  },
  heroProgressText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  heroCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroCreditsText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Info Section Card
  infoSectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
  },
  infoSectionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 16,
  },

  // Requirements
  requirementsText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },

  // Agenda
  agendaContainer: {
    gap: 12,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  agendaTimeContainer: {
    backgroundColor: colors.lightAccent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  agendaTime: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  agendaContent: {
    flex: 1,
  },
  agendaActivity: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Speaker
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  speakerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.lightAccent,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  speakerTitle: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
    marginBottom: 8,
  },
  speakerBio: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },

  // Volunteers
  volunteersContainer: {
    gap: 12,
  },
  volunteerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 12,
  },
  volunteerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightAccent,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volunteerAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  volunteerInfo: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 2,
  },
  volunteerRole: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  volunteerStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  volunteerStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  
  // Staff Actions Styles
  staffActionsHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  staffActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  staffActionsSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  staffStatsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  staffStat: {
    flex: 1,
    alignItems: 'center',
  },
  staffStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 4,
  },
  staffStatLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  staffStatDivider: {
    width: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 16,
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonSecondary: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  actionButtonDanger: {
    backgroundColor: '#ef4444',
  },
  actionButtonDisabled: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
  actionButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },

  bottomSpacer: {
    height: 40,
  },

  // Info Card Styles
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  
  // Badge Styles
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Footer
  footer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  footerCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default function EventDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [userIsStaff, setUserIsStaff] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (id) {
      loadEventDetails();
      checkUserRole();
    }
  }, [id]);

  const checkUserRole = async () => {
    try {
      const staffStatus = await isStaff();
      setUserIsStaff(staffStatus);
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserIsStaff(false);
    }
  };

  const loadEventDetails = async () => {
    try {
      setError(null);
      const backendEvent = await ApiService.getEventById(id);
      const transformedEvent = await ApiService.transformDetailedEventData(backendEvent);
      setEvent(transformedEvent);
    } catch (err) {
      console.error('Failed to load event details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEventDetails();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRegister = async () => {
    if (!event) return;
    
    try {
      setRegistering(true);
      
      if (event.registrationStatus === 'enrolled') {
        // Unregister from event
        await ApiService.unregisterFromEvent(event.id);
        Alert.alert('Success', 'You have been unregistered from this event.');
      } else {
        // Register for event
        await ApiService.registerForEvent(event.id);
        Alert.alert('Success', 'You have been registered for this event!');
      }
      
      // Reload event details to get updated registration status
      await loadEventDetails();
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', err.message || 'Failed to process registration. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    
    try {
      await Share.share({
        message: `Check out this event: ${event.title}`,
        url: `https://events.1337.ma/event/${event.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleQRCheckIn = () => {
    router.push(`/qr-check-in?eventId=${event.id}&mode=generate`);
  };

  const handleAddToCalendar = async () => {
    try {
      // Check if calendar service is available first
      const isAvailable = await CalendarService.isAvailable();
      if (!isAvailable) {
        Alert.alert(
          'Calendar Permission Required',
          'To add events to your calendar, please grant calendar permissions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Grant Permission', onPress: async () => {
              const granted = await CalendarService.requestPermissions();
              if (granted) {
                // Retry adding to calendar
                handleAddToCalendar();
              }
            }}
          ]
        );
        return;
      }

      const success = await CalendarService.addEventToCalendar(event);
      if (success) {
        // Success message is already shown by the service
        console.log('Event added to calendar successfully');
      }
    } catch (error) {
      console.error('Calendar error:', error);
      // Error alert is already shown by the service
    }
  };

  const handleGiveFeedback = () => {
    router.push(`/give-feedback?eventId=${event.id}`);
  };

  const checkIfCanGiveFeedback = () => {
    if (!event) return false;
    
    // Only allow feedback if user attended and event has ended
    if (event.registrationStatus !== 'enrolled' && event.attendanceStatus !== 'attended') {
      return false;
    }
    
    const now = new Date();
    const eventTime = new Date(event.time);
    const eventEndTime = new Date(eventTime.getTime() + (event.expectedTime || 2) * 60 * 60 * 1000);
    const feedbackAvailableTime = new Date(eventEndTime.getTime() + 5 * 60 * 1000); // 5 minutes after event ends
    
    return now >= feedbackAvailableTime;
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProfessionalBackground />
        <SafeAreaView style={styles.safeArea}>
          <StudentHeader onBack={handleBack} />
        </SafeAreaView>
      </View>
    );
  }

  // Show error state
  if (error || !event) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProfessionalBackground />
        <SafeAreaView style={styles.safeArea}>
          <StudentHeader onBack={handleBack} />
        </SafeAreaView>
      </View>
    );
  }

  const registrationPercentage = (event.registered / event.capacity) * 100;
  const availableSpots = event.capacity - event.registered;

  // Determine registration button state
  const getRegistrationButtonProps = () => {
    if (registering) {
      return {
        title: 'Processing...',
        variant: 'primary',
        disabled: true
      };
    }

    switch (event.registrationStatus) {
      case 'enrolled':
        return {
          title: 'Unregister from Event',
          variant: 'secondary',
          disabled: false
        };
      case 'full':
        return {
          title: 'Event Full',
          variant: 'disabled',
          disabled: true
        };
      case 'past':
        return {
          title: 'Event Ended',
          variant: 'disabled',
          disabled: true
        };
      default:
        return {
          title: 'Register for Event',
          variant: 'primary',
          disabled: false
        };
    }
  };

  const buttonProps = getRegistrationButtonProps();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <StudentHeader onBack={handleBack} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#9ca3af"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <EventHeroCard event={event} />
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <InfoSectionCard title="Requirements">
              <Text style={styles.requirementsText}>{event.requirements}</Text>
            </InfoSectionCard>
          </View>

          {/* Speaker Info */}
          <View style={styles.section}>
            <InfoSectionCard title="Speaker">
              <View style={styles.speakerCard}>
                <View style={styles.speakerAvatar}>
                  <Text style={styles.speakerAvatarText}>{event.speaker.name.charAt(0)}</Text>
                </View>
                <View style={styles.speakerInfo}>
                  <Text style={styles.speakerName}>{event.speaker.name}</Text>
                  <Text style={styles.speakerTitle}>{event.speaker.title}</Text>
                  <Text style={styles.speakerBio}>{event.speaker.bio}</Text>
                </View>
              </View>
            </InfoSectionCard>
          </View>

          {/* Volunteers */}
          {event.volunteers && event.volunteers.length > 0 && (
            <View style={styles.section}>
              <InfoSectionCard title="Event Volunteers">
                <View style={styles.volunteersContainer}>
                  {event.volunteers.map((volunteer, index) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} index={index} />
                  ))}
                </View>
              </InfoSectionCard>
            </View>
          )}

          {/* Action Buttons - Different for Staff vs Students */}
          {userIsStaff ? (
            // Staff QR Scanner Actions
            <View style={styles.actionsSection}>
              <View style={styles.staffActionsHeader}>
                <Text style={styles.staffActionsTitle}>Staff Check-in</Text>
                <Text style={styles.staffActionsSubtitle}>Scan student QR codes to verify registration</Text>
              </View>
              
              {/* Staff Actions Row */}
              <View style={styles.quickActionsRow}>
                <ActionButton
                  icon={QrCode}
                  title="Scan QR Code"
                  onPress={() => router.push(`/qr-scanner?eventId=${event.id}&mode=staff`)}
                  variant="primary"
                  style={styles.quickActionButton}
                />
                <ActionButton
                  icon={Users}
                  title="View Attendance"
                  onPress={() => router.push(`/event-attendance?eventId=${event.id}`)}
                  variant="primary"
                  style={styles.quickActionButton}
                />
              </View>
              
              {/* Event Stats for Staff */}
              <View style={styles.staffStatsCard}>
                <View style={styles.staffStat}>
                  <Text style={styles.staffStatValue}>{event.registered}</Text>
                  <Text style={styles.staffStatLabel}>Registered</Text>
                </View>
                <View style={styles.staffStatDivider} />
                <View style={styles.staffStat}>
                  <Text style={styles.staffStatValue}>{event.capacity - event.registered}</Text>
                  <Text style={styles.staffStatLabel}>Available</Text>
                </View>
                <View style={styles.staffStatDivider} />
                <View style={styles.staffStat}>
                  <Text style={styles.staffStatValue}>{Math.round((event.registered / event.capacity) * 100)}%</Text>
                  <Text style={styles.staffStatLabel}>Full</Text>
                </View>
              </View>
            </View>
          ) : (
            // Student Registration Actions
            <View style={styles.actionsSection}>
              {/* Quick Actions Row */}
              <View style={styles.quickActionsRow}>
                <ActionButton
                  icon={QrCode}
                  title="QR Check-in"
                  onPress={handleQRCheckIn}
                  variant="secondary"
                  disabled={false}
                  style={styles.quickActionButton}
                />
                <ActionButton
                  icon={CalendarPlus}
                  title="Add to Calendar"
                  onPress={handleAddToCalendar}
                  variant="secondary"
                  disabled={false}
                  style={styles.quickActionButton}
                />
                {checkIfCanGiveFeedback() && (
                  <ActionButton
                    icon={Star}
                    title="Give Feedback"
                    onPress={handleGiveFeedback}
                    variant="primary"
                    disabled={false}
                    style={styles.quickActionButton}
                  />
                )}
              </View>
              
              {/* Main Registration Button */}
              <ActionButton
                icon={UserPlus}
                title={buttonProps.title}
                onPress={handleRegister}
                variant={buttonProps.variant}
                disabled={buttonProps.disabled}
              />
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
} 