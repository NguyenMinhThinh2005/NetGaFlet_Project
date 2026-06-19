import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import MoodCard from '../components/features/MoodCard';

const MOODS = [
  { emoji: '😂', label: 'Laugh Out Loud' },
  { emoji: '😢', label: 'Feel Everything' },
  { emoji: '🤯', label: 'Mind = Blown' },
  { emoji: '😴', label: 'Just Unwind' },
  { emoji: '🤬', label: 'Let It All Out' },
  { emoji: '😍', label: 'Hopeless Romantic' },
  { emoji: '👻', label: "Can't Sleep" },
  { emoji: '🎉', label: 'Celebrate Life' },
];

export default function MoodPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('Mind = Blown');

  const toggleMood = (label: string) => {
    setSelected(prev => (prev === label ? '' : label));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.tagline}>AI RECOMMENDS</Text>
        <Text style={styles.title}>How are you feeling right now?</Text>
        <Text style={styles.subtitle}>We'll find the perfect film to match your mood.</Text>
      </View>

      {/* Mood grid */}
      <FlatList
        data={MOODS}
        keyExtractor={item => item.label}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <MoodCard
            mood={item}
            selected={selected === item.label}
            onToggle={toggleMood}
          />
        )}
      />

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          disabled={!selected}
          style={[
            styles.ctaBtn,
            {
              backgroundColor: selected ? Theme.colors.primary : Theme.colors.surfaceElevated,
            },
            selected ? Theme.glows.red : {},
          ]}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.ctaBtnText,
              {
                color: selected ? Theme.colors.textPrimary : Theme.colors.textTertiary,
              },
            ]}
          >
            ✨ FIND MY MATCH
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          style={styles.skipBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Skip — Show me everything</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  tagline: {
    color: Theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: '80%',
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  gridContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  ctaBtn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 4,
  },
  skipText: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
});
