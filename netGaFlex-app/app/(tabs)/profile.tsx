import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toggle from '../../components/ui/Toggle';
import Header from '../../components/ui/Header';
import Theme from '../../constants/Theme';
import { useAuth } from '../../context/AuthContext';
import { mockUser } from '../../data/mockUser';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [notif, setNotif] = useState(true);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    router.replace('/signin');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section (Avatar, Name, Stats) */}
        <View style={styles.header}>
          {/* Avatar with gradient ring and glow */}
          <View style={[styles.avatarWrapper, Theme.glows.redStrong]}>
            <LinearGradient
              colors={['#E50914', '#FF6B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientRing}
            />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.initials || 'U'}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userMember}>
            {user?.memberType || 'Premium Member'} · Joined {user?.joinYear || 2026}
          </Text>

          {/* Stats Chips */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>{user?.stats?.watched || 0} Watched</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>{user?.stats?.watchlist || 0} Watchlist</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>{user?.stats?.avgRating || 4.5}★ Avg</Text>
            </View>
          </View>
        </View>

        {/* AI Roast CTA */}
        <View style={styles.roastSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/roast-result')}
            style={[styles.roastBtn, Theme.glows.red]}
          >
            <Text style={styles.roastBtnText}>✨ AI: Roast My Taste</Text>
          </TouchableOpacity>
          <Text style={styles.roastSubtext}>
            Get an honest (brutal) AI review of your movie palette.
          </Text>
        </View>

        {/* Library Section */}
        <ProfileSection label="Library">
          <ListRow icon="🎬" label="Viewing History" onClick={() => router.push('/watch-history')} showChevron />
          <ListRow icon="📥" label="Downloads" onClick={() => router.push('/downloads' as any)} showChevron />
          <ListRow icon="🔖" label="My List" onClick={() => router.push('/watchlist')} showChevron />
        </ProfileSection>

        {/* Preferences Section */}
        <ProfileSection label="Preferences">
          <ListRow
            icon="🎭"
            label="Preferred Genres"
            value="Action, Sci-Fi"
            onClick={() => router.push('/genre-setup')}
            showChevron
          />
          <ListRow icon="🌐" label="Subtitle Language" value="English" showChevron />
        </ProfileSection>

        {/* Account Section */}
        <ProfileSection label="Account">
          <ListRow
            icon="🔔"
            label="Notifications"
            right={<Toggle value={notif} onChange={setNotif} />}
          />
          <ListRow icon="⚙️" label="Settings" onClick={() => router.push('/settings' as any)} showChevron />
          <ListRow
            icon="🚪"
            label="Sign Out"
            labelColor={Theme.colors.primary}
            onClick={handleLogout}
          />
        </ProfileSection>
      </ScrollView>
    </View>
  );
}

function ProfileSection({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

interface ListRowProps {
  icon: string;
  label: string;
  value?: string;
  onClick?: () => void;
  showChevron?: boolean;
  right?: React.ReactNode;
  labelColor?: string;
}

function ListRow({ icon, label, value, onClick, showChevron, right, labelColor }: ListRowProps) {
  const content = (
    <View style={styles.listRow}>
      <View style={styles.listRowLeft}>
        <Text style={styles.listRowIcon}>{icon}</Text>
        <Text style={[styles.listRowLabel, { color: labelColor || Theme.colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.listRowRight}>
        {value && <Text style={styles.listRowValue}>{value}</Text>}
        {right}
        {showChevron && <Text style={styles.chevron}>›</Text>}
      </View>
    </View>
  );

  if (onClick) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
    width: 102,
    height: 102,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientRing: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 51,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.bgBase,
  },
  avatarText: {
    color: Theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  userName: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  userMember: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
    fontFamily: Theme.typography.fontFamily,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Theme.colors.surfaceElevated,
    borderRadius: Theme.roundness.card,
  },
  statChipText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  roastSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  roastBtn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  roastBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  roastSubtext: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    fontFamily: Theme.typography.fontFamily,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
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
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listRowIcon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  listRowLabel: {
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily,
  },
  listRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listRowValue: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  chevron: {
    color: Theme.colors.textTertiary,
    fontSize: 16,
  },
});
