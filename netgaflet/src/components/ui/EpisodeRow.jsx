export default function EpisodeRow({ episode, episodeNum, onPlay }) {
  const hasProgress = episode.progress > 0;
  const isWatched = episode.progress >= 1;

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid var(--divider)',
      alignItems: 'flex-start',
    }}>
      {/* Thumbnail */}
      <div
        onClick={onPlay}
        style={{
          width: '100px',
          height: '64px',
          borderRadius: '10px',
          background: episode.thumbnail,
          flexShrink: 0,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Play overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '10px', marginLeft: '2px' }}>▶</span>
          </div>
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
          }}>
            <div style={{
              height: '100%',
              width: `${episode.progress * 100}%`,
              background: isWatched ? 'var(--text-tertiary)' : 'var(--primary)',
            }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.3,
            flex: 1,
          }}>
            {episodeNum}. {episode.title}
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>
            {episode.duration}
          </span>
        </div>
        {isWatched && (
          <span style={{
            display: 'inline-block',
            marginTop: '4px',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            background: 'var(--surface-elevated)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            Watched
          </span>
        )}
      </div>
    </div>
  );
}
