import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

// ─── EDITABLE CONSTANTS ──────────────────────────────────────────────────────
// ✏️  Change these to personalise the page
const HERO_NAME = 'My Love'; // e.g. "Priya", "Baby", etc.
const OPENING_LINE =
  "Every moment with you is a gift I never want to return. 🎁"; // ← write your own line here
// ─────────────────────────────────────────────────────────────────────────────

// Sparkle / heart particles data
interface Particle {
  id: number;
  x: number;       // vw %
  y: number;       // start vh %
  size: number;    // px
  duration: number; // animation seconds
  delay: number;   // seconds
  emoji: string;
  drift: number;   // horizontal drift in vw
}

function makeParticles(count: number): Particle[] {
  const symbols = ['💗', '💖', '✨', '🌸', '💕', '⭐', '🌷', '💫'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 100 + Math.random() * 20,
    size: 14 + Math.random() * 16,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 12,
    emoji: symbols[Math.floor(Math.random() * symbols.length)],
    drift: (Math.random() - 0.5) * 12,
  }));
}

const PARTICLES = makeParticles(28);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const confettiCalled = useRef(false);

  // ── Confetti burst on mount ────────────────────────────────────────────────
  const launchConfetti = useCallback(() => {
    if (confettiCalled.current) return;
    confettiCalled.current = true;

    const colors = ['#f4a7c3', '#c8a4e8', '#fcd34d', '#e8759a', '#9b59b6', '#f59e0b'];

    // First burst — center
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.55 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.1,
    });

    // Second burst — left
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        scalar: 0.9,
      });
    }, 200);

    // Third burst — right
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        scalar: 0.9,
      });
    }, 350);

    // Gentle shower tail
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors,
        gravity: 0.7,
        scalar: 0.8,
        drift: 0.4,
      });
    }, 600);
  }, []);

  useEffect(() => {
    // Slight delay so the page renders first
    const timer = setTimeout(launchConfetti, 400);
    return () => clearTimeout(timer);
  }, [launchConfetti]);

  return (
    <main
      id="page-landing"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 3rem',
        background:
          'radial-gradient(ellipse at 20% 30%, rgba(249,213,229,0.7) 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 80% 70%, rgba(232,213,245,0.65) 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 50% 50%, rgba(254,243,199,0.4) 0%, transparent 70%), ' +
          'linear-gradient(145deg, #fce4ec 0%, #f3e5f5 45%, #fff8e1 100%)',
      }}
    >
      {/* ── Floating Background Particles ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
      >
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}vw`,
              bottom: `${p.y - 100}%`,
              fontSize: `${p.size}px`,
              opacity: 0,
              animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
              '--drift': `${p.drift}vw`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* ── Glowing Orbs (decorative) ─────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '8%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,167,195,0.25) 0%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '6%',
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,164,232,0.22) 0%, transparent 70%)',
          animation: 'pulse 6.5s ease-in-out 1.5s infinite',
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '60%',
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252,211,77,0.2) 0%, transparent 70%)',
          animation: 'pulse 7s ease-in-out 3s infinite',
        }} />
      </div>

      {/* ── Hero Content ──────────────────────────────────────────────────── */}
      <div
        id="landing-hero"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.75rem',
          maxWidth: '720px',
          width: '100%',
        }}
      >
        {/* Birthday badge */}
        <div
          id="landing-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244,167,195,0.5)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#d14b7e',
            boxShadow: '0 2px 16px rgba(209,75,126,0.12)',
            animation: 'fadeSlideDown 0.6s ease both',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🎂</span>
          <span>Today is your special day</span>
        </div>

        {/* Main heading */}
        <div style={{ animation: 'fadeSlideDown 0.7s ease 0.1s both' }}>
          <h1
            id="landing-heading"
            className="font-heading"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #d14b7e 0%, #9b59b6 45%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
            }}
          >
            Happy Birthday,
          </h1>
          <h1
            className="font-heading"
            style={{
              fontSize: 'clamp(3.2rem, 9vw, 6.2rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              background: 'linear-gradient(135deg, #e8759a 0%, #c8a4e8 50%, #fcd34d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear 1s infinite',
              backgroundSize: '200% 100%',
            }}
          >
            {HERO_NAME}! 🎉
          </h1>
        </div>

        {/* Decorative divider */}
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeSlideDown 0.7s ease 0.2s both',
          }}
        >
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #e8759a)' }} />
          <span style={{ fontSize: '1.3rem' }}>💖</span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #e8759a, transparent)' }} />
        </div>

        {/* Opening line — edit OPENING_LINE constant above */}
        <p
          id="landing-opening-line"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: '#6b3a52',
            fontWeight: 400,
            maxWidth: '540px',
            animation: 'fadeSlideDown 0.7s ease 0.3s both',
            padding: '0 0.5rem',
          }}
        >
          {OPENING_LINE}
        </p>

        {/* CTA Button */}
        <div style={{ animation: 'fadeSlideDown 0.7s ease 0.45s both' }}>
          <button
            id="landing-cta-btn"
            onClick={() => navigate('/story')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '1rem 2.2rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #d14b7e 0%, #9b59b6 60%, #e8759a 100%)',
              backgroundSize: '200% 100%',
              boxShadow:
                '0 6px 28px rgba(209,75,126,0.38), 0 2px 8px rgba(155,89,182,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease, background-position 0.4s ease',
              animation: 'buttonBounce 2.5s ease 1.2s infinite',
              letterSpacing: '0.01em',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.03)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 10px 36px rgba(209,75,126,0.45), 0 4px 12px rgba(155,89,182,0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition = '100% 0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 6px 28px rgba(209,75,126,0.38), 0 2px 8px rgba(155,89,182,0.25), inset 0 1px 0 rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition = '0 0';
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px) scale(0.99)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.03)';
            }}
          >
            <span>Open Our Story</span>
            <span style={{ fontSize: '1.2rem' }}>📖</span>
          </button>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            animation: 'fadeSlideDown 0.7s ease 0.6s both',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: '#9b59b6', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            or explore below
          </span>
          <span
            style={{
              fontSize: '1rem',
              color: '#c8a4e8',
              animation: 'bounce 1.5s ease-in-out infinite',
              display: 'block',
            }}
          >
            ↓
          </span>
        </div>
      </div>

      {/* ── Quick Nav Cards ───────────────────────────────────────────────── */}
      <div
        id="landing-quick-nav"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          maxWidth: '680px',
          width: '100%',
          marginTop: '3.5rem',
          animation: 'fadeSlideDown 0.8s ease 0.7s both',
        }}
      >
        {[
          { emoji: '📖', label: 'Our Story',  to: '/story',   color: '#e8759a' },
          { emoji: '🖼️', label: 'Gallery',    to: '/gallery', color: '#9b59b6' },
          { emoji: '💌', label: 'Birthday\nLetter', to: '/letter', color: '#f59e0b' },
        ].map(({ emoji, label, to, color }) => (
          <button
            key={to}
            id={`landing-card-${to.replace('/', '')}`}
            onClick={() => navigate(to)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1.25rem 1rem',
              borderRadius: '1.25rem',
              border: `1px solid rgba(255,255,255,0.7)`,
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(14px)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: '#3d1a2e',
              boxShadow: '0 4px 20px rgba(209,75,126,0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
              textAlign: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = `0 10px 28px ${color}33`;
              el.style.background = 'rgba(255,255,255,0.72)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = '';
              el.style.boxShadow = '0 4px 20px rgba(209,75,126,0.08)';
              el.style.background = 'rgba(255,255,255,0.5)';
            }}
          >
            <span style={{ fontSize: '2rem' }}>{emoji}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color, whiteSpace: 'pre-line' }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Keyframe Animations ───────────────────────────────────────────── */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0);    opacity: 0; }
          10%  { opacity: 0.55; }
          85%  { opacity: 0.35; }
          100% { transform: translateY(-110vh) translateX(var(--drift)); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);    opacity: 0.8; }
          50%       { transform: scale(1.12); opacity: 1;   }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes buttonBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }

        /* Mobile responsive tweaks */
        @media (max-width: 480px) {
          #landing-quick-nav {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.65rem;
          }
          #landing-cta-btn {
            padding: 0.9rem 1.8rem !important;
            font-size: 0.97rem !important;
          }
        }
      `}</style>
    </main>
  );
}
