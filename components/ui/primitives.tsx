import type { ComponentProps, ReactNode } from "react";
import { docsNav } from "@/content/site";
import { cn } from "@/lib/cn";

/* ---------- Layout ---------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 md:px-6", className)}>{children}</div>;
}

export function Grid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid grid-cols-12 gap-x-6", className)}>{children}</div>;
}

/* ---------- Corner marks and panels ---------- */

export function CornerMarks({ tone = "blue", size = 5 }: { tone?: "blue" | "ink" | "m"; size?: number }) {
  const color = tone === "blue" ? "bg-blue" : tone === "ink" ? "bg-ink" : "bg-m-blue";
  const off = -Math.ceil(size / 2);
  const pos = [
    { top: off, left: off },
    { top: off, right: off },
    { bottom: off, left: off },
    { bottom: off, right: off },
  ];
  return (
    <>
      {pos.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("pointer-events-none absolute z-10", color)}
          style={{ ...p, width: size, height: size }}
        />
      ))}
    </>
  );
}

export function Panel({
  className,
  children,
  marks = true,
  dark = false,
  ...rest
}: { className?: string; children: ReactNode; marks?: boolean; dark?: boolean } & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-panel border",
        dark ? "border-m-line bg-m-canvas text-m-ink" : "tone-light rounded-[12px] border-2 border-ink bg-surface shadow-[5px_5px_0_0_var(--ink)]",
        className,
      )}
      {...rest}
    >
      {marks && dark && <CornerMarks tone="m" />}
      {children}
    </div>
  );
}

/* ---------- Type ---------- */

export function PathMarker({ path, id, className }: { path: string; id: string; className?: string }) {
  const item = docsNav.flatMap((g) => g.items).find((i) => i.id === id);
  return (
    <a href={`#${id}`} className={cn("t-path group inline-flex items-center gap-1.5 hover:text-ink", className)}>
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded-[3px] border border-line-strong font-mono text-[11px] text-blue transition-colors group-hover:border-blue">
        #
      </span>
      <Decode className="text-ink" text={item?.label ?? path} />
      {item && <span className="ml-1 hidden text-slate/70 sm:inline">{path}</span>}
    </a>
  );
}

import { Decode } from "./Reveal";
export { SectionTitle, Reveal, Sticker } from "./Reveal";

/* ---------- Buttons ---------- */

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ink" | "text";
  external?: boolean;
  className?: string;
  size?: "md" | "lg";
};

export function Button({ href, children, variant = "primary", external, className, size = "md" }: BtnProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-display text-[15px] font-medium tracking-[-0.005em] transition-[background,color,border-color,transform,box-shadow] duration-150",
        size === "lg" ? "h-12 px-5" : "h-10 px-4",
        variant !== "text" &&
          "border-2 border-ink font-semibold shadow-[3px_3px_0_0_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        variant === "primary" && "bg-blue text-on-blue",
        variant === "ink" && "bg-ink text-on-blue",
        variant === "outline" && "bg-surface text-ink",
        variant === "text" && "h-auto px-0 text-ink underline decoration-line-strong underline-offset-4 hover:decoration-blue",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function TextLink({ href, children, external, className }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "font-display text-[15px] font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-[5px] transition-colors hover:text-blue hover:decoration-blue",
        className,
      )}
    >
      {children}
    </a>
  );
}

/* ---------- Small marks ---------- */

export function Tag({ children, tone = "slate", className }: { children: ReactNode; tone?: "slate" | "blue" | "amber" | "pass" | "fail"; className?: string }) {
  return (
    <span
      className={cn(
        "t-mono-xs inline-flex items-center gap-1 rounded-[2px] px-1.5 py-px font-medium",
        tone === "slate" && "bg-surface-muted text-slate",
        tone === "blue" && "bg-blue-soft text-blue",
        tone === "amber" && "bg-amber-soft text-amber",
        tone === "pass" && "bg-pass-soft text-pass",
        tone === "fail" && "bg-fail-soft text-fail",
        className,
      )}
    >
      {children}
    </span>
  );
}
