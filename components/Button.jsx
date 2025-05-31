import { Pressable, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onPress,
  ...props 
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 active:bg-primary-600';
      case 'secondary':
        return 'bg-secondary-500 active:bg-secondary-600';
      case 'ghost':
        return 'bg-transparent active:bg-neutral-100';
      default:
        return 'bg-primary-500 active:bg-primary-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 rounded-lg';
      case 'md':
        return 'px-6 py-3 rounded-xl';
      case 'lg':
        return 'px-8 py-4 rounded-2xl';
      default:
        return 'px-6 py-3 rounded-xl';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'font-semibold text-center';
    const colorStyles = variant === 'ghost' ? 'text-primary-600' : 'text-white';
    const sizeStyles = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
    return `${baseStyles} ${colorStyles} ${sizeStyles}`;
  };

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      className={`
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        ${disabled ? 'opacity-50' : ''}
      `}
      {...props}
    >
      <Text className={getTextStyles()}>
        {children}
      </Text>
    </AnimatedPressable>
  );
} 