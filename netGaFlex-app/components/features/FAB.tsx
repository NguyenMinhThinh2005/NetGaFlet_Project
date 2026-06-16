import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Theme from '../../constants/Theme';

interface FABProps {
  onClick: () => void;
  icon?: string;
  tooltip?: string;
}

export default function FAB({ onClick, icon = '✨', tooltip }: FABProps) {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // We can wrap useRef for anim states
  const bounceTimer = useRef<any>(null);

  useEffect(() => {
    if (tooltip) {
      // Show tooltip after 2s
      const timer = setTimeout(() => {
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Bounce animation loop
        const startBounce = () => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: -8,
                duration: 750,
                useNativeDriver: true,
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true,
              }),
            ])
          ).start();
        };
        startBounce();
      }, 2000);

      // Hide tooltip after 7s
      const hideTimer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 7000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [tooltip]);

  const handlePress = () => {
    onClick();
  };

  return (
    <View style={styles.container}>
      {/* Tooltip */}
      {tooltip && visible && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: fadeAnim,
              transform: [{ translateY: bounceAnim }],
            },
          ]}
        >
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </Animated.View>
      )}

      {/* Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={[styles.button, Theme.glows.red]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Inline ref definition
import { useRef } from 'react';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
    zIndex: 99,
  },
  tooltip: {
    backgroundColor: 'rgba(26,26,36,0.95)',
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tooltipText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: Theme.typography.fontFamily,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
