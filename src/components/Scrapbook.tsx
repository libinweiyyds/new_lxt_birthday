/**
 * Scrapbook — premium paper props for the memories scene.
 *
 *   - Polaroid     : ivory card with thick bottom border for the caption
 *   - PhotoPrint   : flush edge, paper margin around the photo
 *   - PhotoFrame   : thin white matting, no border
 *   - PaperNote    : folded card with handwritten text
 *
 * All cards have:
 *   - subtle paper grain (SVG noise)
 *   - soft multi-layer shadow
 *   - tape strip (4 colors, 4 positions)
 *   - optional star/scribble doodle
 */

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { StarDoodle, Sparkle, FlowerDoodle } from './Illustrations';

const TAPE_COLORS: Record<string, { base: string; light: string; dark: string }> = {
  blush: { base: 'rgba(247, 197, 184, 0.58)', light: 'rgba(255, 224, 214, 0.6)', dark: 'rgba(214, 158, 142, 0.45)' },
  lavender: { base: 'rgba(187, 164, 208, 0.52)', light: 'rgba(214, 196, 230, 0.55)', dark: 'rgba(158, 132, 184, 0.4)' },
  champagne: { base: 'rgba(210, 180, 106, 0.52)', light: 'rgba(232, 206, 138, 0.55)', dark: 'rgba(176, 146, 76, 0.4)' },
  rose: { base: 'rgba(232, 138, 115, 0.56)', light: 'rgba(245, 170, 150, 0.58)', dark: 'rgba(198, 108, 86, 0.42)' },
  peach: { base: 'rgba(245, 184, 150, 0.58)', light: 'rgba(255, 206, 176, 0.6)', dark: 'rgba(212, 150, 116, 0.44)' },
};

const TAPE_POS: Record<string, { top?: string; left?: string; right?: string; bottom?: string; rotation: number }> = {
  'top-left': { top: '-14px', left: '-16px', rotation: -22 },
  'top-right': { top: '-14px', right: '-16px', rotation: 18 },
  'bottom-left': { bottom: '-12px', left: '-14px', rotation: 15 },
  'bottom-right': { bottom: '-12px', right: '-16px', rotation: -15 },
};

/**
 * Washi tape — translucent, fibrous, slightly wrinkled, with imperfect edges.
 * Sits ON TOP of the photo/paper. Has a subtle idle sway.
 */
function TapeStrip({
  position,
  color,
}: {
  position: keyof typeof TAPE_POS;
  color: keyof typeof TAPE_COLORS;
}) {
  const pos = TAPE_POS[position];
  const c = TAPE_COLORS[color] || TAPE_COLORS.blush;
  const { rotation, ...posRest } = pos;
  return (
    <motion.span
      className="pointer-events-none absolute z-40"
      style={{
        width: 92,
        height: 26,
        ...posRest,
        transform: `rotate(${rotation}deg)`,
      }}
      animate={{ rotate: [rotation, rotation + 0.6, rotation - 0.4, rotation] }}
      transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Tape body — translucent with vertical light variation (wrinkles) */}
      <span
        className="absolute inset-0 rounded-[1px]"
        style={{
          background: `
            linear-gradient(90deg,
              ${c.dark} 0%,
              ${c.light} 12%,
              ${c.base} 28%,
              ${c.light} 45%,
              ${c.base} 62%,
              ${c.dark} 78%,
              ${c.base} 100%
            )
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.06),
            0 2px 6px rgba(58, 46, 42, 0.12),
            0 1px 2px rgba(58, 46, 42, 0.08)
          `,
        }}
      />
      {/* Paper fibers overlay */}
      <span
        className="absolute inset-0 rounded-[1px]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 40' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2 0.3' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
          mixBlendMode: 'overlay',
          opacity: 0.5,
        }}
      />
      {/* Uneven edge — subtle jaggedness via clip-path */}
      <span
        className="absolute inset-0"
        style={{
          clipPath:
            'polygon(0 2px, 3px 0, 12px 1px, 24px 0, 38px 2px, 52px 0, 66px 1px, 78px 0, 92px 2px, 92px 24px, 78px 26px, 66px 25px, 52px 26px, 38px 24px, 24px 26px, 12px 25px, 3px 26px, 0 24px)',
        }}
      />
      {/* Top + bottom fiber edge highlights */}
      <span
        className="absolute left-0 right-0 top-0 h-[1px]"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      />
      <span
        className="absolute left-0 right-0 bottom-0 h-[1px]"
        style={{ background: 'rgba(58,46,42,0.08)' }}
      />
    </motion.span>
  );
}

const SIZE_TO_W: Record<string, number> = {
  sm: 180,
  md: 240,
  lg: 300,
};

/** Fine paper grain — applied as multiply overlay on every paper surface. */
function PaperGrain() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.45'/></svg>\")",
        mixBlendMode: 'multiply',
        opacity: 0.32,
      }}
    />
  );
}

/** Long paper fibers — subtle directional strands for handmade feel. */
function PaperFibers() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.04 0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23f)' opacity='0.18'/></svg>\")",
        mixBlendMode: 'overlay',
        opacity: 0.4,
      }}
    />
  );
}

const SIZE_TO_H: Record<string, { print: string; polaroid: string; frame: string }> = {
  sm: { print: 'aspect-[4/3]', polaroid: 'aspect-[3/4]', frame: 'aspect-[4/5]' },
  md: { print: 'aspect-[4/3]', polaroid: 'aspect-[3/4]', frame: 'aspect-[4/5]' },
  lg: { print: 'aspect-[16/10]', polaroid: 'aspect-[3/4]', frame: 'aspect-[16/10]' },
};

/* ─── Photo card (the actual scrapbook photo) ─────────────────── */

type Depth = 'foreground' | 'primary' | 'background' | 'secondary';
export type { Depth };

export function PhotoCard({
  src,
  alt = '',
  caption,
  year,
  size = 'md',
  style = 'print',
  tone = 'warm',
  tape,
  tapeColor,
  rotate = 0,
  index = 0,
  depth = 'primary',
  isActive = false,
  aspect,
  onClick,
}: {
  src: string;
  alt?: string;
  caption?: string;
  year?: string;
  size?: keyof typeof SIZE_TO_W;
  style?: 'polaroid' | 'print' | 'frame';
  tone?: 'warm' | 'cool' | 'mono';
  tape?: keyof typeof TAPE_POS;
  tapeColor?: keyof typeof TAPE_COLORS;
  rotate?: number;
  index?: number;
  /** Cinematic depth of field — foreground blurred, primary sharp, background soft. */
  depth?: Depth;
  /** When true, card lifts toward viewer: scale + rotate→0 + stronger shadow. */
  isActive?: boolean;
  /** Natural image aspect ratio (w/h). When provided, the photo frame matches
   *  the image so it fills completely — no letterboxing, no cropping. */
  aspect?: number;
  onClick?: () => void;
}) {
  const w = SIZE_TO_W[size];
  const aspectClass = SIZE_TO_H[size][style];

  // Tone → CSS filter on the photo.
  const filter =
    tone === 'warm'
      ? 'saturate-[1.08] contrast-[1.04] sepia-[0.06]'
      : tone === 'cool'
      ? 'saturate-[0.92] contrast-[1.05] hue-rotate-[-6deg]'
      : 'saturate-0';

  // Depth separation WITHOUT obvious blur — depth comes from scale,
  // opacity, shadow, and overlap. All cards remain sharp.
  const depthOpacity =
    depth === 'background' ? 0.82 : depth === 'foreground' ? 0.95 : 1;

  // Layered physical shadow: contact + ambient + cast.
  // Active card lifts → stronger shadows. Background cards recede → softer.
  const baseShadow = isActive
    ? '0 2px 4px rgba(58,46,42,0.14), 0 18px 32px rgba(58,46,42,0.22), 0 48px 80px -24px rgba(58,46,42,0.28)'
    : depth === 'background'
    ? '0 1px 1px rgba(58,46,42,0.04), 0 4px 10px rgba(58,46,42,0.08), 0 12px 28px -10px rgba(58,46,42,0.1)'
    : depth === 'secondary'
    ? '0 1px 1px rgba(58,46,42,0.05), 0 6px 14px rgba(58,46,42,0.1), 0 18px 36px -18px rgba(58,46,42,0.14)'
    : '0 1px 1px rgba(58,46,42,0.05), 0 8px 18px rgba(58,46,42,0.12), 0 24px 48px -16px rgba(58,46,42,0.18)';

  // Container background — different per style.
  const cardStyle: CSSProperties =
    style === 'polaroid'
      ? {
          width: w,
          background: 'linear-gradient(180deg, #fdfaf3 0%, #faf3e8 100%)',
          padding: '12px 12px 56px 12px',
          boxShadow: baseShadow,
          border: '1px solid rgba(196, 168, 120, 0.2)',
          borderRadius: '2px 3px 2px 4px',
        }
      : style === 'frame'
      ? {
          width: w,
          background: '#fffbf3',
          padding: 8,
          boxShadow: baseShadow,
          border: '1px solid rgba(232, 220, 192, 0.7)',
          borderRadius: '3px 2px 4px 2px',
        }
      : {
          width: w,
          background: 'linear-gradient(180deg, #fdfaf3 0%, #faf3e8 100%)',
          padding: 10,
          boxShadow: baseShadow,
          border: '1px solid rgba(196, 168, 120, 0.18)',
          borderRadius: '2px 4px 2px 3px',
        };

  return (
    <div
      className={`group relative ${onClick ? 'cursor-pointer' : ''}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {tape && tapeColor && <TapeStrip position={tape} color={tapeColor} />}

      <motion.div
        className="relative will-change-transform"
        style={{
          ...cardStyle,
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{
          opacity: isActive ? 1 : depthOpacity,
          y: 0,
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        }}
        onClick={onClick}
        whileHover={
          !isActive
            ? {
                boxShadow:
                  '0 2px 4px rgba(58,46,42,0.1), 0 12px 24px rgba(58,46,42,0.18), 0 32px 56px -20px rgba(58,46,42,0.22)',
              }
            : undefined
        }
      >
        <PaperGrain />
        <PaperFibers />

        {/* Edge highlight — soft top-left light, bottom-right warmth */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow:
              'inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(196,168,120,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
            borderRadius: 'inherit',
          }}
        />

        {/* Photo inner frame — when `aspect` is provided, the frame matches
            the image's natural ratio so it fills completely (no letterboxing,
            no cropping). Falls back to a fixed ratio per size/style. */}
        <div
          className={`relative w-full overflow-hidden ${aspect ? '' : aspectClass}`}
          style={{
            aspectRatio: aspect ? String(aspect) : undefined,
            background: 'linear-gradient(180deg, #f5ead8 0%, #ecdcc0 100%)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 2.0, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
          >
            <motion.img
              src={src}
              alt={alt}
              loading="lazy"
              initial={{
                filter:
                  tone === 'mono'
                    ? 'grayscale(100%) blur(14px) brightness(0.85)'
                    : 'blur(10px) brightness(0.92)',
                scale: 1.06,
              }}
              animate={{
                filter:
                  tone === 'mono'
                    ? 'grayscale(0%) blur(0) brightness(1)'
                    : 'blur(0) brightness(1)',
                scale: 1,
              }}
              transition={{
                filter: { duration: 3.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 3.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
              className={`h-full w-full object-contain ${filter}`}
            />

            {/* Subtle warm light wash */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 55%, rgba(245, 215, 175, 0.15) 100%)',
                mixBlendMode: 'multiply',
              }}
            />
          </motion.div>

          {/* Photo grain */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
            }}
          />

          {/* №  marker — embossed */}
          <div className="pointer-events-none absolute right-2 top-2 z-10 font-hand text-[10px] font-light italic text-ash-50/45 mix-blend-difference sm:text-[11px]">
            №{String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Caption — handwritten */}
        {(caption || year) && (
          <div className={style === 'polaroid' ? 'mt-4' : 'mt-3'}>
            {caption && (
              <p className="font-hand text-[15px] font-normal italic text-espresso-800 sm:text-[17px]">
                {caption}
              </p>
            )}
            {year && style !== 'polaroid' && (
              <p className="mt-1 font-hand text-[10px] font-light italic text-espresso-700/45">
                {year}
              </p>
            )}
            {year && style === 'polaroid' && (
              <p className="absolute bottom-3 right-4 font-hand text-[10px] font-light italic text-espresso-700/45">
                {year}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Paper note (folded card with handwritten message) ───────── */

export function PaperNote({
  text,
  rotate = 0,
  accent = 'cherry',
  className = '',
  depth = 'primary',
}: {
  text: string;
  rotate?: number;
  accent?: 'cherry' | 'rose' | 'champagne';
  className?: string;
  depth?: Depth;
}) {
  const lines = text.split('\n');
  const accentColor =
    accent === 'cherry' ? '#c44444' : accent === 'rose' ? '#e88a73' : '#a98a3f';
  const depthOpacity = depth === 'background' ? 0.82 : 1;
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, width: 220 }}
    >
      <TapeStrip position="top-left" color="champagne" />

      <motion.div
        className="relative px-6 py-7 sm:px-7 sm:py-8"
        style={{
          background: 'linear-gradient(180deg, #fdfaf3 0%, #f5ead8 100%)',
          boxShadow:
            depth === 'background'
              ? '0 1px 1px rgba(58,46,42,0.04), 0 4px 10px rgba(58,46,42,0.08), 0 12px 28px -10px rgba(58,46,42,0.1)'
              : '0 1px 1px rgba(58,46,42,0.05), 0 8px 18px rgba(58,46,42,0.1), 0 24px 48px -16px rgba(58,46,42,0.15)',
          border: '1px solid rgba(196, 168, 120, 0.22)',
          borderRadius: '3px 2px 4px 3px',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: depthOpacity, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <PaperGrain />
        <PaperFibers />

        {/* Edge highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow:
              'inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(196,168,120,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
            borderRadius: 'inherit',
          }}
        />

        {/* Corner fold */}
        <div
          className="absolute -right-px -top-px h-5 w-5"
          style={{
            background: `linear-gradient(225deg, ${accentColor} 0%, ${accentColor} 50%, transparent 50%)`,
            opacity: 0.7,
          }}
        />

        <div className="space-y-1">
          {lines.map((l, i) => (
            <p
              key={i}
              className="font-hand text-[20px] font-normal italic leading-[1.5] sm:text-[22px]"
              style={{ color: accent === 'champagne' ? '#a98a3f' : '#3a2e2a' }}
            >
              {l}
            </p>
          ))}
        </div>

        {/* Tiny doodle in the corner */}
        <div className="absolute bottom-3 right-3 opacity-70">
          {accent === 'cherry' && <StarDoodle size={18} color="#d2b46a" />}
          {accent === 'rose' && <FlowerDoodle size={18} color="#e88a73" />}
          {accent === 'champagne' && <Sparkle size={14} className="text-champagne-300" />}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Hand-drawn scribble underline (used in narrative captions) ── */

export function ScribbleUnderline({
  children,
  color = '#c44444',
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span className="relative inline-block">
      <span
        className="absolute -bottom-1 left-0 right-0 h-2"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8' preserveAspectRatio='none'><path d='M0 4 Q 25 0 50 4 T 100 4' stroke='${color}' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      />
      {children}
    </span>
  );
}
