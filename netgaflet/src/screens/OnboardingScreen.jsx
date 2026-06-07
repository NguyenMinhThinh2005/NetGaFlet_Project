import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Illustrations ─────────────────────────────────────────────────────────────
function TheaterIllustration() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(ellipse at 50% 60%, rgba(229,9,20,0.12) 0%, transparent 60%)' }} />
      {/* Cinema screen */}
      <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', width: '240px', height: '140px', background: 'radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 80%)', border: '1px solid rgba(229,9,20,0.15)', borderRadius: '8px', boxShadow: '0 0 40px rgba(229,9,20,0.1)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(229,9,20,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px' }}>NETGAFLET</div>
      </div>
      {/* Couch silhouette */}
      <div style={{ position: 'absolute', bottom: '60px', display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
        <div style={{ width: '60px', height: '24px', background: '#111118', borderRadius: '4px 4px 0 0' }} />
        <div style={{ width: '10px', height: '40px', background: '#111118', borderRadius: '4px 4px 0 0' }} />
        <div style={{ width: '10px', height: '40px', background: '#111118', borderRadius: '4px 4px 0 0' }} />
        <div style={{ width: '10px', height: '40px', background: '#111118', borderRadius: '4px 4px 0 0' }} />
        <div style={{ width: '60px', height: '24px', background: '#111118', borderRadius: '4px 4px 0 0' }} />
      </div>
      {/* Person head */}
      <div style={{ position: 'absolute', bottom: '96px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', background: '#0f0f18', borderRadius: '50%', border: '1px solid #1a1a24' }} />
    </div>
  );
}

function NeuralNetIllustration() {
  const nodes = [
    { x: 30, y: 30, color: '#E50914' },
    { x: 70, y: 55, color: '#1A1A24' },
    { x: 50, y: 80, color: '#E50914' },
    { x: 20, y: 65, color: '#1A1A24' },
    { x: 80, y: 25, color: '#E50914' },
    { x: 40, y: 45, color: '#1A1A24' },
    { x: 60, y: 20, color: '#E50914' },
    { x: 25, y: 85, color: '#1A1A24' },
    { x: 75, y: 75, color: '#E50914' },
  ];
  const lines = [[0,4],[0,6],[0,5],[1,2],[1,5],[1,8],[2,3],[2,7],[3,5],[4,6],[5,6],[5,8]];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="280" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {lines.map(([a, b], i) => (
          <line key={i} x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`} x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`} stroke="rgba(229,9,20,0.3)" strokeWidth="0.5" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r="3.5" fill={n.color} style={{ animation: `pulse ${1.5 + (i % 3) * 0.4}s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </svg>
    </div>
  );
}

function DiceIllustration() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 50%)', borderRadius: '50%' }} />
      <div style={{ fontSize: '100px', lineHeight: 1, filter: 'drop-shadow(0 0 30px rgba(229,9,20,0.5)) drop-shadow(0 0 60px rgba(229,9,20,0.25))', animation: 'float 2s ease-in-out infinite', position: 'relative', zIndex: 1 }}>🎲</div>
    </div>
  );
}

// ─── Slide Definitions ─────────────────────────────────────────────────────────
const SLIDE_DATA = [
  { id: 0, title: 'Cinema at your fingertips.', body: 'Thousands of films in 4K HDR, curated by NixAI just for you.', cta: 'Next →', Illustration: TheaterIllustration },
  { id: 1, title: 'AI that knows your taste.', body: 'NixAI learns your preferences, reads your mood, and roasts your watch history.', cta: 'Next →', Illustration: NeuralNetIllustration },
  { id: 2, title: 'Shake. Discover. Watch.', body: 'Just shake your phone and NixAI picks the perfect film for tonight.', cta: 'Get Started', Illustration: DiceIllustration },
];

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { setOnboarded } = useAuth();

  const handleCTA = () => {
    if (current < 2) {
      setCurrent(c => c + 1);
    } else {
      setOnboarded();
      navigate('/signin');
    }
  };

  const handleSkip = () => {
    setOnboarded();
    navigate('/signin');
  };

  const slide = SLIDE_DATA[current];
  const { Illustration } = slide;

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Skip button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 0', flexShrink: 0 }}>
        <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-family)', padding: '4px 8px' }}>
          Skip
        </button>
      </div>

      {/* Illustration zone — 55% */}
      <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>
        <Illustration />
      </div>

      {/* Text + nav zone — 45% */}
      <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 30px 32px' }}>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {SLIDE_DATA.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? 'var(--primary)' : 'var(--text-tertiary)', transition: 'all 0.3s ease', cursor: 'pointer' }}
            />
          ))}
        </div>

        {/* Title */}
        <h2 key={`title-${current}`} style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, textAlign: 'center', margin: '0 0 12px', lineHeight: 1.2, animation: 'fadeIn 0.4s ease' }}>
          {slide.title}
        </h2>

        {/* Body */}
        <p key={`body-${current}`} style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', lineHeight: 1.6, maxWidth: '80%', margin: '0 0 auto', animation: 'fadeIn 0.5s ease' }}>
          {slide.body}
        </p>

        {/* CTA */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={handleCTA}
            style={{ height: '48px', borderRadius: '100px', background: 'var(--primary)', border: 'none', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, padding: '0 24px', cursor: 'pointer', fontFamily: 'var(--font-family)', boxShadow: current === 2 ? 'var(--glow-red)' : 'none', transition: 'all 0.2s' }}
          >
            {slide.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
