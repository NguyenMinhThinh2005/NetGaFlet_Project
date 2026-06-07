import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import EpisodeRow from '../components/ui/EpisodeRow';
import { getMovieById, mockMovies } from '../data/mockMovies';

export default function EpisodeListScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const series = getMovieById(id) || mockMovies.find(m => m.type === 'series');
  const [activeSeason, setActiveSeason] = useState(1);

  if (!series || !series.episodes) return null;

  const seasonData = series.episodes.find(s => s.season === activeSeason);

  return (
    <div className="screen">
      <StatusBar />

      {/* Hero */}
      <div style={{
        width: '100%',
        height: '140px',
        background: series.heroGradient,
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 30%, var(--bg-base) 100%)',
        }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: '12px',
            left: '16px',
            background: 'rgba(8,8,14,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--text-primary)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >←</button>
        <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            {series.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            ⭐ {series.rating} · {series.episodes.length} Seasons
          </p>
        </div>
      </div>

      <div className="screen-scrollable" style={{ padding: '0 20px 24px' }}>
        {/* Season tabs */}
        <div className="h-scroll-row" style={{ marginBottom: '20px', marginTop: '4px', gap: '8px' }}>
          {series.episodes.map(s => (
            <button
              key={s.season}
              onClick={() => setActiveSeason(s.season)}
              style={{
                height: '36px',
                borderRadius: '100px',
                padding: '0 18px',
                background: activeSeason === s.season ? 'var(--primary)' : 'var(--surface)',
                border: activeSeason === s.season ? 'none' : '1px solid var(--divider)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: activeSeason === s.season ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                flexShrink: 0,
                boxShadow: activeSeason === s.season ? 'var(--glow-red)' : 'none',
              }}
            >
              Season {s.season}
            </button>
          ))}
        </div>

        {/* Episode count */}
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginBottom: '4px' }}>
          {seasonData?.episodes.length || 0} Episodes
        </p>

        {/* Episodes */}
        {seasonData?.episodes.map((ep, i) => (
          <EpisodeRow
            key={ep.id}
            episode={ep}
            episodeNum={i + 1}
            onPlay={() => navigate(`/movie/${series.id}/play`)}
          />
        ))}
      </div>
    </div>
  );
}
