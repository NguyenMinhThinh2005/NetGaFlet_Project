import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import RoastCard from '../components/features/RoastCard';
import { mockUser } from '../data/mockUser';

export default function RoastResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background bloom */}
      <View style={styles.bloom} pointerEvents="none" />

      {/* Decorative film frame corners */}
      {[
        { top: 60, left: 10 },
        { top: 60, right: 10 },
        { bottom: 120, left: 10 },
        { bottom: 120, right: 10 },
      ].map((pos, i) => (
        <View key={i} style={[styles.filmCorner, pos]} />
      ))}

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🎭</Text>
          <Text style={styles.tagline}>✨ NixAI HAS SPOKEN</Text>
          <Text style={styles.title}>Your Cinematic Profile</Text>
        </View>

        {/* Roast card or loader */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={Theme.colors.primary} size="large" />
          </View>
        ) : (
          <RoastCard text={mockUser.roastProfile.roastText} />
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          {mockUser.roastProfile.roastStats.map(s => (
            <View key={s} style={styles.statChip}>
              <Text style={styles.statChipText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleRegenerate}
            style={styles.regenBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.regenBtnText}>🔄 Regenerate Roast</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.shareBtnText}>Share My Roast 📤</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  bloom: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(229,9,20,0.06)',
  },
  filmCorner: {
    position: 'absolute',
    width: 40,
    height: 32,
    borderWidth: 4,
    borderColor: 'rgba(26,26,36,0.3)',
    borderRadius: 2,
    opacity: 0.4,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  backText: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  tagline: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  loaderContainer: {
    height: 200,
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.25)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  statChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Theme.colors.surfaceElevated,
    borderRadius: Theme.roundness.card,
  },
  statChipText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  regenBtn: {
    width: '100%',
    height: 52,
    borderRadius: Theme.roundness.button,
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenBtnText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  shareBtn: {
    width: '100%',
    height: 52,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
