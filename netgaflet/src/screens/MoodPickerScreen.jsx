import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodCard from '../components/features/MoodCard';

const MOODS = [
  { emoji: '😂', label: 'Laugh Out Loud' },
  { emoji: '😢', label: 'Feel Everything' },
  { emoji: '🤯', label: 'Mind = Blown' },
  { emoji: '😴', label: 'Just Unwind' },
  { emoji: '🤬', label: 'Let It All Out' },
  { emoji: '😍', label: 'Hopeless Romantic' },
  { emoji: '👻', label: "Can't Sleep" },
  { emoji: '🎉', label: 'Celebrate Life' },
];

export default function MoodPickerScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('Mind = Blown');

  const toggleMood = (label) => {
    setSelected(prev => prev === label ? '' : label);
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
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '22px',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >←</button>

      {/* Header */}
      <div style={{ padding: '60px 20px 0', textAlign: 'center', flexShrink: 0 }}>
        <p style={{
          color: 'var(--primary)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          margin: '0 0 8px',
        }}>
          AI RECOMMENDS
        </p>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: '22px',
          fontWeight: 600,
          margin: '0 0 8px',
          lineHeight: 1.2,
          maxWidth: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          How are you feeling right now?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          We'll find the perfect film to match your mood.
        </p>
      </div>

      {/* Mood grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        scrollbarWidth: 'none',
        padding: '20px 20px 0',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
        }}>
          {MOODS.map(mood => (
            <MoodCard
              key={mood.label}
              mood={mood}
              selected={selected === mood.label}
              onToggle={toggleMood}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '20px 20px 28px', flexShrink: 0 }}>
        <button
          onClick={() => navigate('/search')}
          disabled={!selected}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: 'var(--r-button)',
            background: selected ? 'var(--primary)' : 'var(--surface-elevated)',
            border: 'none',
            color: selected ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-family)',
            boxShadow: selected ? 'var(--glow-red)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          ✨ FIND MY MATCH
        </button>
        <button
          onClick={() => navigate('/search')}
          style={{
            display: 'block',
            margin: '12px auto 0',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}
        >
          Skip — Show me everything
        </button>
      </div>
    </div>
  );
}
