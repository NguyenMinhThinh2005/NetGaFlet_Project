import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toggle from '../components/ui/Toggle';
import Theme from '../constants/Theme';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    autoplay: true,
    hdr: true,
    downloadOnWifi: true,
    subtitles: false,
    parentalControl: false,
  });

  const toggle = (key: string) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  interface SettingRow {
    key?: string;
    label: string;
    icon: string;
    toggle: boolean;
    danger?: boolean;
    onClick?: () => void;
  }

  interface SettingSection {
    label: string;
    rows: SettingRow[];
  }

  const settingSections: SettingSection[] = [
    {
      label: 'Playback',
      rows: [
        { key: 'autoplay', label: 'Autoplay Next Episode', icon: '▶', toggle: true },
        { key: 'hdr', label: '4K HDR Streaming', icon: '🎬', toggle: true },
      ],
    },
    {
      label: 'Downloads',
      rows: [
        { key: 'downloadOnWifi', label: 'Download on Wi-Fi Only', icon: '📥', toggle: true },
      ],
    },
    {
      label: 'Privacy',
      rows: [
        { key: 'parentalControl', label: 'Parental Controls', icon: '🔒', toggle: true },
        { label: 'Clear Watch History', icon: '🗑', toggle: false, onClick: () => { } },
        { label: 'Privacy Policy', icon: '📄', toggle: false, onClick: () => { } },
      ],
    },
    {
      label: 'Account',
      rows: [
        { label: 'Change Password', icon: '🔑', toggle: false, onClick: () => { } },
        { label: 'Manage Subscription', icon: '💳', toggle: false, onClick: () => { } },
        {
          label: 'Sign Out',
          icon: '🚪',
          toggle: false,
          danger: true,
          onClick: () => {
            logout();
            router.replace('/signin');
          },
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {settingSections.map(section => (
          // @ts-ignore
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>

            {section.rows.map((row, i) => {
              const rowContent = (
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{row.icon}</Text>
                    <Text style={[styles.rowLabel, { color: row.danger ? Theme.colors.primary : Theme.colors.textPrimary }]}>
                      {row.label}
                    </Text>
                  </View>
                  {row.toggle ? (
                    <Toggle
                      value={settings[row.key || '']}
                      onChange={() => toggle(row.key || '')}
                    />
                  ) : (
                    !row.danger && <Text style={styles.chevron}>›</Text>
                  )}
                </View>
              );

              if (row.onClick) {
                return (
                  // @ts-ignore
                  <TouchableOpacity key={row.label} activeOpacity={0.8} onPress={row.onClick}>
                    {rowContent}
                  </TouchableOpacity>
                );
              }

              // @ts-ignore
              return <View key={row.label}>{rowContent}</View>;
            })}
          </View>
        ))}

        <Text style={styles.footerText}>
          NETGAFLET v1.0.0 · © 2024
        </Text>
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
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  chevron: {
    color: Theme.colors.textTertiary,
    fontSize: 16,
  },
  footerText: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: Theme.typography.fontFamily,
  },
});
