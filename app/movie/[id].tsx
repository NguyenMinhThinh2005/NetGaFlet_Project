import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import BottomSheet from '../../components/ui/BottomSheet';
import ReviewItem from '../../components/ui/ReviewItem';
import MovieCard from '../../components/ui/MovieCard';
import { useApp } from '../../context/AppContext';
import { getMovieById, mockMovies } from '../../data/mockMovies';
import { getReviewsForMovie, getRatingDistribution } from '../../data/mockReviews';
import { useBottomSheet } from '../../hooks/useBottomSheet';
import { parseGradient } from '../../utils/helpers';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isInWatchlist, toggleWatchlist } = useApp();
  const { isOpen, open, close } = useBottomSheet();

  const movie = getMovieById(id || '') || mockMovies[0];
  const inList = isInWatchlist(movie.id);
  const reviews = getReviewsForMovie(movie.id);
  const dist = getRatingDistribution(movie.id);
  const heroGradient = parseGradient(movie.heroGradient);

  const similar = mockMovies
    .filter((m: any) => m.id !== movie.id && m.genres.some((g: any) => movie.genres.includes(g)))
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Area */}
        <View style={styles.heroWrapper}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 16 }]}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          {/* Hero background */}
          <View style={styles.heroBackground}>
            <LinearGradient
              colors={heroGradient.colors}
              locations={heroGradient.locations}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(8,8,14,0.8)', Theme.colors.bgBase]}
              locations={[0.3, 0.75, 1.0]}
              style={StyleSheet.absoluteFill}
            />

            {/* Title + Meta overlay */}
            <View style={styles.heroContent}>
              <Text style={styles.title}>{movie.title.toUpperCase()}</Text>
              
              {/* Badges */}
              <View style={styles.badgeRow}>
                {movie.genres.map((g: any) => (
                  <View key={g} style={styles.genrePill}>
                    <Text style={styles.genrePillText}>{g}</Text>
                  </View>
                ))}
                <View style={[styles.genrePill, styles.formatPill]}>
                  <Text style={styles.genrePillText}>{movie.format}</Text>
                </View>
              </View>

              <Text style={styles.metaText}>
                ⭐ {movie.rating}   |   {movie.year}
              </Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/movie/${movie.id}/play`)}
              style={[styles.playBtn, Theme.glows.red]}
            >
              <Text style={styles.playBtnText}>▶ PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleWatchlist(movie.id)}
              style={[
                styles.watchlistBtn,
                {
                  borderColor: inList ? Theme.colors.primary : 'rgba(255,255,255,0.2)',
                },
              ]}
            >
              <Text style={[styles.watchlistBtnText, { color: inList ? Theme.colors.primary : Theme.colors.textPrimary }]}>
                {inList ? '🔖' : '+'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Summary */}
        <View style={styles.aiSummaryCard}>
          <Text style={styles.aiSummaryTitle}>✨ AI Summary</Text>
          <Text style={styles.aiSummaryText}>{movie.aiSummary}</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.fullSynopsisBtn}>
            <Text style={styles.fullSynopsisText}>Full synopsis</Text>
          </TouchableOpacity>
        </View>

        {/* Cast list */}
        <View style={styles.castSection}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
            {movie.cast.map((person: any) => (
              <View key={person.name} style={styles.castItem}>
                <View style={[styles.castAvatar, { backgroundColor: person.color || Theme.colors.surfaceElevated }]}>
                  <Text style={styles.castInitials}>{person.initials}</Text>
                </View>
                <Text style={styles.castName} numberOfLines={1}>
                  {person.name.split(' ')[0]}
                </Text>
                <Text style={styles.castRole} numberOfLines={1}>
                  {person.role}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* More Like This */}
        {similar.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>More Like This</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
              {similar.map((m: any) => (
                <MovieCard key={m.id} movie={m} variant="portrait" width={110} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Spacer for sticky bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={styles.bottomBarTab}
          onPress={() => toggleWatchlist(movie.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.bottomBarIcon}>🔖</Text>
          <Text style={styles.bottomBarText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarTab} onPress={open} activeOpacity={0.7}>
          <Text style={styles.bottomBarIcon}>💬</Text>
          <Text style={styles.bottomBarText}>{reviews.length * 948} Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarTab} activeOpacity={0.7}>
          <Text style={styles.bottomBarIcon}>📤</Text>
          <Text style={styles.bottomBarText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews Bottom Sheet */}
      <BottomSheet isOpen={isOpen} onClose={close} title="Reviews & Ratings" height="72%">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ReviewsContent movie={movie} reviews={reviews} dist={dist} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

function ReviewsContent({ movie, reviews, dist }: { movie: any; reviews: any[]; dist: number[] }) {
  const totalRatings = '2,847';
  const avgRating = movie.rating;
  const stars = Math.round(avgRating / 2);

  return (
    <View style={reviewStyles.container}>
      {/* Overview */}
      <View style={reviewStyles.overviewCard}>
        <View style={reviewStyles.overviewLeft}>
          <View style={reviewStyles.ratingRow}>
            <Text style={reviewStyles.ratingText}>{avgRating}</Text>
            <Text style={reviewStyles.ratingMax}>/10</Text>
          </View>
          <Text style={reviewStyles.totalRatingsText}>{totalRatings} ratings</Text>
          <View style={reviewStyles.starRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Text
                key={i}
                style={[
                  reviewStyles.star,
                  { color: i <= stars ? Theme.colors.primary : Theme.colors.textTertiary },
                ]}
              >
                ★
              </Text>
            ))}
          </View>
        </View>

        <View style={reviewStyles.overviewRight}>
          {dist.map((pct, i) => (
            <View key={i} style={reviewStyles.distRow}>
              <Text style={reviewStyles.distStarLabel}>{5 - i}★</Text>
              <View style={reviewStyles.progressBarTrack}>
                <View style={[reviewStyles.progressBarFill, { width: `${pct}%` }]} />
              </View>
              <Text style={reviewStyles.distPctLabel}>{pct}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Write review */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <TouchableOpacity activeOpacity={0.8} style={reviewStyles.writeBtn}>
          <Text style={reviewStyles.writeBtnText}>✏️ Write a Review</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews list */}
      {reviews.map(r => (
        <ReviewItem key={r.id} review={r} />
      ))}
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
  heroWrapper: {
    position: 'relative',
    width: '100%',
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
  backBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
  },
  heroBackground: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
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
  metaText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  playBtn: {
    flex: 1,
    height: 52,
    borderRadius: 100,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  watchlistBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistBtnText: {
    fontSize: 20,
  },
  aiSummaryCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
    padding: 16,
  },
  aiSummaryTitle: {
    color: Theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  aiSummaryText: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Theme.typography.fontFamily,
  },
  fullSynopsisBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  fullSynopsisText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  castSection: {
    marginTop: 24,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  castScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  castItem: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  castAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.divider,
  },
  castInitials: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  castName: {
    color: Theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Theme.typography.fontFamily,
  },
  castRole: {
    color: Theme.colors.textTertiary,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: Theme.typography.fontFamily,
  },
  similarSection: {
    marginTop: 24,
  },
  similarScroll: {
    paddingHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: Theme.colors.bgBase,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  bottomBarTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bottomBarIcon: {
    fontSize: 18,
  },
  bottomBarText: {
    color: Theme.colors.textTertiary,
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily,
  },
});

const reviewStyles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Theme.colors.surfaceElevated,
    borderRadius: Theme.roundness.card,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
  },
  overviewLeft: {
    width: '40%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingText: {
    color: Theme.colors.textPrimary,
    fontSize: 52,
    fontWeight: '700',
    lineHeight: 52,
    fontFamily: Theme.typography.fontFamily,
  },
  ratingMax: {
    color: Theme.colors.textTertiary,
    fontSize: 18,
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  totalRatingsText: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    marginVertical: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  overviewRight: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distStarLabel: {
    color: Theme.colors.textTertiary,
    fontSize: 10,
    width: 16,
    textAlign: 'right',
    fontFamily: Theme.typography.fontFamily,
  },
  progressBarTrack: {
    flex: 1,
    height: 7,
    borderRadius: 100,
    backgroundColor: Theme.colors.divider,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 100,
  },
  distPctLabel: {
    color: Theme.colors.textTertiary,
    fontSize: 10,
    width: 28,
    fontFamily: Theme.typography.fontFamily,
  },
  writeBtn: {
    width: '100%',
    height: 48,
    borderRadius: Theme.roundness.button,
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeBtnText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
