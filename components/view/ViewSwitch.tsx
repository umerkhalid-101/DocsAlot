"use client";

import { useEffect, useState } from "react";
import { machine } from "@/content/site";
import { cn } from "@/lib/cn";
import { useView } from "./ViewProvider";

const SEEN_KEY = "docsalot:flip-seen";

export function ViewSwitch({ hint = false, className }: { hint?: boolean; className?: string }) {
  const { view, toggle } = useView();
  const on = view === "machine";
  const [showHint, setShowHint] = useState(false);

  // First visit only: pulse once after the hero settles, with a tiny note.
  useEffect(() => {
    if (!hint) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage can be unavailable */
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const show = window.setTimeout(() => setShowHint(true), 3600);
    const hide = window.setTimeout(() => setShowHint(false), 9000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hint]);

  useEffect(() => {
    if (!on) return;
    setShowHint(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage can be unavailable */
    }
  }, [on]);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Machine view: show the page as agents read it"
        aria-keyshortcuts="M"
        title="Toggle Human / Machine view (M)"
        onClick={toggle}
        className={cn(
          "t-mono-xs relative grid h-8 cursor-pointer grid-cols-2 items-center rounded-sq border border-[var(--c-line)] bg-[var(--c-hover)] p-[3px] text-[11.5px] font-medium",
          showHint && "pulse-once",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-[2px] transition-transform duration-300 ease-[var(--ease-snap)]",
            on ? "translate-x-full bg-blue" : "translate-x-0 bg-ink",
          )}
        />
        <span
          className={cn(
            "relative z-10 px-2.5 transition-colors duration-200",
            on ? "text-[var(--c-dim)]" : "text-on-blue",
          )}
        >
          Human
        </span>
        <span
          className={cn(
            "relative z-10 px-2.5 transition-colors duration-200",
            on ? "text-on-blue" : "text-[var(--c-dim)]",
          )}
        >
          Machine
        </span>
      </button>
      <span
        aria-hidden
        className={cn(
          "t-mono-xs pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-blue transition-all duration-300",
          showHint ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        ↑ {machine.flipMe} <span className="text-slate">or press M</span>
      </span>
    </div>
  );
}
