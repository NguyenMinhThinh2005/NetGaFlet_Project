import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import MovieCard from '../components/ui/MovieCard';
import SkeletonBlock from '../components/ui/SkeletonBlock';
import { mockMovies } from '../data/mockMovies';

const FILTERS = ['All', 'Movies', 'Series', 'Documentaries', 'Short Films'];

const MASONRY_MOVIES = mockMovies.slice(0, 6);

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleFocus = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleChange = (val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setLoading(false);
    }, 500);
  };

  const getMappedType = (f) => {
    if (f === 'Movies') return 'movie';
    if (f === 'Series') return 'series';
    if (f === 'Documentaries') return 'documentary';
    if (f === 'Short Films') return 'short';
    return null;
  };

  const mappedType = getMappedType(filter);
  const baseList = (debouncedQuery || mappedType) ? mockMovies : MASONRY_MOVIES;
  const results = baseList.filter(m => {
    if (mappedType && m.type !== mappedType) return false;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ padding: '0 20px 24px' }}>
        {/* Search bar */}
        <div style={{
          height: '52px',
          background: 'var(--surface)',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 16px',
          marginTop: '12px',
          border: '1px solid var(--divider)',
        }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '18px' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => handleChange(e.target.value)}
            onFocus={handleFocus}
            placeholder="Describe a vibe, plot, or actor..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-family)',
              fontStyle: query ? 'normal' : 'italic',
            }}
          />
          <span style={{ color: 'var(--primary)', fontSize: '18px', cursor: 'pointer' }}>🎙</span>
        </div>

        {/* Filter pills */}
        <div className="h-scroll-row" style={{ marginTop: '12px', gap: '8px' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                height: '32px',
                borderRadius: '100px',
                padding: '0 14px',
                background: filter === f ? 'var(--primary)' : 'var(--surface-elevated)',
                border: filter === f ? 'none' : '1px solid var(--divider)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Section label */}
        <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, marginTop: '20px', marginBottom: '14px' }}>
          {query ? `Results for "${query}"` : 'Trending Searches'}
        </p>

        {/* Loading skeleton */}
        {loading ? (
          <SkeletonOverlay />
        ) : results.length === 0 ? (
          <EmptySearch query={query} />
        ) : (
          <MasonryGrid movies={results} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

function MasonryGrid({ movies, navigate }) {
  const col1 = movies.filter((_, i) => i % 2 === 0);
  const col2 = movies.filter((_, i) => i % 2 === 1);

  const renderCard = (movie, tall) => (
    <div
      key={movie.id}
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{
        width: '100%',
        height: tall ? '180px' : '120px',
        background: movie.posterGradient,
        borderRadius: 'var(--r-card)',
        marginBottom: '12px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        boxShadow: 'var(--glow-card)',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '20px 10px 10px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
      }}>
        <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }}>
          {movie.title}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        {col1.map((m, i) => renderCard(m, i % 2 === 0))}
      </div>
      <div style={{ flex: 1, marginTop: '30px' }}>
        {col2.map((m, i) => renderCard(m, i % 2 !== 0))}
      </div>
    </div>
  );
}

function SkeletonOverlay() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {[0, 1].map(col => (
        <div key={col} style={{ flex: 1, marginTop: col ? '30px' : '0' }}>
          {[180, 120, 180].map((h, i) => (
            <SkeletonBlock key={i} width="100%" height={`${h}px`} borderRadius="16px" style={{ marginBottom: '12px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptySearch({ query }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <p style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
        No results for "{query}"
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Try different keywords or browse by mood.
      </p>
    </div>
  );
}
