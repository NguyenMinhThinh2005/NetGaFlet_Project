import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Theme from '../constants/Theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoggedIn, hasOnboarded } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Spinner spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    // Auto navigate after 2.5 seconds
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else if (hasOnboarded) {
        router.replace('/signin');
      } else {
        router.replace('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, hasOnboarded]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Red bloom backdrop */}
      <View style={styles.radialBloom} />

      {/* Wordmark and subhead */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>NETGAFLET</Text>
        <Text style={styles.subhead}>Cinema, Elevated.</Text>

        {/* Arc spinner */}
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialBloom: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(229,9,20,0.04)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Theme.colors.primary,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 6,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(229,9,20,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
    fontFamily: Theme.typography.fontFamily,
  },
  subhead: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  spinner: {
    marginTop: 32,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Theme.colors.primary,
    borderRightColor: 'rgba(229,9,20,0.3)',
  },
});
