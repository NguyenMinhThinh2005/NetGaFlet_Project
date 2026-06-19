import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import { useApp } from '../../context/AppContext';
import { parseGradient } from '../../utils/helpers';
import { Movie } from '../../data/mockMovies';

interface HeroBannerProps {
  movie: any;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  const router = useRouter();
  const { isInWatchlist, toggleWatchlist } = useApp();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const gradient = parseGradient(movie.heroGradient || 'linear-gradient(135deg, #1A1A24, #111118)');
  const screenWidth = Dimensions.get('window').width;

  const imageUrl = movie.thumbUrl || movie.posterUrl || 
    (movie.thumb_url ? (movie.thumb_url.startsWith('http') ? movie.thumb_url : `https://img.ophim.live/uploads/movies/${movie.thumb_url}`) : 
     (movie.poster_url ? (movie.poster_url.startsWith('http') ? movie.poster_url : `https://img.ophim.live/uploads/movies/${movie.poster_url}`) : null));

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      {/* Background Image or Gradient Fallback */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Vertical fade overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(8,8,14,0.6)', Theme.colors.bgBase]}
        locations={[0.3, 0.7, 1.0]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.contentOverlay}>
        {/* Left: Info */}
        <View style={styles.leftInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title.toUpperCase()}
          </Text>

          {/* Genres + format badges */}
          <View style={styles.badgeRow}>
            {movie.genres.map((g: any) => (
              <View key={g} style={styles.genrePill}>
                <Text style={styles.genrePillText}>{g}</Text>
              </View>
            ))}
            {movie.format && (
              <View style={[styles.genrePill, styles.formatPill]}>
                <Text style={styles.genrePillText}>{movie.format}</Text>
              </View>
            )}
          </View>

          {/* Metadata */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>⭐ {movie.rating}</Text>
            <Text style={styles.metaText}>🕐 {movie.duration}</Text>
            <Text style={styles.metaText}>📅 {movie.year}</Text>
          </View>
        </View>

        {/* Right: Buttons */}
        <View style={styles.rightButtons}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleWatchlist(movie.id)}
            style={styles.watchlistBtn}
          >
            <Text style={[styles.watchlistBtnText, { color: inList ? Theme.colors.primary : Theme.colors.textPrimary }]}>
              {inList ? '🔖' : '+'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(`/movie/${movie.id}/play`)}
            style={[styles.playBtn, Theme.glows.red]}
          >
            <Text style={styles.playBtnText}>▶ Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    position: 'relative',
    overflow: 'hidden',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  genrePill: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  formatPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  genrePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  metaText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  watchlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26,26,36,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistBtnText: {
    fontSize: 18,
  },
  playBtn: {
    height: 40,
    borderRadius: 100,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
});
