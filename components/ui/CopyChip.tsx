"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyChip({
  text,
  prefix = "$",
  tooltip = "Copied",
  label,
  className,
  tone = "light",
}: {
  text: string;
  prefix?: string;
  tooltip?: string;
  label?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard can be blocked; still confirm visually */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label ?? "Copy"}: ${text}`}
      className={cn(
        "group relative inline-flex max-w-full cursor-pointer items-center gap-3 rounded-[10px] border-2 px-3 py-2 text-left font-mono text-[13px] transition-colors",
        tone === "light"
          ? "border-line-strong bg-surface text-ink-2 hover:border-ink"
          : "border-m-line bg-m-surface text-m-ink hover:border-m-dim",
        className,
      )}
    >
      {prefix && <span className={tone === "light" ? "text-slate" : "text-m-dim"}>{prefix}</span>}
      <span className="min-w-0 flex-1 break-words">{text}</span>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 text-[11px]",
          tone === "light" ? "text-slate group-hover:text-ink" : "text-m-dim group-hover:text-m-ink",
        )}
      >
        {copied ? <Check size={14} strokeWidth={2} className="text-pass" aria-hidden /> : <Copy size={14} strokeWidth={1.5} aria-hidden />}
        {label && <span className="hidden sm:inline">{copied ? "Copied" : label}</span>}
      </span>
      <span
        role="status"
        className={cn(
          "t-mono-xs pointer-events-none absolute left-0 top-full z-20 mt-2 whitespace-nowrap rounded-sq bg-ink px-2 py-1 text-on-blue transition-all duration-200",
          copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        {copied ? tooltip : ""}
      </span>
    </button>
  );
}
