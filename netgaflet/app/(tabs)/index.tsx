import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Theme from '../../constants/Theme';
import HeroBanner from '../../components/features/HeroBanner';
import MovieCard from '../../components/ui/MovieCard';
import FAB from '../../components/features/FAB';
import { mockMovies, continueWatching, trending } from '../../data/mockMovies';
import { useShake } from '../../hooks/useShake';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleShake = useCallback(() => {
    router.push('/shake-surprise');
  }, [router]);

  useShake(handleShake, 1.8);

  const heroMovie = mockMovies.find(m => m.id === 'inception') || mockMovies[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <HeroBanner movie={heroMovie} />

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <Section title="Continue Watching" onSeeAll={() => router.push('/watch-history')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {continueWatching.slice(0, 5).map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="landscape" showProgress width={180} />
              ))}
            </ScrollView>
          </Section>
        )}

        {/* Trending Now */}
        <Section title="Trending Now">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {trending.slice(0, 8).map(movie => (
              <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
            ))}
          </ScrollView>
        </Section>

        {/* NixAI Picks */}
        <Section title="🤖 NixAI Picks For You">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {mockMovies.slice(5, 10).map(movie => (
              <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
            ))}
          </ScrollView>
        </Section>

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
