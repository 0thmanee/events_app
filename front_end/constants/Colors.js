/**
 * 1337 Event Management - Modern Design System
 * Based on the beautiful dark theme with lime green accents
 */

export const Colors = {
  // Core Brand Colors - Matching the Design
  brand: {
    primary: '#9AE65C',        // Lime green from design
    primaryHover: '#7DD55C',   // Darker lime for interactions
    primaryPressed: '#6BC74F', // Even darker for pressed state
    secondary: '#1a2332',      // Dark blue-gray for secondary elements
    tertiary: '#0f1419',       // Darker background elements
  },

  // Background System
  background: {
    primary: '#0B0E13',        // Main app background (very dark)
    secondary: '#0F1419',      // Card backgrounds
    tertiary: '#1A2332',       // Elevated elements
    surface: '#232B3D',        // Input fields, modals
    overlay: 'rgba(11, 14, 19, 0.95)', // Modal overlays
  },

  // Text Hierarchy
  text: {
    primary: '#FFFFFF',        // Main headings, important text
    secondary: '#E2E8F0',      // Body text, descriptions
    tertiary: '#94A3B8',       // Muted text, placeholders
    quaternary: '#64748B',     // Very subtle text
    inverse: '#0B0E13',        // Text on light backgrounds
    accent: '#9AE65C',         // Lime text for highlights
  },

  // Interactive Elements
  interactive: {
    primary: '#9AE65C',        // Primary buttons, links
    primaryHover: '#7DD55C',   // Hover state
    primaryPressed: '#6BC74F', // Pressed state
    secondary: '#232B3D',      // Secondary buttons
    secondaryHover: '#2A3441', // Secondary hover
    disabled: '#374151',       // Disabled elements
    disabledText: '#6B7280',   // Disabled text
  },

  // Border System
  border: {
    primary: '#1A2332',        // Main borders
    secondary: '#232B3D',      // Subtle borders
    accent: '#9AE65C',         // Accent borders
    focus: '#7DD55C',          // Focus states
    error: '#EF4444',          // Error borders
    success: '#22C55E',        // Success borders
  },

  // Status Colors
  status: {
    success: {
      bg: '#22C55E',
      text: '#FFFFFF',
      light: '#DCFCE7',
      lightText: '#166534',
    },
    warning: {
      bg: '#F59E0B',
      text: '#FFFFFF',
      light: '#FEF3C7',
      lightText: '#92400E',
    },
    error: {
      bg: '#EF4444',
      text: '#FFFFFF',
      light: '#FEE2E2',
      lightText: '#DC2626',
    },
    info: {
      bg: '#3B82F6',
      text: '#FFFFFF',
      light: '#DBEAFE',
      lightText: '#1D4ED8',
    },
  },

  // Event Status (specific to the app)
  eventStatus: {
    live: {
      bg: '#22C55E',
      text: '#FFFFFF',
      badge: '#DCFCE7',
      badgeText: '#166534',
      indicator: '#10B981',
    },
    upcoming: {
      bg: '#3B82F6',
      text: '#FFFFFF',
      badge: '#DBEAFE',
      badgeText: '#1D4ED8',
      indicator: '#2563EB',
    },
    ended: {
      bg: '#6B7280',
      text: '#FFFFFF',
      badge: '#F3F4F6',
      badgeText: '#374151',
      indicator: '#4B5563',
    },
    cancelled: {
      bg: '#EF4444',
      text: '#FFFFFF',
      badge: '#FEE2E2',
      badgeText: '#DC2626',
      indicator: '#F87171',
    },
  },

  // Gradients - Modern and Elegant
  gradients: {
    primary: ['#9AE65C', '#7DD55C', '#6BC74F'],
    background: ['#0B0E13', '#0F1419', '#1A2332'],
    card: ['#0F1419', '#1A2332'],
    overlay: ['rgba(11, 14, 19, 0.8)', 'rgba(15, 20, 25, 0.9)'],
    success: ['#22C55E', '#16A34A'],
    warning: ['#F59E0B', '#D97706'],
    error: ['#EF4444', '#DC2626'],
    accent: ['#9AE65C', '#7DD55C'],
  },

  // Shadow System
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    accent: {
      shadowColor: '#9AE65C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  // Special Effects
  effects: {
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    shimmer: ['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)'],
    glow: 'rgba(154, 230, 92, 0.2)',
  },
};

// Modern Theme Object (Dark theme as primary)
export const Theme = {
  colors: Colors,
  
  // Typography Scale
  typography: {
    // Headers
    h1: { fontSize: 32, fontWeight: '800', lineHeight: 40, letterSpacing: -0.5 },
    h2: { fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.5 },
    h3: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.3 },
    h4: { fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.2 },
    h5: { fontSize: 18, fontWeight: '600', lineHeight: 26, letterSpacing: -0.1 },
    h6: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    
    // Body Text
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
    bodySemiBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    
    // Small Text
    small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    smallMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    smallSemiBold: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    
    // Tiny Text
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    captionBold: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
    
    // Overline
    overline: { fontSize: 10, fontWeight: '600', lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' },
  },
  
  // Spacing System (8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
  
  // Component Sizes
  sizes: {
    button: {
      small: { height: 36, paddingHorizontal: 16 },
      medium: { height: 44, paddingHorizontal: 20 },
      large: { height: 52, paddingHorizontal: 24 },
    },
    input: {
      small: { height: 36 },
      medium: { height: 44 },
      large: { height: 52 },
    },
  },
};

// Helper Functions
export const getTheme = () => Theme;

export const getStatusColor = (status) => {
  return Colors.status[status] || Colors.status.info;
};

export const getEventStatusColor = (status) => {
  return Colors.eventStatus[status] || Colors.eventStatus.upcoming;
};

// Utility function to create consistent card styles
export const createCardStyle = (variant = 'default') => {
  const baseStyle = {
    backgroundColor: Colors.background.secondary,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Colors.shadows.medium,
  };

  switch (variant) {
    case 'elevated':
      return {
        ...baseStyle,
        backgroundColor: Colors.background.tertiary,
        ...Colors.shadows.large,
      };
    case 'accent':
      return {
        ...baseStyle,
        borderColor: Colors.border.accent,
        ...Colors.shadows.accent,
      };
    default:
      return baseStyle;
  }
};

// Utility function for consistent button styles
export const createButtonStyle = (variant = 'primary', size = 'medium') => {
  const sizeStyle = Theme.sizes.button[size];
  
  const baseStyle = {
    ...sizeStyle,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: Colors.interactive.primary,
        ...Colors.shadows.accent,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: Colors.interactive.secondary,
        borderWidth: 1,
        borderColor: Colors.border.primary,
        ...Colors.shadows.medium,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.border.accent,
      };
    default:
      return baseStyle;
  }
}; 