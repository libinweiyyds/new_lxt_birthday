/**
 * CasualScrap — components for the playful "thrown on a desk" scene.
 *   - StickyNote   : square post-it, slides in from one of 4 directions
 *   - ThrownPolaroid : heavier polaroid, more dramatic throw entry
 *   - DesktopDoodle : small floating editor doodles
 */

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { StarDoodle, Sparkle, FlowerDoodle, HeartDoodle } from './Illustrations';
import { CrossMark, SmirkLine, PointFinger } from './Stickers';
import { EASE, DUR } from '../lib/motion';

/* ─── StickyNote — slides in from one direction ──────────────── */

export function StickyNote({
  text,
  rotate = 0,
  slide = 'left',
  color = '#fce4dc',
  accent = '#c44444',
  className = '',
  style,
}: {
  text: string;
  rotate?: number;
  slide?: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  accent?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const slideFrom = {
    left: { x: -240, y: 0, rotate: rotate - 14 },
    right: { x: 240, y: 0, rotate: rotate + 14 },
    top: { x: 0, y: -240, rotate: rotate - 10 },
    bottom: { x: 0, y: 240, rotate: rotate + 10 },
  }[slide];

  return (
    <motion.div
      className={className}
      style={{ width: 180, ...style, transform: `rotate(${rotate}deg)` }}
      initial={{ opacity: 0, x: slideFrom.x, y: slideFrom.y, rotate: slideFrom.rotate }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate,
        transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
      }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div
        className="relative px-5 py-6"
        style={{
          background: color,
          boxShadow:
            '0 1px 1px rgba(58, 46, 42, 0.05), 0 6px 14px rgba(58, 46, 42, 0.1), 0 20px 40px -12px rgba(58, 46, 42, 0.12)',
        }}
      >
        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>\")",
            mixBlendMode: 'multiply',
          }}
        />

        {/* Handwritten content */}
        <p
          className="whitespace-pre-line font-hand text-[18px] font-light italic leading-[1.5] sm:text-[20px]"
          style={{ color: accent }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── ThrownPolaroid — heavier entry, slight bounce ──────────── */

export function ThrownPolaroid({
  src,
  caption,
  year,
  rotate = 0,
  slide = 'left',
  tape,
  tapeColor,
  pointerOffset = 0,
  index = 0,
}: {
  src: string;
  caption?: string;
  year?: string;
  rotate?: number;
  slide?: 'left' | 'right' | 'top' | 'bottom';
  tape?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  tapeColor?: 'blush' | 'lavender' | 'champagne' | 'rose' | 'peach';
  pointerOffset?: number;
  index?: number;
}) {
  const slideFrom = {
    left: { x: -320, y: 0, rotate: rotate - 16, scale: 0.85 },
    right: { x: 320, y: 0, rotate: rotate + 16, scale: 0.85 },
    top: { x: 0, y: -320, rotate: rotate - 12, scale: 0.85 },
    bottom: { x: 0, y: 320, rotate: rotate + 12, scale: 0.85 },
  }[slide];

  const tapeColors: Record<string, string> = {
    blush: 'rgba(247, 197, 184, 0.62)',
    lavender: 'rgba(187, 164, 208, 0.55)',
    champagne: 'rgba(210, 180, 106, 0.55)',
    rose: 'rgba(232, 138, 115, 0.6)',
    peach: 'rgba(245, 184, 150, 0.62)',
  };
  const tapePos: Record<string, any> = {
    'top-left': { top: '-12px', left: '-14px', rotate: -22 },
    'top-right': { top: '-12px', right: '-14px', rotate: 18 },
    'bottom-left': { bottom: '-10px', left: '-12px', rotate: 15 },
    'bottom-right': { bottom: '-10px', right: '-14px', rotate: -15 },
  };

  // Pointer parallax: each card drifts a few px based on mouse.
  const x = pointerOffset * 1.5;
  const y = pointerOffset * 0.8;

  return (
    <motion.div
      className="absolute"
      style={{
        x,
        y,
        willChange: 'transform',
      }}
      initial={{
        opacity: 0,
        x: slideFrom.x,
        y: slideFrom.y,
        rotate: slideFrom.rotate,
        scale: slideFrom.scale,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate,
        scale: 1,
        transition: {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1 + (index % 3) * 0.15,
        },
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="relative">
        {tape && tapeColor && (
          <span
            className="pointer-events-none absolute z-30"
            style={{
              width: 86,
              height: 22,
              background: tapeColors[tapeColor],
              borderLeft: '1px dashed rgba(255,255,255,0.5)',
              borderRight: '1px dashed rgba(255,255,255,0.5)',
              boxShadow: '0 2px 8px rgba(58, 46, 42, 0.1)',
              ...tapePos[tape],
            }}
          />
        )}

        <div
          className="relative"
          style={{
            width: 200,
            background: 'linear-gradient(180deg, #fdfaf3 0%, #faf3e8 100%)',
            padding: '10px 10px 50px 10px',
            boxShadow:
              '0 1px 1px rgba(58, 46, 42, 0.06), 0 8px 18px rgba(58, 46, 42, 0.14), 0 28px 56px -16px rgba(58, 46, 42, 0.2)',
            border: '1px solid rgba(196, 168, 120, 0.22)',
          }}
        >
          {/* Paper grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.45'/></svg>\")",
              mixBlendMode: 'multiply',
            }}
          />

          <div
            className="relative aspect-square w-full overflow-hidden"
            style={{ background: '#0a0a10' }}
          >
            <motion.img
              src={src}
              alt={caption || ''}
              loading="lazy"
              initial={{ filter: 'blur(8px) brightness(0.92)', scale: 1.06 }}
              whileInView={{ filter: 'blur(0) brightness(1)', scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full object-cover"
              style={{ filter: 'saturate-[0.95] contrast-[1.04]' }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
                mixBlendMode: 'multiply',
              }}
            />
            <div
              className="pointer-events-none absolute right-1.5 top-1.5 font-hand text-[9px] font-light italic text-ash-50/55 mix-blend-difference"
            >
              №{String(index + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Caption — handwritten */}
          {caption && (
            <p className="absolute bottom-3 left-0 right-0 px-3 text-center font-hand text-[13px] font-light italic text-espresso-800 sm:text-[14px]">
              {caption}
            </p>
          )}
          {year && (
            <p className="absolute bottom-1 right-3 font-hand text-[9px] font-light italic text-espresso-700/40">
              {year}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating small sticker (a tiny punchline) ──────────────── */

export function PunchlineSticker({
  kind,
  rotate = 0,
  delay = 0,
}: {
  kind: 'star' | 'sparkle' | 'flower' | 'heart' | 'cross' | 'smirk' | 'point';
  rotate?: number;
  delay?: number;
}) {
  const node = {
    star: <StarDoodle size={22} color="#d2b46a" />,
    sparkle: <Sparkle size={16} className="text-champagne-300" />,
    flower: <FlowerDoodle size={22} color="#e88a73" />,
    heart: <HeartDoodle size={18} color="#c44444" />,
    cross: <CrossMark size={20} color="#c44444" />,
    smirk: <SmirkLine width={36} color="#3a2e2a" />,
    point: <PointFinger rotate={-12} color="#3a2e2a" />,
  }[kind];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 18 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {node}
    </motion.div>
  );
}
