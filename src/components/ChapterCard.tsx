import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Chapter } from '../types/manifest';

// ─── Chapter number badges ────────────────────────────────────────────────────
const CHAPTER_EMOJIS: Record<number, string> = {
  1: '👀', 2: '🙈', 3: '🎉', 4: '🤝', 5: '⏳',
  6: '📱', 7: '🌸', 8: '💋', 9: '💑', 10: '😢',
  11: '🤞', 12: '💖',
};

// ─── Main Chapter Card ────────────────────────────────────────────────────────
interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

export default function ChapterCard({ chapter, index }: ChapterCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Alternate slide direction: even = from left, odd = from right
  const fromX = index % 2 === 0 ? -50 : 50;

  const cardVariants = {
    hidden: { opacity: 0, x: fromX, y: 20 },
    visible: {
      opacity: 1, x: 0, y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' },
    },
  };

  const emoji = CHAPTER_EMOJIS[chapter.id] ?? '💗';

  return (
    <motion.div
      ref={ref}
      id={`chapter-${chapter.id}`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.5rem',
      }}
    >
      {/* ── Card shell ─────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft inner glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -60, right: -60,
            width: 180, height: 180,
            borderRadius: '50%',
            background: index % 2 === 0
              ? 'radial-gradient(circle, rgba(244,167,195,0.18) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(200,164,232,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Chapter number badge + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div
            style={{
              flexShrink: 0,
              width: 48, height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(249,213,229,0.9), rgba(232,213,245,0.9))',
              border: '1.5px solid rgba(255,255,255,0.8)',
              boxShadow: '0 2px 12px rgba(209,75,126,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
            }}
          >
            {emoji}
          </div>
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#c8a4e8',
                marginBottom: '0.2rem',
              }}
            >
              Chapter {chapter.id}
            </span>
            <h2
              className="font-heading"
              style={{
                fontSize: 'clamp(1.55rem, 4vw, 2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                background: 'linear-gradient(135deg, #d14b7e 0%, #9b59b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {chapter.title}
            </h2>
          </div>
        </div>

        {/* Narrative text */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
            lineHeight: 1.8,
            color: '#4a2438',
            fontWeight: 400,
            marginBottom: 0,
          }}
        >
          {chapter.text}
        </motion.p>
      </div>
    </motion.div>
  );
}
