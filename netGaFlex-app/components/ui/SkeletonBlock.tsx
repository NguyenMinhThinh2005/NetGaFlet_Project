import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleSheet } from 'react-native';
import Theme from '../../constants/Theme';

interface SkeletonBlockProps {
  width?: any;
  height?: any;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function SkeletonBlock({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style = {},
}: SkeletonBlockProps) {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: animatedValue,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Theme.colors.surfaceElevated,
  },
});
