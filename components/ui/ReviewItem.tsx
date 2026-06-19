import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../constants/Theme';
import { Review } from '../../data/mockReviews';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const stars = Math.round(review.stars);

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            { backgroundColor: review.avatarColor || Theme.colors.surfaceElevated },
          ]}
        >
          <Text style={styles.avatarText}>{review.initials}</Text>
        </View>

        {/* Details */}
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.name}>{review.name}</Text>
            <Text style={styles.timestamp}>{review.timestamp}</Text>
          </View>

          {/* Stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(i => (
              <Text
                key={i}
                style={[
                  styles.star,
                  { color: i <= stars ? Theme.colors.primary : Theme.colors.textTertiary },
                ]}
              >
                ★
              </Text>
            ))}
          </View>

          {/* Text */}
          <Text style={styles.text}>{review.text}</Text>

          {/* Helpful button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.helpfulBtn}>
            <Text style={styles.helpfulText}>👍 Helpful ({review.helpful})</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  timestamp: {
    color: Theme.colors.textTertiary,
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  star: {
    fontSize: 12,
  },
  text: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Theme.typography.fontFamily,
  },
  helpfulBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  helpfulText: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.divider,
    marginTop: 16,
  },
});
