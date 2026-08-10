import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChapterCard from '../components/ChapterCard';
import TimelineDivider from '../components/TimelineDivider';
import type { Manifest } from '../types/manifest';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="glass-card"
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {[80, 55, 100, 90, 70].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? 28 : 14,
            width: `${w}%`,
            borderRadius: 6,
            background: 'linear-gradient(90deg, rgba(249,213,229,0.5) 25%, rgba(232,213,245,0.5) 50%, rgba(249,213,229,0.5) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonShimmer 1.4s ease infinite',
          }}
        />
      ))}
    </div>
  );
}

// ─── Story Page ───────────────────────────────────────────────────────────────
export default function Story() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json() as Promise<Manifest>;
      })
      .then(setManifest)
      .catch(() => setError(true));
  }, []);

  return (
    <main id="page-story" className="page-wrapper">
      {/* ── Ambient background orbs ──────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '5%', left: '-5%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,167,195,0.16) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,164,232,0.14) 0%, transparent 70%)',
        }} />
      </div>

      <div
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: 780,
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem) 1.25rem clamp(3rem, 6vw, 5rem)',
        }}
      >
        {/* ── Page header ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}
        >
          {/* Eyebrow label */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 1.1rem',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244,167,195,0.45)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#d14b7e',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            <span>📖</span> Our Story
          </span>

          <h1
            id="story-heading"
            className="font-heading"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #d14b7e 0%, #9b59b6 45%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
            }}
          >
            How We Got Here
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
              color: '#6b3a52',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Every love story has chapters. Here are ours — messy, tender, unforgettable. 💕
          </p>

          {/* Decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1.75rem' }}>
            <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, #e8759a)' }} />
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, #e8759a, transparent)' }} />
          </div>
        </motion.div>

        {/* ── Timeline vertical rail ──────────────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          {/* Left rail line (decorative, desktop only) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: -28,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, transparent 0%, rgba(232,117,154,0.3) 10%, rgba(200,164,232,0.3) 90%, transparent 100%)',
              borderRadius: 4,
            }}
            className="timeline-rail"
          />

          {/* ── Error state ───────────────────────────────────────────────── */}
          {error && (
            <div
              className="glass-card"
              style={{ padding: '2rem', textAlign: 'center', color: '#d14b7e' }}
            >
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💔</p>
              <p>Couldn't load the story. Make sure <code>public/manifest.json</code> exists.</p>
            </div>
          )}

          {/* ── Loading skeletons ─────────────────────────────────────────── */}
          {!manifest && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── Chapters ──────────────────────────────────────────────────── */}
          {manifest && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {manifest.chapters.map((chapter, idx) => (
                <div key={chapter.id}>
                  {/* Timeline dot */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.35, ease: 'backOut' }}
                      style={{
                        width: 10, height: 10,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e8759a, #9b59b6)',
                        boxShadow: '0 0 0 3px rgba(232,117,154,0.2)',
                        flexShrink: 0,
                        marginLeft: -33,
                        marginRight: 22,
                      }}
                      className="timeline-dot"
                    />
                  </div>

                  <ChapterCard chapter={chapter} index={idx} />

                  {/* Divider between chapters */}
                  <div style={{ padding: '0.75rem 0' }}>
                    <TimelineDivider isLast={idx === manifest.chapters.length - 1} />
                  </div>
                </div>
              ))}

              {/* ── Closing flourish ─────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ textAlign: 'center', padding: '2rem 0 1rem' }}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>
                  💖
                </span>
                <p
                  className="font-heading"
                  style={{
                    fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                    fontWeight: 700,
                    color: '#d14b7e',
                    opacity: 0.85,
                  }}
                >
                  And the story continues…
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes shimmerLoad {
          0%   { opacity: 0.5; }
          100% { opacity: 0.9; }
        }

        /* Hide rail & dots on narrow screens */
        @media (max-width: 600px) {
          .timeline-rail { display: none !important; }
          .timeline-dot  { display: none !important; }
        }
      `}</style>
    </main>
  );
}
