/**
 * Motion vocabulary — one source of truth.
 * Two easing shapes only:
 *   1. anticipate   — slow start, decisive settle (used for entrances, slams)
 *   2. breathe      — smooth start, slow finish (used for the gentle drift of UI)
 *
 * One duration scale only:
 *   1. fast    0.8s
 *   2. medium  1.6s
 *   3. slow    2.4s
 *   4. ritual  3.6s   ← reserved for the moments that matter
 *   5. breath  5.0s   ← the "nothing happens" pause between revelations
 *
 * No other durations should be hard-coded inside components.
 */

export const EASE = {
  /** Slow start, decisive settle — for type reveals, photo reveals, name slams. */
  anticipate: [0.83, 0, 0.17, 1] as [number, number, number, number],
  /** Gentle drift, slow finish — for parallax, ambient motion, music-button hover. */
  breathe: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Quick cinematic settle for micro-transitions (button taps, hover). */
  snap: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

export const DUR = {
  fast: 0.8,
  medium: 1.6,
  slow: 2.4,
  ritual: 3.6,
  breath: 5.0,
} as const;

export type Ease = keyof typeof EASE;
export type Dur = keyof typeof DUR;
