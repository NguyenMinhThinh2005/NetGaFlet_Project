import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenreCard from '../components/ui/GenreCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';


const GENRES = [
  { id: 'action',       emoji: '🎬', label: 'Action' },
  { id: 'comedy',       emoji: '😂', label: 'Comedy' },
  { id: 'horror',       emoji: '😱', label: 'Horror' },
  { id: 'romance',      emoji: '💕', label: 'Romance' },
  { id: 'scifi',        emoji: '🤯', label: 'Sci-Fi' },
  { id: 'thriller',     emoji: '🔍', label: 'Thriller' },
  { id: 'documentary',  emoji: '📚', label: 'Documentary' },
  { id: 'drama',        emoji: '🎭', label: 'Drama' },
  { id: 'mystery',      emoji: '👻', label: 'Mystery' },
  { id: 'sports',       emoji: '🏆', label: 'Sports' },
  { id: 'animation',    emoji: '💥', label: 'Animation' },
  { id: 'foreign',      emoji: '🌍', label: 'Foreign' },
];

export default function GenreSetupScreen() {
  const navigate = useNavigate();
  const { setGenres } = useApp();
  const { isLoggedIn } = useAuth();
  const [selected, setSelected] = useState(['action', 'comedy', 'scifi', 'thriller']);

  const toggleGenre = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length >= 3;

  const handleContinue = () => {
    if (!canContinue) return;
    setGenres(selected);
    // If already logged in (editing from profile), go back to home; else go to sign in
    navigate(isLoggedIn ? '/home' : '/signin');
  };


  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <p style={{
          color: 'var(--text-tertiary)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: '0 0 8px',
        }}>
          STEP 2 OF 2
        </p>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: '24px',
          fontWeight: 700,
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}>
          What do you love watching?
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          lineHeight: 1.5,
          margin: 0,
        }}>
          Pick at least 3 genres. NixAI will do the rest.
        </p>
      </div>

      {/* Genre grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '16px 20px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {GENRES.map(genre => (
            <GenreCard
              key={genre.id}
              genre={genre}
              selected={selected.includes(genre.id)}
              onToggle={toggleGenre}
            />
          ))}
        </div>

        {/* Counter */}
        <p style={{
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center',
          marginTop: '16px',
        }}>
          {selected.length} selected
        </p>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 20px 24px', flexShrink: 0 }}>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: 'var(--r-button)',
            background: canContinue ? 'var(--primary)' : 'var(--surface-elevated)',
            border: 'none',
            color: canContinue ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-family)',
            boxShadow: canContinue ? 'var(--glow-red)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
