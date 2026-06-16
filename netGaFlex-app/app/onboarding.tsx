import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Theme from '../constants/Theme';

// ─── Illustrations ─────────────────────────────────────────────────────────────
function TheaterIllustration() {
  return (
    <View style={illustrationStyles.container}>
      {/* Light bloom */}
      <View style={illustrationStyles.radialBloom} />
      
      {/* Screen */}
      <View style={illustrationStyles.screen}>
        <Text style={illustrationStyles.screenText}>NETGAFLET</Text>
      </View>

      {/* Couch */}
      <View style={illustrationStyles.couchRow}>
        <View style={{ width: 60, height: 24, backgroundColor: '#111118', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ width: 10, height: 40, backgroundColor: '#111118', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ width: 10, height: 40, backgroundColor: '#111118', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ width: 10, height: 40, backgroundColor: '#111118', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ width: 60, height: 24, backgroundColor: '#111118', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
      </View>

      {/* Person head */}
      <View style={illustrationStyles.personHead} />
    </View>
  );
}

function NeuralNetIllustration() {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const nodes = [
    { x: 30, y: 30, color: Theme.colors.primary },
    { x: 70, y: 55, color: Theme.colors.surfaceElevated },
    { x: 50, y: 80, color: Theme.colors.primary },
    { x: 20, y: 65, color: Theme.colors.surfaceElevated },
    { x: 80, y: 25, color: Theme.colors.primary },
    { x: 40, y: 45, color: Theme.colors.surfaceElevated },
    { x: 60, y: 20, color: Theme.colors.primary },
    { x: 25, y: 85, color: Theme.colors.surfaceElevated },
    { x: 75, y: 75, color: Theme.colors.primary },
  ];

  // We can render lines using styled lines or standard layout overlay
  return (
    <View style={illustrationStyles.container}>
      <View style={illustrationStyles.neuralContainer}>
        {nodes.map((n, i) => (
          <Animated.View
            key={i}
            style={[
              illustrationStyles.node,
              {
                left: `${n.x}%`,
                top: `${n.y}%`,
                backgroundColor: n.color,
                opacity: i % 2 === 0 ? pulseAnim : 0.8,
                transform: [{ scale: i % 2 === 0 ? pulseAnim : 1 }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function DiceIllustration() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={illustrationStyles.container}>
      <View style={illustrationStyles.diceBloom} />
      <Animated.Text
        style={[
          illustrationStyles.diceEmoji,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        🎲
      </Animated.Text>
    </View>
  );
}

// ─── Slide Definitions ─────────────────────────────────────────────────────────
const SLIDE_DATA = [
  { id: 0, title: 'Cinema at your fingertips.', body: 'Thousands of films in 4K HDR, curated by NixAI just for you.', cta: 'Next →', Illustration: TheaterIllustration },
  { id: 1, title: 'AI that knows your taste.', body: 'NixAI learns your preferences, reads your mood, and roasts your watch history.', cta: 'Next →', Illustration: NeuralNetIllustration },
  { id: 2, title: 'Shake. Discover. Watch.', body: 'Just shake your phone and NixAI picks the perfect film for tonight.', cta: 'Get Started', Illustration: DiceIllustration },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { setOnboarded } = useAuth();

  const handleCTA = () => {
    if (current < 2) {
      setCurrent(c => c + 1);
    } else {
      setOnboarded();
      router.replace('/signin');
    }
  };

  const handleSkip = () => {
    setOnboarded();
    router.replace('/signin');
  };

  const slide = SLIDE_DATA[current];
  const { Illustration } = slide;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration zone — 55% */}
      <View style={styles.illustrationArea}>
        <Illustration />
      </View>

      {/* Text + nav zone — 45% */}
      <View style={styles.infoArea}>
        {/* Dot indicators */}
        <View style={styles.dotRow}>
          {SLIDE_DATA.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setCurrent(i)}
              style={[
                styles.dot,
                {
                  width: i === current ? 20 : 6,
                  backgroundColor: i === current ? Theme.colors.primary : Theme.colors.textTertiary,
                },
              ]}
            />
          ))}
        </View>

        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>

        {/* Body */}
        <Text style={styles.body}>{slide.body}</Text>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleCTA}
            style={[styles.ctaButton, current === 2 ? Theme.glows.red : {}]}
          >
            <Text style={styles.ctaText}>{slide.cta}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  illustrationArea: {
    height: '50%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoArea: {
    height: '45%',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: Theme.typography.fontFamily,
  },
  body: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
    fontFamily: Theme.typography.fontFamily,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  ctaButton: {
    height: 48,
    borderRadius: 100,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});

const illustrationStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialBloom: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(229,9,20,0.08)',
  },
  screen: {
    position: 'absolute',
    top: 40,
    width: 240,
    height: 140,
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.15)',
    borderRadius: 8,
    backgroundColor: 'rgba(229,9,20,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  screenText: {
    color: 'rgba(229,9,20,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Theme.typography.fontFamily,
  },
  couchRow: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 2,
    alignItems: 'flex-end',
  },
  personHead: {
    position: 'absolute',
    bottom: 96,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0f0f18',
    borderWidth: 1,
    borderColor: '#1a1a24',
  },
  neuralContainer: {
    width: 240,
    height: 160,
    position: 'relative',
  },
  node: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  diceBloom: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(229,9,20,0.08)',
  },
  diceEmoji: {
    fontSize: 100,
    textShadowColor: 'rgba(229,9,20,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
});
