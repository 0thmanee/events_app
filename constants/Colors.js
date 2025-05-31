/**
 * 1337 Event Management - Color System
 * Modern, elegant, and professional color palette
 */

export const Colors = {
  // 1337 Brand Colors
  brand: {
    primary: '#0ea5e9',     // Main 1337 Blue
    secondary: '#a855f7',   // Elegant Purple
    accent: '#10b981',      // Success Green
    warning: '#f59e0b',     // Event Alert Orange
    error: '#ef4444',       // Critical Red
  },

  // Light Theme
  light: {
    // Backgrounds
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    
    // Text
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Interactive
    interactive: '#0ea5e9',
    interactiveHover: '#0284c7',
    interactivePressed: '#0369a1',
    
    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    
    // Glass Effect
    glass: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },

  // Dark Theme
  dark: {
    // Backgrounds
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    
    // Text
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    // Borders
    border: '#475569',
    borderLight: '#334155',
    
    // Interactive
    interactive: '#38bdf8',
    interactiveHover: '#0ea5e9',
    interactivePressed: '#0284c7',
    
    // Status Colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
    
    // Glass Effect
    glass: 'rgba(0, 0, 0, 0.2)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  // Gradients
  gradients: {
    primary: ['#0ea5e9', '#3b82f6', '#8b5cf6'],
    success: ['#10b981', '#34d399'],
    warning: ['#f59e0b', '#fbbf24'],
    error: ['#ef4444', '#f87171'],
    dark: ['#0c4a6e', '#1e3a8a', '#581c87'],
  },

  // Event Status Colors
  eventStatus: {
    live: {
      bg: '#10b981',
      text: '#ffffff',
      badge: '#dcfce7',
      badgeText: '#166534',
    },
    upcoming: {
      bg: '#0ea5e9',
      text: '#ffffff',
      badge: '#dbeafe',
      badgeText: '#1e40af',
    },
    ended: {
      bg: '#64748b',
      text: '#ffffff',
      badge: '#f1f5f9',
      badgeText: '#475569',
    },
    cancelled: {
      bg: '#ef4444',
      text: '#ffffff',
      badge: '#fee2e2',
      badgeText: '#dc2626',
    },
  },

  // User Level Colors
  levels: {
    beginner: {
      bg: '#10b981',
      text: '#ffffff',
      gradient: ['#10b981', '#34d399'],
    },
    intermediate: {
      bg: '#0ea5e9',
      text: '#ffffff',
      gradient: ['#0ea5e9', '#38bdf8'],
    },
    advanced: {
      bg: '#a855f7',
      text: '#ffffff',
      gradient: ['#a855f7', '#c084fc'],
    },
    expert: {
      bg: '#f59e0b',
      text: '#ffffff',
      gradient: ['#f59e0b', '#fbbf24'],
    },
  },

  // Wallet Colors
  wallet: {
    positive: '#10b981',
    negative: '#ef4444',
    neutral: '#64748b',
    gradient: ['#0ea5e9', '#a855f7'],
  },
};

// Helper function to get theme colors
export const getThemeColors = (isDark = false) => {
  return isDark ? Colors.dark : Colors.light;
};

// Helper function to get event status color
export const getEventStatusColor = (status) => {
  return Colors.eventStatus[status] || Colors.eventStatus.upcoming;
};

// Helper function to get level color
export const getLevelColor = (level) => {
  return Colors.levels[level] || Colors.levels.beginner;
}; 