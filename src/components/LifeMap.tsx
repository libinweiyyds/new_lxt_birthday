/**
 * LifeMap — abstract "year as map" scene primitives.
 *
 *   - MapPath       : an SVG path that self-draws via stroke-dasharray
 *   - DestinationMarker : pulse-ring + crosshair + label
 *   - GlowingStars  : small luminous points scattered around the path
 *
 * The whole scene is one sticky canvas; the path length drives the
 * scroll reveal. Markers trigger when the path passes their position.
 */

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { EASE, DUR } from '../lib/motion';

/* ─── MapPath — champagne-gold self-drawing line ─────────────── */

export type MapPoint = { x: number; y: number; label?: string };

/**
 * A bezier path through the viewport (1000x1400 viewBox).
 * The shape is intentionally curving — not a straight line.
 */
export const DEFAULT_PATH_D =
  'M 80 200 C 220 120, 320 280, 420 220 S 580 360, 700 280 S 880 480, 940 380';

export const DEFAULT_PATH_POINTS: MapPoint[] = [
  { x: 80, y: 200, label: '想去的地方' },
  { x: 320, y: 280, label: '想做的事情' },
  { x: 580, y: 360, label: '想见的人' },
  { x: 880, y: 480, label: '还没发生的故事' },
];

export function MapPath({
  pathD = DEFAULT_PATH_D,
  progress,
  points = DEFAULT_PATH_POINTS,
  height = 1400,
}: {
  pathD?: string;
  progress: MotionValue<number>;
  points?: MapPoint[];
  height?: number;
}) {
  // A 1.0 means the line is fully drawn.
  // dashoffset = pathLength * (1 - progress)
  // We use a CSS transition via Framer Motion.

  return (
    <svg
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="map-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6cf94" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d2b46a" />
          <stop offset="100%" stopColor="#a98a3f" stopOpacity="0.8" />
        </linearGradient>
        <filter id="map-glow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Glow underlay (slightly larger, blurred) */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#map-line)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#map-glow)"
        style={{ pathLength: progress }}
      />

      {/* Crisp line on top */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#map-line)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: progress }}
      />

      {/* Dotted parallels — like map contour lines, very subtle */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(187, 164, 208, 0.18)"
        strokeWidth="0.6"
        strokeDasharray="2 6"
        transform="translate(0, 14)"
      />
      <path
        d={pathD}
        fill="none"
        stroke="rgba(187, 164, 208, 0.14)"
        strokeWidth="0.5"
        strokeDasharray="2 6"
        transform="translate(0, 28)"
      />
    </svg>
  );
}

/* ─── DestinationMarker — appears when path passes its position ─ */

export function DestinationMarker({
  x,
  y,
  label,
  progress,
  position, // 0..1 along the path
  index = 0,
}: {
  x: number;
  y: number;
  label: string;
  progress: MotionValue<number>;
  position: number;
  index?: number;
}) {
  // Marker fades in as the path passes.
  const opacity = useTransform(progress, [position - 0.05, position, position + 0.05], [0, 1, 1]);
  const scale = useTransform(progress, [position - 0.05, position + 0.02], [0.4, 1]);
  const ringScale = useTransform(progress, [position, position + 0.15], [1, 2.4]);
  const ringOpacity = useTransform(progress, [position, position + 0.15], [0.8, 0]);

  // Map viewBox coords (0-1000) to actual screen via SVG transform not needed
  // because we use position: absolute with x% in the wrapper.

  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={{
        left: `${x / 10}%`,
        top: `${(y / 1400) * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative flex flex-col items-center"
      >
        {/* Outer pulse ring */}
        <motion.div
          className="absolute h-12 w-12 rounded-full"
          style={{
            border: '1px solid #d2b46a',
            scale: ringScale,
            opacity: ringOpacity,
          }}
        />
        {/* Solid center dot */}
        <div
          className="relative h-2.5 w-2.5 rounded-full"
          style={{
            background: '#d2b46a',
            boxShadow: '0 0 12px rgba(210, 180, 106, 0.6)',
          }}
        />
        {/* Crosshair lines */}
        <div
          className="absolute h-px w-5"
          style={{ background: 'rgba(210, 180, 106, 0.6)', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateX(-14px)' }}
        />
        <div
          className="absolute h-px w-5"
          style={{ background: 'rgba(210, 180, 106, 0.6)', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateX(14px)' }}
        />
        <div
          className="absolute h-5 w-px"
          style={{ background: 'rgba(210, 180, 106, 0.6)', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(-14px)' }}
        />
        <div
          className="absolute h-5 w-px"
          style={{ background: 'rgba(210, 180, 106, 0.6)', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(14px)' }}
        />

        {/* Label — themed by index to rhyme with the blessings lines
            below: teal (places), gold (do), rose (people), burgundy (stories) */}
        <div
          className="mt-4 whitespace-nowrap font-hand-zh text-[18px] sm:text-[22px]"
          style={{
            color:
              index === 0
                ? '#3d6b6b'
                : index === 1
                ? '#9a7a32'
                : index === 2
                ? '#a85a6a'
                : '#6b3a4a',
          }}
        >
          {label}
        </div>
        <div
          className="mt-1 font-hand text-[9px] font-light italic tracking-wide text-champagne-300/75 sm:text-[10px]"
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── GlowingStars — luminous points scattered in space ───────── */

export function GlowingStars({ count = 22 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 3,
        hue: Math.random(),
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s) => {
        const r = s.hue < 0.5 ? 210 : s.hue < 0.8 ? 232 : 200;
        const g = s.hue < 0.5 ? 180 : s.hue < 0.8 ? 200 : 180;
        const b = s.hue < 0.5 ? 230 : s.hue < 0.8 ? 220 : 130;
        return (
          <motion.span
            key={s.id}
            className="absolute block rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: `rgba(${r}, ${g}, ${b}, 0.7)`,
              boxShadow: `0 0 ${s.size * 4}px rgba(${r}, ${g}, ${b}, 0.45)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
