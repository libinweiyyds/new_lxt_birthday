import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE } from '../lib/motion';

type Props = { onNext: () => void };

type Phase = 'silence' | 'stars' | 'headline' | 'name' | 'blessing' | 'celebration';

const PHASE_ORDER: Phase[] = ['silence', 'stars', 'headline', 'name', 'blessing', 'celebration'];

const PHASE_TIMINGS: Record<Phase, number> = {
  silence: 0,
  stars: 1000,
  headline: 4000,
  name: 5800,
  blessing: 7400,
  celebration: 9800,
};

/**
 * Scene 07 — Emotional Climax (click-to-advance model).
 *
 *   0.0s  silence       darker, quieter pause after the candles
 *   1.0s  stars         one tiny star, then more — gradual field
 *   4.0s  headline      "Happy Birthday" — blur → focus, scale, letter-spacing
 *   5.8s  name           friend's name in italic serif
 *   7.4s  blessing        Chinese blessing in serif
 *   9.8s  celebration     champagne confetti + glowing particles
 *  ~13.0s Continue affordance — into the quiet birthday card resolution
 */
export default function SceneFinale({ onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('silence');
  const [starRevealAt, setStarRevealAt] = useState<number | null>(null);
  const [showContinue, setShowContinue] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const queue: Phase[] = ['stars', 'headline', 'name', 'blessing', 'celebration'];
    queue.forEach((p) => {
      const id = setTimeout(() => setPhase(p), PHASE_TIMINGS[p]);
      timersRef.current.push(id);
    });
    const starId = setTimeout(() => setStarRevealAt(performance.now()), PHASE_TIMINGS.stars);
    timersRef.current.push(starId);
    const continueId = setTimeout(() => setShowContinue(true), 13000);
    timersRef.current.push(continueId);
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const phaseIndex = PHASE_ORDER.indexOf(phase);
  const showHeadline = phaseIndex >= 2;
  const showName = phaseIndex >= 3;
  const showBlessing = phaseIndex >= 4;
  const showConfetti = phaseIndex >= 5;

  return (
    <section
      onClick={() => showContinue && onNext()}
      className={`relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-espresso-900 ${
        showContinue ? 'cursor-pointer' : ''
      }`}
    >
      {/* Warm radial wash on the dark background — keeps the scene warm, not sad */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 200, 140, 0.10) 0%, transparent 70%)',
        }}
      />

      {/* Star field — gradually revealed after the silence */}
      <Stardust
        intensity={0.75}
        mode="sparkle"
        revealAt={starRevealAt}
        revealDuration={3000}
        blendMode="screen"
      />
      <Stardust
        intensity={0.45}
        mode="bokeh"
        revealAt={starRevealAt ? starRevealAt + 600 : null}
        revealDuration={3500}
        blendMode="screen"
      />

      {/* Subtle vignette — pulls focus to center, adds cinematic depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(20, 16, 18, 0.55) 100%)',
        }}
      />

      {/* Cinematic typography — emerges through blur → focus, opacity, scale, letter-spacing */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, filter: 'blur(24px)', scale: 1.06, letterSpacing: '0.4em' }}
          animate={
            showHeadline
              ? { opacity: 1, filter: 'blur(0px)', scale: 1, letterSpacing: '0.04em' }
              : {}
          }
          transition={{ duration: 2.6, ease: EASE.breathe }}
          className="font-hand text-[42px] font-light leading-[1.05] text-cream-50 sm:text-[64px] md:text-[80px]"
        >
          {birthday.birthdayMessages.finale.headline}
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, filter: 'blur(16px)', scale: 1.04, letterSpacing: '0.18em' }}
          animate={
            showName
              ? { opacity: 1, filter: 'blur(0px)', scale: 1, letterSpacing: '0.06em' }
              : {}
          }
          transition={{ duration: 2.2, ease: EASE.breathe, delay: 0.2 }}
          className="mt-4 font-hand text-[22px] font-light italic leading-[1.1] text-cream-200/90 sm:text-[32px] md:text-[40px]"
        >
          {birthday.birthdayMessages.finale.name}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, filter: 'blur(12px)', y: 8, letterSpacing: '0.22em' }}
          animate={
            showBlessing
              ? { opacity: 1, filter: 'blur(0px)', y: 0, letterSpacing: '0.08em' }
              : {}
          }
          transition={{ duration: 2.4, ease: EASE.breathe }}
          className="mt-10 whitespace-pre-line font-hand-zh text-[17px] font-light leading-[2] text-cream-300/80 sm:text-[20px] sm:leading-[2.2]"
        >
          {birthday.birthdayMessages.finale.blessing}
        </motion.p>

        {/* Quiet signoff — appears after the blessing has settled */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={showBlessing ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE.breathe, delay: 1.2 }}
          className="mt-8 font-hand text-[14px] italic text-cream-300/40 sm:text-[15px]"
        >
          {birthday.birthdayMessages.finale.signoff}
        </motion.div>
      </div>

      {/* Champagne confetti + glowing particles — released after the final line */}
      <AnimatePresence>
        {showConfetti && <ChampagneConfetti key="champagne" />}
      </AnimatePresence>

      {showContinue && (
        <ContinueAffordance
          label="继续"
          delay={0.4}
          bottom="6%"
          color="#F3E4C2"
        />
      )}
    </section>
  );
}

/* ─── Champagne Confetti — elegant, warm tones + glowing particles ─── */

function ChampagneConfetti() {
  const colors = ['#d2b46a', '#e6cf94', '#f3e4c2', '#e88a73', '#f7c5b8', '#bba4d0', '#fdfaf3'];

  // Falling champagne paper bits — small amount, slow drift
  const fallingPieces = Array.from({ length: 16 }).map((_, i) => ({
    id: `f${i}`,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 5.5 + Math.random() * 4,
    rotation: Math.random() * 720 - 360,
    size: 4 + Math.random() * 5,
    sway: (Math.random() - 0.5) * 180,
  }));

  // Glowing particles — soft bokeh that drifts upward, magical
  const glowPieces = Array.from({ length: 12 }).map((_, i) => ({
    id: `g${i}`,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 6 + Math.random() * 4,
    size: 8 + Math.random() * 14,
  }));

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE.breathe }}
    >
      {fallingPieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, top: '-5%' }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.sway, 0],
            rotate: [0, p.rotation],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            style={{
              width: p.size,
              height: p.size * 0.4,
              background: p.color,
              borderRadius: 1,
              boxShadow: `0 0 6px ${p.color}66`,
            }}
          />
        </motion.div>
      ))}

      {glowPieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: '-5%',
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color}aa 0%, ${p.color}33 40%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
          initial={{ y: '10vh', opacity: 0 }}
          animate={{
            y: ['10vh', '-110vh'],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
}
