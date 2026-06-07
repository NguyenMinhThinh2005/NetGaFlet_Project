import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function HeroBanner({ movie }) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useApp();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);


  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      position: 'relative',
      background: movie.heroGradient,
      flexShrink: 0,
    }}>
      {/* Gradient overlay to bg-base */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent 30%, rgba(8,8,14,0.7) 70%, var(--bg-base) 100%)',
      }} />

      {/* Ambient red glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 60%, rgba(229,9,20,0.06) 0%, transparent 60%)',
      }} />

      {/* Content overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        {/* Left: title + meta */}
        <div style={{ flex: 1, marginRight: '12px' }}>
          <h1 style={{
            color: 'var(--text-primary)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            marginBottom: '6px',
          }}>
            {movie.title.toUpperCase()}
          </h1>

          {/* Genre + format pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {movie.genres.map(g => (
              <span key={g} className="genre-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>{g}</span>
            ))}
            {movie.format && (
              <span className="genre-pill" style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(255,255,255,0.15)' }}>
                {movie.format}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>⭐ {movie.rating}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>🕐 {movie.duration}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>📅 {movie.year}</span>
          </div>
        </div>

        {/* Right: buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => toggleWatchlist(movie.id)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(26,26,36,0.8)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: inList ? 'var(--primary)' : 'var(--text-primary)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            {inList ? '🔖' : '+'}
          </button>
          <button
            onClick={() => navigate(`/movie/${movie.id}/play`)}
            style={{
              height: '40px',
              borderRadius: '100px',
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '0 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--glow-red)',
              fontFamily: 'var(--font-family)',
            }}
          >
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}
