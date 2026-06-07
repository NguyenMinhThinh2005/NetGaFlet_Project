export default function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '100px',
        background: value ? 'var(--primary)' : 'var(--surface-elevated)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s ease',
        boxShadow: value ? 'var(--glow-red)' : 'none',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: value ? '23px' : '3px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: 'var(--text-primary)',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}
