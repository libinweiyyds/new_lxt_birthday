/**
 * WishesBurst — a constellation of wish cards that fly out of the gift box
 * once it's opened. Each card rises with its own trajectory and rotation,
 * holding in place briefly before continuing to drift slowly upward.
 *
 * Used inside SceneInteractive after the lid lifts. The box stays visible
 * below while wishes scatter above and around it.
 */

import { motion } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';

type Props = {
  wishes: string[];
  active: boolean;
};

/**
 * Each wish has its own spawn position (relative to the box center) and
 * target landing position (relative to the viewport). The flight is a
 * smooth bezier curve so they look like they actually emerged from the box.
 */
type WishTrajectory = {
  // Spawn offset relative to box center — they originate from inside the box.
  startX: number;
  startY: number;
  // Final holding position (relative to viewport center).
  endX: number;
  endY: number;
  // Rotation drift.
  rotateStart: number;
  rotateEnd: number;
  // Hold duration at final position before fading.
  holdMs: number;
  // Stagger delay.
  delayMs: number;
};

function buildTrajectories(count: number): WishTrajectory[] {
  // Distribute wishes in a fan above the box, with a slight left/right bias
  // so they don't stack directly above.
  return Array.from({ length: count }).map((_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    // Horizontal fan: -42% to +42% of viewport width
    const endX = (t - 0.5) * 84;
    // Vertical: -45% to -28% — sit comfortably above the box
    const endY = -45 + Math.sin(t * Math.PI) * 8;
    return {
      startX: 0,
      startY: 0,
      endX,
      endY,
      rotateStart: (i % 2 === 0 ? -1 : 1) * (4 + Math.random() * 4),
      rotateEnd: (i % 2 === 0 ? -1 : 1) * (6 + Math.random() * 4),
      holdMs: 5200,
      delayMs: i * 220,
    };
  });
}

export default function WishesBurst({ wishes, active }: Props) {
  if (!active || wishes.length === 0) return null;

  const trajectories = buildTrajectories(wishes.length);

  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-visible">
      {wishes.map((text, i) => {
        const t = trajectories[i];
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ x: '-50%', y: '-50%' }}
            initial={{
              x: '-50%',
              y: '-50%',
              opacity: 0,
              rotate: t.rotateStart,
              scale: 0.4,
            }}
            animate={{
              // Emerge from center → travel to target
              x: ['-50%', `${t.endX}vw`, `${t.endX}vw`, `${t.endX * 0.9}vw`],
              y: [
                '-50%',
                `calc(-50% + ${t.endY}vh)`,
                `calc(-50% + ${t.endY}vh)`,
                `calc(-50% + ${(t.endY - 8) * 1}vh)`,
              ],
              opacity: [0, 1, 1, 0],
              rotate: [t.rotateStart, t.rotateEnd, t.rotateEnd, t.rotateEnd],
              scale: [0.4, 1.0, 1.0, 0.92],
            }}
            transition={{
              duration: 5.6,
              delay: t.delayMs / 1000,
              times: [0, 0.55, 0.92, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <WishCard text={text} />
          </motion.div>
        );
      })}
    </div>
  );
}

function WishCard({ text }: { text: string }) {
  return (
    <div
      className="font-hand-zh relative max-w-[260px] whitespace-nowrap rounded-lg px-5 py-3 text-center text-[16px] leading-[1.4] text-espresso-800 sm:max-w-[300px] sm:text-[18px]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 251, 240, 0.96) 0%, rgba(250, 240, 220, 0.96) 100%)',
        boxShadow:
          '0 1px 1px rgba(58, 46, 42, 0.06), 0 6px 18px rgba(196, 132, 70, 0.18), 0 22px 48px -16px rgba(196, 132, 70, 0.22)',
        border: '1px solid rgba(210, 180, 106, 0.35)',
      }}
    >
      {/* Inner subtle highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 30%)',
        }}
      />
      <span className="relative z-[1]">{text}</span>
    </div>
  );
}
