import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';

// Dữ liệu giả cho trang Notifications
const mockNotifications = [
  {
    id: '1',
    title: 'New Arrival',
    message: 'Season 4 of Stranger Things is now available.',
    time: '2 hours ago',
    read: false,
    icon: 'film',
  },
  {
    id: '2',
    title: 'New Recommendation',
    message: 'Based on your watch history, we found new titles you might enjoy.',
    time: '5 hours ago',
    read: true,
    icon: 'star',
  },
  {
    id: '3',
    title: 'Recommendation',
    message: 'Based on your watch history, we think you will love "The Dark Knight".',
    time: '1 day ago',
    read: true,
    icon: 'star',
  },
  {
    id: '4',
    title: 'Account Update',
    message: 'Your Premium subscription will renew on July 15, 2026.',
    time: '3 days ago',
    read: true,
    icon: 'credit-card',
  }
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn}>
          <Feather name="check-circle" size={20} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={[styles.iconContainer, !item.read && styles.unreadIconContainer]}>
              <Feather 
                name={item.icon as any} 
                size={22} 
                color={!item.read ? Theme.colors.textPrimary : Theme.colors.textSecondary} 
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={[styles.itemTitle, !item.read && styles.unreadTitle]}>{item.title}</Text>
              <Text style={styles.itemMessage} numberOfLines={2}>{item.message}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color={Theme.colors.textTertiary} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up! Check back later for new updates.</Text>
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
  clearBtn: {
    padding: 4,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
    backgroundColor: Theme.colors.bgBase,
  },
  unreadItem: {
    backgroundColor: 'rgba(229, 9, 20, 0.04)', // Slight red tint for unread
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  unreadIconContainer: {
    backgroundColor: Theme.colors.primary,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  unreadTitle: {
    color: Theme.colors.textPrimary,
    fontWeight: '800',
  },
  itemMessage: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  itemTime: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
    marginTop: 6,
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
