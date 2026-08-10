import { useState, useEffect, useMemo } from 'react';
import type { Manifest, GalleryItem } from '../types/manifest';
import GalleryGrid from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';

export default function Gallery() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Fetch manifest
  useEffect(() => {
    fetch('/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest', err));
  }, []);

  const allItems = useMemo(() => manifest?.gallery ?? [], [manifest]);

  const visibleItems = useMemo(
    () => allItems.slice(0, visibleCount),
    [allItems, visibleCount]
  );

  // Passive infinite-scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 800
      ) {
        setVisibleCount(prev => Math.min(prev + 30, allItems.length));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allItems.length]);

  // Lightbox navigation (through the full unsliced list)
  const handleNext = () => {
    if (!lightboxItem) return;
    const idx = allItems.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(allItems[(idx + 1) % allItems.length]);
  };

  const handlePrev = () => {
    if (!lightboxItem) return;
    const idx = allItems.findIndex(i => i.id === lightboxItem.id);
    setLightboxItem(allItems[(idx - 1 + allItems.length) % allItems.length]);
  };

  if (!manifest) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#c8a4e8', fontSize: '1.1rem', animation: 'pulse 1.5s ease infinite' }}>
          Loading memories ✨
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', paddingTop: '4.5rem', paddingBottom: '3rem' }}>
      {allItems.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '5rem', color: 'rgba(74,36,56,0.5)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</p>
          <p>No memories yet — check back soon.</p>
        </div>
      ) : (
        <GalleryGrid
          items={visibleItems}
          onItemClick={(item) => setLightboxItem(item)}
        />
      )}

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
