import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/home',    label: 'Home',    icon: HomeIcon },
  { path: '/search',  label: 'Search',  icon: SearchIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke={active ? '#E50914' : '#4A4A5A'}
        strokeWidth="1.8" strokeLinejoin="round"
        fill={active ? 'rgba(229,9,20,0.12)' : 'none'} />
      <path d="M9 21V12h6v9" stroke={active ? '#E50914' : '#4A4A5A'} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={active ? '#E50914' : '#4A4A5A'} strokeWidth="1.8" />
      <path d="M20 20l-3-3" stroke={active ? '#E50914' : '#4A4A5A'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={active ? '#E50914' : '#4A4A5A'} strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#E50914' : '#4A4A5A'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      height: 'var(--nav-height)',
      background: 'var(--bg-base)',
      borderTop: '1px solid var(--divider)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      position: 'relative',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 24px',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Icon active={active} />
            <span style={{
              fontSize: '10px',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--primary)' : 'var(--text-tertiary)',
              transition: 'color 0.2s',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
