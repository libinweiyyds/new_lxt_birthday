import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import GiftBox from '../components/GiftBox';
import WishesBurst from '../components/WishesBurst';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

type Phase = 'idle' | 'prompt' | 'confirm' | 'open' | 'loose' | 'lifting' | 'burst' | 'reveal' | 'climax';

/**
 * Scene 06 — Premium gift box reveal (click-to-advance model).
 *
 *   0.0s  idle      (a few seconds of stillness; section feels empty)
 *   1.5s  prompt    "还有一个。"
 *   3.0s  confirm   "真的。"
 *   4.5s  open      "打开看看？"   (tap here)
 *
 * On tap — staged choreography that matches the new GiftBox animation:
 *   0.0s   bow knot unties + ribbon slides off       (loose state)
 *   1.4s   lid lifts with anticipation + bounce      (lifting — giftBoxState='open')
 *   3.0s   wishes start bursting out of the box      (burst phase)
 *   3.0s   golden light burst (viewport-wide wash)
 *   7.0s   last wish settled
 *   8.4s   "生日快乐。" headline appears at the bottom
 *   9.6s   Continue affordance
 */
export default function SceneInteractive({ onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Stage choreography — auto-advances through idle → prompt → confirm → open.
  // Runs once on mount and schedules the full sequence.
  useEffect(() => {
    const timers = timersRef.current;
    const t1 = setTimeout(() => setPhase('prompt'), 1500);
    const t2 = setTimeout(() => setPhase('confirm'), 3000);
    const t3 = setTimeout(() => setPhase('open'), 4500);
    timers.push(t1, t2, t3);
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleTap = () => {
    // After the climax has settled, left-click anywhere advances.
    if (showContinue) {
      onNext();
      return;
    }
    if (phase !== 'open') return;
    // Staged transition that gives each beat of the GiftBox animation
    // room to breathe: untie → lid lift → glow ramp → burst → reveal.
    timersRef.current.forEach(clearTimeout);
    timersRef.current.push(setTimeout(() => setPhase('loose'), 0));      // bow unties, ribbon slides off
    timersRef.current.push(setTimeout(() => setPhase('lifting'), 1400));// lid lifts with anticipation
    timersRef.current.push(setTimeout(() => setPhase('burst'), 3000));  // lid mostly open, wishes start
    timersRef.current.push(setTimeout(() => setPhase('reveal'), 4600)); // wishes settle
    timersRef.current.push(setTimeout(() => setPhase('climax'), 7800)); // headline
    timersRef.current.push(setTimeout(() => setShowContinue(true), 10200));
  };

  const giftBoxState: 'idle' | 'loose' | 'open' =
    phase === 'loose'
      ? 'loose'
      : phase === 'lifting' ||
        phase === 'burst' ||
        phase === 'reveal' ||
        phase === 'climax'
      ? 'open'
      : 'idle';

  const wishesActive =
    phase === 'burst' || phase === 'reveal' || phase === 'climax';

  return (
    <section
      onClick={handleTap}
      className={`relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-cream-100 ${
        phase === 'open' || showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <BackgroundAtmosphere phase={phase} />

      {/* Wishes flying out of the box — sit above the box in the viewport */}
      <div className="pointer-events-none absolute left-1/2 top-[54%] z-[6] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[420px] w-[800px] max-w-[90vw]">
          <WishesBurst
            wishes={birthday.birthdayMessages.interactive.giftWishes}
            active={wishesActive}
          />
        </div>
      </div>

      {/* The gift box */}
      <div className="relative z-10 flex items-center justify-center">
        <GiftBox state={giftBoxState} size={1} />
      </div>

      {/* Phase-specific text — sits above the box at the top */}
      <div className="absolute inset-x-0 top-[14%] z-20 flex flex-col items-center px-8 text-center sm:top-[12%]">
        <AnimatePresence mode="wait">
          {phase === 'idle' && <IdlePulse key="i" />}
          {phase === 'prompt' && <PromptLine key="p" text={birthday.birthdayMessages.interactive.prompt} />}
          {phase === 'confirm' && <PromptLine key="c" text={birthday.birthdayMessages.interactive.promptConfirm} />}
          {phase === 'open' && <OpenPrompt key="o" />}
          {(phase === 'loose' || phase === 'lifting') && <BurstMoment key="l" />}
          {phase === 'burst' && <BurstMoment key="b" />}
          {(phase === 'reveal' || phase === 'climax') && (
            <RevealLines key="r" phase={phase} />
          )}
        </AnimatePresence>
      </div>

      {/* "生日快乐。" headline — appears at the bottom after wishes settle */}
      <AnimatePresence>
        {phase === 'climax' && <ClimaxHeadline key="climax-headline" />}
      </AnimatePresence>

      {/* Golden light burst — viewport-wide wash, fires at 'burst' */}
      <LightBurst active={phase === 'burst' || phase === 'reveal' || phase === 'climax'} />

      {/* Continue affordance — after the climax */}
      {showContinue && (
        <ContinueAffordance label="继续" delay={0.3} bottom="6%" />
      )}
    </section>
  );
}

/* ─── Background atmosphere (driven by phase) ──────────────── */

function BackgroundAtmosphere({ phase }: { phase: Phase }) {
  const isClimax = phase === 'climax' || phase === 'burst' || phase === 'reveal';
  return (
    <>
      <Stardust intensity={isClimax ? 1.4 : 0.4} mode="sparkle" />
      <Stardust intensity={isClimax ? 0.7 : 0.25} mode="dust" />
      {isClimax && <Stardust intensity={1.0} mode="bloom" />}

      {/* Subtle warm radial light around the gift box */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          opacity: isClimax ? 0.85 : 0.35,
          scale: isClimax ? [1, 1.4] : 1,
        }}
        transition={{
          opacity: { duration: 1.0, ease: EASE.breathe },
          scale: { duration: 2.4, ease: EASE.breathe },
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 213, 138, 0.5) 0%, rgba(245, 184, 150, 0.18) 40%, transparent 70%)',
          mixBlendMode: 'multiply',
        }}
      />
    </>
  );
}

/* ─── Phases ─────────────────────────────────────────────────── */

function IdlePulse() {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: EASE.breathe }}
      className="flex flex-col items-center"
    >
      <span className="text-[9px] font-light uppercase tracking-cinematic text-espresso-700/45 sm:text-[10px]">
        {birthday.birthdayMessages.interactive.sectionLabel}
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
      <span className="font-hand text-[28px] font-light italic text-cherry-400 sm:text-[34px]">
        {text}
      </span>
    </motion.div>
  );
}

function OpenPrompt() {
  return (
    <motion.div
      key="open"
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: DUR.ritual, ease: EASE.breathe }}
      className="flex flex-col items-center"
    >
      <span className="font-hand text-[24px] font-light text-espresso-800 sm:text-[30px]">
        {birthday.birthdayMessages.interactive.promptOpen}
      </span>
      <motion.span
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-6 text-[9px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[10px]"
      >
        {birthday.birthdayMessages.interactive.tapHint}
      </motion.span>
    </motion.div>
  );
}

function BurstMoment() {
  return (
    <motion.div
      key="burst"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE.breathe }}
      className="flex flex-col items-center"
    >
      <span className="font-hand text-[22px] font-light italic text-espresso-700/85 sm:text-[26px]">
        打开看看。
      </span>
    </motion.div>
  );
}

function RevealLines({ phase }: { phase: Phase }) {
  const showClimax = phase === 'climax';
  return (
    <motion.div
      key="reveal-lines"
      className="flex flex-col items-center gap-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.6, delayChildren: 0.2 } },
      }}
    >
      <MaskLine
        className="font-hand text-[24px] font-light italic text-cherry-400 sm:text-[30px]"
        delay={0}
      >
        {birthday.birthdayMessages.interactive.afterReveal}
      </MaskLine>
    </motion.div>
  );
}

function ClimaxHeadline() {
  return (
    <motion.div
      key="climax-headline"
      initial={{ opacity: 0, y: 18, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.ritual + 0.6, ease: EASE.breathe }}
      className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
    >
      <h2 className="bg-gradient-to-r from-cherry-400 via-rose-300 to-champagne-300 bg-clip-text text-center font-hand text-[48px] font-light italic leading-[1.1] tracking-[0.04em] text-transparent sm:text-[88px] md:text-[120px]">
        {birthday.birthdayMessages.interactive.climaxLine}
      </h2>
    </motion.div>
  );
}

function MaskLine({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  // Fade + blur + small fixed-pixel y offset — robust to font swap reflow.
  // The earlier mask-reveal (`y: '115%'` inside `overflow: hidden`) caused
  // visible "jumping" because the percentage height depends on the font's
  // ascender/descender, which shifts when the handwritten font swaps in
  // from its fallback. Fixed pixels + opacity + blur gives the same
  // gentle reveal without that reflow.
  return (
    <span className={`block ${className}`}>
      <motion.span
        className="block"
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: DUR.ritual, delay, ease: EASE.anticipate }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Viewport-wide light burst ────────────────────────────── */

function LightBurst({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Core glow — strong warm wash, screen blend, covers viewport */}
          <motion.div
            key="core"
            className="pointer-events-none absolute inset-0 z-[110]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.85, 0.6], scale: [0.4, 1.4, 2.0] }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 2.4, ease: EASE.breathe }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 232, 180, 0.95) 0%, rgba(251, 208, 130, 0.6) 25%, rgba(232, 138, 115, 0.2) 50%, transparent 80%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Secondary — a softer champagne wash, multiply blend, under the core */}
          <motion.div
            key="soft"
            className="pointer-events-none absolute inset-0 z-[105]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55], transition: { duration: 2.0 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255, 220, 180, 0.5) 0%, rgba(245, 184, 150, 0.18) 40%, transparent 75%)',
              mixBlendMode: 'multiply',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
