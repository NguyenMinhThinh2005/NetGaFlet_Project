import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';
import { getPasswordStrength, strengthColor, strengthLabel } from '../utils/helpers';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const strength = getPasswordStrength(password);

  const handleCreate = () => {
    if (!name || !email || !password) return;
    login(email, password);
    navigate('/genre-setup');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '0 20px 32px' }}>
        {/* Header */}
        <div style={{ paddingTop: '60px', paddingBottom: '36px', textAlign: 'center' }}>
          <div style={{
            color: 'var(--primary)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(229,9,20,0.3)',
            marginBottom: '8px',
          }}>
            NETGAFLET
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
            Join the cinema elite.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FloatingInput id="signup-name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          <FloatingInput id="signup-email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <FloatingInput id="signup-password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />

          {/* Password strength */}
          {password.length > 0 && (
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: i <= strength ? strengthColor(strength) : 'var(--divider)',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>Password strength</span>
                <span style={{ color: strengthColor(strength), fontSize: '11px', fontWeight: 600 }}>
                  {strengthLabel(strength)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: 'var(--r-button)',
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              boxShadow: 'var(--glow-red)',
              marginTop: '4px',
            }}
          >
            CREATE ACCOUNT
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {['G Google', '🍎 Apple'].map(label => (
              <button
                key={label}
                onClick={handleCreate}
                style={{
                  flex: 1,
                  height: '56px',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--divider)',
                  borderRadius: 'var(--r-button)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
