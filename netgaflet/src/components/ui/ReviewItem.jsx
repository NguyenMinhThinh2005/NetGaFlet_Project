export default function ReviewItem({ review }) {
  const stars = Math.round(review.stars);

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: review.avatarColor || 'var(--surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {review.initials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
              {review.name}
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
              {review.timestamp}
            </span>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: '12px', color: i <= stars ? '#E50914' : 'var(--text-tertiary)' }}>
                ★
              </span>
            ))}
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {review.text}
          </p>

          {/* Helpful */}
          <button style={{
            marginTop: '10px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '12px',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-family)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            👍 Helpful ({review.helpful})
          </button>
        </div>
      </div>
      <div className="divider" style={{ marginTop: '16px' }} />
    </div>
  );
}
