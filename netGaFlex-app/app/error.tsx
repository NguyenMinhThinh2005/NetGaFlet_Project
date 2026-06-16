import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';

export default function ErrorStateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRetry = () => {
    // Retry action (re-navigate to splash)
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Illustration */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>📡</Text>
        </View>
        <View style={styles.badgeCircle}>
          <Text style={styles.badgeText}>!</Text>
        </View>
      </View>

      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>
        We couldn't load this content. Check your connection and try again.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleRetry}
          style={[styles.retryBtn, Theme.glows.red]}
          activeOpacity={0.85}
        >
          <Text style={styles.retryBtnText}>🔄 Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={styles.homeBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  illustrationWrapper: {
    marginBottom: 24,
    position: 'relative',
    width: 104,
    height: 104,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(229,9,20,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  badgeCircle: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
    fontFamily: Theme.typography.fontFamily,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 10,
  },
  retryBtn: {
    height: 52,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  homeBtn: {
    height: 52,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily,
  },
});
