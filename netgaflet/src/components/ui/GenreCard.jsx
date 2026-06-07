export default function GenreCard({ genre, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(genre.id)}
      style={{
        height: '88px',
        borderRadius: 'var(--r-card)',
        background: selected ? 'rgba(229,9,20,0.12)' : 'var(--surface)',
        border: selected ? '1.5px solid var(--primary)' : '1px solid var(--divider)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 16px rgba(229,9,20,0.15) inset' : 'none',
      }}
    >
      <span style={{ fontSize: '24px' }}>{genre.emoji}</span>
      <span style={{
        fontSize: '11px',
        fontWeight: selected ? 600 : 400,
        color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {genre.label}
      </span>

      {/* Checkmark badge */}
      {selected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: 'var(--text-primary)',
          fontWeight: 700,
        }}>✓</div>
      )}
    </div>
  );
}
