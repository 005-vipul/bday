import { motion } from 'framer-motion';

interface TimelineDividerProps {
  isLast?: boolean;
}

export default function TimelineDivider({ isLast = false }: TimelineDividerProps) {
  if (isLast) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0',
        transformOrigin: 'center',
      }}
    >
      {/* Wavy hand-drawn style line using SVG */}
      <svg
        width="220"
        height="24"
        viewBox="0 0 220 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ opacity: 0.55 }}
      >
        <path
          d="M0 12 Q27.5 4 55 12 Q82.5 20 110 12 Q137.5 4 165 12 Q192.5 20 220 12"
          stroke="url(#divGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="divGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#f4a7c3" stopOpacity="0" />
            <stop offset="30%"  stopColor="#e8759a" stopOpacity="1" />
            <stop offset="70%"  stopColor="#c8a4e8" stopOpacity="1" />
            <stop offset="100%" stopColor="#c8a4e8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centre heart dot */}
      <span
        style={{
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 6px rgba(209,75,126,0.3))',
          animation: 'dividerPulse 2.5s ease-in-out infinite',
        }}
      >
        💗
      </span>

      {/* Second wave */}
      <svg
        width="140"
        height="16"
        viewBox="0 0 140 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ opacity: 0.35 }}
      >
        <path
          d="M0 8 Q17.5 2 35 8 Q52.5 14 70 8 Q87.5 2 105 8 Q122.5 14 140 8"
          stroke="#c8a4e8"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <style>{`
        @keyframes dividerPulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.18); opacity: 1;   }
        }
      `}</style>
    </motion.div>
  );
}
