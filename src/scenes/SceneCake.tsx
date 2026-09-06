import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import BirthdayCake from '../components/BirthdayCake';
import ContinueAffordance from '../components/ContinueAffordance';
import { useMicBlow } from '../hooks/useMicBlow';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

type Phase =
  | 'idle'
  | 'prompt'
  | 'confirm'
  | 'ignite'
  | 'wish'
  | 'blowing'
  | 'blessing';

/**
 * Scene 07 — Premium birthday cake.
 *
 *   0.0s  idle      (a few seconds of stillness)
 *   1.5s  prompt    "好了。"
 *   3.0s  confirm   "现在轮到你了。"
 *   4.5s  ignite    candles light up one at a time (3-2-1 stagger)
 *   6.5s  wish      "许个愿吧。"   + tap hint
 *
 *   On tap (wish / ignite):
 *     candles blow out ONE BY ONE (250ms apart, left → right)
 *     +1.0s after the last candle out → blessing message fades in
 *     +3.0s after the blessing appears  → Continue affordance
 *
 *   On continue → onNext()  (advances to the finale)
 */
export default function SceneCake({ onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [showContinue, setShowContinue] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>(
    () => Array(birthday.birthdayMessages.cake.candleCount).fill(false)
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Stage choreography — auto-advance through the pre-blow sequence.
  // Schedule all transitions on mount with absolute delays so the
  // sequence runs even if the user doesn't interact. Cleared on unmount
  // or when the user blows (handleBlow clears pending timers).
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('prompt'), 1500);
    const t2 = setTimeout(() => setPhase('confirm'), 3000);
    const t3 = setTimeout(() => setPhase('ignite'), 4500);
    const t4 = setTimeout(() => setPhase('wish'), 6500);
    timersRef.current.push(t1, t2, t3, t4);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // When entering the 'ignite' phase, light candles 3-2-1 (center first).
  useEffect(() => {
    if (phase !== 'ignite') return;
    const n = birthday.birthdayMessages.cake.candleCount;
    const t1 = setTimeout(() => {
      setCandlesLit((prev) => {
        const next = [...prev];
        next[Math.floor(n / 2)] = true; // center first
        return next;
      });
    }, 200);
    const t2 = setTimeout(() => {
      setCandlesLit((prev) => {
        const next = [...prev];
        const sides = [0, n - 1];
        sides.forEach((i) => (next[i] = true));
        return next;
      });
    }, 700);
    const t3 = setTimeout(() => {
      setCandlesLit((prev) => {
        const next = [...prev];
        if (n === 5) {
          next[1] = true;
          next[3] = true;
        } else {
          for (let i = 0; i < n; i++) next[i] = true;
        }
        return next;
      });
    }, 1200);
    timersRef.current.push(t1, t2, t3);
  }, [phase]);

  // Blow-out — candles go out one by one, left → right, 250ms apart.
  // After the last candle is out, wait a beat, then reveal the blessing
  // message. After the blessing has had time to breathe, show the
  // continue affordance so the user can advance to the finale.
  const handleBlow = useCallback(() => {
    setPhase((p) => {
      if (p !== 'wish' && p !== 'ignite') return p;
      return 'blowing';
    });

    // Cancel any pending auto-sequence timers (e.g. the 'wish' timer
    // still pending if the user blew during 'ignite' at 4.5–6.5s).
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const n = birthday.birthdayMessages.cake.candleCount;
    // Stagger each candle out, left → right.
    for (let i = 0; i < n; i++) {
      timersRef.current.push(
        setTimeout(() => {
          setCandlesLit((prev) => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }, i * 250)
      );
    }
    // Last candle goes out at (n - 1) * 250 ms. Wait a beat after,
    // then reveal the blessing message.
    const blowDoneMs = (n - 1) * 250;
    timersRef.current.push(
      setTimeout(() => setPhase('blessing'), blowDoneMs + 900)
    );
    // Let the blessing breathe, then show the continue affordance.
    timersRef.current.push(
      setTimeout(() => setShowContinue(true), blowDoneMs + 900 + 2800)
    );
  }, []);

  // ── Interactions ──────────────────────────────────────────────
  // Long-press (≥600ms) also triggers a blow — kept for parity with
  // the original design, though a simple tap is the primary path.
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPress = useCallback(() => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => handleBlow(), 600);
  }, [handleBlow]);
  const endPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  // Tap also blows (one short tap counts as a single blow attempt).
  // After the blessing has settled, left-click anywhere advances.
  const onClick = useCallback(() => {
    if (showContinue) {
      onNext();
      return;
    }
    if (phase === 'wish' || phase === 'ignite') handleBlow();
  }, [phase, handleBlow, showContinue, onNext]);

  // Mic detection (optional, falls back to tap silently).
  useMicBlow({
    enabled:
      birthday.birthdayMessages.cake.enableMic &&
      (phase === 'wish' || phase === 'ignite'),
    onBlow: handleBlow,
  });

  const isDim = phase === 'blowing' || phase === 'blessing';

  return (
    <section
      onClick={onClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className={`relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-cream-100 ${
        phase === 'wish' || phase === 'ignite' || showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <BackgroundAtmosphere phase={phase} />

      {/* The cake */}
      <div className="relative z-10">
        <BirthdayCake lit={candlesLit} size={1} />
      </div>

      {/* Phase-specific text — sits above the cake at the top */}
      <div className="absolute inset-x-0 top-[14%] z-20 flex flex-col items-center px-8 text-center sm:top-[12%]">
        <AnimatePresence mode="wait">
          {phase === 'idle' && <IdlePulse key="i" />}
          {phase === 'prompt' && <PromptLine key="p" text={birthday.birthdayMessages.cake.prompt} />}
          {phase === 'confirm' && <PromptLine key="c" text={birthday.birthdayMessages.cake.promptConfirm} />}
          {phase === 'ignite' && <IgniteLabel key="ig" />}
          {phase === 'wish' && <WishPrompt key="w" />}
          {phase === 'blowing' && <BlowingMoment key="bl" />}
        </AnimatePresence>
      </div>

      {/* Blessing message — appears after all candles are out,
          centered over the cake */}
      <AnimatePresence>
        {phase === 'blessing' && <BlessingMessage key="blessing" />}
      </AnimatePresence>

      {/* Soft dim overlay after blow-out */}
      <DimOverlay active={isDim} />

      {/* Continue affordance — after the blessing */}
      {showContinue && (
        <ContinueAffordance label="继续" delay={0.3} bottom="6%" />
      )}
    </section>
  );
}

/* ─── Background atmosphere ──────────────────────────────────── */

function BackgroundAtmosphere({ phase }: { phase: Phase }) {
  const isClimax = phase === 'wish' || phase === 'ignite';
  const isDim = phase === 'blowing' || phase === 'blessing';
  return (
    <>
      <Stardust intensity={isDim ? 0.15 : 0.4} mode="sparkle" />
      <Stardust intensity={isDim ? 0.08 : 0.22} mode="dust" />

      {/* Warm radial wash — fades to cool/dim after blow-out */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: isDim
            ? 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(150, 140, 150, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 220, 180, 0.32) 0%, rgba(251, 208, 179, 0.12) 35%, transparent 70%)',
        }}
        transition={{ duration: 2.4, ease: EASE.breathe }}
      />
    </>
  );
}

/* ─── Dim overlay (after blow-out) ────────────────────────────── */

function DimOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: EASE.breathe }}
          style={{ background: 'rgba(20, 16, 18, 0.55)' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── Phases ──────────────────────────────────────────────────── */

function IdlePulse() {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: EASE.breathe }}
    >
      <span className="text-[9px] font-light uppercase tracking-cinematic text-espresso-700/45 sm:text-[10px]">
        {birthday.birthdayMessages.cake.sectionLabel}
      </span>
    </motion.div>
  );
}

function PromptLine({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: DUR.ritual, ease: EASE.breathe }}
    >
      <span className="font-hand text-[30px] text-cherry-400 sm:text-[36px]">
        {text}
      </span>
    </motion.div>
  );
}

function IgniteLabel() {
  return (
    <motion.div
      key="ig"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: EASE.breathe }}
    >
      <span className="font-hand text-[22px] font-light italic text-espresso-700/75 sm:text-[26px]">
        准备好了吗。
      </span>
    </motion.div>
  );
}

function WishPrompt() {
  return (
    <motion.div
      key="w"
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: DUR.ritual, ease: EASE.breathe }}
      className="flex flex-col items-center"
    >
      <span className="font-hand text-[26px] text-espresso-800 sm:text-[32px]">
        {birthday.birthdayMessages.cake.promptWish}
      </span>
      <motion.span
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-6 text-[9px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[10px]"
      >
        {birthday.birthdayMessages.cake.tapHint}
      </motion.span>
    </motion.div>
  );
}

function BlowingMoment() {
  return (
    <motion.div
      key="blowing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: EASE.breathe }}
    >
      <span className="font-hand text-[26px] text-cherry-400/85 sm:text-[30px]">
        呼——
      </span>
    </motion.div>
  );
}

/* ─── Blessing message — appears after the last candle goes out ── */
/**
 * Centered over the cake. Two lines, handwritten cherry, with a soft
 * cream "card" behind so it reads against the dimmed background. The
 * blessing is short on purpose — the finale scene carries the longer
 * blessing. This is just the immediate, intimate "your wish is sealed"
 * moment right after the candles go out.
 */
function BlessingMessage() {
  const lines = birthday.birthdayMessages.cake.blessing.split('\n');
  return (
    <motion.div
      className="absolute inset-0 z-[70] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE.breathe } }}
      transition={{ duration: DUR.ritual, ease: EASE.breathe }}
    >
      <motion.div
        initial={{ y: 16, filter: 'blur(10px)' }}
        animate={{ y: 0, filter: 'blur(0px)' }}
        transition={{ duration: DUR.ritual, delay: 0.15, ease: EASE.breathe }}
        className="relative max-w-[440px] px-10 py-9 text-center"
        style={{
          background:
            'linear-gradient(180deg, rgba(253, 250, 243, 0.92) 0%, rgba(247, 234, 216, 0.88) 100%)',
          borderRadius: 4,
          boxShadow:
            '0 1px 2px rgba(58, 46, 42, 0.05), 0 8px 24px rgba(58, 46, 42, 0.10), 0 24px 60px -12px rgba(58, 46, 42, 0.14)',
        }}
      >
        {/* Tiny star ornament on top */}
        <motion.span
          className="mb-3 block text-champagne-400"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: EASE.breathe }}
          aria-hidden
        >
          ✦
        </motion.span>
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3 + i * 0.4,
              duration: DUR.slow,
              ease: EASE.breathe,
            }}
            className="whitespace-pre-line font-hand text-[18px] leading-[1.9] text-espresso-800 sm:text-[22px]"
          >
            {line}
          </motion.p>
        ))}
        {/* Signature line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1.4, ease: EASE.breathe }}
          className="mt-5 font-hand text-[13px] italic text-espresso-700/55 sm:text-[15px]"
        >
          — 已被悄悄接住 —
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
