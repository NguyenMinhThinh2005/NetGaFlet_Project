import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Theme from '../../constants/Theme';

interface FloatingInputProps {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (val: string) => void;
  autoComplete?: string;
  id?: string;
}

export default function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  id,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isFloated = focused || value.length > 0;

  const animatedValue = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFloated ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [isFloated]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 10],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Theme.colors.textSecondary, focused ? Theme.colors.primary : Theme.colors.textTertiary],
    }),
    fontWeight: isFloated ? ('500' as const) : ('400' as const),
    fontFamily: Theme.typography.fontFamily,
  };

  return (
    <View style={styles.container}>
      <TextInput
        secureTextEntry={isPassword && !showPassword}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={
          type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'
        }
        autoCapitalize={type === 'password' || type === 'email' ? 'none' : 'sentences'}
        style={[
          styles.input,
          {
            borderColor: focused ? Theme.colors.primary : Theme.colors.divider,
            paddingTop: isFloated ? 18 : 0,
          },
        ]}
        placeholder=""
      />

      <Animated.Text style={labelStyle} pointerEvents="none">
        {label}
      </Animated.Text>

      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(v => !v)}
          style={styles.eyeButton}
          activeOpacity={0.8}
        >
          <Text style={styles.eyeText}>
            {showPassword ? '👁️' : '🔒'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1.5,
    borderRadius: Theme.roundness.card,
    paddingHorizontal: 16,
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  eyeText: {
    fontSize: 16,
    color: Theme.colors.textTertiary,
  },
});
