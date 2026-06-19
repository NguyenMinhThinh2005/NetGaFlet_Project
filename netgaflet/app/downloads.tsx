import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';

// Dữ liệu giả cho trang Downloads
const mockDownloads = [
  {
    id: '1',
    title: 'Inception',
    size: '1.2 GB',
    status: 'completed',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    size: '1.5 GB',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Interstellar',
    size: '800 MB',
    status: 'downloading',
    progress: 45,
  }
];

export default function DownloadsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for balance */}
      </View>

      <FlatList
        data={mockDownloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.downloadItem}>
            <View style={styles.iconContainer}>
              <Feather name="film" size={24} color={Theme.colors.textSecondary} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSize}>
                {item.status === 'downloading' ? `Downloading... ${item.progress}%` : item.size}
              </Text>
              
              {item.status === 'downloading' && (
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${item.progress || 0}%` as any }]} />
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.actionBtn}>
              {item.status === 'downloading' ? (
                <Feather name="pause-circle" size={24} color={Theme.colors.primary} />
              ) : (
                <Ionicons name="trash-outline" size={24} color={Theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="download-cloud" size={48} color={Theme.colors.textTertiary} />
            <Text style={styles.emptyText}>No downloads yet</Text>
            <Text style={styles.emptySubtext}>Movies and shows you download will appear here.</Text>
          </View>
        )}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  listContent: {
    padding: 20,
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.roundness.card,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  itemTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  itemSize: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Theme.colors.divider,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
  },
  actionBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  emptySubtext: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: Theme.typography.fontFamily,
  }
});
