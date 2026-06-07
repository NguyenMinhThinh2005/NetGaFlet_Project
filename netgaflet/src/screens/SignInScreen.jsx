import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/ui/FloatingInput';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const ok = login(email, password);
    if (ok) navigate('/home');
    else setError('Invalid credentials.');
  };

  const handleSocial = () => {
    login('alex@email.com', 'demo');
    navigate('/home');
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
      {/* Radial bloom */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(ellipse, rgba(229,9,20,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '0 20px 32px' }}>
        {/* Top section */}
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
          <h1 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, margin: 0 }}>
            Welcome back.
          </h1>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FloatingInput
            id="signin-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <FloatingInput
            id="signin-password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {/* Forgot password */}
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => navigate('/forgot-password')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <p style={{ color: 'var(--primary)', fontSize: '13px', textAlign: 'center', margin: 0 }}>
              {error}
            </p>
          )}

          {/* Sign In button */}
          <button
            onClick={handleSignIn}
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
              transition: 'opacity 0.2s',
              marginTop: '4px',
            }}
          >
            SIGN IN
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'G Google', id: 'google-signin' },
              { label: '🍎 Apple', id: 'apple-signin' },
            ].map(({ label, id }) => (
              <button
                key={id}
                id={id}
                onClick={handleSocial}
                style={{
                  flex: 1,
                  height: '56px',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--divider)',
                  borderRadius: 'var(--r-button)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#222230'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-elevated)'}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
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
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
