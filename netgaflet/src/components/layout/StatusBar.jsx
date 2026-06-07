import { useState, useEffect } from 'react';

export default function StatusBar({ transparent = false }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setTime(`${h12}:${m} ${ampm}`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      height: 'var(--status-bar-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      background: transparent ? 'transparent' : 'var(--bg-base)',
      position: transparent ? 'absolute' : 'relative',
      top: transparent ? 0 : 'auto',
      left: transparent ? 0 : 'auto',
      right: transparent ? 0 : 'auto',
      zIndex: transparent ? 10 : 'auto',
    }}>
      <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
        {time || '9:41 AM'}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Signal */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{
              width: '3px',
              height: `${h}px`,
              background: i < 3 ? 'var(--text-primary)' : 'var(--text-tertiary)',
              borderRadius: '1px',
            }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 4C3.2 1.8 5.9 0.5 8 0.5s4.8 1.3 7 3.5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.5 6.5C5 5 6.5 4.2 8 4.2s3 0.8 4.5 2.3" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 9C6.8 8.3 7.4 8 8 8s1.2 0.3 2 1" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="1" fill="var(--text-primary)" />
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <div style={{
            width: '22px', height: '11px',
            border: '1.5px solid var(--text-primary)',
            borderRadius: '3px',
            padding: '2px',
            position: 'relative',
          }}>
            <div style={{
              width: '80%', height: '100%',
              background: 'var(--text-primary)',
              borderRadius: '1px',
            }} />
          </div>
          <div style={{
            width: '2px', height: '5px',
            background: 'var(--text-primary)',
            borderRadius: '0 1px 1px 0',
          }} />
        </div>
      </div>
    </div>
  );
}
