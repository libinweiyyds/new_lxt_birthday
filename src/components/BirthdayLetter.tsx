/**
 * BirthdayLetter — premium, editorial envelope + letter + dried flower.
 *
 * Renders three subcomponents:
 *   - EnvelopeSVG       : a real-feeling 3D envelope with wax seal
 *   - DriedFlower       : a small golden dried-flower SVG
 *   - LetterCard        : a paper card that rises from the envelope
 *
 * The "opened" state is owned by the parent (SceneReveal) so the background
 * glow can brighten in sync.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';

/* ─── Envelope SVG ───────────────────────────────────────────── */

function EnvelopeSVG({ open, size = 1 }: { open: boolean; size?: number }) {
  const w = 320, h = 220;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfaf3" />
          <stop offset="55%" stopColor="#f5ead8" />
          <stop offset="100%" stopColor="#ecdcc0" />
        </linearGradient>
        <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde4d3" />
          <stop offset="100%" stopColor="#f5b896" />
        </linearGradient>
        <linearGradient id="env-flap-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbd0b3" />
          <stop offset="100%" stopColor="#e88a73" />
        </linearGradient>
        <linearGradient id="env-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(58,46,42,0.18)" />
          <stop offset="100%" stopColor="rgba(58,46,42,0)" />
        </linearGradient>
        <radialGradient id="wax-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f6d089" />
          <stop offset="60%" stopColor="#d2b46a" />
          <stop offset="100%" stopColor="#a98a3f" />
        </radialGradient>
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0.18 0" />
        </filter>
      </defs>

      {/* Envelope body */}
      <g>
        <rect
          x="20"
          y="60"
          width="280"
          height="140"
          rx="3"
          fill="url(#env-body)"
          stroke="rgba(196, 168, 120, 0.35)"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="60"
          width="280"
          height="140"
          rx="3"
          fill="rgba(0,0,0,0)"
          filter="url(#paper-grain)"
          opacity="0.6"
        />
        {/* Side fold lines */}
        <line
          x1="20"
          y1="60"
          x2="160"
          y2="200"
          stroke="rgba(196, 168, 120, 0.25)"
          strokeWidth="0.5"
        />
        <line
          x1="300"
          y1="60"
          x2="160"
          y2="200"
          stroke="rgba(196, 168, 120, 0.25)"
          strokeWidth="0.5"
        />
      </g>

      {/* Flap — 3D rotateX 180 when opened */}
      <motion.g
        initial={false}
        animate={{ rotateX: open ? 180 : 0 }}
        transition={{ duration: 1.4, ease: [0.83, 0, 0.17, 1] }}
        style={{
          transformOrigin: '160px 60px',
          transformBox: 'fill-box',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer (visible when closed) */}
        <path
          d="M 20 60 L 160 160 L 300 60 Z"
          fill="url(#env-flap)"
          stroke="rgba(196, 168, 120, 0.35)"
          strokeWidth="0.5"
        />
      </motion.g>

      {/* Inner flap surface (visible when open, rendered separately so it
          appears "behind" the front body) */}
      <AnimatePresence>
        {open && (
          <motion.path
            key="inner"
            d="M 20 60 L 160 160 L 300 60 Z"
            fill="url(#env-flap-inner)"
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: '160px 60px', transformBox: 'fill-box' }}
          />
        )}
      </AnimatePresence>

      {/* Wax seal — sits on top of the closed flap, fades out as flap opens */}
      <AnimatePresence>
        {!open && (
          <motion.g
            key="seal"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.4 } }}
          >
            <circle cx="160" cy="125" r="18" fill="url(#wax-grad)" />
            <circle
              cx="160"
              cy="125"
              r="18"
              fill="rgba(0,0,0,0)"
              stroke="rgba(120, 90, 40, 0.4)"
              strokeWidth="0.6"
            />
            <text
              x="160"
              y="131"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="18"
              fontStyle="italic"
              fontWeight="500"
              fill="#fdfaf3"
            >
              L
            </text>
            <circle cx="153" cy="118" r="3" fill="rgba(255, 240, 200, 0.5)" />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ─── Dried Flower ───────────────────────────────────────────── */

function DriedFlower({ size = 1 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={80 * size}
      height={80 * size}
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden
    >
      <defs>
        <radialGradient id="petal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e6cf94" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#d2b46a" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <path
        d="M 40 78 Q 38 60 40 40"
        stroke="#7a5a3a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 40 55 Q 30 50 28 58 Q 32 60 40 55"
        fill="#9a7a4a"
        opacity="0.6"
      />
      <path
        d="M 40 48 Q 50 44 52 52 Q 48 54 40 48"
        fill="#9a7a4a"
        opacity="0.6"
      />
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * 360;
        return (
          <g key={i} transform={`rotate(${angle} 40 40)`}>
            <ellipse cx="40" cy="22" rx="4" ry="12" fill="url(#petal)" />
          </g>
        );
      })}
      <circle cx="40" cy="40" r="3.5" fill="#a98a3f" />
      <circle cx="40" cy="40" r="2" fill="#7a5a3a" />
    </svg>
  );
}

/* ─── Letter Card ─────────────────────────────────────────────── */

function LetterCard({
  visible,
  lines,
}: {
  visible: boolean;
  lines: string[];
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -90, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.83, 0, 0.17, 1] }}
          className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2"
          style={{ width: 320, zIndex: 5 }}
        >
          <div
            className="relative px-10 py-10"
            style={{
              background: 'linear-gradient(180deg, #fdfaf3 0%, #faf3e8 100%)',
              boxShadow:
                '0 4px 12px rgba(58, 46, 42, 0.12), 0 24px 48px -16px rgba(58, 46, 42, 0.18)',
              border: '1px solid rgba(196, 168, 120, 0.25)',
            }}
          >
            {/* Subtle paper grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>\")",
                mixBlendMode: 'multiply',
              }}
            />

            <div className="relative space-y-3 sm:space-y-4">
              {lines.map((line, i) => (
                <LetterLine key={i} line={line} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LetterLine({ line, index }: { line: string; index: number }) {
  const isGreeting = index === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      transition={{
        duration: 1.6,
        delay: 0.4 + index * 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="overflow-hidden"
    >
      <p
        className={
          isGreeting
            ? 'font-hand text-[20px] italic text-cherry-400 sm:text-[22px]'
            : 'font-hand-zh text-[15px] font-light leading-[1.95] text-espresso-800 sm:text-[16px]'
        }
      >
        {line}
      </p>
    </motion.div>
  );
}

/* ─── Composite ──────────────────────────────────────────────── */

export type BirthdayLetterProps = {
  to: string;
  lines: string[];
  opened: boolean;
  onOpen: () => void;
};

export default function BirthdayLetter({ to, lines, opened, onOpen }: BirthdayLetterProps) {
  return (
    <div
      className="relative flex w-full flex-col items-center"
      style={{ minHeight: 480 }}
    >
      {/* Editorial caption — "A small letter" */}
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
        transition={{ duration: DUR.ritual, ease: EASE.breathe }}
        className="mb-12 text-center"
      >
        <span className="text-[10px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[11px]">
          A small letter
        </span>
      </motion.div>

      {/* Composition: envelope + dried flower */}
      <div
        className="relative cursor-pointer"
        onClick={onOpen}
        style={{ width: 380, height: 280 }}
      >
        {/* Dried flower — sits to the right of the envelope */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.85, rotate: -8 }}
          animate={{
            opacity: opened ? 0.6 : 0.85,
            y: 0,
            scale: 1,
            rotate: -8,
          }}
          transition={{ duration: DUR.ritual, delay: 0.4, ease: EASE.breathe }}
          className="absolute"
          style={{ right: -10, top: 50, zIndex: 1 }}
        >
          <DriedFlower size={0.85} />
        </motion.div>

        {/* "To [name]" handwritten label — above the envelope (fades when opened) */}
        <motion.div
          initial={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
          animate={{ opacity: opened ? 0 : 1, y: 0, filter: 'blur(0)' }}
          transition={{ duration: DUR.ritual, ease: EASE.breathe }}
          className="absolute left-1/2 -top-10 -translate-x-1/2"
        >
          <p className="font-hand text-[18px] italic text-espresso-700/75 sm:text-[20px]">
            To · {to}
          </p>
        </motion.div>

        {/* Envelope — drop-shadow deepens as the flap opens */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          transition={{ duration: DUR.ritual + 0.4, ease: [0.83, 0, 0.17, 1] }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 4 }}
        >
          <motion.div
            animate={{
              filter: opened
                ? 'drop-shadow(0 20px 32px rgba(58, 46, 42, 0.22))'
                : 'drop-shadow(0 12px 22px rgba(58, 46, 42, 0.18))',
            }}
            transition={{ duration: 1.4, ease: [0.83, 0, 0.17, 1] }}
          >
            <EnvelopeSVG open={opened} size={1} />
          </motion.div>
        </motion.div>

        {/* Letter card — rises out of the envelope after the flap opens */}
        <LetterCard visible={opened} lines={lines} />
      </div>

      {/* Tap cue (only when closed) */}
      {!opened && (
        <motion.span
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-2 text-[10px] font-light uppercase tracking-cinematic text-espresso-700/45 sm:text-[11px]"
        >
          轻触打开
        </motion.span>
      )}
    </div>
  );
}
