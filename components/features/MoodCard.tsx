import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../constants/Theme';

interface Mood {
  emoji: string;
  label: string;
}

interface MoodCardProps {
  mood: Mood;
  selected: boolean;
  onToggle: (label: string) => void;
}

export default function MoodCard({ mood, selected, onToggle }: MoodCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onToggle(mood.label)}
      style={[
        styles.card,
        {
          backgroundColor: selected ? 'rgba(229,9,20,0.08)' : Theme.colors.surface,
          borderColor: selected ? Theme.colors.primary : Theme.colors.divider,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      <Text style={styles.emoji}>{mood.emoji}</Text>
      <Text
        style={[
          styles.label,
          {
            fontWeight: selected ? '600' : '400',
            color: selected ? Theme.colors.textPrimary : Theme.colors.textSecondary,
          },
        ]}
      >
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.roundness.card,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 88,
    flex: 1,
    margin: 6,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 36,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
    fontFamily: Theme.typography.fontFamily,
  },
});
