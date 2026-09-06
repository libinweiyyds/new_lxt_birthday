import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { birthday } from '../data/birthday';
import { Sparkle, FlowerDoodle } from '../components/Illustrations';
import { EASE } from '../lib/motion';

type Props = {
  onReplay: () => void;
};

/**
 * Scene 08 — Birthday Card (Final).
 *
 * After the emotional climax, motion reduces dramatically.
 * A physical birthday card rests on a cream "desk":
 *   - ivory paper with embossed texture
 *   - small flowers + tiny stars + champagne details
 *   - delicate ribbon at the top
 *   - quiet blessing, signature, and caption
 *
 * Very little animation:
 *   - paper texture slowly drifts (30s)
 *   - tiny stars twinkle (4-6s, staggered)
 *   - ribbon sways almost imperceptibly (8s)
 *   - soft ambient light breathes (10s)
 */
export default function SceneBirthdayCard({ onReplay }: Props) {
  return (
    <section className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-cream-100">
      {/* Soft ambient light — breathes slowly */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 220, 180, 0.40) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating dust motes — tiny warm particles drifting in the light */}
      <FloatingDust />

      {/* The physical card */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 2.4, ease: EASE.breathe }}
        className="relative w-[min(90vw,500px)]"
      >
        <BirthdayCard />
      </motion.div>

      {/* Minimal replay interaction — anchored to the section bottom */}
      <motion.button
        onClick={onReplay}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: EASE.breathe, delay: 1.4 }}
        className="group absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-3 text-[9px] font-light uppercase tracking-cinematic text-espresso-700/40 transition-colors duration-700 hover:text-cherry-400 sm:text-[10px]"
      >
        <span className="inline-block h-px w-6 bg-espresso-700/25 transition-all duration-700 group-hover:w-10 group-hover:bg-cherry-400/60" />
        <span className="font-hand text-[14px] italic normal-case tracking-normal text-espresso-700/55 sm:text-[16px]">
          {birthday.card.replayLabel}
        </span>
        <svg
          viewBox="0 0 16 16"
          className="h-3 w-3 text-espresso-700/40 transition-transform duration-700 group-hover:rotate-[-45deg] group-hover:text-cherry-400"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 3 V0 L4 4 L8 8 V5 a3 3 0 1 1 -3 3 H3 a5 5 0 1 0 5 -5 z" />
        </svg>
      </motion.button>
    </section>
  );
}

/* ─── Birthday card — ivory paper, embossed, with quiet ornaments ─── */

function BirthdayCard() {
  return (
    <div className="relative">
      {/* Card body */}
      <div
        className="relative overflow-hidden px-10 py-14 sm:px-14 sm:py-18"
        style={{
          background: 'linear-gradient(180deg, #fdfaf3 0%, #f7ead8 100%)',
          borderRadius: 2,
          boxShadow:
            '0 1px 2px rgba(58, 46, 42, 0.05), 0 4px 12px rgba(58, 46, 42, 0.08), 0 16px 40px -8px rgba(58, 46, 42, 0.12), 0 32px 80px -16px rgba(58, 46, 42, 0.16)',
        }}
      >
        {/* Embossed paper texture — slowly drifts */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>\")",
            backgroundSize: '300px 300px',
            mixBlendMode: 'multiply',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '6px 3px', '0px 0px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Subtle inner border — framing */}
        <div
          className="pointer-events-none absolute inset-3 sm:inset-4"
          style={{
            border: '0.5px solid rgba(196, 68, 68, 0.12)',
            borderRadius: 1,
          }}
        />

        {/* Ribbon ornament at top center, sways almost imperceptibly */}
        <Ribbon />

        {/* Corner ornaments */}
        <CornerOrnament className="absolute left-4 top-4 sm:left-5 sm:top-5" />
        <CornerOrnament className="absolute right-4 top-4 sm:right-5 sm:top-5 rotate-90" />
        <CornerOrnament className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 rotate-180" />
        <CornerOrnament className="absolute left-4 bottom-4 sm:left-5 sm:bottom-5 -rotate-90" />

        {/* Twinkling tiny stars — scattered */}
        <TwinkleStar className="absolute left-[22%] top-[18%]" delay={0} size={9} />
        <TwinkleStar className="absolute right-[24%] top-[16%]" delay={1.2} size={7} />
        <TwinkleStar className="absolute left-[18%] top-[58%]" delay={2.5} size={8} />
        <TwinkleStar className="absolute right-[20%] top-[60%]" delay={3.4} size={9} />
        <TwinkleStar className="absolute left-[50%] top-[10%] -translate-x-1/2" delay={4.2} size={6} />

        {/* Small scattered flowers (champagne + peach) */}
        <FlowerDoodle size={14} color="#f7c5b8" className="absolute left-[15%] top-[40%] opacity-50" />
        <FlowerDoodle size={12} color="#eea193" className="absolute right-[16%] top-[42%] opacity-50" />
        <FlowerDoodle size={11} color="#d2b46a" className="absolute left-[18%] bottom-[28%] opacity-50" />
        <FlowerDoodle size={13} color="#d2b46a" className="absolute right-[18%] bottom-[26%] opacity-50" />

        {/* Main message */}
        <div className="relative z-10 mt-10 flex flex-col items-center text-center sm:mt-12">
          <motion.p
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2.0, ease: EASE.breathe, delay: 0.6 }}
            className="font-hand-run text-[17px] font-light leading-[2.0] text-espresso-800 sm:text-[20px]"
          >
            {birthday.finalMessage.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </motion.p>

          {/* Birthday line */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2.0, ease: EASE.breathe, delay: 1.4 }}
            className="mt-8 font-hand text-[24px] font-light italic text-cherry-400 sm:mt-10 sm:text-[30px]"
          >
            生日快乐，{birthday.friendNameCN}。
          </motion.p>

          {/* Signoff */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: EASE.breathe, delay: 2.0 }}
            className="mt-3 font-hand-brush text-[18px] text-espresso-700/80 sm:mt-4 sm:text-[20px]"
          >
            —— {birthday.senderName}
          </motion.p>
        </div>

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: EASE.breathe, delay: 2.6 }}
          className="relative z-10 mt-12 flex items-center justify-center gap-3 sm:mt-14"
        >
          <span className="inline-block h-px w-6 bg-champagne-300/60" />
          <span className="text-[9px] font-light uppercase tracking-cinematic text-espresso-700/55 sm:text-[10px]">
            {birthday.card.caption}
          </span>
          <span className="inline-block h-px w-6 bg-champagne-300/60" />
        </motion.div>
      </div>

      {/* Soft drop shadow under the card (on the "desk") */}
      <div
        className="pointer-events-none absolute -bottom-8 left-1/2 -z-10 h-6 w-[75%] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(58, 46, 42, 0.20) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
}

/* ─── Ribbon — delicate champagne ornament at top ─── */

function Ribbon() {
  return (
    <motion.div
      className="absolute left-1/2 top-6 -translate-x-1/2 sm:top-7"
      animate={{ rotate: [-0.4, 0.4, -0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 24" width="120" height="24" aria-hidden>
        {/* Left champagne line */}
        <path
          d="M5 12 Q 25 4 50 12"
          fill="none"
          stroke="#d2b46a"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Right champagne line */}
        <path
          d="M70 12 Q 95 4 115 12"
          fill="none"
          stroke="#d2b46a"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Center small flower */}
        <g transform="translate(60, 12)">
          <circle cx="0" cy="-3" r="2.2" fill="#eea193" opacity="0.65" />
          <circle cx="-3" cy="0" r="2.2" fill="#eea193" opacity="0.65" />
          <circle cx="3" cy="0" r="2.2" fill="#eea193" opacity="0.65" />
          <circle cx="0" cy="3" r="2.2" fill="#eea193" opacity="0.65" />
          <circle cx="0" cy="0" r="1.6" fill="#d2b46a" />
        </g>
        {/* Tiny star accents on the lines */}
        <path
          d="M30 11 L30.6 12.4 L32 12.4 L30.9 13.2 L31.3 14.6 L30 13.8 L28.7 14.6 L29.1 13.2 L28 12.4 L29.4 12.4 Z"
          fill="#d2b46a"
          opacity="0.6"
        />
        <path
          d="M90 11 L90.6 12.4 L92 12.4 L90.9 13.2 L91.3 14.6 L90 13.8 L88.7 14.6 L89.1 13.2 L88 12.4 L89.4 12.4 Z"
          fill="#d2b46a"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Corner ornament — small champagne flourish ─── */

function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 40 40" width="32" height="32" aria-hidden>
        {/* Champagne curve */}
        <path
          d="M4 4 Q 12 6 16 12 Q 20 18 20 26"
          fill="none"
          stroke="#d2b46a"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Champagne dots */}
        <circle cx="4" cy="4" r="1.2" fill="#d2b46a" opacity="0.85" />
        <circle cx="10" cy="7" r="0.6" fill="#d2b46a" opacity="0.5" />
        {/* Tiny star */}
        <path
          d="M24 18 L25 21 L28 21 L25.5 22.8 L26.4 25.8 L24 24 L21.6 25.8 L22.5 22.8 L20 21 L23 21 Z"
          fill="#d2b46a"
          opacity="0.6"
        />
        {/* Small flower */}
        <g transform="translate(14, 20)">
          <circle cx="0" cy="-2" r="1.5" fill="#f7c5b8" opacity="0.6" />
          <circle cx="-2" cy="0" r="1.5" fill="#f7c5b8" opacity="0.6" />
          <circle cx="2" cy="0" r="1.5" fill="#f7c5b8" opacity="0.6" />
          <circle cx="0" cy="2" r="1.5" fill="#f7c5b8" opacity="0.6" />
          <circle cx="0" cy="0" r="1" fill="#d2b46a" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Twinkle star — tiny, gentle twinkle ─── */

function TwinkleStar({
  className = '',
  delay = 0,
  size = 10,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: [0.2, 0.85, 0.2] }}
      transition={{
        duration: 4 + (delay % 2),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Sparkle size={size} className="text-champagne-300" />
    </motion.div>
  );
}

/* ─── Floating dust — warm motes drifting slowly in the light ─── */

function FloatingDust() {
  const motes = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        size: 1 + Math.random() * 1.6,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.25,
        sway: (Math.random() - 0.5) * 30,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute bottom-0 block rounded-full"
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            background: 'rgba(210, 170, 110, 0.9)',
            boxShadow: '0 0 4px rgba(255, 220, 160, 0.4)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, m.sway, 0],
            opacity: [0, m.opacity, m.opacity, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
