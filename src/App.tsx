import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SceneOpening from './scenes/SceneOpening';
import SceneReveal from './scenes/SceneReveal';
import SceneMemories from './scenes/SceneMemories';
import SceneBlessings from './scenes/SceneBlessings';
import SceneWishList from './scenes/SceneWishList';
import SceneCake from './scenes/SceneCake';
import SceneFinale from './scenes/SceneFinale';
import SceneBirthdayCard from './scenes/SceneBirthdayCard';
import MusicButton from './components/MusicButton';
import Atmosphere from './components/Atmosphere';
import MemoryObjects from './components/MemoryObjects';
import Foreground from './components/Foreground';
import { useReducedMotion } from './hooks/useReducedMotion';
import { EASE, DUR } from './lib/motion';

type Stage = 'opening' | 'film';

/**
 * Film scenes in the order they play. Each scene is mounted alone and
 * advances to the next via its `onNext` callback (click-to-advance model).
 */
const FILM_SCENES = [
  'reveal',
  'memories',
  'blessings',
  'wishList',
  'cake',
  'finale',
  'birthdayCard',
] as const;

/**
 * App — orchestrator.
 *
 * Two stages:
 *   opening — the entry candle scene, click-to-begin
 *   film    — a sequence of single-viewport scenes the user clicks through
 *
 * No scroll. Each scene is h-[100svh], auto-plays its staged animation
 * on mount, then reveals a subtle "继续 ↓" affordance that calls onNext.
 *
 * Interaction:
 *   - Click anywhere on a scene → that scene's onClick handler runs.
 *   - Enter / Space / →        → simulates a click on the active scene
 *                                (so each scene's own staged logic runs).
 *   - ←                        → go back one scene (film stage only).
 *   - Tab                      → focus the chrome controls (music, back).
 */
export default function App() {
  const [stage, setStage] = useState<Stage>('opening');
  const [sceneIdx, setSceneIdx] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const reduced = useReducedMotion();

  const handleBegin = useCallback(() => {
    setSceneIdx(0);
    setStage('film');
  }, []);

  const handleNext = useCallback(() => {
    setSceneIdx((idx) => Math.min(idx + 1, FILM_SCENES.length - 1));
  }, []);

  const handleReplay = useCallback(() => {
    setSceneIdx(0);
    setReplayKey((k) => k + 1);
  }, []);

  const handleBack = useCallback(() => {
    if (stage !== 'film') return;
    if (sceneIdx > 0) {
      setSceneIdx((idx) => idx - 1);
    } else {
      // At the very first film scene, "back" returns to the opening
      // candle so the user can re-read the intro if they want.
      setStage('opening');
    }
  }, [stage, sceneIdx]);

  // Keyboard navigation — standard web UX:
  //   Enter / Space / →  → advance (simulate a click on the active scene
  //                          section so each scene's own staged logic runs)
  //   ←                 → go back one scene, or back to the opening
  //                          from the first film scene
  // We avoid hijacking Enter/Space when focus is on a real control
  // (MusicButton, replay button, etc.) so those keep working natively.
  // The listener is bound in the capture phase so it runs before any
  // scene-level handler can stop propagation.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'button, input, textarea, select, a[href]'
      );

      if (e.key === 'ArrowLeft') {
        if (isInteractive && target?.tagName !== 'BUTTON') return;
        if (stage === 'film') {
          e.preventDefault();
          handleBack();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        if (isInteractive) return; // let the focused control handle it
        e.preventDefault();
        const section = document.querySelector('section');
        if (section) {
          (section as HTMLElement).click();
        }
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [stage, sceneIdx, handleBack]);

  return (
    <div className="app-shell">
      <Atmosphere />
      {stage === 'film' && <MusicButton />}
      {stage === 'film' && <BackButton onClick={handleBack} />}
      {stage === 'film' && (
        <SceneProgress total={FILM_SCENES.length} current={sceneIdx} />
      )}

      <AnimatePresence mode="wait">
        {stage === 'opening' ? (
          <motion.div
            key={`open-${replayKey}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: reduced ? 0 : 1.4, ease: EASE.breathe },
            }}
          >
            <SceneOpening onBegin={handleBegin} />
          </motion.div>
        ) : (
          <motion.div
            key={`scene-${sceneIdx}-${replayKey}`}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: {
                duration: reduced ? 0 : DUR.ritual,
                ease: EASE.breathe,
                delay: reduced ? 0 : 0.3,
              },
            }}
            exit={{
              opacity: 0,
              filter: 'blur(8px)',
              transition: { duration: reduced ? 0 : 0.8, ease: EASE.breathe },
            }}
            className="relative h-[100svh] w-full overflow-hidden"
          >
            {renderScene(sceneIdx, handleNext, handleReplay)}
            {/* Emotional arc — a warm color wash that gently intensifies
                as the film progresses toward the finale. */}
            <SceneWash sceneIdx={sceneIdx} />
            {/* Persistent keepsakes that accumulate across scenes */}
            <MemoryObjects sceneIdx={sceneIdx} />
            {/* Foreground depth layer — partially cropped edges */}
            <Foreground sceneIdx={sceneIdx} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderScene(
  idx: number,
  onNext: () => void,
  onReplay: () => void
): React.ReactNode {
  switch (FILM_SCENES[idx]) {
    case 'reveal':
      return <SceneReveal onNext={onNext} />;
    case 'memories':
      return <SceneMemories onNext={onNext} />;
    case 'blessings':
      return <SceneBlessings onNext={onNext} />;
    case 'wishList':
      return <SceneWishList onNext={onNext} />;
    case 'cake':
      return <SceneCake onNext={onNext} />;
    case 'finale':
      return <SceneFinale onNext={onNext} />;
    case 'birthdayCard':
      return <SceneBirthdayCard onReplay={onReplay} />;
    default:
      return null;
  }
}

/* ─── SceneWash — emotional-arc color overlay ──────────────────── */

/**
 * A very subtle color wash that shifts with the scene index.
 *   - early scenes (0-2): cool lavender tint, low warmth
 *   - middle scenes (3-5): neutral cream
 *   - late scenes (6-7): warm peach/gold tint, higher saturation
 *
 * The finale (index 6) is dark, so the wash is suppressed there to let
 * the scene's own dark background breathe.
 */
function SceneWash({ sceneIdx }: { sceneIdx: number }) {
  // 0.0 (cool) → 1.0 (warm) across the film, except finale which resets to dark.
  const warmth =
    sceneIdx >= 6 ? 0 : Math.min(1, sceneIdx / 5);

  // Lavender coolness fades as warmth rises.
  const lavender = (1 - warmth) * 0.08;
  // Peach warmth grows with the index.
  const peach = warmth * 0.07;
  // Champagne gold peaks at the cake/finale approach.
  const gold = Math.max(0, (warmth - 0.4)) * 0.06;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[45]"
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE.breathe }}
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 15% 15%, rgba(216, 200, 229, ${lavender}) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 85% 85%, rgba(251, 208, 179, ${peach}) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230, 207, 148, ${gold}) 0%, transparent 70%)
        `,
        mixBlendMode: 'multiply',
      }}
    />
  );
}

/* ─── BackButton — subtle top-left back arrow ─────────────────── */

/**
 * A minimal back affordance anchored top-left. Pairs with the existing
 * top-right MusicButton so the chrome reads symmetric. Hidden on the
 * first film scene (sceneIdx === 0) since there's nothing to go back to
 * within the film — going further back would exit to the opening.
 */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: DUR.slow, ease: EASE.breathe }}
      onClick={onClick}
      aria-label="返回上一段"
      className="group fixed left-6 top-6 z-[70] flex items-center gap-2 text-espresso-700/55 transition-colors duration-700 hover:text-cherry-400 sm:left-9 sm:top-9"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3 opacity-70 transition-transform duration-700 group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 4 L4 8 L10 12" />
      </svg>
      <span className="hidden font-hand-zh text-[12px] font-light tracking-soft sm:text-[13px]">
        上一段
      </span>
      <span className="hidden h-px w-5 bg-espresso-700/30 transition-all duration-700 group-hover:w-8 group-hover:bg-cherry-400/60 sm:inline-block" />
    </motion.button>
  );
}

/* ─── SceneProgress — minimal bottom-center dot indicator ─────── */

/**
 * A row of small dots at the bottom-center showing where the user is in
 * the film. Helps reduce "how much longer?" anxiety without being a
 * heavy SaaS-y progress bar. The current scene's dot stretches into a
 * short bar; visited scenes use a slightly warmer tone.
 *
 * Pointer-events disabled so it never competes with the scene's click
 * target (the whole viewport).
 */
function SceneProgress({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 left-1/2 z-[65] flex -translate-x-1/2 items-center gap-1.5"
      aria-label={`进度 ${current + 1} / ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isVisited = i < current;
        return (
          <span
            key={i}
            className="block h-[3px] rounded-full transition-all duration-700 ease-out"
            style={{
              width: isActive ? 18 : 5,
              background: isActive
                ? 'rgba(196, 68, 68, 0.55)'
                : isVisited
                ? 'rgba(210, 180, 106, 0.45)'
                : 'rgba(89, 67, 59, 0.22)',
            }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
