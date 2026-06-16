import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../constants/Theme';

interface Genre {
  id: string;
  emoji: string;
  label: string;
}

interface GenreCardProps {
  genre: Genre;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function GenreCard({ genre, selected, onToggle }: GenreCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onToggle(genre.id)}
      style={[
        styles.card,
        {
          backgroundColor: selected ? 'rgba(229,9,20,0.12)' : Theme.colors.surface,
          borderColor: selected ? Theme.colors.primary : Theme.colors.divider,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      <Text style={styles.emoji}>{genre.emoji}</Text>
      <Text
        style={[
          styles.label,
          {
            fontWeight: selected ? '600' : '400',
            color: selected ? Theme.colors.textPrimary : Theme.colors.textSecondary,
          },
        ]}
      >
        {genre.label}
      </Text>

      {/* Checkmark badge */}
      {selected && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 88,
    borderRadius: Theme.roundness.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
    flex: 1,
    margin: 6,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: Theme.colors.textPrimary,
    fontWeight: '700',
  },
});
