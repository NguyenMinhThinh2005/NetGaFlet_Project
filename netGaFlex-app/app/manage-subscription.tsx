import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Theme from '../constants/Theme';

export default function ManageSubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Premium membership? You will lose access to 4K HDR streaming and offline downloads at the end of your billing cycle.',
      [
        { text: 'Keep Plan', style: 'cancel' },
        { text: 'Cancel Plan', style: 'destructive', onPress: () => Alert.alert('Success', 'Your subscription has been cancelled.') }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Premium Plan</Text>
              <Text style={styles.planStatus}>Active</Text>
            </View>
            <Text style={styles.planPrice}>$14.99<Text style={styles.planCycle}>/mo</Text></Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.detailLabel}>Next billing date</Text>
          <Text style={styles.detailValue}>July 15, 2026</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.detailLabel}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <Feather name="credit-card" size={20} color={Theme.colors.textPrimary} />
            <Text style={styles.detailValue}>•••• •••• •••• 4242</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Plan Benefits</Text>
        <View style={styles.benefitRow}>
          <Feather name="check-circle" size={20} color={Theme.colors.primary} />
          <Text style={styles.benefitText}>Ad-free streaming</Text>
        </View>
        <View style={styles.benefitRow}>
          <Feather name="check-circle" size={20} color={Theme.colors.primary} />
          <Text style={styles.benefitText}>4K HDR quality</Text>
        </View>
        <View style={styles.benefitRow}>
          <Feather name="check-circle" size={20} color={Theme.colors.primary} />
          <Text style={styles.benefitText}>Unlimited offline downloads</Text>
        </View>
        <View style={styles.benefitRow}>
          <Feather name="check-circle" size={20} color={Theme.colors.primary} />
          <Text style={styles.benefitText}>Watch on 4 screens at once</Text>
        </View>

        <TouchableOpacity 
          style={styles.cancelBtn} 
          activeOpacity={0.7}
          onPress={handleCancel}
        >
          <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.roundness.card,
    padding: 20,
    marginBottom: 32,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  planStatus: {
    color: '#22C55E', // Success green
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  planPrice: {
    color: Theme.colors.primary,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: Theme.typography.fontFamily,
  },
  planCycle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.divider,
    marginVertical: 16,
  },
  detailLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  detailValue: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: Theme.typography.fontFamily,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  benefitText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily,
  },
  cancelBtn: {
    marginTop: 40,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: Theme.roundness.button,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  cancelBtnText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
