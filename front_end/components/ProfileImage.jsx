import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileImage = ({ 
  imageUrl, 
  name, 
  size = 52, 
  textSize, 
  borderRadius, 
  backgroundColor = '#3EB489',
  textColor = '#FFFFFF',
  borderWidth = 0,
  borderColor = 'transparent',
  style = {},
  showGradient = false,
  gradientColors = ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)']
}) => {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const finalBorderRadius = borderRadius || size / 4;
  const finalTextSize = textSize || size * 0.4;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: finalBorderRadius,
    backgroundColor: imageUrl && !imageError ? 'transparent' : backgroundColor,
    borderWidth,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getInitial = () => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Show text avatar if no image URL or image failed to load
  if (!imageUrl || imageError) {
    return (
      <View style={containerStyle}>
        {showGradient && (
          <LinearGradient
            colors={gradientColors}
            style={{
              position: 'absolute',
              width: size + 8,
              height: size + 8,
              borderRadius: finalBorderRadius + 4,
              top: -4,
              left: -4,
            }}
          />
        )}
        <Text style={{
          fontSize: finalTextSize,
          fontWeight: '700',
          color: textColor,
          letterSpacing: 0.5,
        }}>
          {getInitial()}
        </Text>
      </View>
    );
  }

  // Show image with loading state
  return (
    <View style={containerStyle}>
      {showGradient && (
        <LinearGradient
          colors={gradientColors}
          style={{
            position: 'absolute',
            width: size + 8,
            height: size + 8,
            borderRadius: finalBorderRadius + 4,
            top: -4,
            left: -4,
          }}
        />
      )}
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: finalBorderRadius,
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        resizeMode="cover"
      />
      {imageLoading && (
        <View style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: finalBorderRadius,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size="small" color={textColor} />
        </View>
      )}
    </View>
  );
};

export default ProfileImage; 