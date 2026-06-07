import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, mockMovies } from '../data/mockMovies';
import { formatTime } from '../utils/helpers';

export default function VideoPlayerScreen() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(movieId) || mockMovies[0];

  const totalSeconds = (movie.durationMin || 148) * 60;

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(Math.floor(totalSeconds * 0.42));
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef(null);
  const controlsTimeout = useRef(null);

  // Auto-play simulation
  useEffect(() => {
    if (!isPlaying || isDragging) return;
    const id = setInterval(() => {
      setCurrentTime(t => {
        if (t >= totalSeconds) {
          clearInterval(id);
          navigate(`/movie/${movie.id}/next`);
          return t;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, isDragging, totalSeconds, navigate, movie.id]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(controlsTimeout.current);
  }, [showControls, currentTime]);

  const progress = currentTime / totalSeconds;

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(Math.floor(pct * totalSeconds));
  };

  const skip = useCallback((sec) => setCurrentTime(t => Math.max(0, Math.min(totalSeconds, t + sec))), [totalSeconds]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0d0d1a 100%)',
        position: 'relative',
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none',
      }}
      onClick={() => setShowControls(v => !v)}
    >
      {/* Simulated video content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.03)',
        fontSize: '64px',
        fontWeight: 900,
        letterSpacing: '4px',
        userSelect: 'none',
      }}>
        {movie.title.toUpperCase()}
      </div>

      {/* Particle grain overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 50%),
          radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.03) 0%, transparent 50%),
          radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* Controls overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Top overlay */}
        <div style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={e => { e.stopPropagation(); navigate(-1); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-family)',
            }}
          >
            ← Back
          </button>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
            {movie.title} · {movie.type === 'series' ? 'S1 E3' : 'N/A'}
          </span>
        </div>

        {/* Bottom overlay */}
        <div style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          padding: '16px 20px 20px',
        }}>
          {/* Skip Intro */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <button
              onClick={e => { e.stopPropagation(); skip(90); }}
              style={{
                height: '36px',
                borderRadius: '100px',
                background: 'var(--primary)',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                padding: '0 16px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                boxShadow: 'var(--glow-red)',
              }}
            >
              Skip Intro →
            </button>
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={e => { e.stopPropagation(); handleProgressClick(e); }}
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              cursor: 'pointer',
              position: 'relative',
              marginBottom: '8px',
            }}
          >
            <div style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'var(--primary)',
              borderRadius: '2px',
              transition: isDragging ? 'none' : 'width 0.5s linear',
            }} />
            {/* Scrubber */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${progress * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }} />
          </div>

          {/* Time labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{formatTime(currentTime)}</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{formatTime(totalSeconds)}</span>
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <ControlBtn onClick={e => { e.stopPropagation(); skip(-10); }} size={28}>⏮ 10</ControlBtn>
            <ControlBtn onClick={e => { e.stopPropagation(); setIsPlaying(v => !v); }} size={44}>
              {isPlaying ? '⏸' : '▶'}
            </ControlBtn>
            <ControlBtn onClick={e => { e.stopPropagation(); skip(10); }} size={28}>10 ⏭</ControlBtn>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      {showControls && (
        <div style={{
          position: 'absolute',
          right: '16px',
          bottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
        }}>
          <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>🔊</button>
          <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' }}>⋮</button>
          <button onClick={e => { e.stopPropagation(); navigate(-1); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '16px', cursor: 'pointer' }}>⛶</button>
        </div>
      )}
    </div>
  );
}

function ControlBtn({ onClick, children, size }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        fontSize: `${size}px`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-family)',
        transition: 'transform 0.15s',
      }}
      onMouseDown={e => { e.stopPropagation(); e.currentTarget.style.transform = 'scale(0.9)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}
