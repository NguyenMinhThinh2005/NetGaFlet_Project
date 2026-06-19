import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Theme from '../../../constants/Theme';
import { getMovieById } from '../../../data/mockMovies';
import { useApp } from '../../../context/AppContext';

export default function VideoPlayerScreen() {
  const { id, link, episodeName, movieName } = useLocalSearchParams<{
    id: string;
    link?: string;
    episodeName?: string;
    movieName?: string;
  }>();
  const router = useRouter();
  const { watchHistory, addToHistory } = useApp();

  const movie = getMovieById(id || '') || {
    id: id || 'movie',
    title: movieName || 'Movie',
    durationMin: 120,
    type: 'movie',
  };

  const totalSeconds = (movie.durationMin || 120) * 60;

  // Initialize playback time from Supabase watch history if available
  const savedItem = watchHistory.find((h: any) => h.movieId === (id || movie.id));
  const savedSeconds = savedItem ? Math.floor(savedItem.progress * totalSeconds) : 0;

  const [currentTime, setCurrentTime] = useState(savedSeconds || Math.floor(totalSeconds * 0.05));
  const isPlaying = true; // Timer always runs in background while watching

  // Auto-play time progression (keeps running in background to update watch history)
  useEffect(() => {
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
  }, [totalSeconds, movie.id]);

  // Periodic progress saving to Supabase (every 10 seconds)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      addToHistory(
        id || movie.id,
        movieName || movie.title,
        episodeName || 'Full',
        currentTime,
        totalSeconds
      );
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [currentTime, id, movieName, movie.id, movie.title, episodeName, totalSeconds]);

  // Save progress on unmount / exit
  const lastTimeRef = useRef(currentTime);
  useEffect(() => {
    lastTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    return () => {
      addToHistory(
        id || movie.id,
        movieName || movie.title,
        episodeName || 'Full',
        lastTimeRef.current,
        totalSeconds
      );
    };
  }, [id, movieName, movie.id, movie.title, episodeName, totalSeconds]);

  // Lock orientation to landscape on mount, restore to portrait on unmount
  useEffect(() => {
    async function lockOrientation() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Could not lock screen orientation:', error);
      }
    }
    lockOrientation();
    return () => {
      async function restoreOrientation() {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } catch (error) {
          console.warn('Could not restore screen orientation:', error);
        }
      }
      restoreOrientation();
    };
  }, []);

  const isValidUrl = link && (link.startsWith('http://') || link.startsWith('https://'));

  return (
    <View style={styles.outerContainer}>
      <StatusBar hidden={true} />

      {/* Main Video Stream Container */}
      <View style={StyleSheet.absoluteFill}>
        {isValidUrl ? (
          Platform.OS === 'web' ? (
            <iframe
              src={link}
              style={{ width: '100%', height: '100%', border: 0 }}
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          ) : (
            <WebView
              source={{ uri: link }}
              style={{ flex: 1, backgroundColor: '#000' }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
            />
          )
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Nguồn phát phim này hiện chưa khả dụng. Vui lòng quay lại chọn tập khác hoặc phim khác!</Text>
          </View>
        )}
      </View>

      {/* Top HUD Overlay (Contains Back button & Movie Details) */}
      <View style={styles.topOverlayContainer} pointerEvents="box-none">
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'transparent']}
          style={styles.topOverlayGradient}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButtonPill}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.movieTitleLabel}>
            {movieName || movie.title} · {episodeName || 'Feature'}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 999,
  },
  topOverlayGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  backButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  movieTitleLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#050508',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Theme.typography.fontFamily,
  },
});
