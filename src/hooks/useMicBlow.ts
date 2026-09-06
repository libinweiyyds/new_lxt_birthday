/**
 * useMicBlow — optional microphone blow detection.
 *
 * Uses the Web Audio API to measure the mic level. If the volume
 * crosses a threshold for a short window, the `blown` callback fires.
 *
 * If the user denies mic permission, the API is unavailable, or the
 * page is not on HTTPS, this hook simply never fires — the caller is
 * expected to provide tap/long-press interactions as a fallback.
 */

import { useEffect, useRef, useState } from 'react';

type Options = {
  threshold?: number;     // 0..1
  durationMs?: number;    // how long the threshold must be exceeded
  onBlow: () => void;
  enabled?: boolean;
};

export function useMicBlow({
  threshold = 0.18,
  durationMs = 200,
  onBlow,
  enabled = true,
}: Options) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const accumulatedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const setup = async () => {
      // HTTPS / localhost check
      if (typeof window === 'undefined') return;
      const isSecure = window.isSecureContext || location.hostname === 'localhost';
      if (!isSecure) {
        setError('insecure-context');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('no-api');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const check = () => {
          if (cancelled || firedRef.current) return;
          analyser.getByteTimeDomainData(data);
          // RMS-ish
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);

          if (rms > threshold) {
            const now = performance.now();
            if (!lastTimeRef.current) lastTimeRef.current = now;
            accumulatedRef.current += now - lastTimeRef.current;
            lastTimeRef.current = now;
            if (accumulatedRef.current > durationMs) {
              firedRef.current = true;
              onBlow();
              return;
            }
          } else {
            lastTimeRef.current = 0;
            accumulatedRef.current = 0;
          }
          rafRef.current = requestAnimationFrame(check);
        };
        setReady(true);
        rafRef.current = requestAnimationFrame(check);
      } catch (err) {
        setError('denied');
        // Silently — tap interaction still works.
      }
    };

    setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, [threshold, durationMs, onBlow, enabled]);

  return { ready, error };
}
