import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '../../constants/Theme';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXGAFLET</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => router.push('/downloads')}
          style={styles.iconBtn}
        >
          <Feather name="download" size={22} color={Theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.iconBtn}
        >
          <View style={styles.bellContainer}>
            <Feather name="bell" size={22} color={Theme.colors.primary} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    color: Theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Theme.typography.fontFamily,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.textPrimary, // Chấm thông báo màu trắng
    borderWidth: 1,
    borderColor: Theme.colors.bgBase,
  }
});
