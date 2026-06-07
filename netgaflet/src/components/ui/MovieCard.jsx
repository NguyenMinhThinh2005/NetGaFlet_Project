import { useNavigate } from 'react-router-dom';

export default function MovieCard({
  movie,
  variant = 'portrait', // 'portrait' | 'landscape' | 'wide'
  showProgress = false,
  width,
}) {
  const navigate = useNavigate();

  const dims = {
    portrait:  { w: width || 120, h: (width || 120) * (3 / 2) },
    landscape: { w: width || 180, h: (width || 180) * (9 / 16) },
    wide:      { w: width || 200, h: (width || 200) * (9 / 16) },
  };

  const { w, h } = dims[variant] || dims.portrait;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{
        width: `${w}px`,
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: '100%',
        height: `${h}px`,
        background: movie.posterGradient,
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--glow-card)',
      }}>
        {/* Title overlay inside card */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '24px 10px 10px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{
            color: 'var(--text-primary)',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {movie.title}
          </span>
          {variant !== 'portrait' && (
            <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
              ⭐ {movie.rating}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && movie.progress != null && movie.progress > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
          }}>
            <div style={{
              height: '100%',
              width: `${movie.progress * 100}%`,
              background: 'var(--primary)',
              borderRadius: '2px',
            }} />
          </div>
        )}

        {/* 4K badge */}
        {movie.format?.includes('4K') && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            padding: '2px 5px',
            fontSize: '8px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            backdropFilter: 'blur(4px)',
          }}>
            4K
          </div>
        )}
      </div>
    </div>
  );
}
