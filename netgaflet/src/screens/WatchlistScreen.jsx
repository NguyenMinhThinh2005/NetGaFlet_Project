import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import { useApp } from '../context/AppContext';
import { mockMovies } from '../data/mockMovies';

export default function WatchlistScreen() {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useApp();
  const items = mockMovies.filter(m => watchlist.includes(m.id));

  if (items.length === 0) return <EmptyWatchlist navigate={navigate} />;

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ padding: '0 20px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', marginBottom: '4px' }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, margin: 0 }}>My Watchlist</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
              {items.length} title{items.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '20px', cursor: 'pointer' }}>☰</button>
        </div>

        {/* Items */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(movie => (
            <SwipeableItem
              key={movie.id}
              movie={movie}
              onDelete={() => removeFromWatchlist(movie.id)}
              onTap={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SwipeableItem({ movie, onDelete, onTap }) {
  const startX = useRef(null);
  const [swipeX, setSwipeX] = useState(0);
  const [removed, setRemoved] = useState(false);
  const DELETE_ZONE = 88;

  const handleStart = (clientX) => { startX.current = clientX; };
  const handleMove = (clientX) => {
    if (startX.current === null) return;
    const dx = Math.min(0, clientX - startX.current);
    setSwipeX(Math.max(-DELETE_ZONE, dx));
  };
  const handleEnd = () => {
    if (swipeX <= -DELETE_ZONE * 0.7) {
      setSwipeX(-DELETE_ZONE);
    } else {
      setSwipeX(0);
    }
    startX.current = null;
  };

  const handleDelete = () => {
    setRemoved(true);
    setTimeout(onDelete, 300);
  };

  if (removed) return null;

  return (
    <div style={{
      height: '88px',
      borderRadius: 'var(--r-card)',
      overflow: 'hidden',
      position: 'relative',
      opacity: removed ? 0 : 1,
      transition: 'opacity 0.3s',
    }}>
      {/* Delete background */}
      <div
        onClick={handleDelete}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${DELETE_ZONE}px`,
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 var(--r-card) var(--r-card) 0',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '22px' }}>🗑</span>
      </div>

      {/* Swipeable content */}
      <div
        onClick={() => swipeX === 0 && onTap()}
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => e.buttons === 1 && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--surface)',
          borderRadius: 'var(--r-card)',
          transform: `translateX(${swipeX}px)`,
          transition: startX.current ? 'none' : 'transform 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Poster */}
        <div style={{
          width: '56px',
          height: '80px',
          borderRadius: '8px',
          background: movie.posterGradient,
          flexShrink: 0,
        }} />
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {movie.title}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
            {movie.durationMin} min · {movie.genres[0]}
          </p>
        </div>
        <span style={{ color: 'var(--primary)', fontSize: '20px', flexShrink: 0 }}>🔖</span>
      </div>
    </div>
  );
}

function EmptyWatchlist({ navigate }) {
  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔖</div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Nothing saved yet
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Start exploring and save movies to watch later.
        </p>
        <button
          onClick={() => navigate('/home')}
          style={{
            height: '52px',
            borderRadius: 'var(--r-button)',
            background: 'var(--primary)',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontWeight: 600,
            padding: '0 28px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            boxShadow: 'var(--glow-red)',
          }}
        >
          Explore Movies
        </button>
      </div>
    </div>
  );
}
