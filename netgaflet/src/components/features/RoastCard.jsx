export default function RoastCard({ text }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: '20px',
      padding: '32px 24px',
      border: '1px solid rgba(229,9,20,0.25)',
      boxShadow: '0 0 32px rgba(229,9,20,0.12) inset',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Opening quote */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        left: '16px',
        color: 'var(--primary)',
        fontSize: '80px',
        fontWeight: 700,
        lineHeight: 1,
        opacity: 0.8,
        fontFamily: 'Georgia, serif',
        pointerEvents: 'none',
      }}>
        "
      </div>

      {/* Text */}
      <p style={{
        color: 'var(--text-primary)',
        fontSize: '14px',
        lineHeight: 1.75,
        textAlign: 'center',
        margin: 0,
        position: 'relative',
        zIndex: 1,
        padding: '16px 8px 16px',
      }}>
        {text}
      </p>

      {/* Closing quote */}
      <div style={{
        position: 'absolute',
        bottom: '-32px',
        right: '16px',
        color: 'var(--primary)',
        fontSize: '80px',
        fontWeight: 700,
        lineHeight: 1,
        opacity: 0.8,
        fontFamily: 'Georgia, serif',
        transform: 'rotate(180deg)',
        pointerEvents: 'none',
      }}>
        "
      </div>
    </div>
  );
}
