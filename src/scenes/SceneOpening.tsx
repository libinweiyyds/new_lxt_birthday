import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { birthday } from '../data/birthday';
import { useMusic } from '../hooks/useMusic';
import { Sparkle } from '../components/Illustrations';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = {
  onBegin: () => void;
};

/**
 * Stages of the opening scene, in strict order.
 *
 *   0.0s  bg       cream fades in
 *   0.3s  dust     tiny golden motes drift up (very faint)
 *   0.5s  hey      "嘿。"
 *   1.3s  wait     "先别急着往下看。"
 *   2.3s  reveal   "这里有一份东西，是偷偷准备给你的。"
 *   3.2s  hint     small candle + tiny stars (center-bottom)
 *   4.0s  invite   "打开这份小惊喜" + ↓ (bottom)
 *
 * First click — starts the press sequence, then PAUSES on "那就给你看看。"
 * so the user can read it. A "继续 ↓" hint appears after a beat.
 *
 *   0.0s  pressed  flame brightens, warm glow spreads, particles gather
 *   0.9s  ok       "好。"
 *   2.0s  show     "那就给你看看。"   (PAUSE — wait here)
 *   ~3.2s continue hint fades in
 *
 * Second click — triggers the paper reveal and transitions to the film.
 *   0.0s  wipe     paper reveal (top → bottom, 1.4s)
 *   1.55s begin    → onBegin()
 */
type Stage =
  | 'bg'
  | 'dust'
  | 'hey'
  | 'wait'
  | 'reveal'
  | 'hint'
  | 'invite'
  | 'pressed'
  | 'ok'
  | 'show'
  | 'wipe';

const STAGE_ORDER: Stage[] = [
  'bg',
  'dust',
  'hey',
  'wait',
  'reveal',
  'hint',
  'invite',
  'pressed',
  'ok',
  'show',
  'wipe',
];

const REVEAL_DELAYS: { stage: Stage; delay: number }[] = [
  { stage: 'dust', delay: 300 },
  { stage: 'hey', delay: 500 },
  { stage: 'wait', delay: 1300 },
  { stage: 'reveal', delay: 2300 },
  { stage: 'hint', delay: 3200 },
  { stage: 'invite', delay: 4000 },
];

const TEXT_COLOR = '#59433B';

export default function SceneOpening({ onBegin }: Props) {
  const [stage, setStage] = useState<Stage>('bg');
  const [showContinue, setShowContinue] = useState(false);
  const lockRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { toggle: toggleMusic } = useMusic();

  // Staged reveal — schedule the pre-press sequence once on mount.
  useEffect(() => {
    REVEAL_DELAYS.forEach(({ stage: s, delay }) => {
      const id = setTimeout(() => setStage(s), delay);
      timers.current.push(id);
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const handleTap = async () => {
    if (lockRef.current) return;

    // Second click — once "那就给你看看。" has appeared, trigger the
    // paper reveal and transition into the film.
    if (stage === 'show') {
      lockRef.current = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      timers.current.push(setTimeout(() => setStage('wipe'), 0));
      // Wipe is 1.4s long; wait for it to fully cover the screen
      // before transitioning, with a tiny breath.
      timers.current.push(setTimeout(onBegin, 1550));
      return;
    }

    // Ignore clicks that fire mid-sequence (pressed → ok → show).
    if (stage === 'pressed' || stage === 'ok' || stage === 'wipe') return;

    // First click — start the press sequence. PAUSE on 'show' so the
    // user can read "那就给你看看。" and click again to continue.
    lockRef.current = true;
    // Clear any pending pre-press timers so they can't override the press
    // sequence (e.g. setStage('invite') firing after setStage('pressed')).
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // Try starting music (browser autoplay may block; fail silently).
    try {
      await toggleMusic();
    } catch {
      /* autoplay blocked */
    }

    // Press sequence — stops at 'show' to wait for the second click.
    timers.current.push(setTimeout(() => setStage('pressed'), 0));
    timers.current.push(setTimeout(() => setStage('ok'), 900));
    timers.current.push(setTimeout(() => setStage('show'), 2000));
    // Release the lock so the second click can fire; then reveal the
    // continue affordance after a beat so the line has time to breathe.
    timers.current.push(setTimeout(() => { lockRef.current = false; }, 2100));
    timers.current.push(setTimeout(() => setShowContinue(true), 3200));
  };

  const stageIndex = STAGE_ORDER.indexOf(stage);
  const showHey = stageIndex >= 2;
  const showWait = stageIndex >= 3;
  const showReveal = stageIndex >= 4;
  const showHint = stageIndex >= 5;
  const showInvite = stageIndex >= 6;
  const isPressed = stageIndex >= 7;
  const showOk = stageIndex >= 8;
  const showShow = stageIndex >= 9;
  const showWipe = stageIndex >= 10;

  return (
    <motion.section
      onClick={handleTap}
      className="relative flex h-[100svh] w-full cursor-pointer items-center justify-center overflow-hidden"
      style={{ background: '#FFF8EE' }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1.4, ease: EASE.breathe },
      }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE.breathe } }}
    >
      <PaperGrain />
      {stage !== 'bg' && <FloatingDust key="dust" />}

      {/* Top-right entry hint — "给特别的你 ▶" */}
      <EntryButton />

      {/* ── Center staged text ──────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          {!isPressed ? (
            <motion.div
              key="pre"
              className="flex flex-col items-center"
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.6, ease: EASE.breathe } }}
            >
              {showHey && (
                <StageText text={birthday.birthdayMessages.opening.heyLine} delay={0} />
              )}
              {showWait && (
                <StageText
                  text={birthday.birthdayMessages.opening.waitLine}
                  delay={0.2}
                  mt={14}
                />
              )}
              {showReveal && (
                <StageText
                  text={birthday.birthdayMessages.opening.revealLine}
                  delay={0.3}
                  mt={20}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="post"
              className="flex flex-col items-center"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: EASE.breathe }}
            >
              {showOk && (
                <StageText text={birthday.birthdayMessages.opening.okLine} delay={0} />
              )}
              {showShow && (
                <StageText
                  text={birthday.birthdayMessages.opening.showLine}
                  delay={0.2}
                  mt={16}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Hint candle + tiny stars (center-bottom) ─────────────── */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE.breathe } }}
            transition={{ duration: DUR.ritual, ease: EASE.breathe }}
            className="absolute left-1/2 top-[60%] -translate-x-1/2"
          >
            <div className="relative">
              <HintCandle brightened={isPressed} />
              {!isPressed && <TinyStars />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom invite — "打开这份小惊喜" + ↓ ───────────────── */}
      <AnimatePresence>
        {showInvite && !isPressed && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE.breathe } }}
            transition={{ duration: DUR.slow, ease: EASE.breathe }}
            className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-[12%]"
          >
            <span
              className="font-hand-zh text-[12px] font-light tracking-soft sm:text-[13px]"
              style={{ color: TEXT_COLOR, opacity: 0.65 }}
            >
              {birthday.birthdayMessages.opening.inviteLabel}
            </span>
            <motion.svg
              viewBox="0 0 16 16"
              className="h-3 w-3"
              style={{ color: TEXT_COLOR, opacity: 0.45 }}
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M8 2 L8 12 M4 8 L8 12 L12 8" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue affordance — shown after "那就给你看看。" ──── */}
      {showContinue && stage === 'show' && (
        <ContinueAffordance label="继续" delay={0.2} bottom="10%" />
      )}

      {/* ── Click effects ───────────────────────────────────────── */}
      <AnimatePresence>
        {isPressed && (
          <>
            <WarmGlow key="glow" />
            <GatherParticles key="gather" />
          </>
        )}
      </AnimatePresence>

      {/* ── Paper reveal transition (top → bottom) ───────────────── */}
      <AnimatePresence>
        {showWipe && <PaperReveal key="wipe" />}
      </AnimatePresence>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Entry button — top-right "给特别的你 ▶"
   ───────────────────────────────────────────────────────────── */

function EntryButton() {
  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: DUR.slow, ease: EASE.breathe }}
      className="group fixed right-6 top-6 z-[80] flex items-center gap-2.5 sm:right-9 sm:top-9"
      style={{ color: TEXT_COLOR }}
      aria-label={`${birthday.birthdayMessages.opening.entryLabel} · 打开`}
    >
      <svg
        viewBox="0 0 12 12"
        className="h-2 w-2 opacity-60 transition-all duration-700 group-hover:translate-x-0.5 group-hover:opacity-100"
        fill="currentColor"
        aria-hidden
      >
        <path d="M2 1 L10 6 L2 11 Z" />
      </svg>
      <span className="font-hand-zh text-[12px] font-light tracking-soft opacity-70 transition-opacity duration-700 group-hover:opacity-100 sm:text-[13px]">
        {birthday.birthdayMessages.opening.entryLabel}
      </span>
      <span className="hidden h-px w-5 bg-current opacity-30 transition-all duration-700 group-hover:w-8 group-hover:opacity-60 sm:inline-block" />
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stage text — premium serif Chinese, very small, loose leading
   ───────────────────────────────────────────────────────────── */

function StageText({
  text,
  delay = 0,
  mt = 0,
}: {
  text: string;
  delay?: number;
  mt?: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: DUR.slow, delay, ease: EASE.breathe }}
      className="whitespace-pre-line font-hand-zh text-[15px] font-light leading-[2.2] sm:text-[17px]"
      style={{ color: TEXT_COLOR, marginTop: mt ? `${mt}px` : 0 }}
    >
      {text}
    </motion.p>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hint candle — small, delicate, cream body + tiny gold flame
   ───────────────────────────────────────────────────────────── */

function HintCandle({ brightened }: { brightened: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Warm radial halo behind the flame */}
      <motion.div
        className="pointer-events-none absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full"
        animate={{
          opacity: brightened
            ? [0.5, 0.95, 0.75]
            : [0.3, 0.55, 0.3],
          scale: brightened ? [1, 1.5, 1.3] : 1,
        }}
        transition={{
          opacity: { duration: brightened ? 1.4 : 2.4, ease: EASE.breathe },
          scale: { duration: 1.2, ease: EASE.breathe },
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 213, 138, 0.55) 0%, rgba(245, 184, 150, 0.2) 35%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Flame */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: brightened ? [1, 1.2, 1.15] : 1,
        }}
        transition={{
          opacity: { duration: 1.4, ease: EASE.breathe },
          scale: { duration: 1.0, ease: EASE.breathe },
        }}
      >
        <HintFlame brightened={brightened} />
      </motion.div>

      {/* Wick */}
      <div className="h-2 w-px" style={{ backgroundColor: '#3a2e2a' }} />

      {/* Candle body — slim, ivory */}
      <div className="relative">
        <div
          className="h-14 w-2 sm:h-16 sm:w-2.5"
          style={{
            background: 'linear-gradient(180deg, #fdfaf3 0%, #f5ead8 100%)',
            boxShadow:
              'inset -1px 0 2px rgba(196, 68, 68, 0.12), inset 1px 0 1px rgba(255, 255, 255, 0.6)',
          }}
        />
        {/* Top wax drip */}
        <div
          className="absolute -top-1 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full"
          style={{ background: '#ecdcc0' }}
        />
        {/* Subtle base shadow */}
        <div
          className="absolute -bottom-2 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(58, 46, 42, 0.16) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  );
}

function HintFlame({ brightened }: { brightened: boolean }) {
  return (
    <svg
      viewBox="0 0 24 36"
      width={20}
      height={30}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <radialGradient id="hint-flame-outer" cx="50%" cy="78%" r="65%">
          <stop offset="0%" stopColor="#fff3c8" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffce7a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#e8895a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hint-flame-core" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#ffe6a8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer flame — slower sway */}
      <motion.path
        d="M12 4 C9 10 8 18 10 26 C11 30 11.5 33 12 34 C12.5 33 13 30 14 26 C16 18 15 10 12 4 Z"
        fill="url(#hint-flame-outer)"
        animate={{
          scaleY: [1, 1.06, 0.97, 1.04, 0.98, 1],
          scaleX: [1, 0.95, 1.05, 0.97, 1.02, 1],
          rotate: [-1, 1, -0.5, 1.5, -1, 0],
        }}
        transition={{
          duration: brightened ? 1.4 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '12px 34px', transformBox: 'fill-box' }}
      />

      {/* Inner core */}
      <motion.path
        d="M12 12 C10.5 16 10 22 11 26 C11.5 28 12 30 12 31 C12 30 12.5 28 13 26 C14 22 13.5 16 12 12 Z"
        fill="url(#hint-flame-core)"
        animate={{
          scaleY: [1, 1.08, 0.94, 1.05, 0.96, 1],
          scaleX: [1, 0.92, 1.06, 0.95, 1.04, 1],
        }}
        transition={{
          duration: brightened ? 0.9 : 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '12px 31px', transformBox: 'fill-box' }}
      />

      {/* Brightest point — when brightened */}
      {brightened && (
        <motion.circle
          cx="12"
          cy="24"
          r="2"
          fill="rgba(255, 255, 255, 0.95)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tiny stars — 4 very small gold stars around the candle
   ───────────────────────────────────────────────────────────── */

function TinyStars() {
  const stars = useMemo(
    () => [
      { top: -14, left: -36, size: 6, delay: 0 },
      { top: -18, right: -34, size: 5, delay: 0.8 },
      { top: 30, left: -44, size: 4, delay: 1.6 },
      { top: 24, right: -40, size: 5, delay: 2.4 },
    ],
    []
  );

  return (
    <>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ top: s.top, left: s.left, right: s.right }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: 1,
          }}
          transition={{
            opacity: {
              duration: 3 + i * 0.4,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            scale: { duration: 1.4, delay: s.delay, ease: EASE.breathe },
          }}
        >
          <Sparkle size={s.size} className="text-champagne-300" />
        </motion.div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Warm glow — radial wash that breathes across the page on click
   ───────────────────────────────────────────────────────────── */

function WarmGlow() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 0.55] }}
      transition={{ duration: 2.4, ease: EASE.breathe }}
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 220, 180, 0.55) 0%, rgba(251, 208, 179, 0.25) 35%, transparent 70%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Gather particles — gold motes fly IN to center on click
   ───────────────────────────────────────────────────────────── */

function GatherParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const distance = 50 + Math.random() * 70; // vmin
        return {
          id: i,
          startX: Math.cos(angle) * distance,
          startY: Math.sin(angle) * distance * 0.6,
          size: 1.5 + Math.random() * 2,
          delay: Math.random() * 0.4,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-[110] -translate-x-1/2 -translate-y-1/2">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: -p.size / 2,
            top: -p.size / 2,
            background:
              'radial-gradient(circle, #fff3c8 0%, #e6cf94 60%, transparent 100%)',
            boxShadow: '0 0 4px rgba(255, 220, 160, 0.6)',
          }}
          initial={{ x: `${p.startX}vmin`, y: `${p.startY}vmin`, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, delay: p.delay, ease: EASE.breathe }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Paper reveal transition — top → bottom clip-path wipe
   ───────────────────────────────────────────────────────────── */

function PaperReveal() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[120]"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.4, ease: EASE.breathe }}
      style={{
        background:
          'linear-gradient(180deg, #fde4d3 0%, #faf3e8 40%, #fdf6e8 100%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Paper grain — fixed SVG noise overlay, very subtle
   ───────────────────────────────────────────────────────────── */

function PaperGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        opacity: 0.05,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
      aria-hidden
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Floating dust — 28 tiny warm motes drifting upward (very faint)
   ───────────────────────────────────────────────────────────── */

function FloatingDust() {
  const motes = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 1 + Math.random() * 1.4,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 6,
        opacity: 0.18 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: EASE.breathe }}
      className="pointer-events-none absolute inset-0"
    >
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute bottom-0 block rounded-full"
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            background: 'rgba(210, 170, 110, 0.85)',
            boxShadow: '0 0 4px rgba(255, 220, 160, 0.35)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '-110vh'],
            opacity: [0, m.opacity, m.opacity, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
}
