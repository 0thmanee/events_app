import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  aspectRatio: SCREEN_HEIGHT / SCREEN_WIDTH,
};

/**
 * Responsive width based on screen percentage
 */
export const wp = (percentage) => {
  return (percentage * SCREEN_WIDTH) / 100;
};

/**
 * Responsive height based on screen percentage
 */
export const hp = (percentage) => {
  return (percentage * SCREEN_HEIGHT) / 100;
};

/**
 * Responsive font size
 */
export const rf = (size) => {
  const scale = SCREEN_WIDTH / 375; // iPhone X base width
  const newSize = size * scale;
  return Math.max(12, PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Check if device has a notch (rough approximation)
 */
export const hasNotch = () => {
  return SCREEN_HEIGHT / SCREEN_WIDTH > 2;
};

/**
 * Safe area insets approximation
 */
export const getSafeAreaInsets = () => {
  const hasNotchDevice = hasNotch();
  return {
    top: hasNotchDevice ? 44 : 20,
    bottom: hasNotchDevice ? 34 : 0,
  };
};

/**
 * Common spacing values
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}; 