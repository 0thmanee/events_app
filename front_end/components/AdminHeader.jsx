import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import NotificationBell from './NotificationBell';

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

const AdminHeader = ({ title, subtitle }) => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.cleanHeader}>
      <View style={styles.headerRow}>
        {/* Innovative Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoSquare}>
            {/* Corner Accents */}
            <View style={styles.logoCornerTL} />
            <View style={styles.logoCornerBR} />
            
            {/* Logo Text */}
            <View style={styles.logoTextLines}>
              <Text style={styles.logoNumber}>13</Text>
              <Text style={styles.logoNumber}>37</Text>
            </View>
          </View>
          
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>EVENT.HUB</Text>
            <Text style={styles.logoSubtitle}>Professional</Text>
          </View>
        </View>

        {/* Settings Button - Student Style */}
        <View style={styles.headerActions}>
          <NotificationBell iconSize={20} showBadge={true} />
          <Pressable style={styles.headerButton} onPress={() => router.push('/settings')}>
            <Settings color={colors.accent} size={20} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
      
      {/* Page Title Section (if provided) */}
      {title && (
        <View style={styles.pageTitleSection}>
          <Text style={styles.pageTitle}>{title}</Text>
          {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
        </View>
      )}
    </Animated.View>
  );
};

const styles = {
  cleanHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSquare: {
    width: 56,
    height: 56,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 16,
    borderRadius: 16,
    shadowColor: colors.primaryText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.accent,
    borderTopLeftRadius: 8,
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.accent,
    borderBottomRightRadius: 8,
  },
  logoTextLines: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 1,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryText,
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  logoSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
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
  pageTitleSection: {
    marginTop: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default AdminHeader; 