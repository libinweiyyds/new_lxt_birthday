import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE, DUR } from '../lib/motion';
import { type ReactNode } from 'react';

/**
 * Reveal — the workhorse "line rises out of its own mask" primitive.
 * Uses overflow:hidden on the outer + y + filter on the inner.
 * Never combine with scaleIn / fadeIn plain variants.
 */
export function Reveal({
  children,
  delay = 0,
  duration = DUR.ritual,
  y = 32,
  blur = false,
  className = '',
  as: As = 'div',
  once = true,
  amount = 0.4,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  as?: any;
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion(As);

  const inner: Variants = {
    hidden: { y, filter: blur ? 'blur(8px)' : 'blur(0px)', opacity: 0 },
    show: {
      y: 0,
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE.anticipate,
      },
    },
  };

  return (
    <MotionTag
      className={`overflow-hidden ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      <motion.div variants={inner}>{children}</motion.div>
    </MotionTag>
  );
}

/**
 * MaskLine — like Reveal but the inner text is masked bottom-to-top.
 * Used for the headline "Happy Birthday,". Reads as print, not web.
 */
export function MaskLine({
  children,
  delay = 0,
  duration = DUR.ritual,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: reduced ? 0 : duration,
          delay: reduced ? 0 : delay,
          ease: EASE.anticipate,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
