# Birthday Film · Cinematic Interactive Site

A private, hand-made birthday surprise. Pure static. Edit one file to make it yours.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Deploy `dist/` to Vercel / Netlify / GitHub Pages.

## Customize

Everything personal lives in **`src/config.ts`**:

- `friendName`, `friendNameCN`, `senderName`

- `opening.lineOne`, `opening.lineTwo`, `opening.tapHint`

- `reveal.prelude`, `reveal.headline`

- `blessings[]` — one per line, scroll-revealed

- `memories.items[]` — `{ src, caption, year, tone, aspect }`

- `interactive.*` — the light-burst scene

- `finale.*` — last screen text

- `music.src` — path to your mp3 (default: `/music/song.mp3`)

## Replace photos

1. Drop your photos into `public/photos/` (or use any URL).
2. In `src/config.ts`, set `memories.items[i].src = '/photos/your.jpg'`.
3. The grid auto-handles 1 / 2 / 3 / 7+ photos with asymmetric editorial layouts.

## Replace music

Place an `.mp3` at `public/music/song.mp3` (or update `music.src` in `config.ts`).
The music button is hidden automatically if no `src` is provided.

## Design notes

- Built with React + Vite + Tailwind + Framer Motion.

- All motion is `transform` / `opacity` only — no layout thrash.

- `prefers-reduced-motion` is respected.

- Device capability is detected to scale particle count (low / medium / high).

- Cinematic easings: `cubic-bezier(0.16, 1, 0.3, 1)` and `(0.22, 1, 0.36, 1)`.

- Letter-spacing decompresses on key reveals (0.4em → 0.04em).

- Photos enter via `clip-path` and desaturate from B\&W → color.

## File map

```
src/
  App.tsx                 — orchestrator + opening/film gate
  config.ts               — ⭐ edit this
  hooks/
    useReducedMotion.ts
    useDeviceCapability.ts
    useMusic.ts
  components/
    CursorGlow.tsx        — soft screen-blended cursor light
    MusicButton.tsx       — top-right minimal toggle
    Stardust.tsx          — canvas particle system (tiered)
  scenes/
    SceneOpening.tsx
    SceneReveal.tsx
    SceneBlessings.tsx
    SceneMemories.tsx
    SceneInteractive.tsx
    SceneFinale.tsx
public/
  music/song.mp3          — your track
  photos/                 — your photos (optional)
```

