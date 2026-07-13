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
  Modal,
  SafeAreaView,
} from 'react-native';
import Constants from 'expo-constants';

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
// Config — Backend URL cho Semantic Search
// • Expo Go trên thiết bị vật lý: dùng IP LAN của máy chủ (manifest2 debuggerHost)
// • Android Emulator: 10.0.2.2 trỏ đến localhost của máy host
// • iOS Simulator: localhost
// • Nếu không detect được: fallback về YOUR_LAN_IP — thay bằng IP thật của bạn
//   Ví dụ: http://192.168.1.5:3000
// =========================================================================
function getBackendUrl(): string {
  // Thử lấy IP từ Expo manifest (hoạt động khi chạy qua Expo Go trên device)
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000`;
  }

  // Fallback theo platform
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000'; // iOS simulator
}

const BACKEND_URL = getBackendUrl();

// =========================================================================
// SemanticSearch Component
// Thiết kế dạng compact strip — search bar hiển thị inline trên màn hình,
// kết quả hiện qua Modal overlay để không phá vỡ layout ScrollView.
// =========================================================================
export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    movies: [],
    loading: false,
    error: null,
    searched: false,
  });
  const [modalVisible, setModalVisible] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setState({ movies: [], loading: true, error: null, searched: true });
    setModalVisible(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/search/semantic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, threshold: 0.5, limit: 15 }),
      });

      if (!response.ok) throw new Error(`Server lỗi: ${response.status}`);

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

  const handleClose = () => {
    setModalVisible(false);
    setState({ movies: [], loading: false, error: null, searched: false });
    setQuery('');
  };

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
          <Text style={styles.movieName} numberOfLines={2}>{item.name}</Text>
          {item.origin_name ? (
            <Text style={styles.originName} numberOfLines={1}>{item.origin_name}</Text>
          ) : null}
          <View style={styles.metaRow}>
            {item.year ? <Text style={styles.metaText}>{item.year}</Text> : null}
            {genres ? <Text style={styles.metaText} numberOfLines={1}>{genres}</Text> : null}
          </View>
          <View style={styles.similarityBadge}>
            <Text style={styles.similarityText}>Độ khớp {similarityPct}%</Text>
          </View>
        </View>
      </View>
    );
  };

    return (
    <>
      {/* ── Compact AI search bar strip (inline on home screen) ── */}
      <View style={styles.strip}>
        <View style={styles.stripInner}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>

          <TextInput
            ref={inputRef}
            style={styles.stripInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm phim bằng ngôn ngữ tự nhiên..."
            placeholderTextColor="#555"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            multiline={false}
          />

          <TouchableOpacity
            style={[styles.stripBtn, !query.trim() && styles.stripBtnDisabled]}
            onPress={handleSearch}
            disabled={!query.trim() || state.loading}
            activeOpacity={0.8}
          >
            {state.loading && !modalVisible ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.stripBtnText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.stripHint}>
          Mô tả bộ phim bạn muốn xem — AI sẽ tìm cho bạn
        </Text>
      </View>

      {/* ── Modal: full-screen results overlay ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal header with search bar */}
          <View style={styles.modalHeader}>
            <View style={styles.modalSearchRow}>
              <TextInput
                style={styles.modalInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm phim..."
                placeholderTextColor="#555"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                autoFocus
              />
              <TouchableOpacity
                style={styles.stripBtn}
                onPress={handleSearch}
                disabled={!query.trim() || state.loading}
                activeOpacity={0.8}
              >
                {state.loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.stripBtnText}>🔍</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>× Đóng</Text>
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
              <Text style={styles.errorHint}>Backend: {BACKEND_URL}</Text>
            </View>
          )}

          {/* Empty */}
          {!state.loading && !state.error && state.searched && state.movies.length === 0 && (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Không tìm thấy phim phù hợp 😢</Text>
              <Text style={styles.emptyHint}>Thử mô tả cụ thể hơn.</Text>
            </View>
          )}

          {/* Results list */}
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
        </SafeAreaView>
      </Modal>
    </>
  );
}


// =========================================================================
// Styles
// =========================================================================
const styles = StyleSheet.create({
  // ── Compact strip (inline on home screen) ──
  strip: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  stripInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8,
  },
  aiBadge: {
    backgroundColor: '#E50914',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  aiBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stripInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    paddingVertical: 10,
  },
  stripBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#E50914',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripBtnDisabled: {
    backgroundColor: '#5a0000',
  },
  stripBtnText: {
    fontSize: 16,
  },
  stripHint: {
    color: '#444',
    fontSize: 11,
    marginTop: 6,
    marginLeft: 2,
  },

  // ── Modal results sheet ──
  modalContainer: {
    flex: 1,
    backgroundColor: '#141414',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 10,
  },
  modalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  modalInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    paddingVertical: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  closeBtnText: {
    color: '#888',
    fontSize: 14,
  },

  // ── Shared ──
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
    color: '#555',
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultCount: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 32,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 8,
  },

  // ── Movie card ──
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
