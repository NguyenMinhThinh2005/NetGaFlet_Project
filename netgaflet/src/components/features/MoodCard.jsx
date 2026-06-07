export default function MoodCard({ mood, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(mood.label)}
      style={{
        background: selected ? 'rgba(229,9,20,0.08)' : 'var(--surface)',
        border: selected ? '1.5px solid var(--primary)' : '1px solid var(--divider)',
        borderRadius: 'var(--r-card)',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 16px rgba(229,9,20,0.15) inset' : 'none',
        minHeight: '88px',
      }}
    >
      <span style={{ fontSize: '32px', lineHeight: 1 }}>{mood.emoji}</span>
      <span style={{
        fontSize: '10px',
        color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.3,
        fontWeight: selected ? 600 : 400,
      }}>
        {mood.label}
      </span>
    </div>
  );
}
