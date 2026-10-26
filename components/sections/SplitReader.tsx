"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { Copy, Info, Lock } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { acme, quickstart } from "@/content/demo";
import { cn } from "@/lib/cn";
import { useReduced } from "@/lib/motion";
import { quickstartMarkdown } from "@/lib/toMarkdown";
import { MarkdownView } from "@/components/view/MarkdownView";

const REST = 55;

export function SplitReader({ codeHtml, caption }: { codeHtml: Record<string, string>; caption: string }) {
  const pos = useMotionValue(REST);
  const humanClip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`);
  const machineClip = useTransform(pos, (p) => `inset(0 0 0 ${p}%)`);
  const left = useTransform(pos, (p) => `${p}%`);
  const [value, setValue] = useState(REST);
  useMotionValueEvent(pos, "change", (v) => setValue(Math.round(v)));

  const box = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const reduced = useReduced();

  // Teach the interaction once: sweep across, then rest at 55%.
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      if (touched.current) return;
      animate(pos, [REST, 7, 93, REST], { duration: 2.8, ease: [0.7, 0, 0.2, 1], times: [0, 0.32, 0.72, 1] });
    }, 2300);
    return () => window.clearTimeout(id);
  }, [pos, reduced]);

  const setFromClientX = (x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    touched.current = true;
    pos.stop();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    const map: Record<string, number> = {
      ArrowLeft: pos.get() - step,
      ArrowRight: pos.get() + step,
      ArrowDown: pos.get() - step,
      ArrowUp: pos.get() + step,
      Home: 0,
      End: 100,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    touched.current = true;
    pos.stop();
    animate(pos, Math.max(0, Math.min(100, map[e.key])), { type: "spring", stiffness: 420, damping: 34 });
  };

  const md = quickstartMarkdown();
  const lines = md.split("\n");
  const find = (needle: string) => lines.findIndex((l) => l.includes(needle));
  const gutter: Record<number, ReactNode> = {
    [find("npm install @acme/sdk")]: <Cite who="cited by Claude" />,
    [find("import { Acme }")]: <Cite who="fetched by Cursor" />,
    [find("Each API key can make")]: <Cite who="cited by ChatGPT" />,
  };

  return (
    <figure className="relative">
      <div className="tone-light relative rounded-[14px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--ink)]">
        {/* Browser frame */}
        <div className="flex h-10 items-center gap-3 border-b border-line px-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-[1px] bg-line-strong" />
            <span className="h-2 w-2 rounded-[1px] bg-line-strong" />
            <span className="h-2 w-2 rounded-[1px] bg-line-strong" />
          </div>
          <div className="t-mono-xs mx-auto flex h-6 min-w-0 items-center gap-1.5 rounded-sq bg-surface-muted px-2.5 text-slate">
            <Lock size={10} strokeWidth={1.75} aria-hidden />
            <span className="truncate">{acme.docsUrl}</span>
          </div>
          <span className="t-mono-xs hidden w-[46px] text-right text-slate sm:block">{value}%</span>
        </div>

        {/* Two layers of the same page */}
        <div
          ref={box}
          className="relative h-[460px] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-b-[12px] md:h-[540px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          <motion.div className="absolute inset-0 bg-surface" style={{ clipPath: humanClip }} aria-hidden>
            <HumanDoc codeHtml={codeHtml} />
          </motion.div>
          <motion.div className="absolute inset-0 bg-m-canvas" style={{ clipPath: machineClip }} aria-hidden>
            <MachineDoc md={md} gutter={gutter} />
          </motion.div>

          {/* Labels */}
          <span className="t-mono-xs pointer-events-none absolute bottom-3 left-3 z-10 rounded-[2px] bg-ink px-1.5 py-0.5 text-on-blue">human</span>
          <span className="t-mono-xs pointer-events-none absolute bottom-3 right-3 z-10 rounded-[2px] bg-m-blue px-1.5 py-0.5 text-m-canvas">machine</span>

          {/* Divider */}
          <motion.div className="absolute inset-y-0 z-20 w-px -translate-x-1/2 bg-blue" style={{ left }}>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Human and machine divider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
              aria-valuetext={`${value}% human, ${100 - value}% machine`}
              onKeyDown={onKeyDown}
              className="t-mono-xs absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-grab items-center gap-1.5 whitespace-nowrap rounded-sq border border-blue bg-surface px-2 py-1 text-[10.5px] font-medium text-blue shadow-frame active:cursor-grabbing"
            >
              <Grip />
              Human <span className="text-blue/40">|</span> Machine
              <Grip />
            </div>
          </motion.div>
        </div>
      </div>
      <figcaption className="t-path mt-4 flex items-center gap-2">
        <span aria-hidden className="h-1.5 w-1.5 bg-blue" />
        {caption}
        <span className="hidden text-slate/70 sm:inline">drag the divider</span>
      </figcaption>
    </figure>
  );
}

function MachineDoc({ md, gutter }: { md: string; gutter: Record<number, ReactNode> }) {
  const row = (k: string, v: string, tone = "text-m-ink/80") => (
    <div className="flex gap-2">
      <span className="text-m-dim">{k}</span>
      <span className={tone}>{v}</span>
    </div>
  );
  return (
    <div className="grid h-full grid-cols-[55%_45%]">
      <div className="hidden flex-col gap-5 overflow-hidden border-r border-m-line px-5 py-5 font-mono text-[11px] leading-[1.7] sm:flex">
        <div>
          <p className="mb-1 text-m-blue">request</p>
          {row("GET", "/docs/quickstart.md")}
          {row("host:", acme.domain)}
          {row("accept:", "text/markdown")}
          {row("user-agent:", "coding-agent")}
        </div>
        <div>
          <p className="mb-1 text-m-blue">response</p>
          {row("status:", "200 OK", "text-m-pass")}
          {row("content-type:", "text/markdown")}
          {row("x-source:", "docsalot / acme-docs")}
          {row("link:", "</llms.txt>; rel=index")}
          {row("tokens:", "~410")}
        </div>
        <div>
          <p className="mb-1 text-m-blue">anchors</p>
          {quickstart.steps.map((s) => (
            <div key={s.id} className="text-m-ink/80">
              <span className="text-m-dim">#</span>
              {s.id}
            </div>
          ))}
          <div className="text-m-ink/80">
            <span className="text-m-dim">#</span>
            {quickstart.rateLimits.id}
          </div>
        </div>
        <div>
          <p className="mb-1 text-m-blue">also served at</p>
          <div className="text-m-ink/80">/llms.txt</div>
          <div className="text-m-ink/80">/skill.md</div>
          <div className="text-m-ink/80">{acme.mcp}</div>
        </div>
      </div>
      <div className="col-span-2 overflow-hidden py-5 pl-[calc(55%+10px)] pr-3 sm:col-span-1 sm:px-4">
        <MarkdownView md={md} dense gutter={gutter} gutterBelow className="text-[10.5px] sm:text-[11.5px]" />
      </div>
    </div>
  );
}

function Grip() {
  return (
    <span aria-hidden className="flex gap-[2px]">
      <span className="h-2.5 w-px bg-blue/60" />
      <span className="h-2.5 w-px bg-blue/60" />
    </span>
  );
}

function Cite({ who }: { who: string }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-[2px] border border-m-blue/30 bg-m-blue/10 px-1 text-[10px] leading-[1.6] text-m-blue">
      <span aria-hidden className="h-1 w-1 bg-m-blue" />
      {who}
    </span>
  );
}

function HumanDoc({ codeHtml }: { codeHtml: Record<string, string> }) {
  return (
    <div className="flex h-full">
      <aside className="hidden w-[164px] shrink-0 border-r border-line bg-canvas px-4 py-5 sm:block">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-4 w-4 rounded-[3px] bg-ink" />
          <span className="font-display text-[13px] font-semibold tracking-tight text-ink">Acme Docs</span>
        </div>
        {quickstart.sidebar.map((g) => (
          <div key={g.group} className="mb-4">
            <p className="mb-1.5 font-display text-[11px] font-semibold text-ink">{g.group}</p>
            <ul className="space-y-0.5 border-l border-line">
              {g.items.map((i) => (
                <li
                  key={i}
                  className={cn(
                    "-ml-px border-l py-0.5 pl-2.5 text-[12px]",
                    i === "Quickstart" ? "border-blue font-medium text-blue" : "border-transparent text-slate",
                  )}
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <article className="relative min-w-0 flex-1 overflow-hidden px-5 py-5 md:px-7">
        <p className="t-mono-xs text-slate">{quickstart.breadcrumb.join(" / ")}</p>
        <h3 className="mt-1.5 font-display text-[26px] font-semibold tracking-[-0.025em] text-ink">{quickstart.title}</h3>
        <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-relaxed text-slate">{quickstart.lede}</p>
        <ol className="mt-5 space-y-4">
          {quickstart.steps.map((s, i) => (
            <li key={s.id} className="relative pl-7">
              <span className="absolute left-0 top-0 grid h-[18px] w-[18px] place-items-center rounded-[3px] border border-line-strong font-mono text-[10px] text-ink">
                {i + 1}
              </span>
              <p className="font-display text-[14px] font-semibold leading-[18px] text-ink">{s.title}</p>
              <p className="mt-0.5 text-[12.5px] text-slate">{s.body}</p>
              <div className="mt-2 overflow-hidden rounded-[4px] border border-ink/10 bg-m-canvas">
                <div className="flex items-center justify-between border-b border-m-line px-2.5 py-1">
                  <span className="font-mono text-[10px] text-m-dim">{s.lang === "ts" ? "index.ts" : "terminal"}</span>
                  <Copy size={10} strokeWidth={1.5} className="text-m-dim" aria-hidden />
                </div>
                <div
                  className="shiki-block px-2.5 py-2 text-[11px] leading-[1.6]"
                  dangerouslySetInnerHTML={{ __html: codeHtml[s.id] ?? "" }}
                />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-2.5 rounded-[4px] border border-blue/20 bg-blue-soft px-3 py-2.5">
          <Info size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-blue" aria-hidden />
          <p className="text-[12.5px] leading-snug text-ink-2">
            <span className="font-semibold text-ink">{quickstart.rateLimits.title}.</span> {quickstart.rateLimits.body}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </article>
    </div>
  );
}
