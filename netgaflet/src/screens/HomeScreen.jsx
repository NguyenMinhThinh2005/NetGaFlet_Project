import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import HeroBanner from '../components/features/HeroBanner';
import MovieCard from '../components/ui/MovieCard';
import FAB from '../components/features/FAB';
import { mockMovies, continueWatching, trending } from '../data/mockMovies';
import { useShake } from '../hooks/useShake';
import { useCallback } from 'react';

const heroMovie = mockMovies.find(m => m.id === 'inception') || mockMovies[0];


export default function HomeScreen() {
  const navigate = useNavigate();

  const onShake = useCallback(() => navigate('/shake-surprise'), [navigate]);
  useShake(onShake, 15);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ paddingBottom: '16px' }}>
        {/* Hero Banner */}
        <HeroBanner movie={heroMovie} />

        {/* Continue Watching */}
        <Section title="Continue Watching" onSeeAll={() => navigate('/watch-history')}>
          <div className="h-scroll-row" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {continueWatching.slice(0, 5).map(movie => (
              <MovieCard key={movie.id} movie={movie} variant="landscape" showProgress width={180} />
            ))}
          </div>
        </Section>

        {/* Trending Now */}
        <Section title="Trending Now">
          <div className="h-scroll-row" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {trending.slice(0, 8).map(movie => (
              <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
            ))}
          </div>
        </Section>

        {/* NixAI Picks */}
        <Section title="🤖 NixAI Picks For You">
          <div className="h-scroll-row" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {mockMovies.slice(5, 10).map(movie => (
              <MovieCard key={movie.id} movie={movie} variant="portrait" width={120} />
            ))}
          </div>
        </Section>

        {/* Spacer for FAB */}
        <div style={{ height: '80px' }} />
      </div>

      {/* Shake tooltip + FAB */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(var(--nav-height) + 24px)',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0',
        zIndex: 50,
      }}>
        <FAB
          onClick={() => navigate('/chatbot')}
          icon="✨"
          tooltip="📳 Shake for a surprise"
        />
      </div>
    </div>
  );
}

function Section({ title, onSeeAll, children }) {
  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        marginBottom: '14px',
      }}>
        <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600 }}>
          {title}
        </span>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            See all
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
