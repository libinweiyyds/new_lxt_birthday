import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { birthday } from '../data/birthday';
import Stardust from '../components/Stardust';
import WishListItem from '../components/WishListItem';
import { StarDoodle, Sparkle, HeartDoodle } from '../components/Illustrations';
import ContinueAffordance from '../components/ContinueAffordance';
import { EASE, DUR } from '../lib/motion';

type Props = { onNext: () => void };

/**
 * Scene 05 — Wish-list notebook (click-to-advance model).
 *
 *   0.0s  Notebook page fades in
 *   0.4s  Section label + headline
 *   1.6s  List items reveal one by one (char-by-char)
 *   4.0s  Final item with red star
 *   5.0s  Doodles + coda
 *   6.5s  Continue affordance
 */
export default function SceneWishList({ onNext }: Props) {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContinue(true), 6500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      onClick={() => showContinue && onNext()}
      className={`relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-cream-100 px-4 py-10 sm:px-6 ${
        showContinue ? 'cursor-pointer' : ''
      }`}
    >
      <Stardust intensity={0.3} mode="sparkle" />
      <Stardust intensity={0.2} mode="dust" />

      <div className="relative mx-auto w-full max-w-xl">
        <NotebookPage />
      </div>

      {showContinue && (
        <ContinueAffordance label="继续" delay={0.2} bottom="5%" />
      )}
    </section>
  );
}

function NotebookPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: DUR.ritual + 0.4, ease: EASE.anticipate }}
      className="relative"
    >
      {/* Spiral binding — small grey circles on the left edge */}
      <div className="pointer-events-none absolute -left-3 top-0 z-10 flex h-full flex-col justify-evenly sm:-left-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #d8d4ca 0%, #8a857c 70%, #5a554c 100%)',
              boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>

      {/* Tape strip in the top-right corner */}
      <div
        className="pointer-events-none absolute -right-3 -top-3 z-20 h-5 w-20 sm:w-24"
        style={{
          background: 'rgba(247, 197, 184, 0.55)',
          borderLeft: '1px dashed rgba(255, 255, 255, 0.5)',
          borderRight: '1px dashed rgba(255, 255, 255, 0.5)',
          transform: 'rotate(8deg)',
          boxShadow: '0 2px 8px rgba(58, 46, 42, 0.08)',
        }}
      />

      {/* The page paper */}
      <div
        className="relative px-5 py-7 sm:px-8 sm:py-9"
        style={{
          background: 'linear-gradient(180deg, #fdfaf3 0%, #faf3e8 100%)',
          boxShadow:
            '0 1px 1px rgba(58, 46, 42, 0.05), 0 8px 18px rgba(58, 46, 42, 0.1), 0 32px 64px -16px rgba(58, 46, 42, 0.18)',
          border: '1px solid rgba(196, 168, 120, 0.25)',
        }}
      >
        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>\")",
            mixBlendMode: 'multiply',
          }}
        />

        {/* Red margin line on the left */}
        <div
          className="pointer-events-none absolute left-10 top-0 h-full w-px sm:left-14"
          style={{ background: 'rgba(196, 68, 68, 0.35)' }}
        />

        {/* Ruled lines */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${(i + 1) * 7}%`,
                background: 'rgba(187, 164, 208, 0.12)',
              }}
            />
          ))}
        </div>

        <div className="relative">
          {/* Section label */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE.breathe }}
            className="block text-[9px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[10px]"
          >
            {birthday.wishList.sectionLabel}
          </motion.span>

          {/* THIS YEAR — handwritten headline */}
          <div className="mt-4 sm:mt-5">
            <RevealMask delay={0.2}>
              <h3 className="font-hand text-[32px] font-light uppercase leading-[0.95] tracking-soft text-espresso-800 sm:text-[48px] md:text-[60px]">
                {birthday.wishList.headline}
              </h3>
            </RevealMask>
            <RevealMask delay={0.7}>
              <h3 className="font-hand text-[20px] font-light italic leading-[0.95] text-cherry-400 sm:text-[28px] md:text-[34px]">
                {birthday.wishList.headlineAccent}
              </h3>
            </RevealMask>
          </div>

          {/* Hand-drawn underline */}
          <RevealMask delay={1.0}>
            <div className="mt-2 mb-5 sm:mb-6">
              <svg viewBox="0 0 200 12" className="h-3 w-28 text-cherry-400/70 sm:h-4 sm:w-36" preserveAspectRatio="none">
                <path
                  d="M 4 6 Q 50 2 100 6 T 196 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </RevealMask>

          {/* The list */}
          <div className="space-y-0.5 sm:space-y-1">
            {birthday.wishList.items.map((item, i) => (
              <WishListItem
                key={i}
                text={item}
                index={i}
                marker={(['place', 'learn', 'food', 'photo', 'people'] as const)[i]}
              />
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.6, delay: 1.6, ease: EASE.breathe }}
            className="my-5 h-px origin-left sm:my-6"
            style={{ background: 'rgba(196, 68, 68, 0.2)' }}
          />

          {/* Final item — special star bullet */}
          <WishListItem
            text={birthday.wishList.finalItem}
            index={birthday.wishList.items.length}
            isFinal
            extraDelay={0.4}
          />

          {/* Tiny doodles in the bottom margin */}
          <div className="mt-6 flex items-center justify-end gap-3 opacity-80 sm:mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2.2, ease: EASE.breathe }}
            >
              <StarDoodle size={18} color="#d2b46a" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2.4, ease: EASE.breathe }}
            >
              <HeartDoodle size={16} color="#c44444" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 2.6, ease: EASE.breathe }}
            >
              <Sparkle size={12} className="text-champagne-300" />
            </motion.div>
          </div>

          {/* Coda */}
          <motion.p
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 2.4, ease: EASE.breathe }}
            className="mt-5 text-center font-hand text-[13px] font-light italic text-espresso-700/55 sm:text-[15px]"
          >
            —— {birthday.wishList.coda} ——
          </motion.p>
        </div>
      </div>

      {/* Pencil mark — small note off the page */}
      <motion.div
        initial={{ opacity: 0, rotate: -20, x: -20 }}
        animate={{ opacity: 1, rotate: 8, x: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease: EASE.breathe }}
        className="pointer-events-none absolute -bottom-5 -right-2 z-10 sm:-right-4"
      >
        <PencilDoodle />
      </motion.div>
    </motion.div>
  );
}

function PencilDoodle() {
  return (
    <svg
      viewBox="0 0 120 30"
      width={100}
      height={25}
      style={{ display: 'block' }}
      aria-hidden
    >
      <rect x="14" y="10" width="80" height="8" fill="#e6cf94" />
      <rect x="14" y="10" width="80" height="3" fill="#f5e4b8" />
      <rect x="92" y="9" width="14" height="10" rx="1.5" fill="#e88a73" />
      <rect x="88" y="9" width="6" height="10" fill="#bba4d0" />
      <path d="M 14 10 L 4 14 L 14 18 Z" fill="#ecdcc0" />
      <path d="M 4 14 L 0 16 L 4 18 Z" fill="#3a2e2a" />
    </svg>
  );
}

function RevealMask({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="will-change-transform"
        initial={{ y: '115%' }}
        animate={{ y: '0%' }}
        transition={{ duration: DUR.ritual, delay, ease: EASE.anticipate }}
      >
        {children}
      </motion.div>
    </div>
  );
}
