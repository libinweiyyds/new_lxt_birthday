/**
 * BirthdayCake — premium 2-tier editorial birthday cake.
 *
 *   - bottom tier: 360x110, cream frosting with soft pink shadow
 *   - top tier:    220x80,  slightly smaller, with strawberry rosettes
 *   - gold rim band around the base of each tier
 *   - 3 strawberries with leaves
 *   - 5 candles on top, each with its own flicker
 *   - soft drop shadow on the plate
 *
 * The cake is fully SVG. Candles accept a `lit` boolean per index.
 */

import { motion } from 'framer-motion';
import { EASE } from '../lib/motion';

type Props = {
  /** Per-candle lit state. Array length should match candleCount. */
  lit: boolean[];
  /** Overall brightness multiplier on the warm glow under the cake. */
  glow?: number;
  /** Display size multiplier. */
  size?: number;
};

export default function BirthdayCake({ lit, glow = 1, size = 1 }: Props) {
  const w = 420, h = 380;
  const litCount = lit.filter(Boolean).length;
  const allLit = litCount === lit.length;
  const noneLit = litCount === 0;

  return (
    <div
      className="relative"
      style={{ width: w * size, height: h * size }}
    >
      {/* Warm glow under the cake — dim when blown out */}
      <motion.div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -10,
          width: w * size * 0.95,
          height: 36,
          background:
            'radial-gradient(ellipse, rgba(255, 200, 130, 0.55) 0%, rgba(255, 220, 180, 0.25) 40%, transparent 75%)',
          filter: 'blur(10px)',
          mixBlendMode: 'multiply',
        }}
        initial={false}
        animate={{ opacity: noneLit ? 0.15 : glow }}
        transition={{ duration: 1.6, ease: EASE.breathe }}
      />

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="relative h-full w-full"
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden
      >
        <defs>
          {/* Body gradients */}
          <linearGradient id="cake-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdfaf3" />
            <stop offset="50%" stopColor="#f5ead8" />
            <stop offset="100%" stopColor="#ecdcc0" />
          </linearGradient>
          <linearGradient id="cake-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="50%" stopColor="#fdf3df" />
            <stop offset="100%" stopColor="#f0e0c8" />
          </linearGradient>
          <linearGradient id="frosting-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="100%" stopColor="#fce4d3" />
          </linearGradient>
          <linearGradient id="gold-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d089" />
            <stop offset="50%" stopColor="#d2b46a" />
            <stop offset="100%" stopColor="#a98a3f" />
          </linearGradient>
          <linearGradient id="gold-band-thin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e6cf94" />
            <stop offset="100%" stopColor="#a98a3f" />
          </linearGradient>
          <radialGradient id="strawberry" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f5a3a3" />
            <stop offset="60%" stopColor="#e25b5b" />
            <stop offset="100%" stopColor="#9b2f2f" />
          </radialGradient>
          <radialGradient id="flame-grad" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#fff5c2" />
            <stop offset="50%" stopColor="#ffce7a" />
            <stop offset="100%" stopColor="#f08e57" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="candle-glow" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="rgba(255, 213, 138, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 213, 138, 0)" />
          </radialGradient>
          <filter id="cake-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0.14 0" />
          </filter>
        </defs>

        {/* ─── PLATE (soft shadow) ──────────────────────────── */}
        <ellipse cx="210" cy="358" rx="180" ry="8" fill="rgba(58, 46, 42, 0.15)" />
        <ellipse cx="210" cy="354" rx="170" ry="6" fill="#fffbf3" />
        <ellipse cx="210" cy="352" rx="160" ry="4" fill="rgba(232, 220, 192, 0.5)" />

        {/* ─── BOTTOM TIER ──────────────────────────────────── */}
        <g>
          {/* Body */}
          <rect x="40" y="240" width="340" height="110" fill="url(#cake-bottom)" />
          {/* Top frosting on the bottom tier */}
          <ellipse cx="210" cy="240" rx="170" ry="14" fill="url(#frosting-top)" />
          {/* Drip detail on top edge */}
          {Array.from({ length: 9 }).map((_, i) => (
            <ellipse
              key={i}
              cx={60 + i * 38}
              cy={248 + ((i % 2) * 5)}
              rx={9}
              ry={9 + (i % 2) * 6}
              fill="#fce4d3"
            />
          ))}
          {/* Gold rim band at the base */}
          <rect x="40" y="334" width="340" height="3" fill="url(#gold-band-thin)" opacity="0.7" />
          {/* Subtle paper grain */}
          <rect x="40" y="240" width="340" height="110" fill="rgba(0,0,0,0)" filter="url(#cake-grain)" opacity="0.5" />
          {/* Soft inner shadow on the top edge */}
          <rect x="40" y="240" width="340" height="14" fill="rgba(58, 46, 42, 0.1)" />
          {/* Bottom shadow */}
          <rect x="40" y="338" width="340" height="12" fill="rgba(58, 46, 42, 0.12)" />
          {/* Side highlight */}
          <rect x="46" y="252" width="2" height="86" fill="rgba(255, 255, 255, 0.4)" />
        </g>

        {/* ─── TOP TIER ─────────────────────────────────────── */}
        <g>
          <rect x="100" y="160" width="220" height="80" fill="url(#cake-top)" />
          {/* Top frosting */}
          <ellipse cx="210" cy="160" rx="110" ry="11" fill="url(#frosting-top)" />
          {/* Drip detail on the top tier */}
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse
              key={i}
              cx={118 + i * 32}
              cy={168 + ((i % 2) * 4)}
              rx={7}
              ry={7 + (i % 2) * 4}
              fill="#fce4d3"
            />
          ))}
          {/* Gold band at the base of the top tier */}
          <rect x="100" y="226" width="220" height="2.5" fill="url(#gold-band-thin)" opacity="0.8" />
          {/* Soft inner shadow on the top edge */}
          <rect x="100" y="160" width="220" height="10" fill="rgba(58, 46, 42, 0.1)" />
          {/* Bottom shadow */}
          <rect x="100" y="228" width="220" height="12" fill="rgba(58, 46, 42, 0.15)" />
          {/* Side highlight */}
          <rect x="105" y="172" width="2" height="60" fill="rgba(255, 255, 255, 0.4)" />
          {/* Paper grain */}
          <rect x="100" y="160" width="220" height="80" fill="rgba(0,0,0,0)" filter="url(#cake-grain)" opacity="0.5" />
        </g>

        {/* ─── STRAWBERRIES on top tier ─────────────────────── */}
        <Strawberry x={140} y={150} delay={0.0} />
        <Strawberry x={210} y={146} delay={0.2} />
        <Strawberry x={278} y={150} delay={0.4} />

        {/* ─── CANDLES on top ───────────────────────────────── */}
        {/* 5 candles evenly spaced across the top tier (x 100–320).
            Spacing 40, centered on the cake center x=210, so candle
            centers sit at 130, 170, 210, 250, 290 — all inside the
            top tier. y=124 so the candle body bottom rests on the
            cake's top edge (y=160) instead of floating above it. */}
        {lit.map((isLit, i) => (
          <Candle
            key={i}
            x={126 + (i * 40)}
            y={124}
            lit={isLit}
            index={i}
          />
        ))}

        {/* Gold ribbon around the base of the top tier — a small detail */}
        <path
          d="M 100 224 Q 210 230 320 224"
          stroke="url(#gold-band)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

/* ─── Strawberry ─────────────────────────────────────────────── */

function Strawberry({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, delay, ease: EASE.breathe }}
    >
      {/* Leaf calyx */}
      <path
        d={`M ${x - 7} ${y - 1} L ${x} ${y - 7} L ${x + 7} ${y - 1} L ${x} ${y + 1} Z`}
        fill="#7a9a4a"
        opacity="0.95"
      />
      <path
        d={`M ${x} ${y - 7} L ${x} ${y + 1}`}
        stroke="#3a2e2a"
        strokeWidth="0.4"
      />
      {/* Berry body */}
      <path
        d={`M ${x - 6} ${y + 0.5} Q ${x - 7} ${y + 8} ${x} ${y + 12} Q ${x + 7} ${y + 8} ${x + 6} ${y + 0.5} Z`}
        fill="url(#strawberry)"
      />
      {/* Tiny seed dots */}
      {[
        [-3, 4], [3, 4], [-2, 7], [2, 7], [0, 9],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={x + dx}
          cy={y + dy}
          r="0.5"
          fill="#f5d089"
        />
      ))}
      {/* Highlight */}
      <ellipse cx={x - 2} cy={y + 3} rx="1.5" ry="2.2" fill="rgba(255, 230, 230, 0.5)" />
    </motion.g>
  );
}

/* ─── Candle ─────────────────────────────────────────────────── */

function Candle({
  x,
  y,
  lit,
  index,
}: {
  x: number;
  y: number;
  lit: boolean;
  index: number;
}) {
  // Different flicker seeds per candle for organic look.
  const seed = index * 0.37;
  return (
    <g>
      {/* Candle glow halo (only when lit) */}
      {lit && (
        <circle
          cx={x + 4}
          cy={y + 6}
          r="22"
          fill="url(#candle-glow)"
          opacity="0.7"
        />
      )}

      {/* Wick */}
      <line
        x1={x + 4}
        y1={y + 14}
        x2={x + 4}
        y2={y + 18}
        stroke="#2a1f1c"
        strokeWidth="0.8"
      />

      {/* Flame */}
      {lit ? (
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE.breathe }}
          style={{ transformOrigin: `${x + 4}px ${y + 12}px`, transformBox: 'fill-box' }}
        >
          <motion.path
            d={`M ${x + 4} ${y - 2} C ${x + 1} ${y + 4} ${x + 1} ${y + 10} ${x + 4} ${y + 14} C ${x + 7} ${y + 10} ${x + 7} ${y + 4} ${x + 4} ${y - 2} Z`}
            fill="url(#flame-grad)"
            animate={{
              scaleY: [1, 1.08, 0.94, 1.05, 0.97, 1],
              scaleX: [1, 0.94, 1.05, 0.97, 1.03, 1],
              rotate: [-1, 1, -0.5, 1.4, -1, 0 + seed],
            }}
            transition={{
              duration: 1.8 + seed * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Inner core */}
          <motion.path
            d={`M ${x + 4} ${y + 4} C ${x + 2.5} ${y + 8} ${x + 2.5} ${y + 11} ${x + 4} ${y + 13} C ${x + 5.5} ${y + 11} ${x + 5.5} ${y + 8} ${x + 4} ${y + 4} Z`}
            fill="rgba(255, 255, 255, 0.85)"
            animate={{
              scaleY: [1, 1.1, 0.92, 1.04, 1],
              scaleX: [1, 0.92, 1.06, 0.94, 1.02],
            }}
            transition={{
              duration: 1.4 + seed * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.g>
      ) : (
        // Smoke wisp — visible only when the candle is blown out
        <CandleSmoke x={x + 4} y={y + 14} index={index} />
      )}

      {/* Candle body — slim ivory with thin gold rim */}
      <rect x={x} y={y + 16} width="8" height="20" rx="0.5" fill="#fdfaf3" />
      <rect x={x} y={y + 16} width="8" height="20" rx="0.5" fill="url(#candle-sheen)" />
      {/* Top wax drip */}
      <ellipse cx={x + 4} cy={y + 16} rx="4" ry="1" fill="#ecdcc0" />
      {/* Gold rim near the base */}
      <rect x={x} y={y + 32} width="8" height="1" fill="url(#gold-band-thin)" opacity="0.7" />
      {/* Subtle paper grain */}
      <rect x={x} y={y + 16} width="8" height="20" fill="rgba(0,0,0,0)" filter="url(#cake-grain)" opacity="0.3" />
    </g>
  );
}

function CandleSmoke({ x, y, index }: { x: number; y: number; index: number }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.4, 0] }}
      transition={{ duration: 3.6, delay: index * 0.12, ease: 'easeOut' }}
    >
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y - i * 4}
          r={2.5 - i * 0.5}
          fill="rgba(180, 175, 165, 0.55)"
          initial={{ cy: y, opacity: 0 }}
          animate={{
            cy: y - 24 - i * 8,
            opacity: [0, 0.5 - i * 0.12, 0],
            x: [x, x + (i % 2 === 0 ? 3 : -3), x + (i % 2 === 0 ? 5 : -5)],
          }}
          transition={{
            duration: 3.6,
            delay: index * 0.12 + i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.g>
  );
}
