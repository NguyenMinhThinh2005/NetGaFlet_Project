import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Theme from '../constants/Theme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>NEXGAFLET Privacy Policy</Text>
        <Text style={styles.date}>Last updated: June 2026</Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, such as when you create or modify your account, contact customer support, or otherwise communicate with us. This information may include: name, email address, phone number, and payment method.
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve our services, such as to personalize the content we show you and to recommend movies and shows we think you'll enjoy based on your viewing history and watchlist.
        </Text>

        <Text style={styles.heading}>3. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not share your personal information with third parties without your consent, except in the following circumstances: to comply with a legal obligation, to protect and defend our rights or property, or to prevent fraud.
        </Text>

        <Text style={styles.heading}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
        </Text>

        <View style={{ height: 40 }} />
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
  content: {
    padding: 24,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  date: {
    color: Theme.colors.textTertiary,
    fontSize: 14,
    marginBottom: 24,
    fontFamily: Theme.typography.fontFamily,
  },
  heading: {
    color: Theme.colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  paragraph: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: Theme.typography.fontFamily,
  },
});
