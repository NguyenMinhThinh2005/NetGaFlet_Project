import { useState, useEffect } from 'react';

export default function FAB({ onClick, icon = '✨', tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (tooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 2000);

      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 7000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [tooltip]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Tooltip */}
      {tooltip && (showTooltip || isHovered) && (
        <div style={{
          position: 'absolute',
          bottom: '72px',
          right: 0,
          whiteSpace: 'nowrap',
          background: 'rgba(26,26,36,0.95)',
          border: '1px solid var(--divider)',
          borderRadius: '100px',
          padding: '6px 14px',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic',
          animation: 'bounce 1.5s ease-in-out infinite',
          backdropFilter: 'blur(8px)',
        }}>
          {tooltip}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={onClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: 'var(--glow-red)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = 'var(--glow-red-strong)';
          setIsHovered(true);
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--glow-red)';
          setIsHovered(false);
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1.1)'}
      >
        {icon}
      </button>
    </div>
  );
}
