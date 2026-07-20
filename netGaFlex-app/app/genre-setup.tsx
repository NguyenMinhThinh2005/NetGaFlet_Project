import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';
import GenreCard from '../components/ui/GenreCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const GENRES = [
  { id: 'action',       emoji: '🎬', label: 'Action' },
  { id: 'comedy',       emoji: '😂', label: 'Comedy' },
  { id: 'horror',       emoji: '😱', label: 'Horror' },
  { id: 'romance',      emoji: '💕', label: 'Romance' },
  { id: 'scifi',        emoji: '🤯', label: 'Sci-Fi' },
  { id: 'thriller',     emoji: '🔍', label: 'Thriller' },
  { id: 'documentary',  emoji: '📚', label: 'Documentary' },
  { id: 'drama',        emoji: '🎭', label: 'Drama' },
  { id: 'mystery',      emoji: '👻', label: 'Mystery' },
  { id: 'sports',       emoji: '🏆', label: 'Sports' },
  { id: 'animation',    emoji: '💥', label: 'Animation' },
  { id: 'foreign',      emoji: '🌍', label: 'Foreign' },
];

export default function GenreSetupScreen() {
  const router = useRouter();
  const { setGenres } = useApp();
  const { isLoggedIn } = useAuth();
  const [selected, setSelected] = useState(['action', 'comedy', 'scifi', 'thriller']);

  const toggleGenre = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length >= 3;

  const handleContinue = () => {
    if (!canContinue) return;
    setGenres(selected);
    router.replace(isLoggedIn ? '/(tabs)' : '/signin');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepText}>STEP 2 OF 2</Text>
        <Text style={styles.title}>What do you love watching?</Text>
        <Text style={styles.subtitle}>Pick at least 3 genres. NixAI will do the rest.</Text>
      </View>

      {/* Grid container */}
      <FlatList
        data={GENRES}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <GenreCard
            genre={item}
            selected={selected.includes(item.id)}
            onToggle={toggleGenre}
          />
        )}
        ListFooterComponent={
          <Text style={styles.counterText}>{selected.length} selected</Text>
        }
      />

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          style={[
            styles.btn,
            {
              backgroundColor: canContinue ? Theme.colors.primary : Theme.colors.surfaceElevated,
            },
            canContinue ? Theme.glows.red : {},
          ]}
        >
          <Text
            style={[
              styles.btnText,
              {
                color: canContinue ? Theme.colors.textPrimary : Theme.colors.textTertiary,
              },
            ]}
          >
            CONTINUE →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
    paddingTop: 48,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stepText: {
    color: Theme.colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Theme.typography.fontFamily,
  },
  gridContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  counterText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: Theme.typography.fontFamily,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  btn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Theme.typography.fontFamily,
  },
});
