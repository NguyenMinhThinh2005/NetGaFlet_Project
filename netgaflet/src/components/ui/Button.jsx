export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  style = {},
}) {
  const sizes = {
    sm: { height: '36px', fontSize: '13px', padding: '0 16px', borderRadius: '10px' },
    md: { height: '48px', fontSize: '15px', padding: '0 24px', borderRadius: '12px' },
    lg: { height: '56px', fontSize: '15px', padding: '0 24px', borderRadius: '12px' },
    pill: { height: '44px', fontSize: '14px', padding: '0 22px', borderRadius: '100px' },
  };

  const variants = {
    primary: {
      background: disabled ? 'var(--surface-elevated)' : 'var(--primary)',
      color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
      border: 'none',
      boxShadow: disabled ? 'none' : 'var(--glow-red)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'var(--surface-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--divider)',
      boxShadow: 'none',
    },
    danger: {
      background: 'rgba(229,9,20,0.12)',
      color: 'var(--primary)',
      border: '1px solid rgba(229,9,20,0.3)',
      boxShadow: 'none',
    },
  };

  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-family)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        ...s,
        ...v,
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '1';
      }}
      onMouseDown={e => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );
}
