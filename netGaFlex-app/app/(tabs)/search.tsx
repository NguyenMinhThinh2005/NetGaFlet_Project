import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../constants/Theme';
import SkeletonBlock from '../../components/ui/SkeletonBlock';
import { searchMovies, getMoviesByType, getNewUpdatedMovies, getMoviesByGenre } from '../../lib/movieApi';
import { parseGradient } from '../../utils/helpers';

const FILTERS = ['All', 'Movies', 'Series', 'Documentaries', 'Short Films'];

const GENRES = [
  { slug: 'hanh-dong', name: 'Hành Động', icon: '🎬', colors: ['#ff4e50', '#f9d423'] },
  { slug: 'hai-huoc', name: 'Hài Hước', icon: '🤣', colors: ['#f9d423', '#ff4e50'] },
  { slug: 'tinh-cam', name: 'Tình Cảm', icon: '💖', colors: ['#ec008c', '#fc6767'] },
  { slug: 'kinh-di', name: 'Kinh Dị', icon: '👻', colors: ['#8a2387', '#e94057'] },
  { slug: 'vien-tuong', name: 'Viễn Tưởng', icon: '🛸', colors: ['#00c6ff', '#0072ff'] },
  { slug: 'co-trang', name: 'Cổ Trang', icon: '🗡️', colors: ['#f12711', '#f5af19'] },
  { slug: 'hoat-hinh', name: 'Hoạt Hình', icon: '🤖', colors: ['#11998e', '#38ef7d'] },
  { slug: 'vo-thuat', name: 'Võ Thuật', icon: '🥋', colors: ['#eb5757', '#333333'] }
];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const debounceRef = useRef<any>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<any | null>(null);

  const handleFocus = () => {
    // Optional focus animation helper
  };

  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
    }, 500);
  };

  const handleLoadMore = async () => {
    if (loading || loadingMore || !hasMore || debouncedQuery) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      let newMovies: any[] = [];

      if (selectedGenre) {
        const data = await getMoviesByGenre(selectedGenre.slug, nextPage);
        newMovies = data?.movies || [];
      } else if (filter === 'All') {
        const data = await getNewUpdatedMovies(nextPage);
        newMovies = data?.movies || [];
      } else {
        let type: 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows' = 'phim-le';
        if (filter === 'Series') type = 'phim-bo';
        else if (filter === 'Documentaries') type = 'hoat-hinh';
        else if (filter === 'Short Films') type = 'tv-shows';

        const data = await getMoviesByType(type, nextPage);
        newMovies = data?.movies || [];
      }

      if (newMovies.length > 0) {
        const mapped = newMovies.map((m: any) => ({
          ...m,
          id: m.slug,
          title: m.name,
          posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
        }));
        setResults(prev => [...prev, ...mapped]);
        setPage(nextPage);
        setHasMore(mapped.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Lỗi tải thêm phim:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    async function fetchSearchData() {
      setLoading(true);
      try {
        if (debouncedQuery) {
          setSelectedGenre(null); // Clear active genre when user types
          // Real live search
          const data = await searchMovies(debouncedQuery);
          if (data && data.movies) {
            const mapped = data.movies.map((m: any) => ({
              ...m,
              id: m.slug,
              title: m.name,
              posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
            }));
            setResults(mapped);
          } else {
            setResults([]);
          }
          setHasMore(false);
        } else if (selectedGenre) {
          // Genre-specific fetching (page 1)
          const data = await getMoviesByGenre(selectedGenre.slug, 1);
          if (data && data.movies) {
            const mapped = data.movies.map((m: any) => ({
              ...m,
              id: m.slug,
              title: m.name,
              posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
            }));
            setResults(mapped);
            setHasMore(mapped.length >= 10);
          } else {
            setResults([]);
            setHasMore(false);
          }
        } else {
          // Filter-based default browsing
          let type: 'phim-bo' | 'phim-le' | 'hoat-hinh' | 'tv-shows' = 'phim-le';
          if (filter === 'Series') type = 'phim-bo';
          else if (filter === 'Documentaries') type = 'hoat-hinh';
          else if (filter === 'Short Films') type = 'tv-shows';

          if (filter === 'All') {
            const data = await getNewUpdatedMovies(1);
            if (data && data.movies) {
              const mapped = data.movies.map((m: any) => ({
                ...m,
                id: m.slug,
                title: m.name,
                posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
              }));
              setResults(mapped);
              setHasMore(mapped.length >= 10);
            } else {
              setResults([]);
              setHasMore(false);
            }
          } else {
            const data = await getMoviesByType(type, 1);
            if (data && data.movies) {
              const mapped = data.movies.map((m: any) => ({
                ...m,
                id: m.slug,
                title: m.name,
                posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
              }));
              setResults(mapped);
              setHasMore(mapped.length >= 10);
            } else {
              setResults([]);
              setHasMore(false);
            }
          }
        }
        setPage(1);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSearchData();
  }, [debouncedQuery, filter, selectedGenre]);

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
              onPress={() => {
                setQuery('');
                setDebouncedQuery('');
                setSelectedGenre(null);
                setFilter(f);
              }}
              style={[
                styles.pill,
                {
                  backgroundColor: filter === f && !selectedGenre ? Theme.colors.primary : Theme.colors.surfaceElevated,
                  borderColor: filter === f && !selectedGenre ? 'transparent' : Theme.colors.divider,
                  borderWidth: filter === f && !selectedGenre ? 0 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { fontWeight: filter === f && !selectedGenre ? '600' : '400' },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Genre active title header or grid title */}
        {selectedGenre && !query && (
          <View style={styles.selectedGenreHeader}>
            <Text style={styles.selectedGenreTitle}>🎭 Thể loại: {selectedGenre.name}</Text>
            <TouchableOpacity
              onPress={() => setSelectedGenre(null)}
              style={styles.clearGenreBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.clearGenreText}>✕ Quay lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Browse Category Grid or Listing Masonry Grid */}
        {!query && !selectedGenre && filter === 'All' ? (
          <View>
            <Text style={styles.sectionTitle}>Browse Genres</Text>
            <View style={styles.genreGrid}>
              {GENRES.map(g => (
                <TouchableOpacity
                  key={g.slug}
                  onPress={() => setSelectedGenre(g)}
                  activeOpacity={0.85}
                  style={styles.genreCardWrapper}
                >
                  <LinearGradient
                    colors={g.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.genreCard}
                  >
                    <Text style={styles.genreCardIcon}>{g.icon}</Text>
                    <Text style={styles.genreCardName}>{g.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {!selectedGenre && (
              <Text style={styles.sectionTitle}>
                {query ? `Results for "${query}"` : `${filter} Searches`}
              </Text>
            )}

            {/* Dynamic states: Loading vs Empty vs Grid */}
            {loading ? (
              <SkeletonOverlay />
            ) : results.length === 0 ? (
              <EmptySearch query={query || filter || selectedGenre?.name} />
            ) : (
              <View>
                <MasonryGrid movies={results} router={router} />
                {hasMore && !debouncedQuery && (
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    style={styles.loadMoreBtn}
                    activeOpacity={0.8}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.loadMoreText}>Load More Movies ➔</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MasonryGrid({ movies, router }: { movies: any[]; router: any }) {
  const col1 = movies.filter((_, i) => i % 2 === 0);
  const col2 = movies.filter((_, i) => i % 2 === 1);

  const renderCard = (movie: any, tall: boolean) => {
    const gradient = parseGradient(movie.posterGradient || 'linear-gradient(135deg, #1A1A24, #111118)');
    const imageUrl = movie.thumbUrl || movie.posterUrl || 
      (movie.thumb_url ? (movie.thumb_url.startsWith('http') ? movie.thumb_url : `https://img.ophim.live/uploads/movies/${movie.thumb_url}`) : 
       (movie.poster_url ? (movie.poster_url.startsWith('http') ? movie.poster_url : `https://img.ophim.live/uploads/movies/${movie.poster_url}`) : null));
    const height = tall ? 180 : 120;

    return (
      <TouchableOpacity
        key={movie.id || movie.slug}
        activeOpacity={0.9}
        onPress={() => router.push(`/movie/${movie.id || movie.slug}`)}
        style={[styles.card, { height }, Theme.glows.card]}
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
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.cardOverlay}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>
            {movie.title || movie.name}
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
      <Text style={styles.emptySubtitle}>Try different keywords or browse by category.</Text>
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
  loadMoreBtn: {
    height: 48,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  loadMoreText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  selectedGenreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 14,
    backgroundColor: Theme.colors.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
  },
  selectedGenreTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  clearGenreBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearGenreText: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  genreCardWrapper: {
    width: '48%',
    aspectRatio: 16 / 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  genreCard: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  genreCardIcon: {
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  genreCardName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
