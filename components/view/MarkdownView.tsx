import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders a markdown string as an agent sees it: raw syntax kept visible,
 * lightly colored. Links stay real links. No markdown library needed.
 */

const INLINE = /(!?\[[^\]]*\]\([^)]*\))|(\*\*[^*]+\*\*)|(`[^`]+`)|(\{#[\w-]+\})|(_[^_]+_$|^_[^_]+_)/g;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    const k = `${key}-${i++}`;
    if (m[1]) {
      const img = tok.startsWith("!");
      const label = tok.slice(img ? 2 : 1, tok.indexOf("]("));
      const href = tok.slice(tok.indexOf("](") + 2, -1);
      const external = /^https?:|^mailto:/.test(href);
      out.push(
        <span key={k}>
          <span className="text-m-dim">{img ? "![" : "["}</span>
          {img ? (
            <span className="text-m-ink">{label}</span>
          ) : (
            <a
              href={href}
              target={external && !href.startsWith("https://docsalot.dev") && !href.startsWith("mailto:") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-m-blue underline decoration-m-blue/40 underline-offset-[3px] hover:decoration-m-blue"
            >
              {label}
            </a>
          )}
          <span className="text-m-dim">]({href})</span>
        </span>,
      );
    } else if (m[2]) {
      out.push(
        <span key={k}>
          <span className="text-m-dim">**</span>
          <span className="font-semibold text-m-ink">{tok.slice(2, -2)}</span>
          <span className="text-m-dim">**</span>
        </span>,
      );
    } else if (m[3]) {
      out.push(
        <span key={k} className="rounded-[2px] bg-m-surface px-0.5 text-m-ink">
          <span className="text-m-dim">`</span>
          {tok.slice(1, -1)}
          <span className="text-m-dim">`</span>
        </span>,
      );
    } else if (m[4]) {
      out.push(
        <span key={k} className="text-m-dim">
          {tok}
        </span>,
      );
    } else {
      out.push(
        <span key={k} className="italic text-m-dim">
          {tok}
        </span>,
      );
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MarkdownView({
  md,
  className,
  numbered = false,
  dense = false,
  gutter,
  gutterBelow = false,
}: {
  md: string;
  className?: string;
  numbered?: boolean;
  dense?: boolean;
  /** optional annotations rendered to the right of a line, keyed by line index */
  gutter?: Record<number, ReactNode>;
  /** render annotations on their own row under the line instead of to the right */
  gutterBelow?: boolean;
}) {
  const lines = md.split("\n");
  let inFence = false;
  let fenceLang = "";

  return (
    <div className={cn("font-mono text-m-ink", dense ? cn("leading-[1.65]", !className?.includes("text-[") && "text-[12px]") : "t-code", className)}>
      {lines.map((raw, i) => {
        const key = `l${i}`;
        let node: ReactNode;
        let cls = "";

        if (raw.startsWith("```")) {
          inFence = !inFence;
          fenceLang = inFence ? raw.slice(3) : "";
          node = <span className="text-m-dim">{raw}</span>;
        } else if (inFence) {
          cls = "bg-m-surface/70 pl-3 text-m-ink";
          node = colorFenceLine(raw, fenceLang);
        } else if (/^#{1,6} /.test(raw)) {
          const hashes = raw.match(/^#+/)![0];
          const rest = raw.slice(hashes.length + 1);
          cls = cn("font-semibold text-m-blue", hashes.length === 1 && "text-[1.15em]");
          node = (
            <>
              <span className="text-m-blue/55">{hashes} </span>
              {inline(rest, key)}
            </>
          );
        } else if (raw.startsWith("<!--")) {
          node = <span className="italic text-m-dim">{raw}</span>;
        } else if (raw.startsWith(">")) {
          node = (
            <>
              <span className="text-m-blue/60">&gt;</span>
              <span className="text-m-ink/90">{inline(raw.slice(1), key)}</span>
            </>
          );
        } else if (/^\s*([-*]|\d+\.) /.test(raw)) {
          const marker = raw.match(/^\s*([-*]|\d+\.) /)![0];
          node = (
            <>
              <span className="text-m-blue/70">{marker}</span>
              {inline(raw.slice(marker.length), key)}
            </>
          );
        } else if (raw.startsWith("|")) {
          node = raw.split(/(\|)/).map((part, j) =>
            part === "|" ? (
              <span key={j} className="text-m-dim/70">
                |
              </span>
            ) : /^ ?-+ ?$/.test(part) ? (
              <span key={j} className="text-m-dim/70">
                {part}
              </span>
            ) : (
              <Fragment key={j}>{inline(part, `${key}-${j}`)}</Fragment>
            ),
          );
        } else if (raw === "---") {
          node = <span className="text-m-dim">---</span>;
        } else {
          node = inline(raw, key);
        }

        return (
          <Fragment key={key}>
          <div className={cn("flex min-h-[1lh] whitespace-pre-wrap [overflow-wrap:anywhere]", cls)}>
            {numbered && (
              <span aria-hidden className="mr-4 inline-block w-6 shrink-0 select-none text-right text-m-dim/50">
                {i + 1}
              </span>
            )}
            <span className="min-w-0 flex-1">{node}</span>
            {gutter && !gutterBelow && <span className="ml-2 flex w-[112px] shrink-0 justify-end">{gutter[i]}</span>}
          </div>
          {gutter && gutterBelow && gutter[i] && <div className="my-0.5">{gutter[i]}</div>}
          </Fragment>
        );
      })}
    </div>
  );
}

function colorFenceLine(line: string, lang: string): ReactNode {
  if (lang === "diff" && line.startsWith("+ ")) return <span className="text-m-pass">{line}</span>;
  if (lang === "diff" && line.startsWith("- ")) return <span className="text-m-fail">{line}</span>;
  if (line.startsWith("$ ")) {
    return (
      <>
        <span className="text-m-dim">$ </span>
        {line.slice(2)}
      </>
    );
  }
  return line;
}
