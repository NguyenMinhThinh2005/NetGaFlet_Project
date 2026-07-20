import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import { parseGradient } from '../utils/helpers';
import { getNewUpdatedMovies, getMovieDetails } from '../lib/movieApi';

export default function ShakeSurpriseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [surpriseMovie, setSurpriseMovie] = useState<any | null>(null);
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;

  const pickRandomMovieFromList = (list: any[]) => {
    if (!list || list.length === 0) return;
    const randomIdx = Math.floor(Math.random() * list.length);
    const item = list[randomIdx];
    setSurpriseMovie({
      id: item.slug,
      title: item.name,
      year: item.year || 2026,
      duration: item.time || '120m',
      rating: 8.8,
      genres: ['Phim Mới', 'AI Pick'],
      format: '4K UltraHD',
      posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
      thumb_url: item.thumb_url,
      poster_url: item.poster_url,
    });
  };

  const handleShuffle = () => {
    pickRandomMovieFromList(moviesList);
  };

  const handleWatchNow = async () => {
    if (!surpriseMovie) return;
    try {
      setWatching(true);
      const details = await getMovieDetails(surpriseMovie.id);
      if (details && details.episodes && details.episodes.length > 0) {
        const serverData = details.episodes[0].server_data || [];
        const firstEp = serverData[0];
        if (firstEp) {
          router.push({
            pathname: `/movie/${surpriseMovie.id}/play` as any,
            params: {
              link: firstEp.link_embed || firstEp.link_m3u8,
              episodeName: firstEp.name,
              movieName: details.movie?.name || surpriseMovie.title,
            }
          });
          return;
        }
      }
      // Fallback: if no stream, route to detail screen
      router.push(`/movie/${surpriseMovie.id}`);
    } catch (e) {
      console.error('Error starting play from shake surprise:', e);
      router.push(`/movie/${surpriseMovie.id}`);
    } finally {
      setWatching(false);
    }
  };

  useEffect(() => {
    async function loadShakeMovies() {
      try {
        setLoading(true);
        const res = await getNewUpdatedMovies(1);
        const list = res?.movies || [];
        setMoviesList(list);
        pickRandomMovieFromList(list);
      } catch (err) {
        console.error('Error fetching shake surprise movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShakeMovies();

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={{ color: '#fff', marginTop: 12, fontFamily: Theme.typography.fontFamily }}>NixAI is choosing...</Text>
      </View>
    );
  }

  if (!surpriseMovie) return null;

  const gradient = parseGradient(surpriseMovie.posterGradient);
  const imageUrl = surpriseMovie.thumb_url ? (surpriseMovie.thumb_url.startsWith('http') ? surpriseMovie.thumb_url : `https://img.ophim.live/uploads/movies/${surpriseMovie.thumb_url}`) : (surpriseMovie.poster_url ? (surpriseMovie.poster_url.startsWith('http') ? surpriseMovie.poster_url : `https://img.ophim.live/uploads/movies/${surpriseMovie.poster_url}`) : null);

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

          {!imageUrl && (
            <Text style={styles.posterTitle} numberOfLines={2}>
              {surpriseMovie.title}
            </Text>
          )}
          {!imageUrl && <Text style={styles.posterYear}>{surpriseMovie.year}</Text>}
        </Animated.View>

        {/* Movie Info */}
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{surpriseMovie.title}</Text>
          <View style={styles.badgeRow}>
            {surpriseMovie.genres.map((g: string) => (
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
          onPress={handleWatchNow}
          style={[styles.watchBtn, Theme.glows.red]}
          activeOpacity={0.85}
          disabled={watching}
        >
          {watching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.watchText}>▶ Watch Now</Text>
          )}
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
            onPress={handleShuffle}
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    paddingHorizontal: 20,
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#12121e',
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
    paddingHorizontal: 10,
  },
  movieTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
    textAlign: 'center',
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
