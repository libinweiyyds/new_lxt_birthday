import { useEffect, useState, useCallback } from 'react';
import { birthday } from '../data/birthday';

/**
 * Singleton music hook.
 *
 * The audio element lives at module level so it can be created once and
 * shared across every component that calls useMusic(). The Opening
 * scene's "给特别的你" entry button can call toggle() to start music
 * as part of the entry gesture, and the MusicButton shown later in
 * the film stage will reflect the same playing state.
 */

let audioEl: HTMLAudioElement | null = null;
let playingState = false;
let readyState = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function ensureAudio(): HTMLAudioElement | null {
  if (audioEl) return audioEl;
  if (!birthday.music.src) return null;
  audioEl = new Audio(birthday.music.src);
  audioEl.loop = true;
  audioEl.volume = 0.55;
  audioEl.preload = 'none';
  audioEl.addEventListener('canplaythrough', () => {
    readyState = true;
    notify();
  });
  return audioEl;
}

export function useMusic() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        playingState = true;
      } else {
        audio.pause();
        playingState = false;
      }
      notify();
    } catch (err) {
      // Autoplay restrictions or missing file — fail silently.
      console.warn('[music] play blocked or missing:', err);
    }
  }, []);

  return { playing: playingState, ready: readyState, toggle };
}
