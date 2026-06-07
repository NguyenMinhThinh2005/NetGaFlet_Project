import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const LANDSCAPE_ROUTES = ['/play', '/next'];
const BOTTOM_NAV_ROUTES = ['/home', '/search', '/profile'];

export default function MobileFrame({ children }) {
  const location = useLocation();
  const isLandscape = LANDSCAPE_ROUTES.some(r => location.pathname.endsWith(r));
  const showNav = BOTTOM_NAV_ROUTES.includes(location.pathname);

  return (
    <div className="app-wrapper">
      <div className={`mobile-frame ${isLandscape ? 'landscape' : ''}`}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          background: 'var(--bg-base)',
        }}>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          {showNav && !isLandscape && <BottomNav />}
        </div>
      </div>
    </div>
  );
}
