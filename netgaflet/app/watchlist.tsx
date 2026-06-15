import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import { useApp } from '../context/AppContext';
import { mockMovies, Movie } from '../data/mockMovies';
import { parseGradient } from '../utils/helpers';

export default function WatchlistScreen() {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useApp();
  const insets = useSafeAreaInsets();
  const items = mockMovies.filter(m => watchlist.includes(m.id));

  if (items.length === 0) {
    return <EmptyWatchlist router={router} insets={insets} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Watchlist</Text>
            <Text style={styles.headerSubtitle}>
              {items.length} title{items.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
        </View>

        {/* List of Swipeable Items */}
        <View style={styles.list}>
          {items.map(movie => (
            <SwipeableItem
              key={movie.id}
              movie={movie}
              onDelete={() => removeFromWatchlist(movie.id)}
              onTap={() => router.push(`/movie/${movie.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

interface SwipeableItemProps {
  movie: Movie;
  onDelete: () => void;
  onTap: () => void;
  key?: string | number;
}

function SwipeableItem({ movie, onDelete, onTap }: SwipeableItemProps) {
  const [removed, setRemoved] = useState(false);
  const swipeX = useRef(new Animated.Value(0)).current;
  const DELETE_ZONE = -88;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const dx = gestureState.dx;
        if (dx < 0) {
          swipeX.setValue(Math.max(DELETE_ZONE, dx));
        } else {
          swipeX.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < DELETE_ZONE * 0.7) {
          Animated.timing(swipeX, {
            toValue: DELETE_ZONE,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    setRemoved(true);
    setTimeout(onDelete, 300);
  };

  if (removed) return null;

  const gradient = parseGradient(movie.posterGradient);

  return (
    <View style={styles.swipeContainer}>
      {/* Delete button behind card */}
      <TouchableOpacity
        onPress={handleDelete}
        activeOpacity={0.8}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>

      {/* Slide overlay container */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.swipeCard,
          {
            transform: [{ translateX: swipeX }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={onTap}
          style={styles.touchableCard}
        >
          <View style={styles.poster}>
            <LinearGradient
              colors={gradient.colors}
              locations={gradient.locations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {movie.title}
            </Text>
            <Text style={styles.movieMeta}>
              {movie.durationMin} min · {movie.genres[0]}
            </Text>
          </View>

          <Text style={styles.bookmark}>🔖</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function EmptyWatchlist({ router, insets }: { router: any; insets: any }) {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }]}>
      <View style={styles.emptyContent}>
        <Text style={styles.emptyEmoji}>🔖</Text>
        <Text style={styles.emptyTitle}>Nothing saved yet</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring and save movies to watch later.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={[styles.exploreBtn, Theme.glows.red]}
          activeOpacity={0.85}
        >
          <Text style={styles.exploreText}>Explore Movies</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 4,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  headerSubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  menuIcon: {
    fontSize: 20,
    color: Theme.colors.textTertiary,
  },
  list: {
    marginTop: 16,
    gap: 10,
  },
  swipeContainer: {
    height: 88,
    borderRadius: Theme.roundness.card,
    position: 'relative',
    overflow: 'hidden',
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 88,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.roundness.card,
  },
  deleteText: {
    fontSize: 22,
    color: Theme.colors.textPrimary,
  },
  swipeCard: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
  },
  touchableCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  poster: {
    width: 56,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardInfo: {
    flex: 1,
  },
  movieTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  movieMeta: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  bookmark: {
    color: Theme.colors.primary,
    fontSize: 20,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  emptySubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: Theme.typography.fontFamily,
  },
  exploreBtn: {
    height: 52,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
