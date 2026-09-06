/**
 * GiftBox — premium 3D-feeling gift box, matte ivory paper,
 * champagne satin ribbon with cross top + dimensional bow.
 *
 * Three animated states:
 *   idle   : box closed, ribbon tied, bow on top, gentle sway
 *   loose  : bow knot opens, ribbon slides off and falls away
 *   open   : lid lifts at 3D angle with anticipation + bounce,
 *            golden glow inside, contents visible, shimmer rising
 *
 * Material language improvements:
 *   - Drop shadow on the floor (offset + blur + contact)
 *   - Lid overhangs the body (visual separation)
 *   - Ribbon has thickness (edge highlights + side shadows + center sheen)
 *   - Bow is larger, multi-layered with fabric folds and self-shadow
 *   - Directional lighting (upper-left key, lower-right fill)
 *   - Ambient occlusion in the lid-body gap
 */

import { motion, AnimatePresence } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';

type State = 'idle' | 'loose' | 'open';

type Props = {
  state: State;
  size?: number;
};

export default function GiftBox({ state, size = 1 }: Props) {
  const w = 240, h = 240;

  return (
    <div
      className="relative"
      style={{
        width: w * size,
        height: h * size,
        perspective: 1200,
        perspectiveOrigin: '50% 30%',
      }}
    >
      {/* ─── FLOOR SHADOW — three layers for depth ─────────────── */}
      <FloorShadow state={state} size={size} />

      {/* ─── BOX BODY (drawn first, behind everything) ─────────── */}
      <div
        className="absolute"
        style={{
          left: '10%',
          right: '10%',
          top: '34%',
          bottom: '8%',
        }}
      >
        <BodySVG state={state} />

        {/* Inner glow visible when opened — light spills out of the box */}
        <motion.div
          className="pointer-events-none absolute inset-x-2 top-0 bottom-2 rounded"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 235, 175, 0.98) 0%, rgba(255, 205, 120, 0.65) 30%, rgba(255, 180, 90, 0.25) 60%, transparent 90%)',
            mixBlendMode: 'screen',
            filter: 'blur(4px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: state === 'open' ? 1 : 0 }}
          transition={{ duration: 0.9, delay: state === 'open' ? 0.4 : 0, ease: EASE.breathe }}
        />

        {/* Volumetric light column rising from the open box */}
        <AnimatePresence>
          {state === 'open' && (
            <motion.div
              key="volumetric"
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
              style={{
                width: '60%',
                height: '300%',
                background:
                  'linear-gradient(180deg, rgba(255, 230, 170, 0.55) 0%, rgba(255, 210, 140, 0.25) 40%, transparent 100%)',
                filter: 'blur(14px)',
                mixBlendMode: 'screen',
                transformOrigin: '50% 0%',
              }}
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 1.6, delay: 0.5, ease: EASE.breathe }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ─── LID (top piece) — lifts on open with anticipation ──── */}
      <motion.div
        className="absolute"
        style={{
          left: '8%',
          right: '8%',
          top: '8%',
          height: '28%',
          transformOrigin: '50% 100%',
          transformStyle: 'preserve-3d',
          zIndex: 3,
        }}
        initial={false}
        animate={
          state === 'open'
            ? {
                rotateX: [0, -8, -135, -128],
                y: [0, 4, -32, -28],
              }
            : { rotateX: 0, y: 0 }
        }
        transition={{
          duration: state === 'open' ? 1.6 : 0.8,
          ease: state === 'open' ? [0.34, 1.2, 0.64, 1] : EASE.breathe,
          times: state === 'open' ? [0, 0.18, 0.85, 1] : undefined,
        }}
      >
        <LidSVG state={state} />
      </motion.div>

      {/* ─── SHIMMER PARTICLES rising from the box (open state) ── */}
      <AnimatePresence>
        {state === 'open' && <ShimmerParticles key="shimmer" />}
      </AnimatePresence>

      {/* ─── RIBBON (front, vertical) ──────────────────────────── */}
      <Ribbon state={state} />

      {/* ─── BOW on top (idle / loose) ──────────────────────────── */}
      <Bow state={state} />
    </div>
  );
}

/* ─── Floor shadow — three stacked layers for realistic grounding ── */
/**
 * 1. Soft ambient drop shadow (large, blurry, low opacity)
 * 2. Closer shadow with offset (medium blur, gives directional light cue)
 * 3. Tight contact shadow where the box meets the floor (small, dark)
 *
 * All three intensify slightly when the lid opens (light from inside
 * pushes the contrast).
 */
function FloorShadow({ state, size }: { state: State; size: number }) {
  const intensity = state === 'open' ? 1.25 : 1;
  return (
    <>
      {/* Soft ambient floor shadow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -10,
          width: 220 * size,
          height: 30,
          background:
            'radial-gradient(ellipse, rgba(58, 38, 28, 0.35) 0%, rgba(89, 60, 40, 0.18) 45%, transparent 75%)',
          filter: 'blur(10px)',
          mixBlendMode: 'multiply',
        }}
        animate={{ opacity: 0.7 * intensity, scale: state === 'open' ? 1.15 : 1 }}
        transition={{ duration: 1.2, ease: EASE.breathe }}
      />
      {/* Closer offset shadow — gives the box weight, direction */}
      <div
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: -4,
          width: 180 * size,
          height: 14,
          transform: 'translateX(-46%)',
          background:
            'radial-gradient(ellipse, rgba(58, 38, 28, 0.5) 0%, rgba(89, 60, 40, 0.25) 50%, transparent 80%)',
          filter: 'blur(5px)',
          mixBlendMode: 'multiply',
          opacity: 0.85 * intensity,
        }}
      />
      {/* Tight contact line */}
      <div
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: -2,
          width: 140 * size,
          height: 4,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(40, 26, 20, 0.55) 30%, rgba(40, 26, 20, 0.65) 70%, transparent 100%)',
          filter: 'blur(2px)',
          mixBlendMode: 'multiply',
          opacity: 0.9 * intensity,
        }}
      />
      {/* Warm light pool — intensifies on open */}
      <motion.div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -8,
          width: 220 * size * 0.95,
          height: 26,
          background:
            'radial-gradient(ellipse, rgba(255, 200, 130, 0.55) 0%, rgba(255, 220, 180, 0.28) 35%, transparent 70%)',
          filter: 'blur(8px)',
          mixBlendMode: 'screen',
        }}
        animate={{
          opacity: state === 'open' ? 1 : 0.3,
          scale: state === 'open' ? 1.5 : 0.65,
        }}
        transition={{ duration: 1.4, ease: EASE.breathe }}
      />
    </>
  );
}

/* ─── Lid SVG ─────────────────────────────────────────────────── */

function LidSVG({ state }: { state: State }) {
  return (
    <svg
      viewBox="0 0 200 50"
      className="h-full w-full"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 8px rgba(58, 38, 28, 0.22))' }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        {/* Lid surface — matte ivory paper with directional lighting (upper-left key) */}
        <linearGradient id="lid-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="40%" stopColor="#faeedc" />
          <stop offset="100%" stopColor="#e8d5b8" />
        </linearGradient>
        <linearGradient id="lid-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(58, 46, 42, 0)" />
          <stop offset="100%" stopColor="rgba(58, 46, 42, 0.32)" />
        </linearGradient>
        {/* Upper-left highlight strip — sells the key light */}
        <linearGradient id="lid-highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255, 255, 245, 0.7)" />
          <stop offset="40%" stopColor="rgba(255, 255, 245, 0.15)" />
          <stop offset="100%" stopColor="rgba(255, 255, 245, 0)" />
        </linearGradient>
        <filter id="lid-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0.22 0" />
        </filter>
      </defs>

      {/* Lid overhang — extends 4px left & right beyond body for 3D reveal */}
      <rect x="-4" y="0" width="208" height="50" rx="3" fill="url(#lid-top)" />

      {/* Upper-left highlight — directional key light */}
      <rect x="-4" y="0" width="208" height="10" fill="url(#lid-highlight)" />

      {/* Paper grain overlay */}
      <rect
        x="-4"
        y="0"
        width="208"
        height="50"
        rx="3"
        fill="rgba(0,0,0,0)"
        style={{ filter: 'url(#lid-grain)', mixBlendMode: 'multiply' }}
      />

      {/* Bottom edge — soft shadow where lid meets box (ambient occlusion) */}
      <rect x="-4" y="40" width="208" height="10" fill="url(#lid-edge)" />

      {/* Subtle inner highlight along the top */}
      <rect x="-4" y="0" width="208" height="2" fill="rgba(255, 255, 255, 0.7)" />

      {/* Vertical ribbon imprint (cream paper, no full ribbon on lid) */}
      <rect x="92" y="0" width="16" height="50" fill="rgba(196, 168, 120, 0.12)" />

      {/* Tiny corner shadow — sells the overhang */}
      <rect x="-4" y="48" width="208" height="2" fill="rgba(40, 26, 20, 0.35)" />
    </svg>
  );
}

/* ─── Body SVG ────────────────────────────────────────────────── */

function BodySVG({ state }: { state: State }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className="h-full w-full"
      style={{ display: 'block' }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="body-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fefbf2" />
          <stop offset="50%" stopColor="#f5ead8" />
          <stop offset="100%" stopColor="#e2cdb0" />
        </linearGradient>
        <linearGradient id="body-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0e0d2" />
          <stop offset="100%" stopColor="#c8b48f" />
        </linearGradient>
        <linearGradient id="body-inside" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1f1a" />
          <stop offset="100%" stopColor="#5a4636" />
        </linearGradient>
        {/* Upper-left directional highlight on the body */}
        <linearGradient id="body-highlight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255, 255, 245, 0.5)" />
          <stop offset="40%" stopColor="rgba(255, 255, 245, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 245, 0)" />
        </linearGradient>
        <filter id="body-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0.2 0" />
        </filter>
      </defs>

      {/* Right side face — gives 3D depth */}
      <path d="M 200 8 L 200 152 L 192 160 L 192 16 Z" fill="url(#body-side)" opacity="0.7" />

      {/* Front face */}
      <rect x="0" y="8" width="200" height="152" fill="url(#body-front)" />

      {/* Directional highlight — upper-left key light */}
      <rect x="0" y="8" width="200" height="152" fill="url(#body-highlight)" />

      {/* Inner dark cavity at the very top — visible when opened */}
      <rect x="6" y="8" width="188" height="6" fill="url(#body-inside)" opacity="0.85" />

      {/* Inner shadow on top — ambient occlusion under the lid */}
      <rect x="0" y="8" width="200" height="16" fill="rgba(58, 38, 28, 0.22)" />

      {/* Bottom shadow — sells grounding */}
      <rect x="0" y="146" width="200" height="14" fill="rgba(58, 38, 28, 0.22)" />

      {/* Paper grain */}
      <rect
        x="0"
        y="8"
        width="200"
        height="152"
        fill="rgba(0,0,0,0)"
        style={{ filter: 'url(#body-grain)', mixBlendMode: 'multiply' }}
      />

      {/* Vertical ribbon imprint on front (subtle) */}
      <rect x="92" y="8" width="16" height="152" fill="rgba(196, 168, 120, 0.14)" />

      {/* Horizontal ribbon imprint on front */}
      <rect x="0" y="78" width="200" height="16" fill="rgba(196, 168, 120, 0.12)" />

      {/* Subtle embossed monogram in the center, visible when closed */}
      {state !== 'open' && (
        <g opacity="0.5">
          <circle
            cx="100"
            cy="44"
            r="13"
            fill="none"
            stroke="rgba(210, 180, 106, 0.6)"
            strokeWidth="0.5"
          />
          <text
            x="100"
            y="50"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="18"
            fontStyle="italic"
            fontWeight="500"
            fill="rgba(210, 180, 106, 0.75)"
          >
            ♥
          </text>
        </g>
      )}
    </svg>
  );
}

/* ─── Ribbon (front, vertical) ────────────────────────────────── */
/**
 * The ribbon has dimensional thickness via three vertical stripes
 * (left shadow, center sheen, right shadow) plus an embossed border.
 *
 * On "loose": the knot unties and the ribbon slides off, falling
 * naturally with a slight curve (not a straight drop). The trailing
 * end swings down with gravity physics.
 */
function Ribbon({ state }: { state: State }) {
  // Vertical fall of the ribbon body — eased for a natural drape
  const verticalFall = state === 'idle' ? 0 : state === 'loose' ? 36 : 80;
  // Slight rotation when loosening — gives a "sag" feel
  const bodyRotate = state === 'loose' ? 4 : state === 'open' ? 14 : 0;
  // Body opacity fades as it falls — ribbon goes "out of view"
  const bodyOpacity = state === 'idle' ? 1 : state === 'loose' ? 0.85 : 0;

  return (
    <div
      className="pointer-events-none absolute z-[4]"
      style={{
        left: '50%',
        top: '8%',
        bottom: '8%',
        width: 22,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Vertical band over the box body — three stripes for thickness */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            // Left shadow stripe (3px) | Center sheen (16px) | Right shadow stripe (3px)
            'linear-gradient(90deg, rgba(120, 88, 36, 0.55) 0%, rgba(120, 88, 36, 0.55) 14%, rgba(236, 210, 138, 0.95) 18%, rgba(255, 235, 175, 1) 35%, rgba(210, 180, 106, 1) 60%, rgba(169, 138, 63, 0.95) 86%, rgba(120, 88, 36, 0.55) 100%)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 245, 200, 0.4), inset 0 -1px 1px rgba(120, 88, 36, 0.3), 0 1px 3px rgba(120, 88, 36, 0.22)',
        }}
        initial={false}
        animate={{
          y: verticalFall,
          rotate: bodyRotate,
          opacity: bodyOpacity,
        }}
        transition={{ duration: 1.2, ease: [0.5, 0, 0.3, 1] }}
      />

      {/* Trailing end on the right — swings down with gravity when loose */}
      <motion.div
        className="absolute"
        style={{
          right: -14,
          top: '64%',
          width: 60,
          height: 16,
          background:
            'linear-gradient(90deg, rgba(169, 138, 63, 1) 0%, rgba(210, 180, 106, 1) 50%, rgba(236, 210, 138, 0.95) 100%)',
          transformOrigin: '0% 50%',
          boxShadow: '0 3px 8px rgba(58, 38, 28, 0.28), inset 0 1px 1px rgba(255, 245, 200, 0.4)',
          borderRadius: '0 4px 4px 0',
        }}
        initial={false}
        animate={{
          rotate: state === 'idle' ? 0 : state === 'loose' ? 72 : 110,
          x: state === 'idle' ? 0 : state === 'loose' ? 10 : 24,
          y: state === 'idle' ? 0 : state === 'loose' ? 18 : 36,
          opacity: state === 'open' ? 0 : 1,
        }}
        transition={{ duration: 1.4, ease: [0.34, 1.2, 0.64, 1] }}
      />
    </div>
  );
}

/* ─── Bow (top of the lid) ────────────────────────────────────── */
/**
 * Larger, more dimensional bow with multiple gradient stops, fabric
 * folds, and a self-shadow on the lid below.
 *
 * On "loose": the knot "unties" — the bow rotates and lifts off,
 * like the ribbon was pulled. The idle sway continues while closed.
 */
function Bow({ state }: { state: State }) {
  // The bow lifts away and rotates when the ribbon unties
  const opacity = state === 'open' ? 0 : 1;
  const y = state === 'loose' ? -36 : state === 'open' ? -80 : 0;
  const rotate = state === 'loose' ? 35 : state === 'open' ? 80 : 0;
  const scale = state === 'loose' ? 0.95 : 1;
  // Gentle idle sway when closed — soft breath
  const idleRotate = state === 'idle' ? [-1.5, 1.5, -1.5] : 0;

  return (
    <>
      {/* Soft self-shadow of the bow on the lid below */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '6%',
          width: 70,
          height: 12,
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse, rgba(58, 38, 28, 0.32) 0%, rgba(89, 60, 40, 0.15) 50%, transparent 80%)',
          filter: 'blur(4px)',
          mixBlendMode: 'multiply',
          zIndex: 4,
        }}
        animate={{
          opacity: state === 'idle' ? 1 : state === 'loose' ? 0.4 : 0,
          y: state === 'loose' ? -10 : 0,
        }}
        transition={{ duration: 1.0, ease: EASE.breathe }}
      />

      <motion.div
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '-4%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
        initial={false}
        animate={{ opacity, y, rotate, scale }}
        transition={{
          opacity: { duration: 1.0, ease: EASE.breathe },
          y: { duration: 1.4, ease: [0.34, 1.2, 0.64, 1] },
          rotate: { duration: 1.4, ease: [0.34, 1.2, 0.64, 1] },
          scale: { duration: 1.0, ease: EASE.breathe },
        }}
      >
        <motion.div
          animate={{ rotate: idleRotate }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BowSVG />
        </motion.div>
      </motion.div>
    </>
  );
}

/* ─── Bow SVG — multi-layered with fabric folds ───────────────── */

function BowSVG() {
  return (
    <svg
      viewBox="0 0 100 60"
      width={100}
      height={60}
      style={{ display: 'block', filter: 'drop-shadow(0 3px 4px rgba(58, 38, 28, 0.3))' }}
      aria-hidden
    >
      <defs>
        {/* Main satin gradient — multiple stops for sheen */}
        <linearGradient id="bow-grad" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#fff2c8" />
          <stop offset="25%" stopColor="#ecd28a" />
          <stop offset="55%" stopColor="#d2b46a" />
          <stop offset="85%" stopColor="#a98a3f" />
          <stop offset="100%" stopColor="#7a6225" />
        </linearGradient>
        {/* Loop inner shadow — fabric fold depth */}
        <radialGradient id="bow-fold" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(120, 88, 36, 0.45)" />
          <stop offset="100%" stopColor="rgba(120, 88, 36, 0)" />
        </radialGradient>
        {/* Highlight stripe — sells the satin sheen */}
        <linearGradient id="bow-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 250, 220, 0.7)" />
          <stop offset="100%" stopColor="rgba(255, 250, 220, 0)" />
        </linearGradient>
      </defs>

      {/* Left loop — larger, with fabric folds */}
      <path
        d="M 48 26 C 26 2, 4 14, 12 32 C 16 40, 30 38, 40 32 C 44 30, 46 28, 48 26 Z"
        fill="url(#bow-grad)"
        stroke="rgba(120, 88, 36, 0.5)"
        strokeWidth="0.4"
      />
      {/* Left loop inner shadow — fabric fold depth */}
      <path
        d="M 48 26 C 38 16, 22 18, 18 28 C 16 32, 22 36, 30 34 C 38 32, 44 30, 48 26 Z"
        fill="url(#bow-fold)"
      />
      {/* Left loop sheen stripe */}
      <path
        d="M 32 18 C 22 16, 14 22, 16 28 C 18 24, 24 20, 32 22 Z"
        fill="url(#bow-sheen)"
        opacity="0.6"
      />

      {/* Right loop — mirror */}
      <path
        d="M 52 26 C 74 2, 96 14, 88 32 C 84 40, 70 38, 60 32 C 56 30, 54 28, 52 26 Z"
        fill="url(#bow-grad)"
        stroke="rgba(120, 88, 36, 0.5)"
        strokeWidth="0.4"
      />
      <path
        d="M 52 26 C 62 16, 78 18, 82 28 C 84 32, 78 36, 70 34 C 62 32, 56 30, 52 26 Z"
        fill="url(#bow-fold)"
      />
      <path
        d="M 68 18 C 78 16, 86 22, 84 28 C 82 24, 76 20, 68 22 Z"
        fill="url(#bow-sheen)"
        opacity="0.6"
      />

      {/* Center knot — multi-layered */}
      <ellipse cx="50" cy="28" rx="8" ry="10" fill="url(#bow-grad)" />
      {/* Knot highlight — vertical sheen */}
      <ellipse cx="48" cy="24" rx="3" ry="5" fill="rgba(255, 250, 220, 0.65)" />
      {/* Knot bottom shadow — fabric fold under the knot */}
      <ellipse cx="50" cy="34" rx="6" ry="3" fill="rgba(120, 88, 36, 0.4)" />

      {/* Trailing tails — longer, with slight curve and gradient */}
      <path
        d="M 44 36 Q 38 50 32 56"
        stroke="url(#bow-grad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 56 36 Q 62 50 68 56"
        stroke="url(#bow-grad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tail inner shadow lines */}
      <path
        d="M 44 36 Q 38 50 32 56"
        stroke="rgba(120, 88, 36, 0.4)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 56 36 Q 62 50 68 56"
        stroke="rgba(120, 88, 36, 0.4)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Shimmer particles rising from the open box ─────────────── */
/**
 * More varied: different sizes, speeds, opacities, and slight
 * horizontal drift. The particles spawn from a wider area to feel
 * like the entire box interior is glowing, not just a single point.
 */
function ShimmerParticles() {
  const motes = Array.from({ length: 22 }).map(() => ({
    x: 25 + Math.random() * 50,
    drift: (Math.random() - 0.5) * 30,
    delay: Math.random() * 1.6,
    duration: 2.4 + Math.random() * 1.8,
    size: 1.5 + Math.random() * 3.5,
    opacity: 0.6 + Math.random() * 0.4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 block rounded-full"
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            background: 'radial-gradient(circle, #fff3c8 0%, #e6cf94 60%, transparent 100%)',
            boxShadow: '0 0 6px rgba(255, 220, 160, 0.8)',
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ['0%', '-220%'],
            x: [0, m.drift, -m.drift / 2, 0],
            opacity: [0, m.opacity, m.opacity, 0],
            scale: [0.6, 1.2, 0.7],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
