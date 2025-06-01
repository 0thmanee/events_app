import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  icon: Icon,
  style,
  textStyle,
  gradient,
  ...props 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#3b82f6',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: '#3b82f6',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingHorizontal: 32,
          paddingVertical: 16,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: 24,
          paddingVertical: 12,
          minHeight: 48,
        };
    }
  };

  const ButtonComponent = (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {Icon && <Icon size={20} color="#ffffff" style={styles.icon} />}
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );

  if (gradient && variant === 'primary') {
    return (
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={gradient}
          style={[
            styles.button,
            getSizeStyles(),
            disabled && styles.disabled,
            style,
          ]}
        >
          <Pressable
            onPress={disabled ? undefined : onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={styles.gradientInner}
            {...props}
          >
            {Icon && <Icon size={20} color="#ffffff" style={styles.icon} />}
            <Text style={[styles.text, textStyle]}>
              {title}
            </Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle]}>
      {ButtonComponent}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Add your button styles here
  },
  disabled: {
    // Add your disabled styles here
  },
  icon: {
    // Add your icon styles here
  },
  text: {
    // Add your text styles here
  },
  gradientInner: {
    // Add your gradient inner styles here
  },
});

export default Button; 