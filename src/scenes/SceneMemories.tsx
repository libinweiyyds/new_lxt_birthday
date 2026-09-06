import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { birthday, type BirthdayData } from '../data/birthday';
import Stardust from '../components/Stardust';
import { PhotoCard, PaperNote, ScribbleUnderline } from '../components/Scrapbook';
import type { Depth } from '../components/Scrapbook';
import {
  StarDoodle,
  FlowerDoodle,
  Sparkle,
  Ribbon,
  ConfettiPiece,
  Candle,
} from '../components/Illustrations';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

type MemoryItem = BirthdayData['memories']['items'][number];

/**
 * Scene 03 — Premium friendship scrapbook (single-viewport collage).
 *
 * Composition: LEFT tall card | CENTER hero + small note | RIGHT tall card
 * with a partially cropped background photo. All cards remain sharp — depth
 * comes from scale, opacity, shadow, and overlap (no CSS blur).
 *
 * Click a card → it smoothly travels to center, rotates to 0, scales to
 * 1.08, becomes the visual focus. Other cards dim to 0.5 opacity.
 */
export default function SceneMemories({ onNext }: Props) {
  const [showContinue, setShowContinue] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = birthday.memories.items as MemoryItem[];

  // Single-viewport composition. Two clean rows that fit one screen:
  //   Row 1 (top 4-55%): LEFT first-meeting | CENTER hero | RIGHT christmas-prep
  //   Row 2 (bottom 55-95%): LEFT chat-freq | CENTER-LEFT heart-hands
  //                          | CENTER-RIGHT note | RIGHT game-record
  // All card sizes shrunk one step (hero=md, others=sm) + bg depth-scaled
  // so the whole collage fits in the desk container with no overflow.
  const layout = useMemo(
    () => [
      // 0 — LEFT top (first meeting, landscape, secondary)
      { top: '8%', left: '4%', rotate: -3, z: 4, depth: 'secondary' as const },
      // 1 — RIGHT top edge (christmas prep, tall portrait, background)
      { top: '4%', right: '4%', left: 'auto' as const, rotate: 2, z: 2, depth: 'background' as const },
      // 2 — CENTER hero (christmas result, portrait, primary)
      { top: '4%', left: '50%', rotate: -1, z: 6, depth: 'primary' as const, centerX: true },
      // 3 — RIGHT bottom (game record, near-square, secondary)
      { top: '60%', right: '4%', left: 'auto' as const, rotate: -2.5, z: 4, depth: 'secondary' as const },
      // 4 — LEFT bottom (chat frequency, square, background)
      { top: '72%', left: '4%', rotate: -1.2, z: 3, depth: 'background' as const },
      // 5 — CENTER-RIGHT (note, tucked at hero's bottom-right corner —
      //     overlaps only the caption strip, not the photo)
      { top: '52%', left: '56%', rotate: 1.5, z: 8, depth: 'primary' as const },
      // 6 — CENTER-LEFT bottom (heart hands, portrait, background)
      { top: '64%', left: '28%', rotate: -2, z: 3, depth: 'background' as const },
    ],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setShowContinue(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleCardClick = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      onClick={() => showContinue && onNext()}
      className={`relative flex h-[100svh] w-full flex-col items-center justify-start overflow-hidden bg-cream-100 px-4 pt-8 sm:pt-10 ${
        showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <Stardust intensity={0.3} mode="sparkle" />
      <Stardust intensity={0.25} mode="dust" />

      {/* Warm desk glow at the bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(245, 184, 150, 0.16) 0%, transparent 60%)',
          mixBlendMode: 'multiply',
        }}
      />

      <SectionHeader />

      {/* The "desk" — relative container with absolute-positioned cards.
          Slight scale keeps the whole collage inside one viewport on
          smaller screens without shrinking individual cards. */}
      <div className="relative mx-auto w-full max-w-4xl flex-1 origin-top scale-[0.92] sm:scale-[0.95]">
        {/* Atmospheric layer — subtle elements in the title-to-scrapbook gap */}
        <AtmosphericLayer />

        {/* Connectors — gold dots + thin line guiding LEFT → CENTER → RIGHT */}
        <Connectors />

        {/* Subtle birthday details around the edges */}
        <BirthdayDetails />

        {items.map((item, i) => (
          <CardLayer
            key={i}
            item={item}
            index={i}
            position={layout[i]}
            isActive={activeIndex === i}
            isDimmed={activeIndex !== null && activeIndex !== i}
            onClick={() => handleCardClick(i)}
          />
        ))}

        {/* Narrative caption */}
        <NarrativeCaption
          text={birthday.memories.captions[0]}
          top="84%"
          left="34%"
          rotate={-1.8}
          delay={3.0}
        />
      </div>

      {/* Coda */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: DUR.slow, ease: EASE.breathe }}
        className="relative z-10 pb-6 text-center sm:pb-8"
      >
        <p className="font-hand-run text-[15px] font-light leading-relaxed text-espresso-700/60 sm:text-[18px]">
          <ScribbleUnderline color="#c44444">还有很多很多</ScribbleUnderline>，以后慢慢补。
        </p>
      </motion.div>

      {showContinue && (
        <ContinueAffordance label="继续" delay={0.2} bottom="3%" />
      )}
    </section>
  );
}

/* ─── Header ──────────────────────────────────────────────────── */

function SectionHeader() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 pb-2 text-center sm:pb-3">
      <RevealMask delay={0.0}>
        <span className="block text-[9px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[10px]">
          {birthday.memories.sectionLabel}
        </span>
      </RevealMask>

      <div className="mt-2 flex flex-col items-center gap-0.5 sm:mt-3 sm:flex-row sm:justify-center sm:gap-3">
        <RevealMask delay={0.3}>
          <h3 className="block font-hand text-[28px] font-light leading-[0.95] text-espresso-800 sm:text-[44px] md:text-[56px]">
            {birthday.memories.sectionTitle}
          </h3>
        </RevealMask>
        <RevealMask delay={0.9}>
          <h3 className="block font-hand-run text-[28px] font-light leading-[0.95] text-cherry-400 sm:text-[44px] md:text-[56px]">
            {birthday.memories.sectionTitleAccent}
          </h3>
        </RevealMask>
      </div>
    </div>
  );
}

/* ─── Card layer ─────────────────────────────────────────────── */

type Position = {
  top: string;
  left?: string | 'auto';
  right?: string | 'auto';
  rotate: number;
  z: number;
  depth: Depth;
  centerX?: boolean;
};

function CardLayer({
  item,
  index,
  position,
  isActive,
  isDimmed,
  onClick,
}: {
  item: MemoryItem;
  index: number;
  position: Position;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  const baseDelay = 0.6 + index * 0.4;
  const [entranceDone, setEntranceDone] = useState(false);

  // After the staggered entrance completes, switch to no-delay transitions
  // so click-to-center responds immediately.
  useEffect(() => {
    const t = setTimeout(() => setEntranceDone(true), (baseDelay + 0.95) * 1000);
    return () => clearTimeout(t);
  }, [baseDelay]);

  // Depth-based scale (matches PhotoCard internal scale).
  const depthScale =
    position.depth === 'primary'
      ? 1
      : position.depth === 'secondary'
      ? 0.85
      : position.depth === 'foreground'
      ? 0.92
      : 0.7;

  // When active, the card lifts in place: rotates to 0, scales to 1.08,
  // becomes the visual focus. Other cards dim to 0.5 opacity.
  // (We avoid animating top/left/right because interpolating to 'auto'
  // causes a jump — lift-in-place captures the "pick up the photo" feel.)
  const targetRotate = isActive ? 0 : position.rotate;
  const targetScale = isActive ? 1.08 : depthScale;
  const targetOpacity = isActive
    ? 1
    : isDimmed
    ? 0.5
    : position.depth === 'background'
    ? 0.82
    : 1;
  const targetY = isActive ? -12 : 0;
  const targetX = position.centerX ? '-50%' : 0;

  const cardContent = (
    <>
      {item.type === 'note' ? (
        <PaperNote
          text={item.text}
          rotate={0}
          accent="cherry"
          depth={position.depth}
        />
      ) : (
        <PhotoCard
          src={item.src || ''}
          alt={item.caption || ''}
          caption={item.caption}
          year={item.year}
          size={item.size || 'sm'}
          style={(item.style || 'print') as 'polaroid' | 'print' | 'frame'}
          tone={(item.tone || 'warm') as 'warm' | 'cool' | 'mono'}
          tape={item.tape}
          tapeColor={item.tapeColor}
          rotate={0}
          index={index}
          depth={position.depth}
          isActive={isActive}
          aspect={item.aspect}
          onClick={undefined}
        />
      )}
    </>
  );

  return (
    <motion.div
      className="group absolute cursor-pointer"
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        zIndex: isActive ? 100 : position.z,
      }}
      initial={{ opacity: 0, y: 24, rotate: position.rotate - 6 }}
      animate={{
        opacity: targetOpacity,
        x: targetX,
        y: targetY,
        rotate: targetRotate,
        scale: targetScale,
      }}
      transition={
        entranceDone
          ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.8, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }
      }
      whileHover={
        isActive
          ? undefined
          : { scale: depthScale * 1.03, y: -5, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
      }
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <IdleSway active={!isActive}>{cardContent}</IdleSway>

      {/* Small floating doodle beside the card */}
      {item.type !== 'note' && <CardDoodle index={index} delay={baseDelay + 1.0} />}
    </motion.div>
  );
}

/* Idle sway — very subtle oscillation, not scroll-driven.
   Pauses when the card is "picked up" (active) so it sits still. */
function IdleSway({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  return (
    <motion.div
      animate={active ? { rotate: [-0.6, 0.6, -0.6] } : { rotate: 0 }}
      transition={{
        duration: 9 + Math.random() * 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transformOrigin: 'center top' }}
    >
      {children}
    </motion.div>
  );
}

function CardDoodle({ index, delay }: { index: number; delay: number }) {
  const positions = [
    { top: -14, right: -20 },
    { bottom: -14, left: -18 },
    { top: 20, right: -28 },
    { bottom: 20, left: -24 },
    { top: -18, left: -18 },
  ];
  const items = [
    <StarDoodle key="star" size={16} color="#d2b46a" />,
    <FlowerDoodle key="flower" size={18} color="#e88a73" />,
    <Sparkle key="sparkle" size={10} className="text-lavender-300" />,
    <Sparkle key="sparkle2" size={8} className="text-champagne-300" />,
    <StarDoodle key="star2" size={12} color="#e6cf94" />,
  ];
  const pos = positions[index % positions.length];
  const item = items[index % items.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
      animate={{ opacity: 0.7, scale: 1, rotate: 0 }}
      transition={{ duration: 1.4, delay, ease: EASE.breathe }}
      className="pointer-events-none absolute z-30"
      style={pos}
    >
      {item}
    </motion.div>
  );
}

/* ─── Atmospheric layer (title-to-scrapbook gap) ──────────────── */

function AtmosphericLayer() {
  // Tiny gold dots, faint marks, paper fragments — extremely low contrast.
  const dots = [
    { top: '2%', left: '18%' },
    { top: '6%', left: '38%' },
    { top: '3%', left: '62%' },
    { top: '8%', left: '78%' },
    { top: '10%', left: '28%' },
    { top: '5%', left: '88%' },
  ];
  const marks = [
    { top: '4%', left: '50%', char: '·' },
    { top: '9%', left: '14%', char: '…' },
    { top: '7%', left: '70%', char: '·' },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {dots.map((d, i) => (
        <motion.span
          key={`dot-${i}`}
          className="absolute h-[3px] w-[3px] rounded-full bg-champagne-400"
          style={{ top: d.top, left: d.left, opacity: 0.28 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.28, scale: 1 }}
          transition={{ delay: 1.5 + i * 0.15, duration: 1.0, ease: EASE.breathe }}
        />
      ))}
      {marks.map((m, i) => (
        <motion.span
          key={`mark-${i}`}
          className="absolute font-hand text-[12px] italic text-espresso-700"
          style={{ top: m.top, left: m.left, opacity: 0.22 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          transition={{ delay: 2.0 + i * 0.2, duration: 1.2 }}
        >
          {m.char}
        </motion.span>
      ))}
      {/* Very subtle light particles */}
      {[
        { top: '5%', left: '46%' },
        { top: '11%', left: '55%' },
        { top: '3%', left: '24%' },
      ].map((p, i) => (
        <motion.span
          key={`particle-${i}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-cream-200"
          style={{ top: p.top, left: p.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ─── Connectors (LEFT → CENTER → RIGHT) ─────────────────────── */

function Connectors() {
  // A thin hand-drawn line + gold dots forming a subtle path.
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 10 30 Q 28 36 50 34 T 90 30"
          stroke="rgba(210, 180, 106, 0.22)"
          strokeWidth="0.12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="0.6 1.2"
        />
      </svg>
      {[
        { x: 12, y: 30 },
        { x: 26, y: 35 },
        { x: 40, y: 36 },
        { x: 56, y: 34 },
        { x: 72, y: 32 },
        { x: 86, y: 30 },
      ].map((p, i) => (
        <motion.span
          key={`conn-${i}`}
          className="absolute h-[3px] w-[3px] rounded-full bg-champagne-500"
          style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0.32 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.32, scale: 1 }}
          transition={{ delay: 2.5 + i * 0.15, duration: 0.8, ease: EASE.breathe }}
        />
      ))}
    </div>
  );
}

/* ─── Subtle birthday details around edges ────────────────────── */

function BirthdayDetails() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Tiny gold star — top right corner */}
      <motion.div
        className="absolute"
        style={{ top: '6%', right: '4%' }}
        initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
        animate={{ opacity: 0.65, scale: 1, rotate: 0 }}
        transition={{ delay: 2.8, duration: 1.2, ease: EASE.breathe }}
      >
        <StarDoodle size={14} color="#d2b46a" />
      </motion.div>

      {/* Small candle icon — bottom left corner */}
      <motion.div
        className="absolute"
        style={{ bottom: '10%', left: '3%' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 3.2, duration: 1.2, ease: EASE.breathe }}
      >
        <Candle size={0.45} />
      </motion.div>

      {/* Tiny sparkles scattered around edges */}
      <motion.div
        className="absolute"
        style={{ top: '24%', left: '2%' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ delay: 3.0, duration: 1.0 }}
      >
        <Sparkle size={8} className="text-champagne-300" />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ top: '48%', right: '2%' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 3.4, duration: 1.0 }}
      >
        <Sparkle size={7} className="text-champagne-300" />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ bottom: '20%', right: '4%' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 3.6, duration: 1.0 }}
      >
        <Sparkle size={6} className="text-lavender-300" />
      </motion.div>

      {/* Small ribbon fragment — top left */}
      <motion.div
        className="absolute"
        style={{ top: '10%', left: '6%' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 3.1, duration: 1.0, ease: EASE.breathe }}
      >
        <Ribbon size={0.35} />
      </motion.div>

      {/* One or two confetti pieces */}
      <motion.div
        className="absolute"
        style={{ top: '40%', left: '22%' }}
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 0.55, rotate: 20 }}
        transition={{ delay: 3.3, duration: 1.0 }}
      >
        <ConfettiPiece color="#e88a73" size={6} rotation={20} />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ bottom: '28%', left: '40%' }}
        initial={{ opacity: 0, rotate: 40 }}
        animate={{ opacity: 0.5, rotate: -15 }}
        transition={{ delay: 3.5, duration: 1.0 }}
      >
        <ConfettiPiece color="#d2b46a" size={5} rotation={-15} />
      </motion.div>

      {/* Small handwritten "生日" annotation — bottom right */}
      <motion.div
        className="absolute font-hand text-[12px] italic text-espresso-700"
        style={{ bottom: '14%', right: '7%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 3.7, duration: 1.4, ease: EASE.breathe }}
      >
        生日 ·
      </motion.div>

      {/* Small handwritten "b-day" annotation — top area, near the title gap */}
      <motion.div
        className="absolute font-hand text-[11px] italic text-champagne-600"
        style={{ top: '12%', right: '24%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3.9, duration: 1.4, ease: EASE.breathe }}
      >
        a little book of you
      </motion.div>
    </div>
  );
}

/* ─── Narrative caption ──────────────────────────────────────── */

function NarrativeCaption({
  text,
  top,
  left,
  right,
  rotate = 0,
  delay = 0,
}: {
  text: string;
  top?: string;
  left?: string;
  right?: string;
  rotate?: number;
  delay?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-20 max-w-[260px]"
      style={{ top, left, right, transform: `rotate(${rotate}deg)` }}
    >
      <RevealMask delay={delay}>
        <p className="whitespace-pre-line text-center font-hand text-[15px] font-light italic leading-[1.5] text-espresso-800/85 sm:text-[17px]">
          {text}
        </p>
      </RevealMask>
    </div>
  );
}

/* ─── Reusable mask-line reveal ───────────────────────────────── */

function RevealMask({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="will-change-transform"
        initial={{ y: '115%' }}
        animate={{ y: '0%' }}
        transition={{ duration: DUR.ritual, delay, ease: EASE.anticipate }}
      >
        {children}
      </motion.div>
    </div>
  );
}
