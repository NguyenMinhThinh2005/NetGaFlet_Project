import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';

// =========================================================================
// Types
// =========================================================================
interface MovieResult {
  id: number;
  slug: string;
  name: string;
  origin_name: string | null;
  thumb_url: string | null;
  description: string | null;
  year: number | null;
  category: { id: string; name: string }[] | null;
  country: { id: string; name: string }[] | null;
  similarity: number;
}

interface SearchState {
  movies: MovieResult[];
  loading: boolean;
  error: string | null;
  searched: boolean;
}

// =========================================================================
// Config — đổi sang IP thực của máy tính nếu chạy trên thiết bị vật lý
// Android emulator dùng 10.0.2.2, iOS simulator dùng localhost
// =========================================================================
const BACKEND_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

// =========================================================================
// SemanticSearch Component
// =========================================================================
export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    movies: [],
    loading: false,
    error: null,
    searched: false,
  });

  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- Animate results in ---
  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  // =========================================================================
  // Gọi backend POST /api/search/semantic
  // =========================================================================
  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setState({ movies: [], loading: true, error: null, searched: true });

    try {
      const response = await fetch(`${BACKEND_URL}/api/search/semantic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, threshold: 0.5, limit: 15 }),
      });

      if (!response.ok) {
        throw new Error(`Server trả về lỗi: ${response.status}`);
      }

      const json = await response.json();
      console.log('[SemanticSearch] Results:', JSON.stringify(json, null, 2));

      setState({ movies: json.movies ?? [], loading: false, error: null, searched: true });
      fadeIn();
    } catch (err: any) {
      console.error('[SemanticSearch] Fetch error:', err);
      setState({
        movies: [],
        loading: false,
        error: err.message ?? 'Không thể kết nối đến server.',
        searched: true,
      });
    }
  }, [query]);

  // =========================================================================
  // Render một kết quả phim
  // =========================================================================
  const renderItem = ({ item }: { item: MovieResult }) => {
    const thumbUri = item.thumb_url
      ? item.thumb_url.startsWith('http')
        ? item.thumb_url
        : `https://img.ophim.live/uploads/movies/${item.thumb_url}`
      : null;

    const genres = item.category?.map((c) => c.name).join(' • ') ?? '';
    const similarityPct = Math.round(item.similarity * 100);

    return (
      <View style={styles.card}>
        {thumbUri ? (
          <Image source={{ uri: thumbUri }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Text style={styles.thumbPlaceholderText}>🎬</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.movieName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.origin_name ? (
            <Text style={styles.originName} numberOfLines={1}>
              {item.origin_name}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            {item.year ? <Text style={styles.metaText}>{item.year}</Text> : null}
            {genres ? (
              <Text style={styles.metaText} numberOfLines={1}>
                {genres}
              </Text>
            ) : null}
          </View>
          <View style={styles.similarityBadge}>
            <Text style={styles.similarityText}>Độ khớp {similarityPct}%</Text>
          </View>
        </View>
      </View>
    );
  };

  // =========================================================================
  // Render
  // =========================================================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🔍 Tìm Kiếm Thông Minh</Text>
      <Text style={styles.subHeader}>
        Mô tả bộ phim bạn muốn xem bằng ngôn ngữ tự nhiên
      </Text>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder='Ví dụ: "phim hành động Mỹ với siêu anh hùng"'
          placeholderTextColor="#666"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.searchBtn, !query.trim() && styles.searchBtnDisabled]}
          onPress={handleSearch}
          disabled={!query.trim() || state.loading}
          activeOpacity={0.8}
        >
          <Text style={styles.searchBtnText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {state.loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Đang phân tích câu hỏi...</Text>
        </View>
      )}

      {/* Error */}
      {!state.loading && state.error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠️ {state.error}</Text>
          <Text style={styles.errorHint}>
            Hãy đảm bảo backend đang chạy tại {BACKEND_URL}
          </Text>
        </View>
      )}

      {/* Empty state */}
      {!state.loading && !state.error && state.searched && state.movies.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Không tìm thấy phim phù hợp 😢</Text>
          <Text style={styles.emptyHint}>
            Thử mô tả cụ thể hơn hoặc kiểm tra xem database đã có dữ liệu chưa.
          </Text>
        </View>
      )}

      {/* Results */}
      {!state.loading && state.movies.length > 0 && (
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.resultCount}>
            Tìm thấy {state.movies.length} kết quả cho "{query}"
          </Text>
          <FlatList
            data={state.movies}
            keyExtractor={(item) => item.slug}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Animated.View>
      )}
    </View>
  );
}

// =========================================================================
// Styles
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchBtn: {
    backgroundColor: '#E50914',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnDisabled: {
    backgroundColor: '#5a0000',
  },
  searchBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: '#AAA',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#E50914',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCount: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    gap: 12,
  },
  thumb: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  thumbPlaceholder: {
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbPlaceholderText: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  movieName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  originName: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  metaText: {
    color: '#888',
    fontSize: 11,
  },
  similarityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a3a1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#2d6b2d',
  },
  similarityText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '600',
  },
});
