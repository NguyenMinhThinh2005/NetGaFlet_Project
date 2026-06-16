import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import { useApp } from '../context/AppContext';
import { groupByDate, formatDate, parseGradient } from '../utils/helpers';

export default function WatchHistoryScreen() {
  const router = useRouter();
  const { watchHistory, clearHistory } = useApp();
  const insets = useSafeAreaInsets();
  const grouped = groupByDate(watchHistory);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Watch History</Text>
        </View>

        {watchHistory.length > 0 && (
          <TouchableOpacity onPress={clearHistory} activeOpacity={0.7}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {watchHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📺</Text>
            <Text style={styles.emptyTitle}>Nothing watched yet</Text>
            <Text style={styles.emptySubtitle}>
              Start watching and your history will appear here.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([groupLabel, items]) => (
            <View key={groupLabel} style={styles.section}>
              <Text style={styles.sectionLabel}>{groupLabel}</Text>
              
              <View style={styles.list}>
                {items.map((item, i) => {
                  const gradient = parseGradient(item.gradient);
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/movie/${item.movieId}`)}
                      style={styles.itemRow}
                    >
                      {/* Thumbnail */}
                      <View style={styles.thumbnail}>
                        <LinearGradient
                          colors={gradient.colors}
                          locations={gradient.locations}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        {item.progress < 1 && (
                          <View style={styles.innerProgressTrack}>
                            <View style={[styles.innerProgressFill, { width: `${item.progress * 100}%` }]} />
                          </View>
                        )}
                        {item.progress >= 1 && (
                          <View style={styles.checkBadge}>
                            <Text style={styles.checkBadgeText}>✓</Text>
                          </View>
                        )}
                      </View>

                      {/* Info */}
                      <View style={styles.info}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.itemMeta}>
                          {item.duration} · {formatDate(item.watchedAt)}
                        </Text>
                        {item.progress < 1 && (
                          <View style={styles.outerProgressTrack}>
                            <View style={[styles.outerProgressFill, { width: `${item.progress * 100}%` }]} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  clearText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  emptySubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  list: {
    gap: 10,
  },
  itemRow: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 72,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  innerProgressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  innerProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(34,197,94,0.9)',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '700',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
    fontFamily: Theme.typography.fontFamily,
  },
  itemMeta: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    marginBottom: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  outerProgressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: Theme.colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  outerProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
});
