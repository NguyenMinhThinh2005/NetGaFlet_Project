import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import Theme from '../../constants/Theme';

interface ToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const leftPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 23],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange(!value)}
      style={[
        styles.track,
        {
          backgroundColor: value ? Theme.colors.primary : Theme.colors.surfaceElevated,
        },
        value ? Theme.glows.red : {},
      ]}
    >
      <Animated.View style={[styles.thumb, { left: leftPosition }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
