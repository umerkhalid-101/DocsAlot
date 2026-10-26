"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, CircleCheck, FileText, Folder, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { apiBlock, docsTree } from "@/content/demo";
import { surfaces, type SurfaceId } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeScan, useReduced } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, Grid, PathMarker, SectionTitle } from "@/components/ui/primitives";
import { MarkdownView } from "@/components/view/MarkdownView";
import { SectionShell } from "@/components/view/SectionShell";

const CYCLE_MS = 6000;

// Which source files feed each surface (indexes into docsTree).
const FEEDS: Record<SurfaceId, number[]> = {
  hosted: [1, 2, 7],
  api: [4, 5, 8],
  llms: [1, 2, 4, 5, 7, 8, 9],
  skill: [1, 5, 9],
  mcp: [1, 2, 4, 5, 7, 8],
  audit: [1, 5, 7],
};

const TILE: Record<SurfaceId, string> = {
  hosted: "bg-surface",
  api: "bg-butter",
  llms: "bg-sky",
  skill: "bg-butter",
  mcp: "bg-sky",
  audit: "bg-surface",
};

/* ---------- The editable source ---------- */

type Src = { name: string; slug: string; limit: string };

const makeSrc = (name: string, limit: number): Src => {
  const clean = name.trim() || "Acme";
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "acme";
  return { name: clean, slug, limit: limit.toLocaleString("en-US") };
};

const llmsFor = (s: Src) => `# ${s.name}
> Payments API for developers. Accept payments, manage customers, handle webhooks.

## Docs
- [Quickstart](https://${s.slug}.dev/docs/quickstart): install the SDK, first payment
- [Authentication](https://${s.slug}.dev/docs/authentication): API keys and scopes
- [Rate limits](https://${s.slug}.dev/docs/api/rate-limits): ${s.limit} requests per minute
- [API reference](https://${s.slug}.dev/docs/api): every endpoint, from OpenAPI`;

const skillFor = (s: Src) => `---
name: ${s.slug}
description: Build and debug ${s.name} payment integrations.
---
## When to use
Any task that touches ${s.name} payments, customers or webhooks.
## Rules
- Install \`@${s.slug}/sdk\`.
- Stay under ${s.limit} requests per minute per key.`;

const mcpFor = (s: Src) => `> search_docs({ "query": "rate limit" })
< {
    "path": "/api/rate-limits",
    "title": "Rate limits",
    "snippet": "Each API key can make ${s.limit} requests per minute."
  }`;

const curlFor = (s: Src) => `curl https://api.${s.slug}.dev/v1/payments/pay_123 \\
  -H "Authorization: Bearer $${s.slug.toUpperCase().replace(/-/g, "_")}_API_KEY"`;

/** Milliseconds since `key` last changed, ticking while `run` is true. */
function useClock(key: string, run: boolean, max = 5000) {
  const reduced = useReduced();
  const [t, setT] = useState(0);
  useEffect(() => {
    setT(0);
    if (!run || reduced) return;
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const e = now - start;
      setT(e);
      if (e < max) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [key, run, max, reduced]);
  return reduced ? max : t;
}

export function Surfaces() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReduced();
  const [active, setActive] = useState<SurfaceId>("hosted");
  const [paused, setPaused] = useState(false);
  const idx = surfaces.items.findIndex((s) => s.id === active);

  // Auto-advance while visible, unless the visitor is steering.
  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setTimeout(() => {
      setActive(surfaces.items[(idx + 1) % surfaces.items.length].id);
    }, CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [inView, paused, reduced, idx]);

  const pick = (id: SurfaceId) => {
    setActive(id);
    setPaused(true);
  };

  const current = surfaces.items[idx];

  // The source the visitor can edit. Every surface is rendered from it.
  const [name, setName] = useState("Acme");
  const [limit, setLimit] = useState(1000);
  const [rev, setRev] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = window.setTimeout(() => setRev((r) => r + 1), 350);
    return () => window.clearTimeout(id);
  }, [name, limit]);
  const src = makeSrc(name, limit);
  const edited = name !== "Acme" || limit !== 1000;

  const t = useClock(`${active}-${rev}`, inView);

  // Wire geometry: from the center window to each surface card.
  const center = useRef<HTMLDivElement>(null);
  const items = useRef<Partial<Record<SurfaceId, HTMLButtonElement | null>>>({});
  const [wires, setWires] = useState<{ id: SurfaceId; d: string; from: [number, number]; to: [number, number] }[]>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const w = ref.current?.getBoundingClientRect();
      const c = center.current?.getBoundingClientRect();
      if (!w || !c || window.innerWidth < 1024) {
        setWires([]);
        return;
      }
      const next: { id: SurfaceId; d: string; from: [number, number]; to: [number, number] }[] = [];
      surfaces.items.forEach((it, i) => {
        const el = items.current[it.id]?.getBoundingClientRect();
        if (!el) return;
        const left = i < 3;
        const k = i % 3;
        const cy = c.top - w.top + (c.height * (k + 1)) / 4;
        const cx = left ? c.left - w.left : c.right - w.left;
        const iy = el.top - w.top + el.height / 2;
        const ix = left ? el.right - w.left : el.left - w.left;
        const mx = (cx + ix) / 2;
        next.push({ id: it.id, d: `M ${cx} ${cy} C ${mx} ${cy}, ${mx} ${iy}, ${ix} ${iy}`, from: [cx, cy], to: [ix, iy] });
      });
      setWires(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [active]);

  const card = (s: (typeof surfaces.items)[number]) => {
    const on = s.id === active;
    return (
      <button
        key={s.id}
        ref={(el) => {
          items.current[s.id] = el;
        }}
        role="tab"
        type="button"
        id={`surface-${s.id}`}
        aria-selected={on}
        aria-controls="surface-output"
        onClick={() => pick(s.id)}
        onMouseEnter={() => pick(s.id)}
        onFocus={() => pick(s.id)}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-[14px] border-2 px-4 py-3.5 text-left transition-all duration-300 ease-[var(--ease-snap)]",
          on ? `border-ink ${TILE[s.id]} -translate-y-0.5 shadow-[5px_5px_0_0_var(--ink)]` : "border-ink/15 bg-surface/60 hover:border-ink/40 hover:bg-surface",
        )}
      >
        <span className={cn("block font-mono text-[11.5px]", on ? "text-blue" : "text-slate")}>{s.at}</span>
        <span className="mt-0.5 block font-display text-[18px] font-semibold tracking-[-0.015em] text-ink md:text-[20px]">{s.name}</span>
        <span className="mt-1 block text-[14px] leading-snug text-ink-2">{s.body}</span>
        {on && !reduced && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/10">
            {paused ? (
              <span className="block h-full bg-blue" />
            ) : (
              <motion.span
                key={s.id}
                className="block h-full origin-left bg-blue"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView ? 1 : 0 }}
                transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
              />
            )}
          </span>
        )}
      </button>
    );
  };

  return (
    <SectionShell id={surfaces.id} path={surfaces.path} md={sectionMarkdown.surfaces()} band="sky">
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={surfaces.path} id={surfaces.id} />
        <Grid className="mt-10 gap-y-6 md:mt-14">
          <div className="col-span-12 lg:col-span-8">
            <SectionTitle lines={surfaces.title} />
          </div>
          <p className="t-body-lg col-span-12 max-w-[26rem] self-end lg:col-span-4">Six outputs, one maintained source. Edit the source below and watch every surface rebuild.</p>
        </Grid>

        <div ref={ref} className="relative mt-14 md:mt-20">
          {/* Wires from the source to every surface (desktop) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            <svg className="absolute inset-0 h-full w-full overflow-visible">
              {wires.map((w) => {
                const on = w.id === active;
                return (
                  <g key={w.id}>
                    <path
                      id={`wire-${w.id}`}
                      d={w.d}
                      fill="none"
                      strokeWidth={on ? 2.5 : 1.5}
                      strokeDasharray={on ? undefined : "4 5"}
                      className={cn("transition-[stroke] duration-300", on ? "stroke-blue" : "stroke-ink/25")}
                    />
                    {/* sockets where the wire meets the window and the card */}
                    <circle cx={w.from[0]} cy={w.from[1]} r={on ? 5 : 4} strokeWidth={2} className={cn(on ? "fill-blue stroke-ink" : "fill-sky stroke-ink/40")} />
                    <circle cx={w.to[0]} cy={w.to[1]} r={on ? 5 : 4} strokeWidth={2} className={cn(on ? "fill-blue stroke-ink" : "fill-sky stroke-ink/40")} />
                    {/* packets travelling along the wire, from the source out to the surface */}
                    {!reduced &&
                      (on ? [0, 0.5] : [0]).map((phase) => (
                        <circle
                          key={phase}
                          r={on ? 6 : 3.5}
                          strokeWidth={2}
                          className={on ? "fill-butter stroke-ink" : "fill-surface stroke-ink/50"}
                        >
                          <animateMotion
                            dur={on ? "1.6s" : "3.6s"}
                            begin={`${-phase * (on ? 1.6 : 3.6)}s`}
                            repeatCount="indefinite"
                            path={w.d}
                            calcMode="spline"
                            keyTimes="0;1"
                            keySplines="0.45 0 0.55 1"
                          />
                        </circle>
                      ))}
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            role="tablist"
            aria-label="Surfaces"
            className="relative grid grid-cols-12 gap-x-6 gap-y-8"
            onMouseLeave={() => setPaused(false)}
          >
            <div className="order-2 col-span-12 grid content-center gap-3 sm:grid-cols-3 lg:order-1 lg:col-span-3 lg:grid-cols-1 lg:gap-5 lg:pr-9">
              {surfaces.items.slice(0, 3).map((s) => card(s))}
            </div>
            <div className="order-1 col-span-12 lg:order-2 lg:col-span-6 lg:px-2">
            <div ref={center} className="tone-light relative overflow-hidden rounded-[16px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--ink)]">
              <div className="flex h-11 items-center justify-between gap-3 border-b-2 border-ink bg-canvas px-4">
                <span className="flex items-center gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-butter" />
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-sky" />
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-surface" />
                </span>
                <span className="truncate font-mono text-[12px] text-slate">
                  {src.slug}-docs <span className="text-ink">→</span> <span className="text-blue">{current.at}</span>
                </span>
                <BuildBadge t={t} />
              </div>

              <div className="grid min-h-[430px] grid-cols-1 sm:grid-cols-[150px_1fr]">
                {/* Source tree: files feeding this surface light up */}
                <ul className="relative hidden border-r-2 border-ink bg-canvas px-3 py-4 sm:block" aria-label="Docs source tree">
                  {docsTree.map((n, i) => {
                    const order = FEEDS[active].indexOf(i);
                    const lit = order !== -1 && t > 150 + order * 110;
                    return (
                      <li
                        key={i}
                        className={cn(
                          "relative flex items-center gap-1.5 rounded-[4px] py-[3px] pr-1 font-mono text-[11.5px] transition-colors duration-200",
                          lit ? "bg-blue-soft text-blue" : "text-ink-2",
                        )}
                        style={{ paddingLeft: 6 + n.depth * 12 }}
                      >
                        {n.name.endsWith("/") ? (
                          <Folder size={11} strokeWidth={1.5} className="shrink-0 text-slate" aria-hidden />
                        ) : (
                          <FileText size={11} strokeWidth={1.5} className={cn("shrink-0", lit ? "text-blue" : "text-slate")} aria-hidden />
                        )}
                        {n.name}
                        {lit && <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-blue" />}
                      </li>
                    );
                  })}
                  <li className="t-mono-xs mt-4 border-t border-line pt-3 text-slate">1 source of truth</li>
                  {/* Build beam */}
                  <motion.span
                    key={`beam-${active}-${rev}`}
                    aria-hidden
                    className="pointer-events-none absolute -right-[2px] top-0 w-[3px] bg-blue"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 0.9, ease: easeScan, delay: 0.4 }}
                  />
                </ul>

                {/* File packets flying from the source into the build */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-11 z-20 hidden overflow-hidden sm:block">
                  {!reduced &&
                    FEEDS[active].map((fi, k) => (
                      <motion.span
                        key={`${active}-${rev}-${fi}`}
                        className="absolute left-[40px] flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-ink bg-butter px-2 py-0.5 font-mono text-[11px] font-medium text-ink shadow-[2px_2px_0_0_var(--ink)]"
                        style={{ top: 16 + fi * 23.5 }}
                        initial={{ x: 0, opacity: 0, scale: 0.6 }}
                        animate={{ x: [0, 150, 360], opacity: [0, 1, 0], scale: [0.6, 1, 0.8], rotate: [0, -4, 6] }}
                        transition={{ duration: 1.1, ease: "easeInOut", delay: 0.25 + k * 0.12, times: [0, 0.35, 1] }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                        {docsTree[fi].name}
                      </motion.span>
                    ))}
                </div>

                <div id="surface-output" role="tabpanel" aria-labelledby={`surface-${active}`} className="relative min-w-0 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={active}
                      initial={{ clipPath: "inset(0 0 0 100%)" }}
                      animate={{ clipPath: "inset(0 0 0 0%)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: easeScan, delay: 0.35 }}
                      className="h-full"
                    >
                      <Output id={active} t={t} src={src} rev={rev} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            </div>
            <div className="order-3 col-span-12 grid content-center gap-3 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1 lg:gap-5 lg:pl-9">
              {surfaces.items.slice(3).map((s) => card(s))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[760px] md:mt-16">
            <div className="tone-light rounded-[16px] border-2 border-ink bg-butter p-4 shadow-[5px_5px_0_0_var(--ink)] md:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
                  <Pencil size={14} strokeWidth={2} aria-hidden /> Edit the source
                  <span className="font-mono text-[12px] font-normal text-ink/60">api/rate-limits.mdx</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setName("Acme");
                    setLimit(1000);
                  }}
                  disabled={!edited}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-2.5 py-0.5 font-mono text-[11.5px] text-ink transition-opacity disabled:cursor-default disabled:opacity-40"
                >
                  <RotateCcw size={11} strokeWidth={2} aria-hidden /> reset
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
                <label className="block">
                  <span className="t-mono-xs text-ink/70">product name</span>
                  <input
                    value={name}
                    maxLength={16}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPaused(true);
                    }}
                    spellCheck={false}
                    className="mt-1 h-11 w-full rounded-[10px] border-2 border-ink bg-surface px-3 font-display text-[17px] font-semibold text-ink outline-none focus:shadow-[3px_3px_0_0_var(--blue)]"
                  />
                </label>
                <label className="block">
                  <span className="t-mono-xs flex items-baseline justify-between text-ink/70">
                    rate limit
                    <span className="font-display text-[17px] font-semibold tabular-nums text-ink">
                      {src.limit} <span className="font-mono text-[11.5px] font-normal text-ink/60">req / min</span>
                    </span>
                  </span>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={100}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPaused(true);
                    }}
                    className="mt-3 h-2 w-full cursor-pointer accent-[var(--blue)]"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-live="polite">
              <span className="mr-1 font-mono text-[12.5px] text-ink">
                {rev === 0 ? "One source feeds all six:" : `1 edit → ${surfaces.items.length} surfaces updated`}
              </span>
              {surfaces.items.map((s, i) => {
                const ok = rev > 0 && t > 1300 + i * 140;
                return (
                  <span
                    key={s.id}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 font-mono text-[11.5px] transition-all duration-300",
                      ok ? "scale-100 border-ink bg-pass text-on-blue" : "border-ink/20 bg-surface/60 text-ink",
                    )}
                  >
                    {ok && <Check size={11} strokeWidth={2.5} aria-hidden />}
                    {s.name}
                  </span>
                );
              })}
            </div>
        </div>
      </Container>
    </SectionShell>
  );
}

function BuildBadge({ t }: { t: number }) {
  const done = t > 1400;
  return (
    <span
      className={cn(
        "t-mono-xs inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-2 py-0.5 font-medium transition-colors duration-300",
        done ? "border-pass bg-pass-soft text-pass" : "border-blue bg-blue-soft text-blue",
      )}
    >
      {done ? <Check size={11} strokeWidth={2.5} aria-hidden /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue" />}
      {done ? "published" : "building"}
    </span>
  );
}

const typeBy = (text: string, t: number, start: number, msPerChar = 14) => text.slice(0, Math.max(0, Math.floor((t - start) / msPerChar)));
const rise = (v: boolean) => cn("transition-all duration-500 ease-[var(--ease-snap)]", v ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0");

function Value({ children, rev }: { children: React.ReactNode; rev: number }) {
  return (
    <motion.span
      key={rev}
      initial={rev > 0 ? { backgroundColor: "var(--butter)" } : false}
      animate={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 1.6, delay: 0.8 }}
      className="rounded-[3px] px-0.5"
    >
      {children}
    </motion.span>
  );
}

function Output({ id, t, src, rev }: { id: SurfaceId; t: number; src: Src; rev: number }) {
  if (id === "llms" || id === "skill") {
    const file = id === "llms" ? llmsFor(src) : skillFor(src);
    const shown = typeBy(file, t, 700, 9);
    return (
      <div className="h-full bg-m-canvas p-5 md:p-6">
        <p className="t-mono-xs mb-3 text-m-dim">
          <span className="text-m-pass">200</span> GET {src.slug}.dev/{id === "llms" ? "llms.txt" : "skill.md"} · text/markdown
        </p>
        <MarkdownView md={shown || " "} dense />
        {shown.length < file.length && <span className="caret ml-0.5 text-m-blue" aria-hidden />}
      </div>
    );
  }

  if (id === "mcp") {
    const [req, ...res] = mcpFor(src).split("\n");
    const reqTyped = typeBy(req, t, 700, 22);
    return (
      <div className="h-full bg-m-canvas p-5 font-mono text-[12.5px] leading-[1.8] md:p-6">
        <p className="mb-4 flex flex-wrap items-center gap-2 text-m-dim">
          <span className="rounded-full bg-m-pass/15 px-2 text-m-pass">connected</span> mcp.docsalot.dev/{src.slug}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {["search_docs", "get_page", "run_example"].map((tool, i) => (
            <span
              key={tool}
              className={cn(
                "rounded-[6px] border px-2 py-1 transition-colors duration-300",
                i === 0 && t > 500 ? "border-m-blue bg-m-blue/15 text-m-blue" : "border-m-line text-m-dim",
              )}
            >
              {tool}
            </span>
          ))}
        </div>
        <p className="text-m-blue">
          {reqTyped}
          {reqTyped.length < req.length && <span className="caret ml-0.5" aria-hidden />}
        </p>
        {res.map((line, i) => (
          <p key={i} className={cn("whitespace-pre-wrap text-m-ink", rise(t > 1700 + i * 120))}>
            {line}
          </p>
        ))}
        <p className={cn("mt-4 text-m-dim", rise(t > 2600))}>cited /api/rate-limits</p>
      </div>
    );
  }

  if (id === "api") {
    return (
      <div className="p-5 md:p-7">
        <div className={cn("flex items-center gap-2.5", rise(t > 600))}>
          <span className="rounded-[6px] border-2 border-ink bg-pass-soft px-2 py-0.5 font-mono text-[12px] font-bold text-pass">{apiBlock.method}</span>
          <span className="font-mono text-[15px] font-medium text-ink">{apiBlock.path}</span>
        </div>
        <p className={cn("mt-2 text-[15px] text-slate", rise(t > 750))}>{apiBlock.summary}</p>
        <table className="mt-5 w-full text-left text-[13.5px]">
          <tbody>
            {apiBlock.params.map((p, i) => (
              <tr key={p.name} className={cn("border-t border-line", rise(t > 900 + i * 150))}>
                <td className="py-2.5 font-mono text-ink">{p.name}</td>
                <td className="py-2.5 font-mono text-slate">{p.type}</td>
                <td className="py-2.5 text-right">
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[12px] text-slate">{p.note}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre className={cn("mt-5 min-h-[5.5em] overflow-x-auto rounded-[8px] border-2 border-ink bg-m-canvas p-4 font-mono text-[12px] leading-[1.7] text-m-ink", rise(t > 1200))}>
          {typeBy(curlFor(src), t, 1300, 16)}
        </pre>
      </div>
    );
  }

  if (id === "audit") {
    const score = Math.round(96 * Math.min(1, Math.max(0, (t - 600) / 1200)) ** 0.6);
    const rows = [
      { label: "Quickstart is cited", ok: true },
      { label: "Rate limits answer is current", ok: true },
      { label: "Webhooks page has no markdown twin", ok: false },
    ];
    return (
      <div className="p-5 md:p-7">
        <p className="t-mono-xs text-slate">AI visibility · docs.{src.slug}.dev</p>
        <div className="mt-3 flex items-end gap-5">
          <p className="font-display text-[84px] font-medium leading-[0.85] tracking-[-0.05em] text-ink tabular-nums">{score}</p>
          <div className="mb-2 flex-1">
            <p className="t-mono-xs mb-1.5 text-slate">/ 100</p>
            <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-surface-muted">
              <div className="h-full rounded-full bg-blue" style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>
        <ul className="mt-7 space-y-2.5">
          {rows.map((r, i) => (
            <li
              key={r.label}
              className={cn(
                "flex items-center gap-2.5 rounded-[8px] border-2 px-3 py-2 text-[14px]",
                r.ok ? "border-pass/30 bg-pass-soft" : "border-amber/40 bg-amber-soft",
                rise(t > 1500 + i * 220),
              )}
            >
              {r.ok ? (
                <CircleCheck size={15} strokeWidth={1.75} className="text-pass" aria-hidden />
              ) : (
                <span className="ml-[4px] mr-[3px] h-2 w-2 rounded-full bg-amber" aria-hidden />
              )}
              <span className="text-ink">{r.label}</span>
            </li>
          ))}
        </ul>
        <p className={cn("t-mono-xs mt-5 text-slate", rise(t > 2300))}>next fix: publish /webhooks.md</p>
      </div>
    );
  }

  // Hosted docs: the page assembles block by block.
  return (
    <div className="p-5 md:p-7">
      <p className={cn("t-mono-xs text-slate", rise(t > 550))}>{src.name} Docs / API</p>
      <p className={cn("mt-1.5 font-display text-[28px] font-semibold tracking-[-0.03em] text-ink", rise(t > 650))}>Rate limits</p>
      <p className={cn("mt-2 max-w-[36rem] text-[15px] leading-relaxed text-ink-2", rise(t > 800))}>
        Each {src.name} API key can make <Value rev={rev}>{src.limit} requests per minute</Value>. Requests over the limit return 429.
      </p>
      <div className={cn("mt-5 overflow-hidden rounded-[10px] border-2 border-ink", rise(t > 1000))}>
        <table className="w-full text-left text-[13.5px]">
          <thead className="bg-canvas">
            <tr className="t-mono-xs text-slate">
              <th className="px-4 py-2 font-normal">Plan</th>
              <th className="px-4 py-2 text-right font-normal">Limit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="px-4 py-2.5 text-ink">Default</td>
              <td className="px-4 py-2.5 text-right font-mono text-ink">
                <Value rev={rev}>{src.limit} / min</Value>
              </td>
            </tr>
            <tr className="border-t border-line">
              <td className="px-4 py-2.5 text-ink">Burst</td>
              <td className="px-4 py-2.5 text-right font-mono text-ink">50 / sec</td>
            </tr>
          </tbody>
        </table>
      </div>
      <motion.div
        initial={false}
        animate={t > 1300 ? { scale: 1, opacity: 1, rotate: -1.5 } : { scale: 0.85, opacity: 0, rotate: -6 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="mt-5 inline-flex items-center gap-2 rounded-[10px] border-2 border-ink bg-butter px-3 py-2 text-[13.5px] text-ink shadow-[3px_3px_0_0_var(--ink)]"
      >
        <span className="font-semibold">Tip.</span> Retry 429s with exponential backoff.
      </motion.div>
    </div>
  );
}
