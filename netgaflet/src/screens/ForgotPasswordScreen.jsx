import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('alex@email.com');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (step !== 'otp') return;
    const id = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const handleOtpChange = (index, value) => {
    const v = value.replace(/\D/, '');
    const newOtp = [...otp];
    newOtp[index] = v;
    setOtp(newOtp);
    if (v && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const allFilled = otp.every(d => d !== '');

  if (step === 'email') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 20px',
        overflow: 'hidden',
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '22px',
            cursor: 'pointer',
            marginTop: '20px',
            alignSelf: 'flex-start',
            padding: '4px',
          }}
        >←</button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '340px' }}>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>
              Reset Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', lineHeight: 1.5, marginBottom: '32px' }}>
              Enter your email and we'll send a 6-digit code.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FloatingInput id="reset-email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />

              <button
                onClick={() => { setCountdown(60); setStep('otp'); }}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: 'var(--r-button)',
                  background: 'var(--primary)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  boxShadow: 'var(--glow-red)',
                }}
              >
                SEND CODE
              </button>

              <button
                onClick={() => navigate('/signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  textAlign: 'center',
                }}
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP State
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setStep('email')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '22px',
          cursor: 'pointer',
          marginTop: '20px',
          alignSelf: 'flex-start',
          padding: '4px',
        }}
      >←</button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>
            Check your inbox
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', lineHeight: 1.5, marginBottom: '32px' }}>
            We sent a 6-digit code to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>

          {/* OTP Boxes */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {otp.map((digit, i) => {
              const isActive = inputRefs.current[i] === document.activeElement;
              return (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: '48px',
                    height: '60px',
                    background: 'var(--surface)',
                    border: digit ? '1px solid var(--divider)' : isActive ? '2px solid var(--primary)' : '1px solid var(--divider)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'var(--text-primary)',
                    fontSize: '22px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-family)',
                    outline: 'none',
                    boxShadow: isActive ? '0 0 0 4px rgba(229,9,20,0.15)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.borderWidth = '2px';
                    e.target.style.boxShadow = '0 0 0 4px rgba(229,9,20,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = otp[i] ? 'var(--divider)' : 'var(--divider)';
                    e.target.style.borderWidth = '1px';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              );
            })}
          </div>

          {/* Countdown */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
            {countdown > 0
              ? `Resend code in 0:${String(countdown).padStart(2, '0')}`
              : <button onClick={() => setCountdown(60)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: '13px' }}>Resend code</button>
            }
          </p>

          <button
            onClick={() => {
              if (allFilled) {
                login(email, 'new_password');
                navigate('/home');
              }
            }}
            disabled={!allFilled}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: 'var(--r-button)',
              background: allFilled ? 'var(--primary)' : 'var(--surface-elevated)',
              border: 'none',
              color: allFilled ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: allFilled ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-family)',
              boxShadow: allFilled ? 'var(--glow-red)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            VERIFY & CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
