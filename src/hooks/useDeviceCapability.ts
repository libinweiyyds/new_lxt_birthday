import { useEffect, useState } from 'react';

export type Capability = 'low' | 'medium' | 'high';

/**
 * Best-effort capability detection. Combines:
 *  - prefers-reduced-motion
 *  - device memory (navigator.deviceMemory)
 *  - hardware concurrency
 *  - viewport size
 *  - coarse pointer (touch)
 *
 * Returns a tier used by canvas/particle systems to scale cost.
 */
export function useDeviceCapability(): Capability {
  const [tier, setTier] = useState<Capability>('medium');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTier('low');
      return;
    }

    const memory = (navigator as any).deviceMemory as number | undefined;
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const dpr = window.devicePixelRatio || 1;

    let score = 0;
    if (memory === undefined) score += 1;
    else if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;

    score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
    if (isMobile) score -= 1;
    if (dpr > 2) score -= 1;

    if (score >= 5) setTier('high');
    else if (score >= 3) setTier('medium');
    else setTier('low');
  }, []);

  return tier;
}
