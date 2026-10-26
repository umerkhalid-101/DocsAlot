"use client";

import { motion, useInView } from "motion/react";
import { ArrowRight, Check, CircleCheck, FileText, Folder } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { chunks, gaps } from "@/content/demo";
import { how } from "@/content/site";
import { cn } from "@/lib/cn";
import { useReduced } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, Grid, PathMarker, SectionTitle } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

const CARD_TONE = ["bg-butter", "bg-surface", "bg-sky"];
const STEP_DELAY = 1400; // each card starts a beat after the previous one

export function How() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <SectionShell id={how.id} path={how.path} md={sectionMarkdown.how()}>
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={how.path} id={how.id} />
        <Grid className="mt-10 gap-y-6 md:mt-14">
          <div className="col-span-12 lg:col-span-8">
            <SectionTitle lines={how.title} />
          </div>
          <p className="t-body-lg col-span-12 max-w-[26rem] self-end lg:col-span-4">{how.sub}</p>
        </Grid>

        <div ref={ref} className="relative mt-14 grid gap-6 md:mt-20 lg:grid-cols-3 lg:gap-10">
          {how.steps.map((s, i) => (
            <div key={s.title} className="relative">
              <StepCard i={i} start={inView} />
              {i < how.steps.length - 1 && <Connector i={i} start={inView} />}
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

/** Arrow between cards that fills once the previous step finishes. */
function Connector({ i, start }: { i: number; start: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute -bottom-5 left-1/2 z-10 grid h-10 w-10 -translate-x-1/2 rotate-90 place-items-center rounded-full border-2 border-ink bg-surface text-ink shadow-[3px_3px_0_0_var(--ink)] lg:-right-[34px] lg:bottom-auto lg:left-auto lg:top-[42%] lg:translate-x-0 lg:rotate-0"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={start ? { scale: [0.6, 1.25, 1], opacity: 1 } : undefined}
      transition={{ delay: ((i + 1) * STEP_DELAY) / 1000 - 0.2, duration: 0.6 }}
    >
      <ArrowRight size={18} strokeWidth={2.25} />
    </motion.span>
  );
}

function StepCard({ i, start }: { i: number; start: boolean }) {
  const s = how.steps[i];
  const t = useStepClock(start, i * STEP_DELAY);
  const live = t > 0;
  return (
    <article
      className={cn(
        "tone-light flex h-full flex-col rounded-[20px] border-2 border-ink p-6 shadow-[6px_6px_0_0_var(--ink)] transition-transform duration-500 md:p-7",
        CARD_TONE[i],
        live && "lg:-translate-y-1",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-3 py-1 font-mono text-[12px] font-semibold text-ink">
          <span className={cn("h-2 w-2 rounded-full transition-colors duration-300", t > 2600 ? "bg-pass" : live ? "animate-pulse bg-blue" : "bg-line-strong")} />
          Step {i + 1} · {s.tag}
        </span>
        <span className="font-mono text-[12px] text-ink/50">{t > 2600 ? "done" : live ? "running" : "queued"}</span>
      </div>
      <h3 className="mt-6 font-display text-[24px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink md:text-[27px]">{s.title}</h3>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{s.body}</p>
      <div className="mt-7 flex-1" role="img" aria-label={s.alt}>
        <div className="h-[250px] overflow-hidden rounded-[14px] border-2 border-ink bg-surface p-4">
          {i === 0 && <ConnectVisual t={t} />}
          {i === 1 && <PackageVisual t={t} />}
          {i === 2 && <PublishVisual t={t} />}
        </div>
      </div>
    </article>
  );
}

/** Milliseconds since this step started (after `delay`), capped. Reduced motion jumps to the end. */
function useStepClock(start: boolean, delay: number, max = 4000) {
  const reduced = useReduced();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!start || reduced) return;
    const begin = performance.now() + delay;
    let raf = 0;
    const loop = (now: number) => {
      const e = Math.max(0, now - begin);
      setT(e);
      if (e < max) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [start, delay, max, reduced]);
  return reduced ? max : t;
}

const pop = (v: boolean) => cn("transition-all duration-500 ease-[var(--ease-snap)]", v ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0");

/* Step 1: files from every tool drop into one folder */
const incoming = [
  { name: "README.md", from: "GitHub" },
  { name: "refunds.html", from: "Help center" },
  { name: "openapi.yaml", from: "OpenAPI" },
  { name: "launch-notes", from: "Notion" },
];
function ConnectVisual({ t }: { t: number }) {
  const landedAt = (k: number) => 500 + k * 450;
  const landed = incoming.filter((_, k) => t > landedAt(k)).length;
  const count = Math.round(184 * Math.min(1, Math.max(0, (t - 600) / 2000)));
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Sources: each ticks off as its files are pulled in */}
      <div className="grid grid-cols-2 gap-1.5">
        {incoming.map((f, k) => {
          const done = t > landedAt(k);
          return (
            <span
              key={f.from}
              className={cn(
                "flex items-center justify-between gap-1 whitespace-nowrap rounded-[8px] border-2 px-2 py-1 font-mono text-[10.5px] transition-colors duration-300",
                done ? "border-ink bg-ink text-canvas" : "border-ink/25 text-ink",
              )}
            >
              {f.from}
              {done ? <Check size={11} strokeWidth={3} aria-hidden /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue" />}
            </span>
          );
        })}
      </div>
      {/* One folder that fills up */}
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border-2 border-ink bg-butter">
        <div className="flex items-center gap-2 border-b-2 border-ink px-2.5 py-1.5">
          <Folder size={15} strokeWidth={2} className="text-ink" aria-hidden />
          <span className="font-mono text-[12px] font-semibold text-ink">acme-docs/</span>
          <span className="ml-auto font-mono text-[11px] text-ink/70 tabular-nums">{count} pages</span>
        </div>
        <ul className="flex-1 space-y-1 overflow-hidden px-2.5 py-2">
          {incoming.map((f, k) => (
            <motion.li
              key={f.name}
              className="flex items-center gap-1.5 font-mono text-[11.5px] text-ink"
              initial={false}
              animate={t > landedAt(k) ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.2, 0.9, 0.25, 1] }}
            >
              <FileText size={12} strokeWidth={2} aria-hidden /> {f.name}
              <span className="ml-auto text-ink/50">{landed > k ? "normalized" : ""}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Step 2: one page splits into anchored, agent-ready chunks */
function PackageVisual({ t }: { t: number }) {
  const split = t > 600;
  return (
    <div className="flex h-full flex-col">
      <p className="mb-2 flex items-center justify-between font-mono text-[11.5px] text-slate">
        <span>/quickstart</span>
        <span className={pop(split)}>{chunks.length} chunks</span>
      </p>
      <div className={cn("flex flex-1 flex-col transition-all duration-500 ease-[var(--ease-snap)]", split ? "gap-1.5" : "gap-0")}>
        {chunks.map((c, k) => (
          <div
            key={c.anchor}
            className={cn(
              "flex flex-1 flex-col justify-center border-2 px-2.5 transition-all duration-500 ease-[var(--ease-snap)]",
              split ? "rounded-[8px] border-ink bg-surface" : "border-line bg-canvas",
              !split && k > 0 && "border-t-transparent",
            )}
            style={{ transitionDelay: split ? `${k * 80}ms` : "0ms" }}
          >
            <span className="truncate font-display text-[12.5px] font-semibold leading-tight text-ink">{c.label}</span>
            <span className={cn("mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px] leading-none", pop(t > 1300 + k * 220))}>
              <span className="text-blue">{c.anchor}</span>
              <ArrowRight size={10} strokeWidth={2.5} className="text-ink/40" aria-hidden />
              <span className="rounded-full bg-blue px-1.5 py-px text-[10px] text-on-blue">{c.target}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Step 3: published, and the onboarding gaps close one by one */
function PublishVisual({ t }: { t: number }) {
  const fixed = gaps.filter((_, k) => t > 900 + k * 550).length;
  const left = gaps.length - fixed;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[11.5px] text-slate">AI onboarding gaps</p>
          <p className={cn("font-display text-[52px] font-medium leading-none tracking-[-0.04em] transition-colors duration-300", left === 0 ? "text-pass" : "text-amber")}>
            {left}
          </p>
        </div>
        <span
          className={cn(
            "mb-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-2.5 py-0.5 font-mono text-[11.5px] font-semibold transition-colors duration-300",
            left === 0 ? "border-pass bg-pass-soft text-pass" : "border-ink/20 text-slate",
          )}
        >
          {left === 0 ? <Check size={12} strokeWidth={2.5} aria-hidden /> : null}
          {left === 0 ? "live and current" : "publishing"}
        </span>
      </div>
      <ul className="mt-auto space-y-1.5">
        {gaps.map((g, k) => {
          const ok = k < fixed;
          return (
            <li
              key={g}
              className={cn(
                "flex items-center gap-2 rounded-[8px] border-2 px-2.5 py-1.5 text-[12.5px] transition-colors duration-300",
                ok ? "border-pass/40 bg-pass-soft" : "border-amber/40 bg-amber-soft",
              )}
            >
              {ok ? <CircleCheck size={13} strokeWidth={2} className="shrink-0 text-pass" aria-hidden /> : <span className="h-2 w-2 shrink-0 rounded-full bg-amber" aria-hidden />}
              <span className={cn("truncate", ok ? "text-slate line-through" : "text-ink")}>{g}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
