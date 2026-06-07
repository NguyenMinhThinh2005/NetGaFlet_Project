import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomSheet from '../components/ui/BottomSheet';
import ReviewItem from '../components/ui/ReviewItem';
import MovieCard from '../components/ui/MovieCard';
import { useApp } from '../context/AppContext';
import { getMovieById, mockMovies } from '../data/mockMovies';
import { getReviewsForMovie, getRatingDistribution } from '../data/mockReviews';
import { useBottomSheet } from '../hooks/useBottomSheet';

export default function MovieDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useApp();
  const { isOpen, open, close } = useBottomSheet();

  const movie = getMovieById(id) || mockMovies[0];
  const inList = isInWatchlist(movie.id);
  const reviews = getReviewsForMovie(movie.id);
  const dist = getRatingDistribution(movie.id);

  const similar = mockMovies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 5);

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <div className="screen-scrollable" style={{ paddingBottom: '80px' }}>
        {/* Hero with transparent status overlay */}
        <div style={{ position: 'relative' }}>
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(8,8,14,0.7)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text-primary)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >←</button>

          {/* Hero area */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            background: movie.heroGradient,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 30%, rgba(8,8,14,0.8) 75%, var(--bg-base) 100%)',
            }} />
            {/* Title + meta overlay */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
              <h1 style={{
                color: 'var(--text-primary)',
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                margin: '0 0 8px',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}>
                {movie.title.toUpperCase()}
              </h1>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {movie.genres.map(g => <span key={g} className="genre-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>{g}</span>)}
                <span className="genre-pill" style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(255,255,255,0.15)' }}>{movie.format}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                ⭐ {movie.rating} | {movie.year}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', padding: '16px 20px 0', alignItems: 'center' }}>
            <button
              onClick={() => navigate(`/movie/${movie.id}/play`)}
              style={{
                flex: 1,
                height: '52px',
                borderRadius: '100px',
                background: 'var(--primary)',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                boxShadow: 'var(--glow-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ▶ PLAY
            </button>
            <button
              onClick={() => toggleWatchlist(movie.id)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--surface-elevated)',
                border: '1.5px solid ' + (inList ? 'var(--primary)' : 'rgba(255,255,255,0.2)'),
                color: inList ? 'var(--primary)' : 'var(--text-primary)',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {inList ? '🔖' : '+'}
            </button>
          </div>
        </div>

        {/* AI Summary */}
        <div style={{ margin: '20px 20px 0', background: 'var(--surface)', borderRadius: 'var(--r-card)', padding: '16px' }}>
          <p style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px' }}>
            ✨ AI Summary
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
            {movie.aiSummary}
          </p>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-family)', marginTop: '8px', display: 'block', marginLeft: 'auto' }}>
            Full synopsis
          </button>
        </div>

        {/* Cast */}
        <div style={{ marginTop: '24px', padding: '0 20px' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Cast</p>
          <div className="h-scroll-row">
            {movie.cast.map(person => (
              <div key={person.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: person.color || 'var(--surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontWeight: 700,
                  border: '1px solid var(--divider)',
                }}>
                  {person.initials}
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 500, maxWidth: '60px', textAlign: 'center', lineHeight: 1.2 }}>
                  {person.name.split(' ')[0]}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', maxWidth: '60px', textAlign: 'center' }}>
                  {person.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* More Like This */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, padding: '0 20px', marginBottom: '14px' }}>More Like This</p>
          <div className="h-scroll-row" style={{ padding: '0 20px' }}>
            {similar.map(m => <MovieCard key={m.id} movie={m} variant="portrait" width={110} />)}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--divider)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
      }}>
        {[
          { icon: '🔖', label: 'Save', onClick: () => toggleWatchlist(movie.id) },
          { icon: '💬', label: `${reviews.length * 948} Reviews`, onClick: open },
          { icon: '📤', label: 'Share', onClick: () => {} },
        ].map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Reviews Bottom Sheet */}
      <BottomSheet isOpen={isOpen} onClose={close} title="Reviews & Ratings" height="72%">
        <ReviewsContent movie={movie} reviews={reviews} dist={dist} />
      </BottomSheet>
    </div>
  );
}

function ReviewsContent({ movie, reviews, dist }) {
  const totalRatings = '2,847';
  const avgRating = movie.rating;
  const stars = Math.round(avgRating / 2);

  return (
    <div>
      {/* Rating overview */}
      <div style={{ margin: '0 20px 16px', background: 'var(--surface-elevated)', borderRadius: 'var(--r-card)', padding: '20px', display: 'flex', gap: '16px' }}>
        <div style={{ width: '40%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '52px', fontWeight: 700, lineHeight: 1 }}>{avgRating}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '18px', marginBottom: '6px' }}>/10</span>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '2px 0 8px' }}>{totalRatings} ratings</p>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: '14px', color: i <= stars ? '#E50914' : 'var(--text-tertiary)' }}>★</span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
          {dist.map((pct, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', width: '12px', textAlign: 'right' }}>{5-i}★</span>
              <div style={{ flex: 1, height: '7px', borderRadius: '100px', background: 'var(--divider)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '100px' }} />
              </div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', width: '28px' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review button */}
      <div style={{ padding: '0 20px 16px' }}>
        <button style={{
          width: '100%',
          height: '48px',
          borderRadius: 'var(--r-button)',
          background: 'transparent',
          border: '1.5px solid var(--primary)',
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
        }}>
          ✏️ Write a Review
        </button>
      </div>

      {/* Review list */}
      {reviews.map(r => <ReviewItem key={r.id} review={r} />)}
    </div>
  );
}
