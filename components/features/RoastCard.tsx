import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../constants/Theme';

interface RoastCardProps {
  text: string;
}

export default function RoastCard({ text }: RoastCardProps) {
  return (
    <View style={styles.card}>
      {/* Opening quote */}
      <Text style={styles.quoteOpen} pointerEvents="none">
        "
      </Text>

      {/* Text */}
      <Text style={styles.text}>{text}</Text>

      {/* Closing quote */}
      <View style={styles.quoteCloseContainer} pointerEvents="none">
        <Text style={styles.quoteClose}>"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.25)',
    position: 'relative',
    overflow: 'hidden',
  },
  quoteOpen: {
    position: 'absolute',
    top: -8,
    left: 16,
    color: Theme.colors.primary,
    fontSize: 80,
    fontWeight: '700',
    opacity: 0.8,
    fontFamily: 'Georgia',
  },
  text: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    position: 'relative',
    zIndex: 1,
    fontFamily: Theme.typography.fontFamily,
  },
  quoteCloseContainer: {
    position: 'absolute',
    bottom: -32,
    right: 16,
    transform: [{ rotate: '180deg' }],
  },
  quoteClose: {
    color: Theme.colors.primary,
    fontSize: 80,
    fontWeight: '700',
    opacity: 0.8,
    fontFamily: 'Georgia',
  },
});
