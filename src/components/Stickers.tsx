/**
 * Editorial stickers — premium, restrained. No cartoon packs.
 * Used in the playful desk scene.
 */

import { motion } from 'framer-motion';

/* ─── Tiny stamps (round, like a postmark or seal) ────────────── */

export function Stamp({ text, rotate = 0, color = '#c44444' }: { text: string; rotate?: number; color?: string }) {
  return (
    <div
      className="inline-flex items-center justify-center"
      style={{
        transform: `rotate(${rotate}deg)`,
        border: `1.5px solid ${color}`,
        borderRadius: 999,
        padding: '2px 10px',
        color,
        opacity: 0.8,
      }}
    >
      <span className="text-[9px] font-light uppercase tracking-cinematic sm:text-[10px]">
        {text}
      </span>
    </div>
  );
}

/* ─── Postage-style circle stamp ────────────────────────────── */

export function CircleStamp({
  text,
  rotate = 0,
  color = '#c44444',
}: {
  text: string;
  rotate?: number;
  color?: string;
}) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: 56,
        height: 56,
        transform: `rotate(${rotate}deg)`,
        border: `1.4px solid ${color}`,
        borderRadius: '50%',
        opacity: 0.75,
      }}
    >
      <span
        className="font-hand text-[10px] font-light uppercase tracking-cinematic sm:text-[11px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─── "Hand" pointing finger (vector, not emoji) ─────────────── */

export function PointFinger({ rotate = 0, color = '#3a2e2a' }: { rotate?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 40 60"
      width={32}
      height={48}
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}
      aria-hidden
    >
      {/* Sleeve */}
      <path
        d="M 8 60 L 32 60 L 30 50 L 10 50 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Hand palm */}
      <path
        d="M 12 50 Q 8 38 14 30 L 14 18 Q 14 14 18 14 Q 22 14 22 18 L 22 28 L 24 26 Q 28 24 30 28 L 28 32 L 30 30 Q 34 30 32 36 L 28 42 Q 28 50 24 50 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Index finger highlight */}
      <line
        x1="18"
        y1="16"
        x2="18"
        y2="28"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/* ─── Small tag / label (like a price tag) ──────────────────── */

export function Tag({ text, color = '#a98a3f' }: { text: string; color?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
      style={{ borderColor: `${color}66`, color }}
    >
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      <span className="text-[9px] font-light uppercase tracking-cinematic sm:text-[10px]">
        {text}
      </span>
    </div>
  );
}

/* ─── Hand-written X (as a "do not want" mark) ───────────────── */

export function CrossMark({ size = 18, color = '#c44444' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M 4 4 L 20 20 M 20 4 L 4 20"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── Smile / smirk line ────────────────────────────────────── */

export function SmirkLine({ width = 30, color = '#3a2e2a' }: { width?: number; color?: string }) {
  return (
    <svg viewBox="0 0 60 20" width={width} height={width / 3} aria-hidden>
      <path
        d="M 4 4 Q 30 22 56 4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── A "do not enter" hand (palm forward) ──────────────────── */

export function StopHand({ rotate = 0, color = '#3a2e2a' }: { rotate?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 40 50"
      width={30}
      height={38}
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}
      aria-hidden
    >
      <path
        d="M 6 50 L 34 50 L 32 36 L 30 18 L 28 8 Q 28 4 32 4 Q 36 4 36 8 L 36 22 L 38 22 L 36 18 Q 36 14 39 14 Q 42 14 42 18 L 41 24 L 42 22 Q 42 18 45 18 Q 48 18 47 22 L 45 28 Q 47 28 47 30 Q 47 32 45 32 L 42 34 Q 38 38 32 38 L 8 38 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

/* ─── Doodle that pops in ─────────────────────────────────── */

export function AnimatedStamp({
  text,
  rotate = 0,
  color = '#c44444',
  delay = 0,
}: {
  text: string;
  rotate?: number;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 2, rotate: rotate - 20 }}
      whileInView={{ opacity: 0.85, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Stamp text={text} rotate={0} color={color} />
    </motion.div>
  );
}
