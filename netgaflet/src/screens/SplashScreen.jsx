import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { isLoggedIn, hasOnboarded } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) navigate('/home');
      else if (hasOnboarded) navigate('/signin');
      else navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isLoggedIn, hasOnboarded]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Red radial bloom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(229,9,20,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Wordmark */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          color: 'var(--primary)',
          fontSize: '36px',
          fontWeight: 700,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          textShadow: '0 0 40px rgba(229,9,20,0.4)',
          margin: 0,
          animation: 'fadeIn 0.8s ease',
        }}>
          NETGAFLET
        </h1>
        <p style={{
          color: 'var(--text-tertiary)',
          fontSize: '13px',
          fontStyle: 'italic',
          marginTop: '8px',
          animation: 'fadeIn 1.2s ease',
        }}>
          Cinema, Elevated.
        </p>

        {/* Arc spinner */}
        <div style={{
          margin: '32px auto 0',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'var(--primary)',
          borderRightColor: 'rgba(229,9,20,0.3)',
          animation: 'spin 1.2s linear infinite',
        }} />
      </div>
    </div>
  );
}
