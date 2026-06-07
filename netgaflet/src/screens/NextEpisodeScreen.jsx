import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, mockMovies } from '../data/mockMovies';

export default function NextEpisodeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id) || mockMovies[0];
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          navigate(`/movie/${movie.id}/play`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, movie.id]);

  const circumference = 2 * Math.PI * 20;
  const strokeDash = circumference - (countdown / 5) * circumference;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0d0d1a 100%)',
      overflow: 'hidden',
    }}>
      {/* Dimmed video bg */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(8,8,14,0.70)',
      }} />

      {/* "Next Up" text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, calc(-50% - 20px))',
        textAlign: 'center',
        zIndex: 5,
      }}>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: '28px',
          fontWeight: 600,
          margin: 0,
          textShadow: '0 2px 16px rgba(0,0,0,0.8)',
        }}>
          Next Up
        </h1>
      </div>

      {/* Next Episode Card */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        background: 'var(--surface-elevated)',
        borderRadius: 'var(--r-card)',
        width: '220px',
        padding: '12px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        zIndex: 10,
        boxShadow: 'var(--glow-card)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Thumbnail */}
        <div style={{
          width: '72px',
          height: '48px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0a0414 0%, #140820 100%)',
          flexShrink: 0,
        }} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: 'var(--primary)',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 3px',
          }}>
            NEXT EPISODE
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            S1 E4 — The Body
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0 }}>
            Starting in {countdown}s
          </p>
        </div>

        {/* Countdown circle */}
        <div className="countdown-circle">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--divider)" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
          </svg>
          <div className="countdown-number">{countdown}</div>
        </div>
      </div>

      {/* Cancel button */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        right: '24px',
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            padding: '8px',
          }}
        >
          Cancel
        </button>
      </div>

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
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
