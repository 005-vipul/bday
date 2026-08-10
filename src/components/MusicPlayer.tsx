import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { title: "Abhi Na Jao Chhod Kar", src: "/music/song1.mp3" },
  { title: "Ek Ajnabee Haseena Se", src: "/music/song2.mp3" },
  { title: "Lag Ja Gale Se Phir", src: "/music/song3.mp3" },
  { title: "Pyar Diwana Hota Hai", src: "/music/song4.mp3" },
  { title: "Yeh Sham Mastani", src: "/music/song5.mp3" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle Play/Pause state changes from the audio element itself
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => handleNext();

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Handle Autoplay policy
  useEffect(() => {
    const attemptPlay = async () => {
      try {
        if (audioRef.current && !isPlaying) {
          await audioRef.current.play();
          setHasInteracted(true);
        }
      } catch (err) {
        // Autoplay blocked by browser. Wait for user interaction.
      }
    };

    attemptPlay();

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        attemptPlay();
      }
    };

    // Listen for any click to start the music if autoplay was blocked
    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted, isPlaying]);

  // When current track changes, play it (if we have already interacted)
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentIndex, hasInteracted]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent document click from interfering
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const currentSong = PLAYLIST[currentIndex];

  return (
    <>
      <audio ref={audioRef} src={currentSong.src} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '0.5rem 0.5rem 0.5rem 1rem',
          borderRadius: '9999px',
          boxShadow: '0 4px 15px rgba(209,75,126,0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Animated Music Bars (only animate when playing) */}
        <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'flex-end' }}>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ height: isPlaying ? ['4px', '16px', '4px'] : '4px' }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              style={{
                width: '4px',
                background: '#d14b7e',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>

        {/* Song Info & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          
          <AnimatePresence mode="wait">
            {(!isPlaying && !hasInteracted) ? (
              <motion.span
                key="prompt"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b3a52', whiteSpace: 'nowrap' }}
              >
                Tap anywhere to play
              </motion.span>
            ) : (
              <motion.span
                key="title"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 500, 
                  color: '#6b3a52',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '110px' // Ensures it fits on small phones like iPhone SE
                }}
              >
                {currentSong.title}
              </motion.span>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                background: 'rgba(209,75,126,0.1)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d14b7e',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(209,75,126,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(209,75,126,0.1)'}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Skip Song"
              title="Skip Song"
              style={{
                background: 'rgba(209,75,126,0.1)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d14b7e',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(209,75,126,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(209,75,126,0.1)'}
            >
              ⏭
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
