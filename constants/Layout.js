/**
 * 1337 Event Management - Layout Constants
 * Responsive design system and spacing
 */
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Layout = {
  // Screen Dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 380,   // Small phones
    md: 414,   // Standard phones
    lg: 768,   // Large phones / small tablets
    xl: 1024,  // Tablets
  },

  // Spacing System (8px base unit)
  spacing: {
    xs: 4,      // 0.25rem
    sm: 8,      // 0.5rem
    md: 16,     // 1rem
    lg: 24,     // 1.5rem
    xl: 32,     // 2rem
    '2xl': 48,  // 3rem
    '3xl': 64,  // 4rem
    '4xl': 80,  // 5rem
    '5xl': 96,  // 6rem
  },

  // Border Radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    round: 9999,
  },

  // Component Sizes
  components: {
    // Header Heights
    header: {
      default: 60,
      large: 80,
      compact: 50,
    },

    // Tab Bar
    tabBar: {
      height: Platform.OS === 'ios' ? 85 : 70,
      paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    },

    // Buttons
    button: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
        xl: 60,
      },
      borderRadius: 12,
    },

    // Cards
    card: {
      minHeight: 120,
      borderRadius: 16,
      padding: 16,
    },

    // Event Cards
    eventCard: {
      height: 200,
      width: screenWidth - 32,
      borderRadius: 20,
    },

    // Profile Avatar
    avatar: {
      sm: 32,
      md: 48,
      lg: 64,
      xl: 80,
      '2xl': 120,
    },

    // Input Fields
    input: {
      height: 48,
      borderRadius: 12,
      padding: 16,
    },

    // Modal
    modal: {
      borderRadius: 24,
      padding: 24,
    },
  },

  // Safe Area
  safeArea: {
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  },

  // Animation Durations (ms)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },

  // Z-Index Layers
  zIndex: {
    background: 0,
    content: 1,
    overlay: 10,
    modal: 100,
    notification: 1000,
    tooltip: 1001,
  },

  // Icon Sizes
  icons: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 48,
  },

  // Typography Scale (matches Tailwind config)
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Shadow Presets
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    strong: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 32,
      elevation: 8,
    },
  },
};

// Helper Functions
export const isSmallScreen = () => screenWidth < Layout.breakpoints.md;
export const isMediumScreen = () => screenWidth >= Layout.breakpoints.md && screenWidth < Layout.breakpoints.lg;
export const isLargeScreen = () => screenWidth >= Layout.breakpoints.lg;

export const getResponsiveValue = (small, medium, large) => {
  if (isSmallScreen()) return small;
  if (isMediumScreen()) return medium;
  return large;
};

export const getComponentSize = (component, size = 'md') => {
  return Layout.components[component]?.[size] || Layout.components[component]?.md || 44;
}; 