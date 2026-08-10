import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import type { GalleryItem } from '../types/manifest';

// ─── Individual masonry item ──────────────────────────────────────────────────
function MasonryItem({
  item,
  index,
  onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: (item: GalleryItem) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Preload 600px before the item enters the viewport so it's ready when seen
  const isInView = useInView(ref, { once: true, margin: '600px' });
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const safeUrl = item.url || item.thumb;
  const isVideo = item.type === 'video';

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      style={{
        marginBottom: '0.6rem',
        breakInside: 'avoid',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '0.6rem',
        overflow: 'hidden',
        background: 'rgba(249,213,229,0.25)',
        // subtle entrance: only opacity, no y-shift (cheaper on mobile GPU)
        opacity: loaded || isVideo ? 1 : 0.92,
        transition: 'opacity 0.35s ease',
        transform: 'translateZ(0)',
      }}
    >
      {/* Shimmer placeholder — shown until image loads */}
      {!loaded && !errored && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            minHeight: 180,
            background:
              'linear-gradient(90deg, rgba(249,213,229,0.4) 0%, rgba(232,213,245,0.7) 50%, rgba(249,213,229,0.4) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmerLoad 1.4s ease infinite',
          }}
        />
      )}

      {/* Video */}
      {isInView && isVideo && (
        <div style={{ position: 'relative' }}>
          {/* Poster / thumbnail fallback for videos */}
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.caption}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          ) : (
            <video
              src={safeUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          )}
        </div>
      )}

      {/* Image — only starts loading once in (extended) viewport */}
      {isInView && !isVideo && !errored && (
        <img
          src={safeUrl}
          alt={item.caption || `Memory ${index + 1}`}
          loading="lazy"
          decoding="async"
          // Let browser prioritize first 6 items
          fetchPriority={index < 6 ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}

      {/* Error fallback */}
      {errored && (
        <div
          style={{
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            opacity: 0.4,
          }}
        >
          🖼️
        </div>
      )}

      {/* Caption removed as requested */}
    </div>
  );
}

// ─── Masonry grid ─────────────────────────────────────────────────────────────
export default function GalleryGrid({
  items,
  onItemClick,
}: {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}) {
  return (
    <>
      <style>{`
        @keyframes shimmerLoad {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div className="gallery-masonry">
        {items.map((item, i) => (
          <div key={item.id} className="gallery-item">
            <MasonryItem item={item} index={i} onClick={onItemClick} />
          </div>
        ))}
      </div>
    </>
  );
}
