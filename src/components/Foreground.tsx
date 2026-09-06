/**
 * Foreground — depth layer that sits above the scene content.
 *
 * Adds soft, partially-cropped decorative elements at the viewport edges
 * to create a sense of depth (like looking at a table with objects just
 * outside the frame). Elements are:
 *   - faint, blurred, low-opacity so they never compete with the scene
 *   - slightly out of focus (depth-of-field)
 *   - static or very slowly breathing
 *
 * The decor shifts subtly with the scene index so the table feels like
 * it evolves, but it never draws attention away from the center.
 */

import { motion } from 'framer-motion';
import { EASE } from '../lib/motion';

type Props = {
  sceneIdx: number;
};

export default function Foreground({ sceneIdx }: Props) {
  // Gradually intensify the foreground as the film progresses — the table
  // feels more "lived in" by the finale.
  const depth = Math.min(1, 0.3 + sceneIdx * 0.1);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
      style={{ opacity: depth }}
    >
      {/* Bottom-left — a soft out-of-focus ribbon curve */}
      <motion.div
        className="absolute -bottom-10 -left-12"
        animate={{ rotate: [-2, 1, -2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(6px)', opacity: 0.25 }}
      >
        <svg viewBox="0 0 200 80" width={200} height={80} aria-hidden>
          <path
            d="M0 40 Q 60 10 120 40 T 200 40"
            stroke="#d2b46a"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M0 40 Q 60 10 120 40 T 200 40"
            stroke="#e6cf94"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </motion.div>

      {/* Bottom-right — a soft bokeh light bloom */}
      <motion.div
        className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 220, 170, 0.5) 0%, rgba(251, 208, 179, 0.2) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Top-left — a faint dried-flower silhouette */}
      <motion.div
        className="absolute -top-6 -left-6"
        animate={{ rotate: [3, -2, 3] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(5px)', opacity: 0.18 }}
      >
        <svg viewBox="0 0 100 100" width={90} height={90} aria-hidden>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="50"
              cy="30"
              rx="5"
              ry="14"
              fill="#d2b46a"
              transform={`rotate(${angle} 50 50)`}
              opacity="0.6"
            />
          ))}
          <circle cx="50" cy="50" r="4" fill="#a98a3f" opacity="0.7" />
        </svg>
      </motion.div>

      {/* Top-right — a small star cluster, softly glowing */}
      <motion.div
        className="absolute right-4 top-8"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(1px)' }}
      >
        <svg viewBox="0 0 60 60" width={50} height={50} aria-hidden>
          <path
            d="M30 5 L33 25 L50 27 L36 38 L40 55 L30 45 L20 55 L24 38 L10 27 L27 25 Z"
            fill="#e6cf94"
            opacity="0.6"
          />
        </svg>
      </motion.div>

      {/* Very subtle warm light leak at the very top edge */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(251, 208, 179, 0.12) 0%, transparent 100%)',
        }}
      />

      {/* Very subtle warm light leak at the very bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            'linear-gradient(0deg, rgba(245, 184, 150, 0.1) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
