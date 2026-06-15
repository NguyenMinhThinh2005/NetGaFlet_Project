import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../../constants/Theme';
import { getMovieById, mockMovies } from '../../../data/mockMovies';
import { formatTime } from '../../../utils/helpers';

export default function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movie = getMovieById(id || '') || mockMovies[0];

  const totalSeconds = (movie.durationMin || 148) * 60;

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(Math.floor(totalSeconds * 0.42));
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<any>(null);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(t => {
        if (t >= totalSeconds) {
          clearInterval(interval);
          // Redirect to next episode countdown
          router.replace(`/movie/${movie.id}/next`);
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds, movie.id]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(controlsTimeout.current);
  }, [showControls, currentTime]);

  const progress = currentTime / totalSeconds;

  const skip = useCallback((sec: number) => {
    setCurrentTime(t => Math.max(0, Math.min(totalSeconds, t + sec)));
  }, [totalSeconds]);

  const toggleControls = () => {
    setShowControls(v => !v);
  };

  // Draggable Progress simulation on tap
  const handleProgressTap = (e: any) => {
    // Basic tap simulation for scrubber jump
    skip(90); // skip 90s forward as simple demo jump, or just skip forward
  };

  // Landscape dimensions rotation
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  // For web simulator or rotated layout
  const rotationStyle = Platform.OS === 'web' ? {} : {
    width: screenHeight,
    height: screenWidth,
    transform: [{ rotate: '90deg' }],
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        style={[styles.container, rotationStyle]}
      >
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e', '#0d0d1a']}
          style={StyleSheet.absoluteFill}
        />

        {/* Video simulation label */}
        <View style={styles.videoContent}>
          <Text style={styles.videoTitle}>{movie.title.toUpperCase()}</Text>
        </View>

        {/* Controls Overlay */}
        <View style={[styles.controlsOverlay, { opacity: showControls ? 1 : 0 }]}>
          
          {/* Top Bar */}
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'transparent']}
            style={styles.topBar}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={styles.topTitle}>
              {movie.title} · {movie.type === 'series' ? 'S1 E3' : 'Feature'}
            </Text>
          </LinearGradient>

          {/* Bottom Bar */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.bottomBar}
          >
            {/* Skip Intro */}
            <View style={styles.skipIntroRow}>
              <TouchableOpacity
                onPress={() => skip(90)}
                style={[styles.skipIntroBtn, Theme.glows.red]}
                activeOpacity={0.8}
              >
                <Text style={styles.skipIntroText}>Skip Intro →</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar slider */}
            <TouchableOpacity
              onPress={handleProgressTap}
              activeOpacity={1}
              style={styles.progressBarTrack}
            >
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.scrubberDot, { left: `${progress * 100}%` }]} />
            </TouchableOpacity>

            {/* Time labels */}
            <View style={styles.timeLabelRow}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(totalSeconds)}</Text>
            </View>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={() => skip(-10)} style={styles.controlBtn}>
                <Text style={styles.controlText}>⏮ 10</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsPlaying(v => !v)} style={styles.playPauseBtn}>
                <Text style={styles.playPauseText}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => skip(10)} style={styles.controlBtn}>
                <Text style={styles.controlText}>10 ⏭</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Right side controls overlay */}
        {showControls && (
          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.rightBtn}>
              <Text style={styles.rightBtnText}>🔊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightBtn}>
              <Text style={styles.rightBtnText}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  videoContent: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    color: 'rgba(255,255,255,0.03)',
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  topTitle: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 32,
  },
  skipIntroRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  skipIntroBtn: {
    height: 36,
    borderRadius: 100,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipIntroText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  scrubberDot: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Theme.colors.textPrimary,
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  timeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    color: Theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  controlBtn: {
    padding: 8,
  },
  controlText: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontFamily: Theme.typography.fontFamily,
  },
  playPauseBtn: {
    padding: 8,
  },
  playPauseText: {
    color: Theme.colors.textPrimary,
    fontSize: 36,
    fontFamily: Theme.typography.fontFamily,
  },
  rightControls: {
    position: 'absolute',
    right: 24,
    bottom: '40%',
    gap: 16,
    alignItems: 'center',
    zIndex: 12,
  },
  rightBtn: {
    padding: 8,
  },
  rightBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
  },
});
