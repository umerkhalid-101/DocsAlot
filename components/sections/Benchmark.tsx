"use client";

import { CircleCheck, CircleX, Globe } from "lucide-react";
import { useRef, useState } from "react";
import { categories, failedChecks, leaderboard, leaderboardNote, scores, totalChecks } from "@/content/benchmark";
import { benchmark } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeOutCubic, progress, usePlayhead } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, Grid, Panel, PathMarker, SectionTitle, Sticker, TextLink } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

const ROW_MS = 380;
const START = 250;
const RUN_MS = START + categories.length * ROW_MS + 500;

type Mode = "before" | "after";

export function Benchmark() {
  return (
    <SectionShell id={benchmark.id} path={benchmark.path} md={sectionMarkdown.benchmark()}>
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={benchmark.path} id={benchmark.id} />
        <Grid className="mt-10 gap-y-6 md:mt-14">
          <div className="relative col-span-12 lg:col-span-7">
            <SectionTitle lines={benchmark.title} />
            <Sticker tone="sky" rotate={5} className="absolute bottom-3 right-0 md:right-6">
              41 → 96 with DocsAlot
            </Sticker>
          </div>
          <p className="t-body-lg col-span-12 max-w-[30rem] self-end lg:col-span-5">{benchmark.body}</p>
        </Grid>
        <Grid className="mt-14 gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <Scan />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pl-6">
            <Leaderboard />
          </div>
        </Grid>
      </Container>
    </SectionShell>
  );
}

function Scan() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, done, play } = usePlayhead(ref, RUN_MS, { amount: 0.45 });
  const [mode, setMode] = useState<Mode>("before");
  const [url, setUrl] = useState<string>(benchmark.url);
  const [custom, setCustom] = useState(false);
  const [from, setFrom] = useState(0);

  const target = mode === "before" ? scores.before : scores.after;
  const p = progress(t, START, START + categories.length * ROW_MS);
  const score = Math.round(from + (target - from) * easeOutCubic(p));
  const running = t > 0 && !done;

  const run = (nextMode: Mode, keepScore: boolean) => {
    setFrom(keepScore ? score : 0);
    setMode(nextMode);
    play();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustom(url.trim().replace(/^https?:\/\//, "") !== benchmark.url);
    run(mode, false);
  };

  const passed = categories.reduce((n, c, i) => n + (t >= START + (i + 1) * ROW_MS ? c[mode] : 0), 0);

  return (
    <div ref={ref}>
      <Panel className="overflow-hidden">
        <form onSubmit={onSubmit} className="flex flex-col gap-2 border-b border-line p-4 sm:flex-row sm:items-center">
          <label className="flex h-11 flex-1 items-center gap-2 rounded-sq border border-line-strong bg-canvas px-3 focus-within:border-blue">
            <Globe size={15} strokeWidth={1.5} className="text-slate" aria-hidden />
            <span className="sr-only">Docs URL</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              spellCheck={false}
              className="h-full min-w-0 flex-1 bg-transparent font-mono text-[14px] text-ink outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={running}
            className="h-11 cursor-pointer rounded-sq bg-ink px-4 font-display text-[15px] font-medium text-on-blue transition-colors hover:bg-ink-2 disabled:cursor-wait disabled:opacity-70"
          >
            {running ? "Scanning" : benchmark.run}
          </button>
        </form>

        <div className="grid gap-6 p-5 md:grid-cols-[1fr_190px] md:p-6">
          <ol className="space-y-0">
            {categories.map((c, i) => {
              const rowStart = START + i * ROW_MS;
              const state = t < rowStart ? "pending" : t < rowStart + ROW_MS ? "running" : "done";
              const pass = c[mode];
              return (
                <li key={c.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-line py-2.5 first:border-t-0">
                  <span className={cn("text-[14.5px] transition-colors", state === "pending" ? "text-slate/60" : "text-ink")}>{c.name}</span>
                  <span className="font-mono text-[12px] text-slate">
                    {state === "done" ? (
                      <span className={pass === c.checks ? "text-pass" : "text-fail"}>
                        {pass}/{c.checks}
                      </span>
                    ) : state === "running" ? (
                      <span className="text-blue">scanning</span>
                    ) : (
                      `${c.checks} checks`
                    )}
                  </span>
                  <span className="col-span-2 flex gap-1" aria-hidden>
                    {Array.from({ length: c.checks }, (_, j) => (
                      <span
                        key={j}
                        className={cn(
                          "h-1 flex-1 transition-colors duration-200",
                          state === "done" ? (j < pass ? "bg-pass" : "bg-fail") : state === "running" ? "animate-pulse bg-blue/40" : "bg-line",
                        )}
                        style={{ transitionDelay: state === "done" ? `${j * 25}ms` : "0ms" }}
                      />
                    ))}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-col border-t border-line pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="t-mono-xs text-slate">{url || benchmark.url}</p>
            <p
              className={cn(
                "mt-2 font-display text-[64px] font-medium leading-none tracking-[-0.04em] tabular-nums transition-colors duration-300",
                done ? (mode === "after" ? "text-pass" : "text-amber") : "text-ink",
              )}
              aria-live="polite"
            >
              {score}
            </p>
            <p className="t-mono-xs mt-1 text-slate">/ 100 · {passed}/{totalChecks} checks</p>

            <button
              type="button"
              role="switch"
              aria-checked={mode === "after"}
              onClick={() => run(mode === "after" ? "before" : "after", true)}
              disabled={running}
              className="mt-6 flex cursor-pointer items-center gap-2.5 text-left disabled:cursor-wait"
            >
              <span className={cn("relative h-5 w-9 rounded-full border transition-colors duration-200", mode === "after" ? "border-blue bg-blue" : "border-line-strong bg-surface-muted")}>
                <span
                  className={cn(
                    "absolute top-[2px] h-3.5 w-3.5 rounded-full bg-surface shadow-frame transition-transform duration-200 ease-[var(--ease-snap)]",
                    mode === "after" ? "translate-x-[18px]" : "translate-x-[2px]",
                  )}
                />
              </span>
              <span className="font-display text-[14.5px] font-medium text-ink">{benchmark.withDocsAlot}</span>
            </button>

            <ul className={cn("mt-5 space-y-2 transition-opacity duration-300", done ? "opacity-100" : "opacity-0")}>
              {failedChecks.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] leading-snug">
                  {mode === "after" ? (
                    <CircleCheck size={14} strokeWidth={1.5} className="mt-px shrink-0 text-pass" aria-hidden />
                  ) : (
                    <CircleX size={14} strokeWidth={1.5} className="mt-px shrink-0 text-fail" aria-hidden />
                  )}
                  <span className={mode === "after" ? "text-slate line-through decoration-slate/50" : "text-ink"}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <TextLink href={benchmark.cta.href}>{benchmark.cta.label}</TextLink>
        <span className="t-path">{custom ? benchmark.demoNote : "Scripted demo on a fictional docs site."}</span>
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-ink pb-3">
        <p className="font-display text-[16px] font-semibold text-ink">{benchmark.leaderboardTitle}</p>
        <p className="t-mono-xs text-slate">score</p>
      </div>
      <ol>
        {leaderboard.map((r, i) => (
          <li key={r.domain} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-line py-3.5">
            <span className="font-mono text-[12px] text-slate">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="block font-display text-[15.5px] font-medium text-ink">{r.name}</span>
              <span className="block truncate font-mono text-[12px] text-slate">{r.domain}</span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[22px] font-medium tabular-nums tracking-tight text-ink">{r.score}</span>
              <span className="w-6 font-mono text-[11px] text-pass">{r.grade}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="t-mono-xs mt-3 text-slate">{leaderboardNote}</p>
      <TextLink href={benchmark.leaderboardCta.href} className="mt-6 inline-block">
        {benchmark.leaderboardCta.label}
      </TextLink>
    </div>
  );
}
