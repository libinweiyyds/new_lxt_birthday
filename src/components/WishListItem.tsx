/**
 * WishListItem — one line of the personal wish list.
 *
 * A small empty square checkbox, a handwritten line that reveals
 * character by character, and an optional category marker.
 * Final items get a star bullet instead of a square.
 */

import { motion } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';

type WishListItemProps = {
  text: string;
  index: number;
  isFinal?: boolean;
  /** Whether to show a small category icon on the right edge. */
  marker?: 'place' | 'learn' | 'food' | 'photo' | 'people' | 'self' | null;
  /** Delay (s) added on top of the index stagger. */
  extraDelay?: number;
};

const MARKER_GLYPH: Record<NonNullable<WishListItemProps['marker']>, string> = {
  place: '✶',
  learn: '✦',
  food: '✱',
  photo: '❀',
  people: '✻',
  self: '★',
};

const MARKER_COLOR: Record<NonNullable<WishListItemProps['marker']>, string> = {
  place: '#e88a73',
  learn: '#a98a3f',
  food: '#d2b46a',
  photo: '#bba4d0',
  people: '#c44444',
  self: '#c44444',
};

export default function WishListItem({
  text,
  index,
  isFinal = false,
  marker = null,
  extraDelay = 0,
}: WishListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: DUR.ritual,
        delay: 0.2 + index * 0.18 + extraDelay,
        ease: EASE.breathe,
      }}
      className="relative flex items-baseline gap-4 py-2 sm:gap-5 sm:py-3"
    >
      {/* Bullet / Checkbox */}
      {isFinal ? (
        <StarBullet color="#c44444" delay={0.6 + index * 0.18} />
      ) : (
        <EmptyCheckbox delay={0.4 + index * 0.18} />
      )}

      {/* Handwritten line — char-by-char reveal */}
      <p
        className={`flex-1 whitespace-pre-line ${
          isFinal
            ? 'font-hand text-[20px] font-normal italic text-cherry-400 sm:text-[24px]'
            : 'font-hand text-[18px] font-normal text-espresso-800 sm:text-[22px]'
        }`}
      >
        <CharReveal text={text} delay={0.4 + index * 0.18 + extraDelay} speed={0.035} />
      </p>

      {/* Optional category marker (right side) */}
      {marker && !isFinal && (
        <motion.span
          initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
          animate={{ opacity: 0.85, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.8,
            delay: 0.6 + index * 0.18,
            ease: EASE.breathe,
          }}
          className="font-hand text-[18px] sm:text-[20px]"
          style={{ color: MARKER_COLOR[marker] }}
        >
          {MARKER_GLYPH[marker]}
        </motion.span>
      )}
    </motion.div>
  );
}

/* ─── Empty checkbox (small square) ──────────────────────────── */

function EmptyCheckbox({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: EASE.breathe }}
      className="relative shrink-0"
    >
      <div
        className="h-4 w-4 sm:h-5 sm:w-5"
        style={{
          border: '1.4px solid rgba(58, 46, 42, 0.55)',
          borderRadius: 2,
          background: 'rgba(255, 251, 243, 0.6)',
          boxShadow: 'inset 0 0 0 2px rgba(255, 251, 243, 0.4)',
        }}
      />
    </motion.div>
  );
}

/* ─── Star bullet (for the final item) ──────────────────────── */

function StarBullet({ color = '#c44444', delay = 0 }: { color?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative shrink-0"
    >
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
        <path
          d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z"
          fill={color}
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Char-by-char reveal (handwriting effect) ───────────────── */

function CharReveal({
  text,
  delay = 0,
  speed = 0.04,
}: {
  text: string;
  delay?: number;
  speed?: number;
}) {
  const chars = Array.from(text);
  return (
    <span aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          transition={{
            duration: 0.5,
            delay: delay + i * speed,
            ease: EASE.snap,
          }}
          style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}
