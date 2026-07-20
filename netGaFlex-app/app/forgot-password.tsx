import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Theme from '../constants/Theme';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('alex@email.com');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [activeInput, setActiveInput] = useState<number | null>(null);

  const inputRefs = useRef<any[]>([]);

  // Countdown timer
  useEffect(() => {
    if (step !== 'otp') return;
    const id = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = v;
    setOtp(newOtp);
    if (v && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const allFilled = otp.every(d => d !== '');

  const handleVerify = () => {
    if (allFilled) {
      login(email, 'new_password');
      router.replace('/(tabs)');
    }
  };

  if (step === 'email') {
    return (
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.innerContent}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send a 6-digit code.
            </Text>

            <View style={styles.form}>
              <FloatingInput label="Email Address" type="email" value={email} onChange={setEmail} />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setCountdown(60);
                  setStep('otp');
                }}
                style={[styles.btn, Theme.glows.red]}
              >
                <Text style={styles.btnText}>SEND CODE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/signin')}
                style={styles.backToSignBtn}
              >
                <Text style={styles.backToSignText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // OTP Verification View
  return (
    <View style={styles.container}>
      {/* Back to Email step button */}
      <TouchableOpacity onPress={() => setStep('email')} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContent}>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to <Text style={{ color: Theme.colors.textPrimary, fontWeight: '700' }}>{email}</Text>
          </Text>

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, i) => {
              const isActive = activeInput === i;
              return (
                <TextInput
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  style={[
                    styles.otpInput,
                    {
                      borderColor: isActive ? Theme.colors.primary : Theme.colors.divider,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                  value={digit}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={val => handleOtpChange(i, val)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  onFocus={() => setActiveInput(i)}
                  onBlur={() => setActiveInput(null)}
                />
              );
            })}
          </View>

          {/* Countdown timer */}
          <View style={styles.timerContainer}>
            {countdown > 0 ? (
              <Text style={styles.timerText}>
                Resend code in 0:{String(countdown).padStart(2, '0')}
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setCountdown(60)}>
                <Text style={styles.resendText}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleVerify}
            disabled={!allFilled}
            style={[
              styles.btn,
              {
                backgroundColor: allFilled ? Theme.colors.primary : Theme.colors.surfaceElevated,
              },
              allFilled ? Theme.glows.red : {},
            ]}
          >
            <Text
              style={[
                styles.btnText,
                {
                  color: allFilled ? Theme.colors.textPrimary : Theme.colors.textTertiary,
                },
              ]}
            >
              VERIFY & CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
    paddingTop: 48,
  },
  backBtn: {
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    paddingVertical: 12,
  },
  backText: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Theme.typography.fontFamily,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: Theme.typography.fontFamily,
  },
  form: {
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  btn: {
    width: '100%',
    height: 56,
    borderRadius: Theme.roundness.button,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  backToSignBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backToSignText: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 44,
    height: 56,
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily,
  },
  timerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  timerText: {
    color: Theme.colors.textTertiary,
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily,
  },
  resendText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
});
