import { cn } from "@/lib/cn";

/** DocsAlot's mark as used on docsalot.dev: a dark rounded square with a list glyph. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-[8px]", className)}
      style={{ background: "var(--c-ink, var(--ink))", color: "var(--c-solid, var(--canvas))" }}
    >
      <svg viewBox="0 0 24 24" className="h-[43%] w-[43%]" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[16px] font-[650] tracking-[-0.02em]">DocsAlot</span>
    </span>
  );
}
