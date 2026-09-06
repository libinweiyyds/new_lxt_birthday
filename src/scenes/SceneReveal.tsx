import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import BirthdayLetter from '../components/BirthdayLetter';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

/**
 * Scene 02 — Birthday letter (click-to-advance model).
 *
 *   0.0s  Envelope fades in (auto-play on mount)
 *   1.4s  "Tap to open" hint appears
 *
 *   On tap:
 *         flap rotates up · wax seal fades · paper card rises
 *         letter reveals line by line (1.2s apart)
 *   +6s   "To · {name}" appears below the letter
 *   +8s   Continue affordance fades in
 *
 *   On continue → onNext()
 */
export default function SceneReveal({ onNext }: Props) {
  const [opened, setOpened] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // After the letter has had time to reveal, show the name headline.
    timers.current.push(setTimeout(() => setShowName(true), 6000));
    // Then the continue affordance.
    timers.current.push(setTimeout(() => setShowContinue(true), 8000));
  };

  // Left-click anywhere to advance once the letter + name have settled.
  // Before the envelope is opened, a click anywhere also opens it.
  const handleSectionClick = () => {
    if (showContinue) {
      onNext();
    } else if (!opened) {
      handleOpen();
    }
  };

  return (
    <section
      onClick={handleSectionClick}
      className={`relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-cream-100 px-6 ${
        !opened || showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <Stardust intensity={0.4} mode="sparkle" />
      <Stardust intensity={0.25} mode="dust" />

      <BackgroundGlow opened={opened} />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: DUR.ritual, ease: EASE.breathe }}
        >
          <BirthdayLetter
            to={birthday.birthdayMessages.reveal.envelopeTo}
            lines={birthday.birthdayMessages.reveal.letterLines}
            opened={opened}
            onOpen={handleOpen}
          />
        </motion.div>

        {/* Name headline — appears after the letter has been read */}
        <motion.div
          className="mt-10 flex flex-col items-center text-center sm:mt-14"
          initial={false}
          animate={{
            opacity: showName ? 1 : 0,
            y: showName ? 0 : 12,
          }}
          transition={{ duration: DUR.ritual, ease: EASE.breathe }}
        >
          <motion.span
            initial={false}
            className="font-hand text-[20px] italic text-cherry-400 sm:text-[24px]"
          >
            To · {birthday.birthdayMessages.reveal.envelopeTo}
          </motion.span>

          <div className="mt-4 overflow-hidden sm:mt-6">
            <motion.span
              initial={false}
              animate={{
                y: showName ? '0%' : '115%',
                filter: showName ? 'blur(0px)' : 'blur(18px)',
              }}
              transition={{ duration: DUR.ritual + 0.4, ease: EASE.anticipate }}
              className="block bg-gradient-to-r from-cherry-400 via-rose-300 to-champagne-300 bg-clip-text text-center font-hand text-[42px] font-light leading-[0.95] tracking-headline text-transparent sm:text-[68px] md:text-[88px]"
            >
              {birthday.birthdayMessages.reveal.nameReveal}
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Tap hint before opening */}
      <AnimatePresenceHint opened={opened} />

      {/* Continue affordance — appears after the letter + name */}
      {showContinue && (
        <ContinueAffordance
          label="继续"
          delay={0.2}
          bottom="6%"
        />
      )}
    </section>
  );
}

/* Background glow — brightens when the letter opens. */
function BackgroundGlow({ opened }: { opened: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{
        background: opened
          ? 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255, 220, 180, 0.42) 0%, rgba(251, 208, 179, 0.18) 35%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 220, 180, 0.18) 0%, transparent 70%)',
      }}
      transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/* Subtle "tap to open" hint, shown only before the envelope is opened. */
function AnimatePresenceHint({ opened }: { opened: boolean }) {
  if (opened) return null;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: DUR.slow, ease: EASE.breathe }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 font-hand-zh text-[12px] font-light tracking-soft text-espresso-700/55 sm:text-[13px]"
    >
      轻触信封
    </motion.span>
  );
}
