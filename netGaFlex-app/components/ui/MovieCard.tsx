import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import { parseGradient } from '../../utils/helpers';
import { Movie } from '../../data/mockMovies';

interface MovieCardProps {
  movie: Movie;
  variant?: 'portrait' | 'landscape' | 'wide';
  showProgress?: boolean;
  width?: number;
  style?: ViewStyle;
}

export default function MovieCard({
  movie,
  variant = 'portrait',
  showProgress = false,
  width,
  style = {},
}: MovieCardProps) {
  const router = useRouter();

  const dims = {
    portrait:  { w: width || 120, h: (width || 120) * 1.5 },
    landscape: { w: width || 180, h: (width || 180) * (9 / 16) },
    wide:      { w: width || 200, h: (width || 200) * (9 / 16) },
  };

  const { w, h } = dims[variant] || dims.portrait;
  const gradient = parseGradient(movie.posterGradient);

  const handlePress = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[{ width: w, marginRight: 12 }, style]}
    >
      <View style={[styles.cardContainer, { height: h }, Theme.glows.card]}>
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Title overlay inside card */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.textOverlay}
        >
          <Text style={styles.titleText} numberOfLines={1}>
            {movie.title}
          </Text>
          {variant !== 'portrait' && (
            <Text style={styles.ratingText}>
              ⭐ {movie.rating}
            </Text>
          )}
        </LinearGradient>

        {/* Progress bar */}
        {showProgress && movie.progress !== null && movie.progress > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${movie.progress * 100}%` }]} />
          </View>
        )}

        {/* 4K badge */}
        {movie.format?.includes('4K') && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4K</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: Theme.roundness.card,
    overflow: 'hidden',
    position: 'relative',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
  },
  titleText: {
    color: Theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  ratingText: {
    color: Theme.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    fontFamily: Theme.typography.fontFamily,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
});
