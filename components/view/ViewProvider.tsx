"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { machine } from "@/content/site";
import { SCAN_MS } from "@/lib/motion";

export type View = "human" | "machine";

type Ctx = {
  view: View;
  /** true once the scan has finished and the target view fully owns the page */
  settled: View;
  scanning: boolean;
  toggle: () => void;
  setView: (v: View) => void;
  registerLayer: (el: HTMLElement | null) => void;
  scanRef: React.RefObject<HTMLDivElement | null>;
};

const ViewContext = createContext<Ctx | null>(null);

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside ViewProvider");
  return ctx;
}

const STORAGE_KEY = "docsalot:view";

function readInitial(): View {
  if (typeof document === "undefined") return "human";
  return document.documentElement.dataset.view === "machine" ? "machine" : "human";
}

const ease = (x: number) => {
  // cubic-bezier(0.7, 0, 0.2, 1) approximated with an ease-in-out quint-ish curve
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>("human");
  const [settled, setSettled] = useState<View>("human");
  const [scanning, setScanning] = useState(false);
  const layers = useRef(new Set<HTMLElement>());
  const scanRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);
  const live = useRef<HTMLDivElement | null>(null);

  // Pick up ?view=machine (applied pre-paint by the inline script in layout).
  useEffect(() => {
    const initial = readInitial();
    setViewState(initial);
    setSettled(initial);
  }, []);

  const registerLayer = useCallback((el: HTMLElement | null) => {
    if (el) layers.current.add(el);
  }, []);

  const persist = (v: View) => {
    const url = new URL(window.location.href);
    if (v === "machine") url.searchParams.set("view", "machine");
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url.toString());
    try {
      window.sessionStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* storage can be unavailable */
    }
  };

  const finish = useCallback((v: View) => {
    const root = document.documentElement;
    // Keep the reader at the same place within the same section when heights change.
    const navH = 64;
    const shells = Array.from(document.querySelectorAll<HTMLElement>("[data-shell]"));
    const anchor = shells.find((el) => el.getBoundingClientRect().bottom > navH);
    const before = anchor?.getBoundingClientRect();
    const ratio = before ? Math.max(0, Math.min(1, (navH - before.top) / before.height)) : 0;
    const atTop = window.scrollY < 4;
    root.dataset.view = v;
    root.dataset.chrome = v;
    delete root.dataset.scanning;
    layers.current.forEach((el) => {
      if (!el.isConnected) layers.current.delete(el);
      el.style.clipPath = "";
    });
    if (anchor && before && !atTop) {
      const after = anchor.getBoundingClientRect();
      if (ratio > 0) window.scrollTo({ top: after.top + window.scrollY + ratio * after.height - navH, behavior: "instant" });
      else window.scrollBy({ top: after.top - before.top, behavior: "instant" });
    }
    if (scanRef.current) scanRef.current.style.opacity = "0";
    setSettled(v);
    setScanning(false);
  }, []);

  const setView = useCallback(
    (v: View) => {
      if (v === view && !scanning) return;
      cancelAnimationFrame(raf.current);
      setViewState(v);
      persist(v);
      if (live.current) live.current.textContent = v === "machine" ? machine.announceMachine : machine.announceHuman;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        finish(v);
        return;
      }

      const root = document.documentElement;
      const down = v === "machine";
      root.dataset.scanning = "";
      if (down) root.dataset.chrome = "machine";
      setScanning(true);

      const vh = window.innerHeight;
      const line = scanRef.current;
      if (line) {
        line.style.opacity = "1";
        line.dataset.dir = down ? "down" : "up";
      }
      const start = performance.now();

      const frame = (now: number) => {
        const p = Math.min(1, (now - start) / SCAN_MS);
        const e = ease(p);
        // Machine content is shown above the line in both directions.
        const y = down ? e * vh : (1 - e) * vh;
        if (line) line.style.transform = `translate3d(0, ${y}px, 0)`;
        layers.current.forEach((el) => {
          const r = el.getBoundingClientRect();
          const visible = Math.max(0, Math.min(r.height, y - r.top));
          el.style.clipPath = `inset(0 0 ${r.height - visible}px 0)`;
        });
        if (!down && y < 80) root.dataset.chrome = "human";
        if (p < 1) raf.current = requestAnimationFrame(frame);
        else finish(v);
      };
      raf.current = requestAnimationFrame(frame);
    },
    [view, scanning, finish],
  );

  const toggle = useCallback(() => setView(view === "machine" ? "human" : "machine"), [view, setView]);

  // Keyboard: M toggles (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "m" && e.key !== "M") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo(
    () => ({ view, settled, scanning, toggle, setView, registerLayer, scanRef }),
    [view, settled, scanning, toggle, setView, registerLayer],
  );

  return (
    <ViewContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <div ref={live} aria-live="polite" className="sr-only" />
    </ViewContext.Provider>
  );
}
