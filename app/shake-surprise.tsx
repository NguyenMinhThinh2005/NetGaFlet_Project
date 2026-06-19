import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import { mockMovies, Movie } from '../data/mockMovies';
import { parseGradient } from '../utils/helpers';

export default function ShakeSurpriseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [surpriseMovie, setSurpriseMovie] = useState<Movie | null>(null);

  const floatAnim = useRef(new Animated.Value(0)).current;

  const pickRandomMovie = () => {
    const randomIdx = Math.floor(Math.random() * mockMovies.length);
    setSurpriseMovie(mockMovies[randomIdx]);
  };

  useEffect(() => {
    pickRandomMovie();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!surpriseMovie) return null;

  const gradient = parseGradient(surpriseMovie.posterGradient);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ambient red bloom */}
      <View style={styles.bloom} pointerEvents="none" />

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.tagline}>🎲 TONIGHT'S PICK</Text>
        <Text style={styles.subtitle}>NixAI chose this for you.</Text>
      </View>

      {/* Movie poster area */}
      <View style={styles.posterArea}>
        <Animated.View
          style={[
            styles.poster,
            Theme.glows.redStrong,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <LinearGradient
            colors={gradient.colors}
            locations={gradient.locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.posterTitle} numberOfLines={2}>
            {surpriseMovie.title}
          </Text>
          <Text style={styles.posterYear}>{surpriseMovie.year}</Text>
        </Animated.View>

        {/* Movie Info */}
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{surpriseMovie.title}</Text>
          <View style={styles.badgeRow}>
            {surpriseMovie.genres.map(g => (
              <View key={g} style={styles.genrePill}>
                <Text style={styles.genrePillText}>{g}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.movieMeta}>
            ⭐ {surpriseMovie.rating}  ·  {surpriseMovie.duration}  ·  {surpriseMovie.format}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push(`/movie/${surpriseMovie.id}/play`)}
          style={[styles.watchBtn, Theme.glows.red]}
          activeOpacity={0.85}
        >
          <Text style={styles.watchText}>▶ Watch Now</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            onPress={() => router.push(`/movie/${surpriseMovie.id}`)}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>ℹ️ Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickRandomMovie}
            style={styles.btn}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>🎲 Shuffle Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  bloom: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(229,9,20,0.06)',
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
  header: {
    alignItems: 'center',
    paddingTop: 16,
  },
  tagline: {
    color: Theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  posterArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  posterTitle: {
    color: 'rgba(245,245,245,0.9)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  posterYear: {
    color: 'rgba(229,9,20,0.6)',
    fontSize: 12,
    marginTop: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  movieInfo: {
    alignItems: 'center',
  },
  movieTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  genrePill: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  genrePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
  movieMeta: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 10,
  },
  watchBtn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  watchText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
});
