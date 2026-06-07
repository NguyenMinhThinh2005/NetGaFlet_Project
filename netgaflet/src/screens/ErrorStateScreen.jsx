import { useNavigate } from 'react-router-dom';

export default function ErrorStateScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      {/* Illustration */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(229,9,20,0.08)',
          border: '1px solid rgba(229,9,20,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          margin: '0 auto',
        }}>
          📡
        </div>
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#fff',
          fontWeight: 700,
        }}>!</div>
      </div>

      <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 32px', maxWidth: '80%' }}>
        We couldn't load this content. Check your connection and try again.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            height: '52px',
            borderRadius: 'var(--r-button)',
            background: 'var(--primary)',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            boxShadow: 'var(--glow-red)',
          }}
        >
          🔄 Try Again
        </button>
        <button
          onClick={() => navigate('/home')}
          style={{
            height: '52px',
            borderRadius: 'var(--r-button)',
            background: 'var(--surface)',
            border: '1px solid var(--divider)',
            color: 'var(--text-secondary)',
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
