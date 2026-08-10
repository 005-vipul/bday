import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryItem } from '../types/manifest';

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ item, onClose, onNext, onPrev }: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', fontSize: '2rem',
            width: 48, height: 48, borderRadius: '50%',
            cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          &times;
        </button>

        {/* Prev/Next Buttons (Desktop mostly) */}
        <button
          onClick={onPrev}
          style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}
          className="hidden md:flex"
        >
          &#8592;
        </button>
        <button
          onClick={onNext}
          style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}
          className="hidden md:flex"
        >
          &#8594;
        </button>

        {/* Media Container (with drag for swipe) */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            if (swipe < -50 || velocity.x < -500) onNext();
            else if (swipe > 50 || velocity.x > 500) onPrev();
          }}
          style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '4rem 1rem',
          }}
        >
          {item.type === 'video' ? (
            <video
              src={item.url}
              controls
              autoPlay
              playsInline
              style={{
                maxWidth: '100%', maxHeight: '80vh',
                borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />
          ) : (
            <img
              src={item.url}
              alt={item.caption}
              style={{
                maxWidth: '100%', maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                userSelect: 'none', WebkitUserDrag: 'none'
              }}
            />
          )}

          {/* Caption */}
          {item.caption && (
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              marginTop: '1.5rem',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}>
              {item.caption}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
