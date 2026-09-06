import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import {
  MapPath,
  DestinationMarker,
  GlowingStars,
  DEFAULT_PATH_POINTS,
} from '../components/LifeMap';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

/**
 * Scene 04 — Life map (click-to-advance model).
 *
 *   0.0s  Path begins drawing itself across the canvas (8s)
 *   0.5s  Prelude "如果新的一岁是一张地图，"
 *   2.0s  Line 1 "希望你可以去更多自己想去的地方。"
 *   4.0s  Line 2 "见更多想见的人。"
 *   6.0s  Line 3 "做更多真正让自己开心的事。"
 *   8.0s  Coda "至于要去哪里，你慢慢写就好。"
 *   9.5s  Continue affordance
 *
 * Markers light up as the path passes their position.
 */
export default function SceneBlessings({ onNext }: Props) {
  const mapProgress = useMotionValue(0);
  const [showPrelude, setShowPrelude] = useState(false);
  const [showLines, setShowLines] = useState<boolean[]>([false, false, false]);
  const [showCoda, setShowCoda] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Path draws itself over 8 seconds.
    const controls = animate(mapProgress, 1, {
      duration: 8,
      ease: EASE.breathe,
      delay: 0.5,
    });

    timers.current.push(setTimeout(() => setShowPrelude(true), 500));
    timers.current.push(setTimeout(() => setShowLines([true, false, false]), 2000));
    timers.current.push(setTimeout(() => setShowLines([true, true, false]), 4000));
    timers.current.push(setTimeout(() => setShowLines([true, true, true]), 6000));
    timers.current.push(setTimeout(() => setShowCoda(true), 8000));
    timers.current.push(setTimeout(() => setShowContinue(true), 9500));

    return () => {
      controls.stop();
      timers.current.forEach(clearTimeout);
    };
  }, [mapProgress]);

  // Marker positions (0..1) along the path.
  const markerPositions = [0.08, 0.32, 0.56, 0.82];

  return (
    <section
      onClick={() => showContinue && onNext()}
      className={`relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-cream-100 ${
        showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <SectionBackground />

      <GlowingStars count={28} />

      {/* The map path */}
      <div className="absolute inset-0">
        <MapPath progress={mapProgress} />
      </div>

      {/* Markers */}
      {DEFAULT_PATH_POINTS.map((p, i) => (
        <DestinationMarker
          key={i}
          x={p.x}
          y={p.y}
          label={birthday.birthdayMessages.blessings.markers[i]}
          progress={mapProgress}
          position={markerPositions[i]}
          index={i}
        />
      ))}

      {/* Cinematic text */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          {/* Prelude — upper third — warm burgundy for grounding */}
          <motion.div
            className="absolute left-1/2 top-[14%] -translate-x-1/2"
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{
              opacity: showPrelude ? 1 : 0,
              y: showPrelude ? 0 : 12,
              filter: showPrelude ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{ duration: DUR.ritual, ease: EASE.breathe }}
          >
            <p className="font-hand-zh text-[26px] leading-[1.4] text-espresso-900 sm:text-[38px] md:text-[48px]"
               style={{ color: '#6b3a4a' }}>
              {birthday.birthdayMessages.blessings.prelude}
            </p>
          </motion.div>

          {/* Three lines, each appears and holds (stacked vertically in the center).
              Each line is themed to a different warm hue to break the monotonous
              black-ink look while keeping the cream-paper aesthetic. */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 sm:gap-4">
            {birthday.birthdayMessages.blessings.lines.map((line, i) => (
              <motion.p
                key={i}
                className="whitespace-pre-line font-hand-zh text-[22px] leading-[1.6] sm:text-[30px] md:text-[36px]"
                style={{
                  // Line 1 — teal: places / distance / horizon
                  // Line 2 — rose: people / warmth / connection
                  // Line 3 — champagne gold: joy / doing / light
                  color:
                    i === 0
                      ? '#3d6b6b'
                      : i === 1
                      ? '#a85a6a'
                      : '#9a7a32',
                }}
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{
                  opacity: showLines[i] ? 1 : 0,
                  y: showLines[i] ? 0 : 14,
                  filter: showLines[i] ? 'blur(0px)' : 'blur(8px)',
                }}
                transition={{ duration: DUR.ritual, ease: EASE.breathe }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Coda — lower third — cherry red, the emotional landing */}
          <motion.div
            className="absolute left-1/2 bottom-[14%] -translate-x-1/2"
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{
              opacity: showCoda ? 1 : 0,
              y: showCoda ? 0 : 12,
              filter: showCoda ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{ duration: DUR.ritual, ease: EASE.breathe }}
          >
            <p className="whitespace-pre-line font-hand-zh text-[22px] leading-[1.5] text-cherry-400 sm:text-[28px] md:text-[32px]">
              {birthday.birthdayMessages.blessings.coda}
            </p>
          </motion.div>
        </div>
      </div>

      {showContinue && (
        <ContinueAffordance label="继续" delay={0.2} bottom="6%" />
      )}
    </section>
  );
}

/* ─── Background — lavender + cream wash ──────────────────────── */

function SectionBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 20% 20%, rgba(216, 200, 229, 0.45) 0%, transparent 60%), radial-gradient(ellipse 80% 70% at 80% 80%, rgba(251, 208, 179, 0.32) 0%, transparent 60%), linear-gradient(180deg, #fdfaf3 0%, #f5ead8 50%, #f0e0d2 100%)',
        }}
      />
      <Stardust intensity={0.35} mode="sparkle" />
      <Stardust intensity={0.2} mode="dust" />
    </>
  );
}
