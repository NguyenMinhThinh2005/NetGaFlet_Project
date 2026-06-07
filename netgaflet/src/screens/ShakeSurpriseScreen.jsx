import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMovies } from '../data/mockMovies';

export default function ShakeSurpriseScreen() {
  const navigate = useNavigate();
  const [surpriseMovie, setSurpriseMovie] = useState(null);

  const pickRandomMovie = () => {
    const randomIdx = Math.floor(Math.random() * mockMovies.length);
    setSurpriseMovie(mockMovies[randomIdx]);
  };

  useEffect(() => {
    pickRandomMovie();
  }, []);

  if (!surpriseMovie) return null;
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
      {/* Ambient red bloom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, rgba(229,9,20,0.10) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

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

      {/* Top label */}
      <div style={{ textAlign: 'center', paddingTop: '64px', flexShrink: 0 }}>
        <p style={{
          color: 'var(--primary)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          margin: '0 0 6px',
        }}>
          🎲 TONIGHT'S PICK
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', margin: 0 }}>
          NixAI chose this for you.
        </p>
      </div>

      {/* Movie poster — floats directly on bg canvas */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '200px',
          height: '300px',
          borderRadius: '20px',
          background: surpriseMovie.posterGradient,
          boxShadow: '0 0 60px rgba(229,9,20,0.40), 0 0 120px rgba(229,9,20,0.20)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <span style={{
            color: 'rgba(245,245,245,0.9)',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            {surpriseMovie.title}
          </span>
          <span style={{ color: 'rgba(229,9,20,0.6)', fontSize: '12px', marginTop: '6px' }}>
            {surpriseMovie.year}
          </span>
        </div>

        {/* Movie info */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>
            {surpriseMovie.title}
          </h2>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
            {surpriseMovie.genres.map(g => <span key={g} className="genre-pill">{g}</span>)}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            ⭐ {surpriseMovie.rating} · {surpriseMovie.duration} · {surpriseMovie.format}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '20px 20px 28px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => navigate(`/movie/${surpriseMovie.id}/play`)}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: 'var(--r-button)',
            background: 'var(--primary)',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            boxShadow: 'var(--glow-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ▶ Watch Now
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate(`/movie/${surpriseMovie.id}`)}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: 'var(--r-button)',
              background: 'var(--surface)',
              border: '1px solid var(--divider)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            ℹ️ Details
          </button>
          <button
            onClick={pickRandomMovie}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: 'var(--r-button)',
              background: 'var(--surface)',
              border: '1px solid var(--divider)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            🎲 Shuffle Again
          </button>
        </div>
      </div>
    </div>
  );
}
