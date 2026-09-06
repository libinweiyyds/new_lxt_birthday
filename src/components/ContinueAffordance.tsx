import { motion } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';

type Props = {
  /** Custom label (defaults to "继续"). */
  label?: string;
  /** Delay (seconds) before the affordance fades in. */
  delay?: number;
  /** Hide the down-arrow (e.g. for the very last scene). */
  hideArrow?: boolean;
  /** Override text color (defaults to warm brown #59433B). */
  color?: string;
  /** Position from the bottom of the section, default 8%. */
  bottom?: string;
};

/**
 * A subtle editorial "continue" affordance — visual hint only.
 *
 * Not a SaaS "Next" button. Just a small serif label and a gently
 * bobbing ↓ arrow, in the warm brown ink color, fading in after the
 * scene's animation has had time to breathe.
 *
 * Pointer-events are disabled; the entire scene section handles the
 * click-to-advance interaction (left-click anywhere to continue).
 */
export default function ContinueAffordance({
  label = '继续',
  delay = 0,
  hideArrow = false,
  color = '#59433B',
  bottom = '8%',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: DUR.slow, ease: EASE.breathe }}
      className="pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
      style={{ color, bottom }}
      aria-hidden
    >
      <span className="font-hand-zh text-[12px] font-light tracking-soft opacity-55 sm:text-[13px]">
        {label}
      </span>
      {!hideArrow && (
        <motion.svg
          viewBox="0 0 16 16"
          className="h-3 w-3 opacity-40"
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
      )}
    </motion.div>
  );
}
