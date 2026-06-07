import { useEffect } from 'react';

export default function BottomSheet({ isOpen, onClose, title, children, height = '72%' }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.60)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative',
        background: '#111118',
        borderRadius: '24px 24px 0 0',
        height,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease',
        zIndex: 1,
      }}>
        {/* Drag handle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '12px 0 0',
          flexShrink: 0,
        }}>
          <div style={{
            width: '36px',
            height: '4px',
            background: 'var(--text-tertiary)',
            borderRadius: '2px',
          }} />
        </div>

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            flexShrink: 0,
          }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600 }}>
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 1,
              }}
            >✕</button>
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
