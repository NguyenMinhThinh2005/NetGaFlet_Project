import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.success) {
        // Explicit navigation — guarantees redirect even if onAuthStateChange
        // fires late on physical devices with slow network.
        router.replace('/(tabs)');
      } else {
        const msg = res.error || 'Invalid credentials.';
        setError(msg);
        Alert.alert('Đăng nhập thất bại', msg);
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred.';
      setError(msg);
      Alert.alert('Lỗi Đăng Nhập', msg);
    } finally {
      // Always reset local loading so the button is never stuck.
      setLoading(false);
    }
  };

  const handleSocial = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await login('alex@email.com', 'password123');
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        const msg = 'Demo login failed. Please sign up or sign in with your email.';
        setError(msg);
        Alert.alert('Demo Login', msg);
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred.';
      setError(msg);
      Alert.alert('Lỗi Đăng Nhập', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Red radial bloom */}
      <View style={styles.radialBloom} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NETGAFLET</Text>
          <Text style={styles.welcome}>Welcome back.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FloatingInput
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <FloatingInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {/* Forgot password */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign In Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={loading}
            style={[styles.signInBtn, Theme.glows.red, loading && { opacity: 0.7 }]}
          >
            <Text style={styles.signInBtnText}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity onPress={handleSocial} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>G Google</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSocial} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>🍎 Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Navigation link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')} activeOpacity={0.8}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  radialBloom: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(229,9,20,0.06)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 36,
    alignItems: 'center',
  },
  logo: {
    color: Theme.colors.primary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(229,9,20,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
    fontFamily: Theme.typography.fontFamily,
  },
  welcome: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  form: {
    gap: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  errorText: {
    color: Theme.colors.primary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  signInBtn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  signInBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Theme.typography.fontFamily,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.divider,
  },
  dividerText: {
    color: Theme.colors.textTertiary,
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 56,
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    borderRadius: Theme.roundness.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  signupLink: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
