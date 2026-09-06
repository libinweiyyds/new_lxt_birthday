/**
 * MemoryObjects — persistent decorative objects that accumulate across scenes.
 *
 * The "birthday memory table" concept: as the user progresses through the
 * film, small physical keepsakes from earlier scenes linger in the corners
 * of the viewport. They are small, softly out of focus, and breathe with
 * subtle asynchronous motion. They never distract from the current scene.
 *
 * Objects appear based on the current scene index:
 *   - candle      : after opening (scene 01)
 *   - polaroid    : after memories (scene 03)
 *   - gift box    : after interactive (scene 06)
 *   - cake        : after cake (scene 07)
 *
 * Each object is rendered in a fixed corner with its own slow sway / flicker
 * so the table feels alive and personal.
 */

import { motion } from 'framer-motion';
import { EASE } from '../lib/motion';

type Props = {
  /** Current film scene index (0-based). Objects appear once this passes their trigger. */
  sceneIdx: number;
};

/**
 * Scene index thresholds at which each memory object appears.
 * Objects linger from scenes already visited, so the threshold is the
 * index AFTER the object's source scene (the gift box lives in scene 0,
 * so its memory appears at index 1, etc.).
 *
 *   FILM_SCENES order: interactive, reveal, memories, blessings,
 *                       wishList, cake, finale, birthdayCard
 */
const THRESHOLDS = {
  candle: 0, // carried over from the opening — present throughout the film
  polaroid: 2, // after the memories scrapbook scene (index 1)
  cake: 5, // after the cake scene (index 4) — lingers into the finale
} as const;

export default function MemoryObjects({ sceneIdx }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden">
      {sceneIdx >= THRESHOLDS.candle && <MemoryCandle />}
      {sceneIdx >= THRESHOLDS.polaroid && <MemoryPolaroid />}
      {sceneIdx >= THRESHOLDS.cake && <MemoryCake />}
    </div>
  );
}

/* ─── Memory Candle — tiny, bottom-left corner ─────────────────── */

function MemoryCandle() {
  return (
    <motion.div
      className="absolute bottom-[6%] left-[5%] sm:bottom-[8%] sm:left-[6%]"
      initial={{ opacity: 0, y: 20, scale: 0.8, rotate: -8 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
      transition={{ duration: 2.4, ease: EASE.breathe }}
      style={{ filter: 'blur(0.3px)' }}
    >
      {/* Warm glow halo */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/3 rounded-full"
        animate={{
          opacity: [0.35, 0.6, 0.35],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 213, 138, 0.5) 0%, rgba(245, 184, 150, 0.18) 45%, transparent 75%)',
          filter: 'blur(8px)',
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Flame */}
        <motion.div
          animate={{
            scaleY: [1, 1.08, 0.94, 1.05, 0.97, 1],
            scaleX: [1, 0.95, 1.04, 0.97, 1.02, 1],
            rotate: [-1, 1, -0.5, 1.2, -0.8, 0],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <svg viewBox="0 0 24 36" width={16} height={24} style={{ overflow: 'visible' }} aria-hidden>
            <defs>
              <radialGradient id="mem-flame-outer" cx="50%" cy="78%" r="65%">
                <stop offset="0%" stopColor="#fff3c8" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#ffce7a" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#e8895a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mem-flame-core" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#ffe6a8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffb86b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M12 4 C9 10 8 18 10 26 C11 30 11.5 33 12 34 C12.5 33 13 30 14 26 C16 18 15 10 12 4 Z"
              fill="url(#mem-flame-outer)"
            />
            <path
              d="M12 12 C10.5 16 10 22 11 26 C11.5 28 12 30 12 31 C12 30 12.5 28 13 26 C14 22 13.5 16 12 12 Z"
              fill="url(#mem-flame-core)"
            />
          </svg>
        </motion.div>

        {/* Wick */}
        <div className="h-1.5 w-px" style={{ backgroundColor: '#3a2e2a' }} />

        {/* Candle body — ivory with gold rim */}
        <div className="relative">
          <div
            className="h-10 w-1.5"
            style={{
              background: 'linear-gradient(180deg, #fdfaf3 0%, #f5ead8 100%)',
              boxShadow:
                'inset -1px 0 1px rgba(196, 68, 68, 0.1), inset 1px 0 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(58, 46, 42, 0.15)',
            }}
          />
          {/* Top wax */}
          <div
            className="absolute -top-0.5 left-1/2 h-1 w-2.5 -translate-x-1/2 rounded-full"
            style={{ background: '#ecdcc0' }}
          />
          {/* Gold rim */}
          <div
            className="absolute bottom-0.5 left-0 h-px w-full"
            style={{ background: 'rgba(210, 180, 106, 0.6)' }}
          />
        </div>

        {/* Base shadow */}
        <div
          className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(58, 46, 42, 0.18) 0%, transparent 70%)',
            filter: 'blur(1.5px)',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Memory Polaroid — small, top-right corner ────────────────── */

function MemoryPolaroid() {
  return (
    <motion.div
      className="absolute right-[5%] top-[10%] sm:right-[6%] sm:top-[12%]"
      initial={{ opacity: 0, y: -16, scale: 0.85, rotate: 12 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 6 }}
      transition={{ duration: 2.6, ease: EASE.breathe }}
      style={{ filter: 'blur(0.4px)' }}
    >
      {/* Washi tape */}
      <div
        className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2"
        style={{
          background: 'rgba(247, 197, 184, 0.6)',
          borderLeft: '1px dashed rgba(255,255,255,0.4)',
          borderRight: '1px dashed rgba(255,255,255,0.4)',
          boxShadow: '0 1px 4px rgba(58, 46, 42, 0.08)',
          transform: 'rotate(-4deg)',
        }}
      />

      {/* Polaroid card */}
      <div
        className="relative px-1.5 pb-3 pt-1.5"
        style={{
          width: 72,
          background: 'linear-gradient(180deg, #fdfaf3 0%, #f5ead8 100%)',
          boxShadow:
            '0 1px 1px rgba(58, 46, 42, 0.05), 0 4px 12px rgba(58, 46, 42, 0.12), 0 12px 28px -8px rgba(58, 46, 42, 0.18)',
          border: '1px solid rgba(196, 168, 120, 0.2)',
        }}
      >
        {/* Photo */}
        <div
          className="h-12 w-full"
          style={{
            background:
              'linear-gradient(135deg, #fbd0b3 0%, #f5b896 40%, #d8c8e5 100%)',
          }}
        />
        {/* Caption */}
        <p
          className="mt-1.5 text-center font-hand text-[8px] italic leading-none text-espresso-700/70"
          style={{ fontFamily: '"Ma Shan Zheng", cursive' }}
        >
          那天
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Memory Gift Box — tiny, bottom-right corner ──────────────── */

function MemoryGiftBox() {
  return (
    <motion.div
      className="absolute bottom-[7%] right-[6%] sm:bottom-[9%] sm:right-[7%]"
      initial={{ opacity: 0, y: 18, scale: 0.8, rotate: 6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 3 }}
      transition={{ duration: 2.6, ease: EASE.breathe }}
      style={{ filter: 'blur(0.3px)' }}
    >
      {/* Warm glow from inside */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 220, 160, 0.45) 0%, transparent 70%)',
          filter: 'blur(10px)',
          transform: 'scale(1.8)',
        }}
      />

      <div className="relative" style={{ width: 48, height: 48 }}>
        {/* Box body */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '60%',
            background: 'linear-gradient(180deg, #fdfaf3 0%, #ecdcc0 100%)',
            boxShadow:
              'inset -1px 0 1px rgba(120, 90, 40, 0.2), 0 2px 6px rgba(58, 46, 42, 0.18)',
          }}
        />
        {/* Lid */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '22%',
            background: 'linear-gradient(180deg, #fffaf0 0%, #f5ead8 100%)',
            boxShadow: '0 1px 2px rgba(58, 46, 42, 0.15)',
          }}
        />
        {/* Vertical ribbon */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 4,
            background: 'linear-gradient(180deg, #ecd28a 0%, #d2b46a 50%, #a98a3f 100%)',
          }}
        />
        {/* Horizontal ribbon */}
        <div
          className="absolute left-0 right-0 top-[45%]"
          style={{
            height: 4,
            background: 'linear-gradient(90deg, #ecd28a 0%, #d2b46a 50%, #a98a3f 100%)',
          }}
        />
        {/* Tiny bow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 12, height: 8 }}
        >
          <svg viewBox="0 0 40 24" width={12} height={8} aria-hidden>
            <path
              d="M20 12 C12 2 2 6 6 14 C9 18 16 16 20 12 Z"
              fill="url(#mem-bow-grad)"
            />
            <path
              d="M20 12 C28 2 38 6 34 14 C31 18 24 16 20 12 Z"
              fill="url(#mem-bow-grad)"
            />
            <ellipse cx="20" cy="12" rx="3" ry="4" fill="url(#mem-bow-grad)" />
            <defs>
              <linearGradient id="mem-bow-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ecd28a" />
                <stop offset="100%" stopColor="#a98a3f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Memory Cake — small, top-left corner ─────────────────────── */

function MemoryCake() {
  return (
    <motion.div
      className="absolute left-[6%] top-[12%] sm:left-[7%] sm:top-[14%]"
      initial={{ opacity: 0, y: -14, scale: 0.85, rotate: -6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
      transition={{ duration: 2.6, ease: EASE.breathe }}
      style={{ filter: 'blur(0.4px)' }}
    >
      {/* Warm glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 213, 138, 0.45) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      <svg viewBox="0 0 64 72" width={52} height={58} style={{ overflow: 'visible' }} aria-hidden>
        {/* Plate */}
        <ellipse cx="32" cy="66" rx="26" ry="3" fill="rgba(58, 46, 42, 0.15)" />
        <ellipse cx="32" cy="65" rx="25" ry="2.5" fill="#fffbf3" />

        {/* Cake body */}
        <rect x="10" y="38" width="44" height="26" rx="1.5" fill="url(#mem-cake-body)" />
        {/* Frosting top */}
        <ellipse cx="32" cy="38" rx="22" ry="4" fill="#fce4dc" />
        {/* Drip */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={i}
            cx={16 + i * 9}
            cy={41 + (i % 2) * 2}
            rx={3}
            ry={3 + (i % 2) * 1.5}
            fill="#fce4dc"
          />
        ))}

        {/* Candle */}
        <rect x="30" y="24" width="4" height="14" fill="#fdfaf3" />
        <rect x="30" y="36" width="4" height="1" fill="rgba(210, 180, 106, 0.6)" />
        <line x1="32" y1="22" x2="32" y2="24" stroke="#2a1f1c" strokeWidth="0.6" />

        {/* Flame */}
        <motion.ellipse
          cx="32"
          cy="18"
          rx="3"
          ry="6"
          fill="url(#mem-cake-flame)"
          animate={{
            scaleY: [1, 1.1, 0.93, 1.05, 1],
            scaleX: [1, 0.95, 1.04, 0.97, 1],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 22px', transformBox: 'fill-box' }}
        />

        <defs>
          <linearGradient id="mem-cake-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdfaf3" />
            <stop offset="100%" stopColor="#ecdcc0" />
          </linearGradient>
          <radialGradient id="mem-cake-flame" cx="50%" cy="75%" r="60%">
            <stop offset="0%" stopColor="#fff5c2" />
            <stop offset="50%" stopColor="#ffd07a" />
            <stop offset="100%" stopColor="#f08e57" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
