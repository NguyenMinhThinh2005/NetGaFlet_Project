import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import { parseGradient } from '../../utils/helpers';
import { Episode } from '../../data/mockMovies';

interface EpisodeRowProps {
  episode: Episode;
  episodeNum: number;
  onPlay: () => void;
}

export default function EpisodeRow({ episode, episodeNum, onPlay }: EpisodeRowProps) {
  const hasProgress = episode.progress > 0;
  const isWatched = episode.progress >= 1;
  const gradient = parseGradient(episode.thumbnail);

  return (
    <View style={styles.row}>
      {/* Thumbnail */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPlay}
        style={styles.thumbnailContainer}
      >
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Play indicator */}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>

        {/* Progress bar */}
        {hasProgress && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${episode.progress * 100}%`,
                  backgroundColor: isWatched ? Theme.colors.textTertiary : Theme.colors.primary,
                },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {episodeNum}. {episode.title}
          </Text>
          <Text style={styles.duration}>{episode.duration}</Text>
        </View>
        
        {isWatched && (
          <View style={styles.watchedBadge}>
            <Text style={styles.watchedText}>Watched</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
    alignItems: 'flex-start',
  },
  thumbnailContainer: {
    width: 100,
    height: 64,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 2,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: {
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    flex: 1,
    paddingRight: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  duration: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  watchedBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: Theme.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watchedText: {
    fontSize: 10,
    color: Theme.colors.textTertiary,
    fontFamily: Theme.typography.fontFamily,
  },
});
