import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User } from 'lucide-react-native';

const AdminHeader = ({ title, subtitle }) => {
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

        {/* User Profile Icon */}
        <Pressable style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <User color="#3b82f6" size={20} strokeWidth={2} />
          </View>
          <View style={styles.profileDot} />
        </Pressable>
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
    paddingBottom: 24,
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
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 16,
  },
  logoCornerTL: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#3b82f6',
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#3b82f6',
  },
  logoTextLines: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    fontFamily: 'monospace',
    textShadowColor: '#3b82f6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    lineHeight: 18,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 2,
  },
  profileButton: {
    position: 'relative',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  pageTitleSection: {
    marginTop: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
};

export default AdminHeader; 