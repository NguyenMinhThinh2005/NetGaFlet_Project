import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../constants/Theme';
import MovieCard from '../../components/ui/MovieCard';
import SkeletonBlock from '../../components/ui/SkeletonBlock';
import { mockMovies } from '../../data/mockMovies';
import { parseGradient } from '../../utils/helpers';

const FILTERS = ['All', 'Movies', 'Series', 'Documentaries', 'Short Films'];
const MASONRY_MOVIES = mockMovies.slice(0, 6);

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<any>(null);

  const handleFocus = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setLoading(false);
    }, 500);
  };

  const getMappedType = (f: string) => {
    if (f === 'Movies') return 'movie';
    if (f === 'Series') return 'series';
    if (f === 'Documentaries') return 'documentary';
    if (f === 'Short Films') return 'short';
    return null;
  };

  const mappedType = getMappedType(filter);
  const baseList = (debouncedQuery || mappedType) ? mockMovies : MASONRY_MOVIES;
  const results = baseList.filter(m => {
    if (mappedType && m.type !== mappedType) return false;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={handleChange}
            onFocus={handleFocus}
            placeholder="Describe a vibe, plot, or actor..."
            placeholderTextColor={Theme.colors.textTertiary}
            style={[
              styles.input,
              { fontStyle: query ? 'normal' : 'italic' },
            ]}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.micIcon}>🎙</Text>
          </TouchableOpacity>
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.pill,
                {
                  backgroundColor: filter === f ? Theme.colors.primary : Theme.colors.surfaceElevated,
                  borderColor: filter === f ? 'transparent' : Theme.colors.divider,
                  borderWidth: filter === f ? 0 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { fontWeight: filter === f ? '600' : '400' },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section title */}
        <Text style={styles.sectionTitle}>
          {query ? `Results for "${query}"` : 'Trending Searches'}
        </Text>

        {/* Dynamic states: Loading vs Empty vs Grid */}
        {loading ? (
          <SkeletonOverlay />
        ) : results.length === 0 ? (
          <EmptySearch query={query} />
        ) : (
          <MasonryGrid movies={results} router={router} />
        )}
      </ScrollView>
    </View>
  );
}

function MasonryGrid({ movies, router }: { movies: any[]; router: any }) {
  const col1 = movies.filter((_, i) => i % 2 === 0);
  const col2 = movies.filter((_, i) => i % 2 === 1);

  const renderCard = (movie: any, tall: boolean) => {
    const gradient = parseGradient(movie.posterGradient);
    const height = tall ? 180 : 120;

    return (
      <TouchableOpacity
        key={movie.id}
        activeOpacity={0.9}
        onPress={() => router.push(`/movie/${movie.id}`)}
        style={[styles.card, { height }, Theme.glows.card]}
      >
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.cardOverlay}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>
            {movie.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.gridRow}>
      <View style={styles.column}>
        {col1.map((m, i) => renderCard(m, i % 2 === 0))}
      </View>
      <View style={[styles.column, { marginTop: 30 }]}>
        {col2.map((m, i) => renderCard(m, i % 2 !== 0))}
      </View>
    </View>
  );
}

function SkeletonOverlay() {
  return (
    <View style={styles.gridRow}>
      {[0, 1].map(col => (
        <View key={col} style={[styles.column, { marginTop: col ? 30 : 0 }]}>
          {[180, 120, 180].map((h, i) => (
            <SkeletonBlock
              key={i}
              width="100%"
              height={h}
              borderRadius={16}
              style={{ marginBottom: 12 }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyTitle}>No results for "{query}"</Text>
      <Text style={styles.emptySubtitle}>Try different keywords or browse by mood.</Text>
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
  searchBar: {
    height: 52,
    backgroundColor: Theme.colors.surface,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
  },
  searchIcon: {
    fontSize: 18,
    color: Theme.colors.textTertiary,
  },
  input: {
    flex: 1,
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  micIcon: {
    fontSize: 18,
    color: Theme.colors.primary,
  },
  filterScroll: {
    marginTop: 12,
    flexDirection: 'row',
  },
  filterScrollContent: {
    gap: 8,
  },
  pill: {
    height: 32,
    borderRadius: 100,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  card: {
    width: '100%',
    borderRadius: Theme.roundness.card,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  cardTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  emptySubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
});
