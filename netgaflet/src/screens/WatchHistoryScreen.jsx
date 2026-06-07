import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import { useApp } from '../context/AppContext';
import { groupByDate, formatDate } from '../utils/helpers';

export default function WatchHistoryScreen() {
  const navigate = useNavigate();
  const { watchHistory, clearHistory } = useApp();
  const grouped = groupByDate(watchHistory);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ padding: '0 20px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '22px', cursor: 'pointer', padding: '4px' }}
            >←</button>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, margin: 0 }}>Watch History</h1>
          </div>
          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {watchHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📺</div>
            <p style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Nothing watched yet</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Start watching and your history will appear here.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupLabel, items]) => (
            <div key={groupLabel} style={{ marginBottom: '24px' }}>
              <p className="section-label">{groupLabel}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/movie/${item.movieId}`)}
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 'var(--r-card)',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '72px',
                      height: '48px',
                      borderRadius: '8px',
                      background: item.gradient,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {item.progress < 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0, left: 0, right: 0,
                          height: '3px',
                          background: 'rgba(255,255,255,0.2)',
                        }}>
                          <div style={{ height: '100%', width: `${item.progress * 100}%`, background: 'var(--primary)' }} />
                        </div>
                      )}
                      {item.progress >= 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(34,197,94,0.9)',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8px',
                          color: '#fff',
                          fontWeight: 700,
                        }}>✓</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '0 0 6px' }}>
                        {item.duration} · {formatDate(item.watchedAt)}
                      </p>
                      {item.progress < 1 && (
                        <div style={{ width: '100%', height: '3px', background: 'var(--divider)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.progress * 100}%`, background: 'var(--primary)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
