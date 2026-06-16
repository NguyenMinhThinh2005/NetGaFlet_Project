import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../../constants/Theme';
import EpisodeRow from '../../../components/ui/EpisodeRow';
import { getMovieById, mockMovies } from '../../../data/mockMovies';
import { parseGradient } from '../../../utils/helpers';

export default function EpisodeListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const series = getMovieById(id || '') || mockMovies.find((m: any) => m.type === 'series');
  const [activeSeason, setActiveSeason] = useState(1);

  if (!series || !series.episodes) return null;

  const seasonData = series.episodes.find((s: any) => s.season === activeSeason);
  const heroGradient = parseGradient(series.heroGradient);

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <LinearGradient
          colors={heroGradient.colors}
          locations={heroGradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', Theme.colors.bgBase]}
          style={StyleSheet.absoluteFill}
        />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { top: insets.top + 12 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <Text style={styles.title}>{series.title}</Text>
          <Text style={styles.meta}>
            ⭐ {series.rating}   ·   {series.episodes.length} Seasons
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Season tabs selection row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {series.episodes.map((s: any) => (
            <TouchableOpacity
              key={s.season}
              onPress={() => setActiveSeason(s.season)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeSeason === s.season ? Theme.colors.primary : Theme.colors.surface,
                  borderColor: activeSeason === s.season ? 'transparent' : Theme.colors.divider,
                  borderWidth: activeSeason === s.season ? 0 : 1,
                },
                activeSeason === s.season ? Theme.glows.red : {},
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.tabText}>Season {s.season}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Episode count */}
        <Text style={styles.epCount}>
          {seasonData?.episodes.length || 0} Episodes
        </Text>

        {/* Episodes stack */}
        <View style={styles.epList}>
          {seasonData?.episodes.map((ep: any, i: number) => (
            <EpisodeRow
              key={ep.id}
              episode={ep}
              episodeNum={i + 1}
              onPlay={() => router.push(`/movie/${series.id}/play`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  hero: {
    width: '100%',
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8,8,14,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  meta: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tabsScroll: {
    marginVertical: 12,
    flexDirection: 'row',
  },
  tabsScrollContent: {
    gap: 8,
  },
  tab: {
    height: 36,
    borderRadius: 100,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  epCount: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  epList: {
    marginTop: 8,
  },
});
