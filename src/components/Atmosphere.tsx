/**
 * Atmosphere — global background layers in one mount.
 * Stacking order (lowest → highest):
 *   1. paper-fiber  (organic fibrous texture)
 *   2. scanlines    (paper fibers — fine horizontal)
 *   3. light-leak   (peach + lavender drift)
 *   4. tracing-paper (translucent warm wash)
 *   5. frame-edge   (cream deepening at top/bottom)
 *   6. vignette     (soft cream inward darkening)
 *   7. cursor-glow  (warm peach)
 *   8. grain-overlay (paper texture, animated)
 */
import CursorGlow from './CursorGlow';

export default function Atmosphere() {
  return (
    <>
      <div className="paper-fiber" />
      <div className="scanlines" />
      <div className="light-leak" />
      <div className="tracing-paper" />
      <div className="frame-edge" />
      <div className="vignette" />
      <CursorGlow />
      <div className="grain-overlay" />
    </>
  );
}
