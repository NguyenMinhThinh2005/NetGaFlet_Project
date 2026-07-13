import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import { parseGradient } from '../../utils/helpers';
import { Movie } from '../../data/mockMovies';

interface Message {
  id: string | number;
  sender: 'ai' | 'user';
  text?: string;
  type?: 'typing';
  time?: string;
  streaming?: boolean;
  movieCard?: any | null;
}

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.sender === 'ai';
  const isTyping = message.type === 'typing';

  if (isTyping) {
    return <TypingIndicator />;
  }

  return (
    <View style={[styles.wrapper, { justifyContent: isAI ? 'flex-start' : 'flex-end' }]}>
      <View
        style={[
          styles.bubble,
          {
            maxWidth: isAI ? '80%' : '70%',
            backgroundColor: isAI ? Theme.colors.surfaceElevated : Theme.colors.primary,
            borderTopLeftRadius: isAI ? 4 : 16,
            borderTopRightRadius: isAI ? 16 : 4,
          },
        ]}
      >
        {/* Streaming text */}
        <Text style={styles.bubbleText}>
          {message.text}
          {message.streaming && <CursorBlinker />}
        </Text>

        {/* Embedded movie card */}
        {message.movieCard && <MovieCardEmbed movie={message.movieCard} />}

        {/* Timestamp */}
        {message.time && (
          <View style={{ alignSelf: isAI ? 'flex-start' : 'flex-end', marginTop: 6 }}>
            <Text style={styles.timestamp}>{message.time}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function CursorBlinker() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.cursor, { opacity: fadeAnim }]} />
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const makeAnim = (val: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1.0, duration: 400, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );
    };

    Animated.parallel([
      makeAnim(dot1, 0),
      makeAnim(dot2, 200),
      makeAnim(dot3, 400),
    ]).start();
  }, []);

  return (
    <View style={[styles.wrapper, { justifyContent: 'flex-start' }]}>
      <View style={[styles.bubble, styles.typingBubble]}>
        <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
      </View>
    </View>
  );
}

function MovieCardEmbed({ movie }: { movie: any }) {
  const router = useRouter();
  const gradient = movie.posterGradient ? parseGradient(movie.posterGradient) : { colors: ['#1a1a2e', '#16213e'], locations: [0, 1] };
  const title = movie.title || movie.name || '';
  const genres = movie.genres || (movie.category ? movie.category.map((c: any) => c.name) : []);
  const rating = movie.rating || 8.0;
  const year = movie.year || '';
  const duration = movie.duration || '';

  return (
    <View style={styles.embedContainer}>
      {/* Poster */}
      <View style={styles.embedPoster}>
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.embedPosterText} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.embedInfo}>
        <Text style={styles.embedTitle}>{title}</Text>
        <View style={styles.embedBadgeRow}>
          {(genres || []).slice(0, 2).map((g: string) => (
            <View key={g} style={styles.embedPill}>
              <Text style={styles.embedPillText}>{g}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.embedMeta}>
          ⭐ {rating} · {year} · {duration}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(`/movie/${movie.id || movie.slug}/play`)}
          style={styles.embedPlayBtn}
        >
          <Text style={styles.embedPlayBtnText}>▶ Play Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 14,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typingBubble: {
    backgroundColor: Theme.colors.surfaceElevated,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  bubbleText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Theme.typography.fontFamily,
  },
  cursor: {
    width: 2,
    height: 14,
    backgroundColor: Theme.colors.primary,
    marginLeft: 2,
  },
  timestamp: {
    color: 'rgba(245,245,245,0.4)',
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Theme.colors.textSecondary,
  },
  embedContainer: {
    marginTop: 10,
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  embedPoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  embedPosterText: {
    fontSize: 8,
    color: Theme.colors.textTertiary,
    textAlign: 'center',
    padding: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  embedInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  embedTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  embedBadgeRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  embedPill: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  embedPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
  embedMeta: {
    color: Theme.colors.textSecondary,
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily,
  },
  embedPlayBtn: {
    alignSelf: 'flex-start',
    height: 28,
    borderRadius: 100,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  embedPlayBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
  },
});
