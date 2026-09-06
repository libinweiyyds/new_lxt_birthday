import { useEffect, useRef } from 'react';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

type Star = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  twinkle: number;
  phase: number;
  size: number;
  hue: number; // 0=gold, 1=peach, 2=champagne
};

type Mode = 'sparkle' | 'dust' | 'bokeh' | 'confetti' | 'bloom';
type BlendMode = 'multiply' | 'screen' | 'normal';

type Props = {
  intensity?: number;
  mode?: Mode;
  /** Timestamp (ms, performance.now()) when star reveal should begin. null = visible immediately. */
  revealAt?: number | null;
  /** Duration (ms) to grow visible stars from 0 → full count. */
  revealDuration?: number;
  /** CSS mix-blend-mode. Default 'multiply' (warm on cream). Use 'screen' for dark backgrounds. */
  blendMode?: BlendMode;
};

/**
 * Warm particle field. Cream background friendly.
 *  - sparkle: tiny gold twinkles (default ambient)
 *  - dust:    ultra-fine motes drifting up
 *  - bokeh:   soft pastel bokeh circles (climax)
 *  - confetti: paper pieces, drift down with sway (celebration)
 *
 * `revealAt` enables a gradual reveal: stars at index 0..N become visible
 * as N grows from 0 → count over `revealDuration`. Use this for the
 * "one star, then another, then more" climax effect.
 */
export default function Stardust({
  intensity = 0.6,
  mode = 'sparkle',
  revealAt = null,
  revealDuration = 2500,
  blendMode = 'multiply',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealAtRef = useRef(revealAt);
  revealAtRef.current = revealAt;
  const revealDurationRef = useRef(revealDuration);
  revealDurationRef.current = revealDuration;
  const tier = useDeviceCapability();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d', { alpha: true });
    if (!ctx) return;
    // Non-null aliases — control-flow narrowing does not persist into the
    // nested draw()/resize() closures, so we assert non-null here.
    const canvas = canvasEl as HTMLCanvasElement;
    const c = ctx as CanvasRenderingContext2D;

    let raf = 0;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const baseCount = mode === 'bokeh' ? 18 : mode === 'dust' ? 50 : mode === 'confetti' ? 60 : mode === 'bloom' ? 24 : 80;
    const countByTier =
      tier === 'high' ? baseCount : tier === 'medium' ? Math.floor(baseCount * 0.55) : Math.floor(baseCount * 0.2);
    const count = Math.max(0, Math.floor(countByTier * intensity));

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      stars = new Array(count).fill(0).map(() => {
        const z = Math.random();
        const hue = Math.random();
        return {
          x: Math.random() * w,
          y: mode === 'confetti' ? -Math.random() * h : Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * (mode === 'confetti' ? 0.4 : 0.06) * (0.3 + z),
          vy:
            mode === 'dust'
              ? -(0.04 + Math.random() * 0.06) * (0.3 + z)
              : mode === 'confetti'
              ? 0.3 + Math.random() * 0.5
              : (Math.random() - 0.5) * 0.04,
          twinkle: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          hue,
          size: mode === 'bokeh' ? 30 + z * 60 : mode === 'bloom' ? 60 + z * 120 : mode === 'confetti' ? 4 + z * 6 : z * 1.5 + 0.3,
        };
      });
    }

    function draw(t: number) {
      c.clearRect(0, 0, w, h);
      const time = t * 0.001;

      // Reveal progress (0 → 1). null = always fully visible.
      const ra = revealAtRef.current;
      const rd = revealDurationRef.current;
      let reveal = 1;
      if (ra !== null) {
        const elapsed = t - ra;
        reveal = Math.max(0, Math.min(1, elapsed / rd));
        // easeInOut for a natural "one then more" buildup
        reveal = reveal < 0.5
          ? 2 * reveal * reveal
          : 1 - Math.pow(-2 * reveal + 2, 2) / 2;
      }
      const visibleCount = Math.floor(stars.length * reveal);

      for (let i = 0; i < visibleCount; i++) {
        const s = stars[i];
        s.x += s.vx + Math.sin(time * 0.6 + s.phase) * 0.1;
        s.y += s.vy;
        if (s.y > h + 30) s.y = -30;
        if (s.y < -30) s.y = h + 30;
        if (s.x < -30) s.x = w + 30;
        if (s.x > w + 30) s.x = -30;

        const tw = 0.5 + Math.sin(time * (0.4 + s.twinkle) + s.phase) * 0.5;
        const baseAlpha =
          mode === 'dust' ? 0.12 + s.z * 0.18 : mode === 'bokeh' ? 0.06 + s.z * 0.12 : mode === 'bloom' ? 0.1 + s.z * 0.2 : 0.15 + s.z * 0.4;
        const alpha = baseAlpha * tw * (0.4 + intensity * 0.7);

        // Color: gold (250,210,140) / peach (250,200,170) / champagne (240,220,180)
        let r = 230, g = 200, b = 150;
        if (s.hue < 0.33) { r = 246; g = 200; b = 170; }       // peach
        else if (s.hue < 0.66) { r = 230; g = 200; b = 160; }   // champagne
        else { r = 218; g = 170; b = 110; }                     // gold

        if (mode === 'confetti') {
          // Paper pieces — small rotated squares
          const rot = time * (0.5 + s.twinkle) + s.phase;
          c.save();
          c.translate(s.x, s.y);
          c.rotate(rot);
          c.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.85, alpha + 0.3)})`;
          c.fillRect(-s.size / 2, -s.size / 6, s.size, s.size / 3);
          c.restore();
          continue;
        }

        if (mode === 'bokeh') {
          const grad = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          c.fillStyle = grad;
          c.beginPath();
          c.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          c.fill();
          continue;
        }

        if (mode === 'bloom') {
          // Bloom — large, soft, warm light blooms for climax moments.
          const grad = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 1.2})`);
          grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
          grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          c.fillStyle = grad;
          c.beginPath();
          c.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          c.fill();
          continue;
        }

        if (mode === 'dust') {
          c.fillStyle = `rgba(180, 145, 100, ${Math.min(0.25, alpha)})`;
          c.beginPath();
          c.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          c.fill();
          continue;
        }

        // sparkle: soft gold glow + bright core
        const grad = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 6);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = grad;
        c.beginPath();
        c.arc(s.x, s.y, s.size * 6, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = `rgba(255, 245, 220, ${Math.min(0.9, alpha + 0.3)})`;
        c.beginPath();
        c.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        c.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, mode, tier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        opacity: mode === 'bokeh' ? 0.95 : mode === 'bloom' ? 0.9 : mode === 'dust' ? 0.6 : mode === 'confetti' ? 0.9 : 0.7,
        mixBlendMode: blendMode,
      }}
      aria-hidden
    />
  );
}
