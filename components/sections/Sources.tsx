"use client";

import { useInView } from "motion/react";
import { ArrowDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sources, traffic } from "@/content/site";
import { cn } from "@/lib/cn";
import { useReduced } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { BrandLogo, BrandTile } from "@/components/ui/BrandLogo";
import { LogoMark } from "@/components/ui/Logo";
import { Button, Container, Grid, PathMarker, SectionTitle } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

const N_IN = sources.integrations.length;
const N_OUT = sources.outputs.length;
const yIn = (i: number) => ((i + 0.5) / N_IN) * 100;
const yOut = (j: number) => ((j + 0.5) / N_OUT) * 100;

export function Sources() {
  return (
    <SectionShell id={sources.id} path={sources.path} md={sectionMarkdown.sources()} machineClassName="md:pt-16 pt-12 pb-12" label="Connect once" band="ink">
      <Container className="pb-16 pt-20 md:pb-24 md:pt-[136px]">
        <PathMarker path={sources.path} id={sources.id} />
        <Grid className="mt-10 items-center gap-y-14 md:mt-14">
          <div className="col-span-12 lg:col-span-5 lg:pr-4">
            <SectionTitle lines={sources.title} className="text-[clamp(34px,4.2vw,58px)]" />
            <p className="t-body-lg mt-6 max-w-[32rem]">{sources.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={sources.primary.href} size="lg">
                {sources.primary.label}
              </Button>
              <Button href={sources.secondary.href} variant="outline" size="lg">
                {sources.secondary.label}
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[13px] text-slate">{sources.to.label}</span>
              {sources.to.items.map((a) => (
                <span
                  key={a}
                  className="tone-light inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface py-1 pl-1.5 pr-3 font-mono text-[12.5px] font-medium text-ink"
                >
                  <BrandLogo name={a} size={15} />
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:pl-4">
            <Diagram />
          </div>
        </Grid>
      </Container>

      <div className="ticker-wrap relative overflow-hidden border-t border-line pb-16 pt-5 md:pb-24" aria-label={traffic.label}>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />
        <Row items={traffic.rowA} dur="70s" />
        <Row items={traffic.rowB} dur="85s" reverse />
        <p className="t-mono-xs mx-auto mt-3 max-w-[1240px] px-5 text-slate/80 md:px-6">{traffic.label}</p>
      </div>
    </SectionShell>
  );
}

/* Sources flow into one docs layer, which publishes to every surface. */
function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReduced();
  const [ready, setReady] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setReady(N_IN);
      return;
    }
    const timers = Array.from({ length: N_IN }, (_, i) => window.setTimeout(() => setReady(i + 1), 300 + i * 320));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduced]);

  const allIn = ready >= N_IN;

  const chip = (it: (typeof sources.integrations)[number], i: number) => {
    const done = i < ready;
    return (
      <div
        key={it.name}
        onMouseEnter={() => setHover(i)}
        onMouseLeave={() => setHover(null)}
        className={cn(
          "flex items-center justify-between gap-3 rounded-[10px] border-2 bg-surface px-3.5 py-2.5 transition-colors duration-200",
          hover === i ? "border-blue" : "border-line-strong",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <BrandTile name={it.name} size={15} />
          <span className="min-w-0">
            <span className="block font-mono text-[14px] font-semibold text-ink">{it.name}</span>
            <span className="block truncate text-[12.5px] text-slate">{it.kind}</span>
          </span>
        </span>
        <span
          className={cn(
            "t-mono-xs shrink-0 rounded-full px-2 py-0.5 transition-colors duration-300",
            done ? "bg-pass-soft text-pass" : "bg-surface-muted text-slate",
          )}
        >
          {done ? it.status : "queued"}
        </span>
      </div>
    );
  };

  const hub = (
    <div className="tone-light relative rounded-[16px] border-2 border-ink bg-surface p-5 text-center shadow-[6px_6px_0_0_var(--blue)]">
      <span aria-hidden className={cn("absolute -inset-2 rounded-[20px] border-2 border-blue/40", allIn && !reduced && "animate-ping [animation-duration:2.4s]")} />
      <LogoMark className="mx-auto h-11 w-11" />
      <p className="mt-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">{sources.hub.name}</p>
      <p className="t-mono-xs mt-1 text-slate">{sources.hub.note}</p>
      <p className={cn("t-mono-xs mt-3 rounded-full px-2 py-0.5 transition-colors", allIn ? "bg-pass-soft text-pass" : "bg-surface-muted text-slate")}>
        {allIn ? "in sync" : `syncing ${ready}/${N_IN}`}
      </p>
    </div>
  );

  const out = (o: string, j: number) => (
    <div
      key={o}
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] border-2 px-3.5 py-3 transition-all duration-500",
        allIn ? "border-blue bg-blue-soft" : "border-line bg-surface",
      )}
      style={{ transitionDelay: allIn ? `${j * 120}ms` : "0ms" }}
    >
      <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors", allIn ? "bg-blue text-on-blue" : "bg-surface-muted text-transparent")}>
        <Check size={12} strokeWidth={2.5} aria-hidden />
      </span>
      <span className="font-mono text-[13.5px] font-medium text-ink">{o}</span>
    </div>
  );

  return (
    <div ref={ref}>
      {/* Desktop: wired diagram */}
      <div className="relative hidden h-[480px] lg:block">
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {sources.integrations.map((_, i) => (
            <path
              key={`in-${i}`}
              d={`M 37 ${yIn(i)} C 42 ${yIn(i)}, 40 50, 45 50`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeWidth={hover === i ? 2 : 1.5}
              className={cn("transition-[stroke] duration-200", i < ready ? "wire-flow" : "", hover === i ? "stroke-blue" : i < ready ? "stroke-blue/60" : "stroke-line-strong")}
            />
          ))}
          {sources.outputs.map((_, j) => (
            <path
              key={`out-${j}`}
              d={`M 66 50 C 70 50, 69 ${yOut(j)}, 73 ${yOut(j)}`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeWidth={1.5}
              className={cn(allIn ? "wire-flow stroke-blue" : "stroke-line-strong")}
            />
          ))}
        </svg>
        <div className="absolute inset-y-0 left-0 flex w-[37%] flex-col justify-around">{sources.integrations.map(chip)}</div>
        <div className="absolute left-[45%] top-1/2 w-[21%] -translate-y-1/2">{hub}</div>
        <div className="absolute inset-y-0 right-0 flex w-[27%] flex-col justify-around py-6">{sources.outputs.map(out)}</div>
      </div>

      {/* Mobile and tablet: stacked */}
      <div className="flex flex-col items-stretch gap-4 lg:hidden">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">{sources.integrations.map(chip)}</div>
        <ArrowDown size={20} strokeWidth={1.5} className="mx-auto text-blue" aria-hidden />
        <div className="mx-auto w-full max-w-[260px]">{hub}</div>
        <ArrowDown size={20} strokeWidth={1.5} className="mx-auto text-blue" aria-hidden />
        <div className="grid grid-cols-2 gap-2.5">{sources.outputs.map(out)}</div>
      </div>
    </div>
  );
}

type Req = (typeof traffic.rowA)[number];

function Row({ items, dur, reverse }: { items: Req[]; dur: string; reverse?: boolean }) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-1.5">
      <ul aria-hidden className={`ticker flex w-max gap-3 ${reverse ? "ticker-rev" : ""}`} style={{ "--ticker-dur": dur } as React.CSSProperties}>
        {loop.map((r, i) => (
          <li
            key={i}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[12.5px] text-ink-2"
          >
            <span className={r.method === "TOOL" ? "text-blue" : "text-slate"}>{r.method}</span>
            <span className="text-ink">{r.path}</span>
            <span className="rounded-full bg-pass-soft px-1.5 text-[11px] text-pass">{r.status}</span>
            <span className="tone-light grid h-5 w-5 place-items-center rounded-full bg-surface">
              <BrandLogo name={r.agent} size={12} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
