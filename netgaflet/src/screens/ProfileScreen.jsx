import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/layout/StatusBar';
import Toggle from '../components/ui/Toggle';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { mockUser } from '../data/mockUser';


export default function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notif, setNotif] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-scrollable" style={{ padding: '0 0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 0' }}>
          {/* Avatar with gradient ring */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
              zIndex: 0,
            }} />
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A1A24, #111118)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              border: '3px solid var(--bg-base)',
            }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '28px', fontWeight: 700 }}>AR</span>
            </div>
          </div>

          <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>
            {mockUser.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 16px' }}>
            {mockUser.memberType} · Joined {mockUser.joinYear}
          </p>

          {/* Stats chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="stat-chip">{mockUser.stats.watched} Watched</span>
            <span className="stat-chip">{mockUser.stats.watchlist} Watchlist</span>
            <span className="stat-chip">{mockUser.stats.avgRating}★ Avg</span>
          </div>
        </div>

        {/* AI Roast CTA */}
        <div style={{ padding: '20px 20px 0' }}>
          <button
            onClick={() => navigate('/roast-result')}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: 'var(--r-button)',
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              boxShadow: 'var(--glow-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            ✨ AI: Roast My Taste
          </button>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', textAlign: 'center', marginTop: '6px' }}>
            Get an honest (brutal) AI review of your movie palette.
          </p>
        </div>

        {/* Library Section */}
        <ProfileSection label="Library">
          <ListRow icon="🎬" label="Watch History" onClick={() => navigate('/watch-history')} showChevron />
          <ListRow icon="🔖" label="My Watchlist" onClick={() => navigate('/watchlist')} showChevron />
        </ProfileSection>

        {/* Preferences Section */}
        <ProfileSection label="Preferences">
          <ListRow icon="🎭" label="Preferred Genres" value="Action, Sci-Fi" onClick={() => navigate('/genre-setup')} showChevron />
          <ListRow icon="🌐" label="Subtitle Language" value="English" showChevron />
        </ProfileSection>

        {/* Account Section */}
        <ProfileSection label="Account">
          <ListRow
            icon="🔔"
            label="Notifications"
            right={<Toggle value={notif} onChange={setNotif} />}
          />
          <ListRow icon="⚙️" label="Settings" onClick={() => navigate('/settings')} showChevron />
          <ListRow
            icon="🚪"
            label="Sign Out"
            labelColor="var(--primary)"
            onClick={handleLogout}
          />
        </ProfileSection>
      </div>
    </div>
  );
}

function ProfileSection({ label, children }) {
  return (
    <div style={{ padding: '24px 20px 0' }}>
      <p className="section-label" style={{ marginBottom: '10px' }}>{label}</p>
      {children}
    </div>
  );
}

function ListRow({ icon, label, value, onClick, showChevron, right, labelColor }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        background: 'var(--surface)',
        borderRadius: 'var(--r-card)',
        padding: '0 16px',
        marginBottom: '8px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.background = 'var(--surface-elevated)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px', width: '24px', textAlign: 'center' }}>{icon}</span>
        <span style={{ color: labelColor || 'var(--text-primary)', fontSize: '15px' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {value && <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{value}</span>}
        {right}
        {showChevron && <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>›</span>}
      </div>
    </div>
  );
}
