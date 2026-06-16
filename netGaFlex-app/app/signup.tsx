import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';
import { getPasswordStrength, strengthColor, strengthLabel } from '../utils/helpers';

export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const strength = getPasswordStrength(password);

  const handleCreate = () => {
    if (!name || !email || !password) return;
    login(email, password);
    router.replace('/genre-setup');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NETGAFLET</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the cinema elite.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FloatingInput label="Full Name" type="text" value={name} onChange={setName} />
          <FloatingInput label="Email Address" type="email" value={email} onChange={setEmail} />
          <FloatingInput label="Password" type="password" value={password} onChange={setPassword} />

          {/* Password strength */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarsRow}>
                {[1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor: i <= strength ? strengthColor(strength) : Theme.colors.divider,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.strengthLabelRow}>
                <Text style={styles.strengthText}>Password strength</Text>
                <Text style={[styles.strengthLevelText, { color: strengthColor(strength) }]}>
                  {strengthLabel(strength)}
                </Text>
              </View>
            </View>
          )}

          {/* Sign Up CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreate}
            style={[styles.btn, Theme.glows.red]}
          >
            <Text style={styles.btnText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity onPress={handleCreate} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>G Google</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} style={styles.socialBtn} activeOpacity={0.8}>
              <Text style={styles.socialBtnText}>🍎 Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Navigator link */}
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')} activeOpacity={0.8}>
              <Text style={styles.signinLink}>Sign In</Text>
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
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  form: {
    gap: 12,
  },
  strengthContainer: {
    marginBottom: 8,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthText: {
    color: Theme.colors.textTertiary,
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily,
  },
  strengthLevelText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  btn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnText: {
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
    fontFamily: Theme.typography.fontFamily,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signinText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  signinLink: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
