/**
 * usePointer — normalized pointer position relative to the viewport.
 * Returns x and y in [-1, 1] (centered).
 *
 * Used by the playful desk scene to give thrown polaroids a subtle
 * parallax response when the user moves the mouse.
 */
import { useEffect, useState } from 'react';

export function usePointer() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ x, y });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pos;
}
