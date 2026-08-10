import { useState, useRef, useEffect } from 'react';
import type { GalleryItem } from '../types/manifest';

// ─── Lightweight native IntersectionObserver hook ────────────────────────────
function useIsVisible(rootMargin = '700px'): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isVisible];
}

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
  const [ref, isVisible] = useIsVisible('700px');
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const safeUrl = item.url || item.thumb;
  const isVideo = item.type === 'video';

  // Aspect ratio: portrait for photos (3:4), vertical for videos (9:16)
  const aspectRatio = isVideo ? '9/16' : '3/4';

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      style={{
        marginBottom: '0.5rem',
        breakInside: 'avoid',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        // Fixed aspect ratio = zero layout shift, shimmer fills perfectly
        aspectRatio,
        background: '#f5dce8',
      }}
    >
      {/* Shimmer — fills the full container since it's now aspect-ratio sized */}
      {!loaded && !errored && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg,rgba(249,213,229,0.5) 0%,rgba(232,213,245,0.85) 50%,rgba(249,213,229,0.5) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmerLoad 1.2s ease infinite',
          }}
        />
      )}

      {/* Video — autoplay, muted, looping */}
      {isVisible && isVideo && (
        <video
          src={safeUrl}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        />
      )}

      {/* Image */}
      {isVisible && !isVideo && !errored && (
        <img
          src={safeUrl}
          alt={item.caption || `Memory ${index + 1}`}
          loading="lazy"
          decoding="async"
          fetchPriority={index < 8 ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            // cover crops slightly but ensures no white borders or layout jumps
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        />
      )}

      {/* Error fallback */}
      {errored && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            opacity: 0.35,
          }}
        >
          🖼️
        </div>
      )}
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
    <div className="gallery-masonry">
      {items.map((item, i) => (
        <div key={item.id} className="gallery-item">
          <MasonryItem item={item} index={i} onClick={onItemClick} />
        </div>
      ))}
    </div>
  );
}
