import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import Toggle from '../components/ui/Toggle';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    autoplay: true,
    hdr: true,
    downloadOnWifi: true,
    subtitles: false,
    parentalControl: false,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const settingSections = [
    {
      label: 'Playback',
      rows: [
        { key: 'autoplay', label: 'Autoplay Next Episode', icon: '▶', toggle: true },
        { key: 'hdr', label: '4K HDR Streaming', icon: '🎬', toggle: true },
        { key: 'subtitles', label: 'Subtitles', icon: '💬', toggle: true },
      ],
    },
    {
      label: 'Downloads',
      rows: [
        { key: 'downloadOnWifi', label: 'Download on Wi-Fi Only', icon: '📥', toggle: true },
      ],
    },
    {
      label: 'Privacy',
      rows: [
        { key: 'parentalControl', label: 'Parental Controls', icon: '🔒', toggle: true },
        { label: 'Clear Watch History', icon: '🗑', toggle: false, onClick: () => {} },
        { label: 'Privacy Policy', icon: '📄', toggle: false, onClick: () => {} },
      ],
    },
    {
      label: 'Account',
      rows: [
        { label: 'Change Password', icon: '🔑', toggle: false, onClick: () => {} },
        { label: 'Manage Subscription', icon: '💳', toggle: false, onClick: () => {} },
        {
          label: 'Sign Out',
          icon: '🚪',
          toggle: false,
          danger: true,
          onClick: () => { logout(); navigate('/signin'); },
        },
      ],
    },
  ];

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ padding: '0 20px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '22px', cursor: 'pointer', padding: '4px' }}
          >←</button>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 700, margin: 0 }}>Settings</h1>
        </div>

        {settingSections.map(section => (
          <div key={section.label} style={{ marginBottom: '24px' }}>
            <p className="section-label">{section.label}</p>
            {section.rows.map((row, i) => (
              <div
                key={row.label}
                onClick={row.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '56px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--r-card)',
                  padding: '0 16px',
                  marginBottom: '8px',
                  cursor: row.onClick ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => row.onClick && (e.currentTarget.style.background = 'var(--surface-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{row.icon}</span>
                  <span style={{ color: row.danger ? 'var(--primary)' : 'var(--text-primary)', fontSize: '14px' }}>
                    {row.label}
                  </span>
                </div>
                {row.toggle ? (
                  <Toggle
                    value={settings[row.key]}
                    onChange={() => toggle(row.key)}
                  />
                ) : !row.danger && (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>
                )}
              </div>
            ))}
          </div>
        ))}

        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          NETGAFLET v1.0.0 · © 2024
        </p>
      </div>
    </div>
  );
}
