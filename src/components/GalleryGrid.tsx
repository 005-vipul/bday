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
        opacity: loaded || isVideo ? 1 : 0.92,
        transition: 'opacity 0.35s ease',
      }}
    >
      {/* Shimmer placeholder — shown until image loads */}
      {!loaded && !isVideo && !errored && (
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
            width: '100%', 
            height: 'auto', 
            display: 'block' 
          }}
        />
      )}

      {/* Image — original intrinsic height */}
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
