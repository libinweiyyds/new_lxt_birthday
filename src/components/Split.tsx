import type { CSSProperties } from 'react';

/**
 * Splits a string into per-character spans. Used for character-level reveals
 * that read like film titles, not like web UIs.
 *
 * Keeps spaces as their own span so layout never collapses.
 * Each character gets a CSS custom property `--i` so a parent can drive
 * `animation-delay: calc(var(--i) * 0.05s)`.
 */
export function Split({
  text,
  className = '',
  charClass = '',
  startIndex = 0,
}: {
  text: string;
  className?: string;
  charClass?: string;
  startIndex?: number;
}) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) =>
        c === ' ' ? (
          <span key={i} className="inline-block" style={{ width: '0.32em' }}>
            {' '}
          </span>
        ) : (
          <span key={i} className="inline-block overflow-hidden align-baseline">
            <span
              className={`inline-block will-change-transform ${charClass}`}
              style={{ '--i': i + startIndex } as CSSProperties}
            >
              {c}
            </span>
          </span>
        )
      )}
    </span>
  );
}
