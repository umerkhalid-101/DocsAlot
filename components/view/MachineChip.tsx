"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { machine } from "@/content/site";
import { cn } from "@/lib/cn";
import { pageMarkdown } from "@/lib/toMarkdown";
import { useView } from "./ViewProvider";

export function MachineChip() {
  const { settled, scanning } = useView();
  const [copied, setCopied] = useState(false);
  const shown = settled === "machine" && !scanning;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageMarkdown());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked */
    }
  };

  return (
    <div
      inert={!shown}
      className={cn(
        "fixed bottom-[68px] right-3 z-50 flex max-w-[calc(100vw-24px)] items-center gap-3 rounded-panel border border-m-line bg-m-surface/95 py-2 pl-3 pr-2 shadow-pop backdrop-blur transition-all duration-300 md:bottom-5 md:right-5",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="t-mono-xs text-m-ink">{machine.chip}</span>
      <button
        type="button"
        onClick={copy}
        className="t-mono-xs inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sq bg-m-blue px-2 py-1 font-medium text-m-canvas hover:bg-m-ink"
      >
        {copied ? <Check size={12} strokeWidth={2} aria-hidden /> : <Copy size={12} strokeWidth={1.75} aria-hidden />}
        {copied ? machine.copied : machine.copy}
      </button>
    </div>
  );
}
