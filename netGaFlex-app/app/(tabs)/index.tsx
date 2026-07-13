import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Theme from '../../constants/Theme';
import Header from '../../components/ui/Header';
import HeroBanner from '../../components/features/HeroBanner';
import MovieCard from '../../components/ui/MovieCard';
import FAB from '../../components/features/FAB';
import { getNewUpdatedMovies, getMoviesByType } from '../../lib/movieApi';
import { useApp } from '../../context/AppContext';
import { useShake } from '../../hooks/useShake';
import SkeletonBlock from '../../components/ui/SkeletonBlock';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { watchHistory } = useApp();

  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [leMovies, setLeMovies] = useState<any[]>([]);
  const [boMovies, setBoMovies] = useState<any[]>([]);
  const [nixPicks, setNixPicks] = useState<any[]>([]);
  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleShake = useCallback(() => {
    router.push('/shake-surprise');
  }, [router]);

  useShake(handleShake, 1.8);

  useEffect(() => {
    async function loadHomeMovies() {
      try {
        setLoading(true);
        // Fetch new updated movies as trending
        const trendingRes = await getNewUpdatedMovies(1);
        const list = trendingRes?.movies || [];
        
        if (list.length > 0) {
          const mappedTrending = list.map((m: any) => ({
            ...m,
            id: m.slug,
            title: m.name,
            rating: 8.8,
            year: m.year || 2024,
            duration: m.time || '120m',
            genres: ['Phim Mới', 'Hot'],
            posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%)',
            heroGradient: 'linear-gradient(135deg, #0a0a14 0%, #1a1a3e 50%, #0f3060 100%)',
          }));
          setTrendingMovies(mappedTrending);
          setHeroMovie(mappedTrending[0]);
        }

        // Fetch TV Shows / Anime as NixAI picks
        const picksRes = await getMoviesByType('hoat-hinh', 1);
        const picksList = picksRes?.movies || [];
        if (picksList.length > 0) {
          const mappedPicks = picksList.map((m: any) => ({
            ...m,
            id: m.slug,
            title: m.name,
            rating: 8.2,
            year: m.year || 2024,
            duration: m.time || '95m',
            genres: ['Hoạt Hình', 'Anime'],
            posterGradient: 'linear-gradient(135deg, #0a0d14 0%, #0d1a2e 40%, #0a0f20 80%)',
          }));
          setNixPicks(mappedPicks);
        }

        // Fetch Feature Movies (phim-le)
        const leRes = await getMoviesByType('phim-le', 1);
        const leList = leRes?.movies || [];
        if (leList.length > 0) {
          const mappedLe = leList.map((m: any) => ({
            ...m,
            id: m.slug,
            title: m.name,
            rating: 8.5,
            year: m.year || 2026,
            duration: m.time || '115m',
            genres: ['Phim Lẻ', 'Hot'],
          }));
          setLeMovies(mappedLe);
        }

        // Fetch TV Series (phim-bo)
        const boRes = await getMoviesByType('phim-bo', 1);
        const boList = boRes?.movies || [];
        if (boList.length > 0) {
          const mappedBo = boList.map((m: any) => ({
            ...m,
            id: m.slug,
            title: m.name,
            rating: 8.9,
            year: m.year || 2026,
            duration: m.time || '45m',
            genres: ['Phim Bộ', 'Drama'],
          }));
          setBoMovies(mappedBo);
        }
      } catch (err) {
        console.error('Lỗi load danh sách phim trang chủ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeMovies();
  }, []);

  if (loading && !heroMovie) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Banner Skeleton */}
          <View style={{ height: 350, width: '100%', marginBottom: 20 }}>
            <SkeletonBlock width="100%" height="100%" borderRadius={0} />
          </View>

          {/* Section 1 Skeleton */}
          <View style={{ marginTop: 20 }}>
            <SkeletonBlock width={130} height={20} borderRadius={4} style={{ marginLeft: 20, marginBottom: 14 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
              </View>
            </ScrollView>
          </View>

          {/* Section 2 Skeleton */}
          <View style={{ marginTop: 28 }}>
            <SkeletonBlock width={150} height={20} borderRadius={4} style={{ marginLeft: 20, marginBottom: 14 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
                <SkeletonBlock width={120} height={180} borderRadius={12} />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        {heroMovie && <HeroBanner movie={heroMovie} />}

        {/* Continue Watching (From Supabase watch history) */}
        {watchHistory && watchHistory.length > 0 && (
          <Section title="Continue Watching" onSeeAll={() => router.push('/watch-history')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {watchHistory.slice(0, 5).map(movie => (
                <MovieCard key={movie.movieId} movie={movie} variant="landscape" showProgress width={180} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* Trending Now (From OPhim new updated list) */}
        {trendingMovies.length > 0 && (
          <Section title="Trending Now">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {trendingMovies.slice(0, 20).map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* Feature Movies (Phim Lẻ) */}
        {leMovies.length > 0 && (
          <Section title="Feature Movies">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {leMovies.slice(0, 20).map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* TV Series (Phim Bộ) */}
        {boMovies.length > 0 && (
          <Section title="TV Series">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {boMovies.slice(0, 20).map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* NixAI Picks (From OPhim Anime / Cartoon category) */}
        {nixPicks.length > 0 && (
          <Section title="🤖 NixAI Picks For You">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {nixPicks.slice(0, 20).map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* Spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        onClick={() => router.push('/chatbot')}
        icon="✨"
        tooltip="📳 Shake for a surprise"
      />
    </View>
  );
}

interface SectionProps {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}

function Section({ title, onSeeAll, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.8}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  seeAllText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
});
