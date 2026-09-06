import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../hooks/useMusic';
import { birthday } from '../data/birthday';
import { EASE, DUR } from '../lib/motion';

/**
 * Minimal music toggle. Cherry-rose accent on hover.
 */
export default function MusicButton() {
  const { playing, toggle } = useMusic();
  if (!birthday.music.src) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: DUR.ritual, ease: EASE.breathe }}
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="group fixed right-6 top-6 z-[80] flex items-center gap-3 text-espresso-700/55 transition-colors duration-700 hover:text-cherry-400 sm:right-9 sm:top-9"
    >
      <AnimatePresence mode="wait" initial={false}>
        {playing ? (
          <motion.svg
            key="pause"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.6, ease: EASE.breathe }}
            viewBox="0 0 16 16"
            className="h-3 w-3"
          >
            <rect x="3.5" y="3" width="2.5" height="10" fill="currentColor" />
            <rect x="10" y="3" width="2.5" height="10" fill="currentColor" />
          </motion.svg>
        ) : (
          <motion.svg
            key="play"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.6, ease: EASE.breathe }}
            viewBox="0 0 16 16"
            className="h-3 w-3"
          >
            <path d="M4 3 L13 8 L4 13 Z" fill="currentColor" />
          </motion.svg>
        )}
      </AnimatePresence>

      <span className="hidden font-hand text-[14px] italic sm:inline">
        {playing ? 'playing' : birthday.music.title}
      </span>

      <span className="hidden h-px w-6 bg-espresso-700/30 transition-all duration-700 group-hover:w-10 group-hover:bg-cherry-400/60 sm:inline-block" />
    </motion.button>
  );
}
