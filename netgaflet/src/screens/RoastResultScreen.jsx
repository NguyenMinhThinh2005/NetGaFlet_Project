import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoastCard from '../components/features/RoastCard';
import { mockUser } from '../data/mockUser';

export default function RoastResultScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background radial bloom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(229,9,20,0.18) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Decorative film frames */}
      {[
        { top: '10px', left: '10px' },
        { top: '10px', right: '10px' },
        { bottom: '80px', left: '10px' },
        { bottom: '80px', right: '10px' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '40px',
          height: '32px',
          border: '4px solid rgba(26,26,36,0.3)',
          borderRadius: '2px',
          opacity: 0.4,
          ...pos,
        }} />
      ))}

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '22px',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >←</button>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '0 20px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: '80px', marginBottom: '20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>🎭</div>
          <p style={{
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            margin: '0 0 8px',
          }}>
            ✨ NixAI HAS SPOKEN
          </p>
          <h1 style={{
            color: 'var(--text-primary)',
            fontSize: '24px',
            fontWeight: 700,
            margin: 0,
          }}>
            Your Cinematic Profile
          </h1>
        </div>

        {/* Roast card */}
        {loading ? (
          <div style={{
            height: '200px',
            background: 'var(--surface)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(229,9,20,0.25)',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : (
          <RoastCard text={mockUser.roastProfile.roastText} />
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          {mockUser.roastProfile.roastStats.map(s => (
            <span key={s} className="stat-chip">{s}</span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={handleRegenerate}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: 'var(--r-button)',
              background: 'transparent',
              border: '1.5px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            🔄 Regenerate Roast
          </button>
          <button
            style={{
              width: '100%',
              height: '52px',
              borderRadius: 'var(--r-button)',
              background: 'var(--surface-elevated)',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            Share My Roast 📤
          </button>
        </div>
      </div>
    </div>
  );
}
