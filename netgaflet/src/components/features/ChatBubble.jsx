export default function ChatBubble({ message }) {
  const isAI = message.sender === 'ai';
  const isTyping = message.type === 'typing';

  if (isTyping) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          background: 'var(--surface-elevated)',
          borderRadius: '4px 16px 16px 16px',
          padding: '14px 18px',
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--text-secondary)',
                animation: `typingDot 1.2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
    }}>
      <div style={{
        maxWidth: isAI ? '80%' : '70%',
        background: isAI ? 'var(--surface-elevated)' : 'var(--primary)',
        borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        padding: '12px 14px',
      }}>
        {/* Streaming text */}
        <p style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {message.text}
          {message.streaming && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '14px',
              background: 'var(--primary)',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 0.8s ease-in-out infinite',
            }} />
          )}
        </p>

        {/* Embedded movie card */}
        {message.movieCard && (
          <MovieCardEmbed movie={message.movieCard} />
        )}

        {/* Timestamp */}
        <div style={{
          textAlign: isAI ? 'left' : 'right',
          marginTop: '6px',
        }}>
          <span style={{ color: 'rgba(245,245,245,0.4)', fontSize: '10px' }}>
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
}

function MovieCardEmbed({ movie }) {
  return (
    <div style={{
      marginTop: '10px',
      background: 'var(--surface)',
      borderRadius: '12px',
      padding: '12px',
      display: 'flex',
      gap: '12px',
    }}>
      {/* Poster */}
      <div style={{
        width: '60px',
        height: '90px',
        borderRadius: '8px',
        background: movie.posterGradient,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '8px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '4px' }}>
          {movie.title}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
          {movie.title}
        </span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {movie.genres.slice(0, 2).map(g => (
            <span key={g} className="genre-pill" style={{ fontSize: '10px', padding: '2px 7px' }}>{g}</span>
          ))}
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
          ⭐ {movie.rating} · {movie.year} · {movie.duration}
        </span>
        <button
          style={{
            alignSelf: 'flex-start',
            height: '28px',
            borderRadius: '100px',
            background: 'var(--primary)',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '11px',
            fontWeight: 600,
            padding: '0 12px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}
        >
          ▶ Play Now
        </button>
      </div>
    </div>
  );
}
