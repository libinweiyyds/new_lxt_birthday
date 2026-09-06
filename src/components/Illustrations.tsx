/**
 * SVG illustration primitives — birthday iconography in a soft,
 * editorial style. No emoji, no clip-art. Hand-tuned paths only.
 */

import { motion } from 'framer-motion';

/* ─── Candle with flame ──────────────────────────────────────── */

export function Candle({
  flame = true,
  size = 1,
  className = '',
}: {
  flame?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 80"
      width={40 * size}
      height={80 * size}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {/* Wick */}
      <line x1="20" y1="32" x2="20" y2="38" stroke="#2a1f1c" strokeWidth="1" strokeLinecap="round" />
      {/* Flame */}
      {flame && (
        <motion.g
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scaleY: [1, 1.1, 0.95, 1.05, 1],
            scaleX: [1, 0.94, 1.04, 0.97, 1],
            opacity: [1, 0.92, 1, 0.95, 1],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '20px 30px', transformBox: 'fill-box' }}
        >
          <path
            d="M20 8 C17 14 16 22 20 30 C24 22 23 14 20 8 Z"
            fill="url(#flame-grad)"
          />
          <path
            d="M20 14 C18.5 18 18 24 20 28 C22 24 21.5 18 20 14 Z"
            fill="rgba(255,255,220,0.7)"
          />
        </motion.g>
      )}
      {/* Candle body */}
      <rect x="15" y="36" width="10" height="36" rx="1" fill="#fce4dc" />
      <rect x="15" y="36" width="10" height="36" rx="1" fill="url(#candle-sheen)" />
      {/* Candle top drip */}
      <ellipse cx="20" cy="36" rx="5" ry="1.4" fill="#eea193" />
      <defs>
        <radialGradient id="flame-grad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff5c2" />
          <stop offset="40%" stopColor="#ffd07a" />
          <stop offset="100%" stopColor="#f08e57" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id="candle-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(196,68,68,0.18)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Cake (single tier) ──────────────────────────────────────── */

export function Cake({
  size = 1,
  className = '',
  withCandles = 0,
  candleFlicker = true,
}: {
  size?: number;
  className?: string;
  withCandles?: number;
  candleFlicker?: boolean;
}) {
  const w = 200, h = 140;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {/* Plate */}
      <ellipse cx="100" cy="130" rx="80" ry="6" fill="rgba(58,46,42,0.1)" />
      <ellipse cx="100" cy="128" rx="78" ry="5" fill="#fffbf3" />
      {/* Cake body — cream with subtle gradient */}
      <rect x="30" y="60" width="140" height="64" rx="3" fill="#fdfaf3" />
      <rect x="30" y="60" width="140" height="64" rx="3" fill="url(#cake-body-grad)" />
      {/* Cake top frosting */}
      <ellipse cx="100" cy="60" rx="70" ry="8" fill="#fce4dc" />
      <ellipse cx="100" cy="58" rx="70" ry="6" fill="url(#frosting-grad)" />
      {/* Drip detail */}
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse
          key={i}
          cx={45 + i * 22}
          cy={66 + ((i % 2) * 4)}
          rx={5}
          ry={5 + (i % 2) * 3}
          fill="#fce4dc"
        />
      ))}
      {/* Cream rosettes on top */}
      {[50, 80, 110, 140].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="56" r="3.5" fill="#f5b896" />
          <circle cx={x} cy="56" r="2" fill="#eea193" />
        </g>
      ))}
      {/* Cherries */}
      <circle cx="100" cy="50" r="4" fill="#c44444" />
      <path d="M100 46 Q 102 42 105 42" stroke="#5a3a2a" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Candles */}
      {withCandles > 0 &&
        Array.from({ length: withCandles }).map((_, i) => {
          const x = 50 + (i * 100) / Math.max(1, withCandles - 1);
          return (
            <g key={i} transform={`translate(${x - 6}, 18)`}>
              <line x1="6" y1="14" x2="6" y2="18" stroke="#2a1f1c" strokeWidth="0.8" />
              {candleFlicker && (
                <motion.path
                  d="M6 2 C4 6 4 11 6 14 C8 11 8 6 6 2 Z"
                  fill="url(#candle-flame)"
                  initial={{ scale: 1 }}
                  animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1], scaleX: [1, 0.94, 1.04, 0.97, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '6px 12px', transformBox: 'fill-box' }}
                />
              )}
              <rect x="4" y="16" width="4" height="18" rx="0.5" fill={i % 2 === 0 ? '#fce4dc' : '#fbd0b3'} />
            </g>
          );
        })}

      <defs>
        <linearGradient id="cake-body-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(196,150,110,0.15)" />
        </linearGradient>
        <linearGradient id="frosting-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(247,197,184,0.4)" />
        </linearGradient>
        <radialGradient id="candle-flame" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff5c2" />
          <stop offset="50%" stopColor="#ffd07a" />
          <stop offset="100%" stopColor="#f08e57" stopOpacity="0.6" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Envelope ──────────────────────────────────────────────── */

export function Envelope({
  to = '',
  open = false,
  size = 1,
  className = '',
}: {
  to?: string;
  open?: boolean;
  size?: number;
  className?: string;
}) {
  const w = 200, h = 140;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {/* Card inside (revealed when open) */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: open ? -40 : 0 }}
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
      >
        <rect x="35" y="20" width="130" height="90" rx="2" fill="#fffbf3" />
        <rect x="35" y="20" width="130" height="90" rx="2" fill="url(#card-grad)" />
        {/* Card content lines */}
        {open && (
          <>
            <line x1="55" y1="48" x2="145" y2="48" stroke="#e88a73" strokeWidth="0.8" opacity="0.4" />
            <line x1="55" y1="62" x2="130" y2="62" stroke="#e88a73" strokeWidth="0.8" opacity="0.4" />
            <line x1="55" y1="76" x2="120" y2="76" stroke="#e88a73" strokeWidth="0.8" opacity="0.4" />
            <text x="100" y="98" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="14" fill="#c44444">
              ♡
            </text>
          </>
        )}
      </motion.g>
      {/* Envelope back */}
      <rect x="20" y="50" width="160" height="80" rx="2" fill="#fde4d3" />
      <rect x="20" y="50" width="160" height="80" rx="2" fill="url(#env-grad)" />
      {/* Envelope flap */}
      <motion.g
        initial={{ rotateX: 0 }}
        animate={{ rotateX: open ? 180 : 0 }}
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
        style={{ transformOrigin: '100px 50px', transformBox: 'fill-box' }}
      >
        <path d="M20 50 L100 110 L180 50 Z" fill="#fbd0b3" />
        <path d="M20 50 L100 110 L180 50 Z" fill="url(#flap-grad)" />
      </motion.g>
      {/* Wax seal */}
      <circle cx="100" cy="78" r="10" fill="#c44444" />
      <circle cx="100" cy="78" r="10" fill="url(#seal-grad)" />
      <text x="100" y="82" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontStyle="italic" fill="#fffbf3">
        L
      </text>
      {/* "To" label */}
      {to && (
        <text x="100" y="38" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="14" fill="#3a2e2a" opacity="0.65">
          To · {to}
        </text>
      )}
      <defs>
        <linearGradient id="card-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(232,138,115,0.08)" />
        </linearGradient>
        <linearGradient id="env-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(196,68,68,0.06)" />
        </linearGradient>
        <linearGradient id="flap-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(196,68,68,0.1)" />
        </linearGradient>
        <radialGradient id="seal-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(120,30,30,0.5)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Sparkle / Star ────────────────────────────────────────── */

export function Sparkle({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ─── Balloon ──────────────────────────────────────────────── */

export function Balloon({
  color = '#f7c5b8',
  size = 1,
  className = '',
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 60 100" width={60 * size} height={100 * size} className={className} style={{ overflow: 'visible' }} aria-hidden>
      <ellipse cx="30" cy="35" rx="22" ry="28" fill={color} />
      <ellipse cx="24" cy="28" rx="6" ry="9" fill="rgba(255,255,255,0.4)" />
      <path d="M30 63 L26 68 L30 66 L34 68 Z" fill={color} />
      <motion.path
        d="M30 68 Q 32 78 28 90"
        stroke="rgba(58,46,42,0.3)"
        strokeWidth="0.8"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
    </svg>
  );
}

/* ─── Ribbon ───────────────────────────────────────────────── */

export function Ribbon({ size = 1, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 30" width={100 * size} height={30 * size} className={className} aria-hidden>
      <path
        d="M0 15 Q 25 0 50 15 T 100 15"
        stroke="#c44444"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Hand-drawn flower ────────────────────────────────────── */

export function FlowerDoodle({
  size = 20,
  color = '#e88a73',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <circle cx="12" cy="6" r="3" fill={color} opacity="0.7" />
      <circle cx="6" cy="12" r="3" fill={color} opacity="0.7" />
      <circle cx="18" cy="12" r="3" fill={color} opacity="0.7" />
      <circle cx="12" cy="18" r="3" fill={color} opacity="0.7" />
      <circle cx="12" cy="12" r="2" fill="#d2b46a" />
    </svg>
  );
}

/* ─── Hand-drawn star (5-point) ────────────────────────────── */

export function StarDoodle({ size = 22, color = '#d2b46a', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z"
        fill={color}
        opacity="0.85"
        stroke={color}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Hand-drawn heart (single) ────────────────────────────── */

export function HeartDoodle({ size = 20, color = '#c44444', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 21 C 6 16 2 12 2 8 C 2 5 4 3 7 3 C 9 3 11 4 12 6 C 13 4 15 3 17 3 C 20 3 22 5 22 8 C 22 12 18 16 12 21 Z"
        fill={color}
        opacity="0.7"
      />
    </svg>
  );
}

/* ─── Confetti piece (paper) ───────────────────────────────── */

export function ConfettiPiece({
  color = '#e88a73',
  size = 10,
  rotation = 0,
}: {
  color?: string;
  size?: number;
  rotation?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size * 0.4,
        background: color,
        transform: `rotate(${rotation}deg)`,
        borderRadius: 1,
      }}
    />
  );
}
