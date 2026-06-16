import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Theme from '../../constants/Theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'pill';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  style = {},
  textStyle = {},
}: ButtonProps) {
  const containerStyles: ViewStyle[] = [styles.base];
  const textStyles: TextStyle[] = [styles.textBase];

  // Apply sizes
  if (size === 'sm') {
    containerStyles.push(styles.sm);
    textStyles.push(styles.textSm);
  } else if (size === 'md') {
    containerStyles.push(styles.md);
    textStyles.push(styles.textMd);
  } else if (size === 'lg') {
    containerStyles.push(styles.lg);
    textStyles.push(styles.textLg);
  } else if (size === 'pill') {
    containerStyles.push(styles.pill);
    textStyles.push(styles.textMd);
  }

  // Apply variants
  if (variant === 'primary') {
    containerStyles.push(disabled ? styles.primaryDisabled : styles.primary);
    textStyles.push(disabled ? styles.textPrimaryDisabled : styles.textPrimary);
  } else if (variant === 'outline') {
    containerStyles.push(styles.outline);
    textStyles.push(styles.textOutline);
  } else if (variant === 'ghost') {
    containerStyles.push(styles.ghost);
    textStyles.push(styles.textGhost);
  } else if (variant === 'danger') {
    containerStyles.push(styles.danger);
    textStyles.push(styles.textDanger);
  }

  if (fullWidth) {
    containerStyles.push(styles.fullWidth);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onClick}
      style={[containerStyles, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'danger' ? Theme.colors.primary : Theme.colors.textPrimary} size="small" />
      ) : typeof children === 'string' ? (
        <Text style={[textStyles, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  sm: {
    height: 36,
    borderRadius: 10,
  },
  md: {
    height: 48,
    borderRadius: 12,
  },
  lg: {
    height: 56,
    borderRadius: 12,
  },
  pill: {
    height: 44,
    borderRadius: 100,
  },
  primary: {
    backgroundColor: Theme.colors.primary,
    ...Theme.glows.red,
  },
  primaryDisabled: {
    backgroundColor: Theme.colors.surfaceElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  ghost: {
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
  },
  danger: {
    backgroundColor: 'rgba(229,9,20,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229,9,20,0.3)',
  },
  textBase: {
    fontFamily: Theme.typography.fontFamily,
    fontWeight: '600' as const,
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 15,
  },
  textPrimary: {
    color: Theme.colors.textPrimary,
  },
  textPrimaryDisabled: {
    color: Theme.colors.textTertiary,
  },
  textOutline: {
    color: Theme.colors.primary,
  },
  textGhost: {
    color: Theme.colors.textPrimary,
  },
  textDanger: {
    color: Theme.colors.primary,
  },
});
