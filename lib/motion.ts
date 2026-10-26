"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export const snap = { type: "spring", stiffness: 420, damping: 34 } as const;
export const glide = { type: "spring", stiffness: 170, damping: 26 } as const;
export const SCAN_MS = 650;
export const RESOLVE_MS_PER_LINE = 30;
export const STAGGER = 0.04;
export const easeScan = [0.7, 0, 0.2, 1] as const;
export const easeSnap = [0.2, 0.9, 0.25, 1] as const;

export function useReduced(): boolean {
  return useReducedMotion() ?? false;
}

/**
 * A pausable playhead for scripted demos. Starts once when `ref` is in view,
 * pauses while off screen, and can be replayed. Reduced motion jumps to the end.
 */
export function usePlayhead(
  ref: RefObject<Element | null>,
  duration: number,
  { amount = 0.5, autoplay = true }: { amount?: number; autoplay?: boolean } = {},
) {
  const reduced = useReduced();
  const inView = useInView(ref, { amount });
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (autoplay && inView && !started.current) {
      started.current = true;
      setPlaying(true);
    }
  }, [autoplay, inView]);

  useEffect(() => {
    if (!playing || !inView || reduced) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 250);
      last = now;
      setT((prev) => {
        const next = Math.min(duration, prev + dt);
        if (next >= duration) setPlaying(false);
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView, duration, reduced]);

  const play = useCallback(() => {
    started.current = true;
    setT(0);
    setPlaying(true);
  }, []);

  if (reduced) return { t: duration, done: true, playing: false, play, inView };
  return { t, done: t >= duration, playing, play, inView };
}

/** Characters of `text` typed by time t, starting at `start`, at `cps` chars per second. */
export function typed(text: string, t: number, start: number, msPerChar = 28): string {
  if (t <= start) return "";
  const n = Math.floor((t - start) / msPerChar);
  return text.slice(0, n);
}

/** Linear 0..1 progress between two timestamps. */
export function progress(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return (t - start) / (end - start);
}

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
