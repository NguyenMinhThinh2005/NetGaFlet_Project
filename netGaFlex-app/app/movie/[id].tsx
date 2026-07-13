import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import BottomSheet from '../../components/ui/BottomSheet';
import ReviewItem from '../../components/ui/ReviewItem';
import MovieCard from '../../components/ui/MovieCard';
import { useApp } from '../../context/AppContext';
import { getMovieDetails } from '../../lib/movieApi';
import { getReviewsForMovie, getRatingDistribution } from '../../data/mockReviews';
import { useBottomSheet } from '../../hooks/useBottomSheet';
import { parseGradient } from '../../utils/helpers';
import SkeletonBlock from '../../components/ui/SkeletonBlock';
import { MovieDetail, Episode, CastMember } from '../../types/movie';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isInWatchlist, toggleWatchlist } = useApp();
  const { isOpen, open, close } = useBottomSheet();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const inList = movie ? isInWatchlist(movie.id) : false;
  const reviews = getReviewsForMovie(id || '');
  const dist = getRatingDistribution(id || '');

  useEffect(() => {
    async function loadDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        if (data && data.movie) {
          // Map actors
          const apiActors = data.movie.actor;
          let mappedCast: CastMember[] = [];
          if (apiActors) {
            const actorList = Array.isArray(apiActors) ? apiActors : apiActors.split(',');
            mappedCast = actorList.slice(0, 10).map((actorName: string) => {
              const trimmed = actorName.trim();
              return {
                name: trimmed,
                role: 'Cast',
                initials: trimmed.slice(0, 2).toUpperCase(),
                color: '#1a3a5c',
              };
            });
          }

          // Map episodes
          let apiEpisodes: Episode[] = [];
          if (data.episodes && data.episodes.length > 0) {
            // Take the first server's data
            apiEpisodes = data.episodes[0].server_data || [];
          }

          setMovie({
            id: data.movie.slug,
            title: data.movie.name,
            originalTitle: data.movie.origin_name,
            year: data.movie.year || 2024,
            duration: data.movie.time || '120m',
            rating: 8.5,
            genres: data.movie.category ? data.movie.category.map((c: any) => c.name) : ['Movie'],
            format: data.movie.quality || 'FHD',
            description: data.movie.content ? data.movie.content.replace(/<[^>]*>/g, '') : 'No description available.',
            aiSummary: `Live Stream: High quality ${data.movie.quality} encode with ${data.movie.lang} localization. Ready for instant buffer-free playback.`,
            cast: mappedCast,
            thumbUrl: data.movie.thumb_url,
            posterUrl: data.movie.poster_url,
            heroGradient: 'linear-gradient(135deg, #0a0a14 0%, #1a1a3e 50%, #0f3060 100%)',
          });
          setEpisodes(apiEpisodes);
        }
      } catch (err) {
        console.error('Error fetching movie details from OPhim:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading && !movie) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { top: 16 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Skeleton Hero Background */}
          <View style={styles.heroBackground}>
            <SkeletonBlock width="100%" height="100%" borderRadius={0} />
          </View>

          {/* Skeleton Meta / Title */}
          <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 12 }}>
            <SkeletonBlock width="70%" height={28} borderRadius={6} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SkeletonBlock width={70} height={20} borderRadius={10} />
              <SkeletonBlock width={75} height={20} borderRadius={10} />
              <SkeletonBlock width={60} height={20} borderRadius={10} />
            </View>
            <SkeletonBlock width="45%" height={16} borderRadius={4} />
          </View>

          {/* Skeleton AI Summary Card */}
          <View style={styles.aiSummaryCard}>
            <SkeletonBlock width="35%" height={14} borderRadius={4} style={{ marginBottom: 12 }} />
            <SkeletonBlock width="100%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="95%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="60%" height={14} borderRadius={4} />
          </View>

          {/* Skeleton Episodes Section */}
          <View style={styles.episodesSection}>
            <SkeletonBlock width="25%" height={18} borderRadius={4} style={{ marginLeft: 20, marginBottom: 14 }} />
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
              <SkeletonBlock width={80} height={40} borderRadius={8} />
              <SkeletonBlock width={80} height={40} borderRadius={8} />
              <SkeletonBlock width={80} height={40} borderRadius={8} />
            </View>
          </View>

          {/* Skeleton Cast Section */}
          <View style={styles.castSection}>
            <SkeletonBlock width="20%" height={18} borderRadius={4} style={{ marginLeft: 20, marginBottom: 14 }} />
            <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 20 }}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                  <SkeletonBlock width={56} height={56} borderRadius={28} />
                  <SkeletonBlock width={50} height={10} borderRadius={4} />
                  <SkeletonBlock width={40} height={8} borderRadius={3} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const heroGradient = parseGradient(movie?.heroGradient || 'linear-gradient(135deg, #0a0a14, #1a1a3e)');
  const imageUrl = movie?.posterUrl || (movie?.thumbUrl ? (movie.thumbUrl.startsWith('http') ? movie.thumbUrl : `https://img.ophim.live/uploads/movies/${movie.thumbUrl}`) : null);

  const handlePlayFirst = () => {
    if (!movie) return;
    if (episodes && episodes.length > 0) {
      const firstEp = episodes[0];
      const playLink = firstEp.link_embed || firstEp.link_m3u8;
      if (!playLink || playLink.trim() === '') {
        alert("Nguồn phát phim này hiện chưa khả dụng (phim bản quyền hoặc link lỗi). Vui lòng thử lại sau hoặc chọn phim khác!");
        return;
      }
      router.push({
        pathname: `/movie/${movie.id}/play` as any,
        params: {
          link: playLink,
          episodeName: firstEp.name,
          movieName: movie.title,
        }
      });
    } else {
      alert("Phim này hiện chưa có tập phim khả dụng!");
    }
  };

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
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={heroGradient.colors}
                locations={heroGradient.locations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(8,8,14,0.8)', Theme.colors.bgBase]}
              locations={[0.3, 0.75, 1.0]}
              style={StyleSheet.absoluteFill}
            />

            {/* Title + Meta overlay */}
            <View style={styles.heroContent}>
              <Text style={styles.title}>{movie?.title?.toUpperCase()}</Text>

              {/* Badges */}
              <View style={styles.badgeRow}>
                {movie?.genres?.map((g: string) => (
                  <View key={g} style={styles.genrePill}>
                    <Text style={styles.genrePillText}>{g}</Text>
                  </View>
                ))}
                <View style={[styles.genrePill, styles.formatPill]}>
                  <Text style={styles.genrePillText}>{movie?.format}</Text>
                </View>
              </View>

              <Text style={styles.metaText}>
                ⭐ {movie?.rating}   |   {movie?.year}   |   {movie?.duration}
              </Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePlayFirst}
              style={[styles.playBtn, Theme.glows.red]}
            >
              <Text style={styles.playBtnText}>▶ PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleWatchlist(movie)}
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
          <Text style={styles.aiSummaryText}>{movie?.aiSummary}</Text>
          <Text style={[styles.aiSummaryText, { marginTop: 10, color: Theme.colors.textPrimary }]}>
            {movie?.description}
          </Text>
        </View>

        {/* Episodes Section */}
        {episodes && episodes.length > 0 && (
          <View style={styles.episodesSection}>
            <Text style={styles.sectionTitle}>Episodes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.episodesScroll}>
              {episodes.map((ep: Episode) => (
                <TouchableOpacity
                  key={ep.slug}
                  onPress={() => {
                    const playLink = ep.link_embed || ep.link_m3u8;
                    if (!playLink || playLink.trim() === '') {
                      alert("Tập phim này hiện chưa có nguồn phát hoặc lỗi. Vui lòng chọn tập khác!");
                      return;
                    }
                    router.push({
                      pathname: `/movie/${movie!.id}/play` as any,
                      params: {
                        link: playLink,
                        episodeName: ep.name,
                        movieName: movie!.title,
                      }
                    });
                  }}
                  style={[styles.episodeChip, Theme.glows.red]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.episodeChipText}>
                    {ep.name.includes('Tập') || ep.name.includes('Full') ? ep.name : `Ep ${ep.name}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Cast list */}
        {movie?.cast && movie.cast.length > 0 && (
          <View style={styles.castSection}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {movie.cast.map((person: CastMember) => (
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
        )}

        {/* Spacer for sticky bottom bar */}
        <View style={{ height: insets.bottom + 88 }} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={styles.bottomBarTab}
          onPress={() => toggleWatchlist(movie)}
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

function ReviewsContent({ movie, reviews, dist }: { movie: MovieDetail | null; reviews: any[]; dist: number[] }) {
  const totalRatings = '2,847';
  const avgRating = movie?.rating || 8.5;
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
  episodesSection: {
    marginTop: 24,
  },
  episodesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  episodeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.divider,
    borderWidth: 1,
    borderRadius: Theme.roundness.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeChipText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.bgBase,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
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
