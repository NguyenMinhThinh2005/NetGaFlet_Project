import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../../constants/Theme';
import { getMovieById, mockMovies } from '../../../data/mockMovies';

export default function NextEpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movie = getMovieById(id || '') || mockMovies[0];
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          router.replace(`/movie/${movie.id}/play`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router, movie.id]);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const rotationStyle = Platform.OS === 'web' ? {} : {
    width: screenHeight,
    height: screenWidth,
    transform: [{ rotate: '90deg' }],
  };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, rotationStyle]}>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e', '#0d0d1a']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.dimOverlay} />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        {/* Center label */}
        <View style={styles.centerLabel}>
          <Text style={styles.nextText}>Next Up</Text>
        </View>

        {/* Next Card */}
        <View style={[styles.nextCard, Theme.glows.card]}>
          <View style={styles.thumb} />
          
          <View style={styles.info}>
            <Text style={styles.nextTag}>NEXT EPISODE</Text>
            <Text style={styles.title} numberOfLines={1}>S1 E4 — The Body</Text>
            <Text style={styles.countdownText}>Starting in {countdown}s</Text>
          </View>

          {/* Countdown badge circle */}
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </View>
        </View>

        {/* Cancel CTA */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,8,14,0.7)',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 12,
  },
  backBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  centerLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: Theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
    fontFamily: Theme.typography.fontFamily,
  },
  nextCard: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: Theme.colors.surfaceElevated,
    borderRadius: Theme.roundness.card,
    width: 220,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  thumb: {
    width: 72,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#140820',
  },
  info: {
    flex: 1,
  },
  nextTag: {
    color: Theme.colors.primary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
    fontFamily: Theme.typography.fontFamily,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  countdownText: {
    color: Theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  countdownCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  cancelBtn: {
    position: 'absolute',
    bottom: 8,
    right: 24,
    zIndex: 12,
    padding: 8,
  },
  cancelText: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
});
