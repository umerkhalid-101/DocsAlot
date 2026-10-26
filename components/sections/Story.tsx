"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Bot, Check, CircleCheck, GitMerge, LoaderCircle, Pencil, Radio, TriangleAlert, type LucideIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { current, stale } from "@/content/demo";
import { keepCurrent, story, why } from "@/content/site";
import { cn } from "@/lib/cn";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, PathMarker, Sticker } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

const N = story.chapters.length;
const STATUS_TONE = ["pass", "amber", "fail", "blue", "pass"] as const;
const ICONS: LucideIcon[] = [GitMerge, TriangleAlert, Bot, Pencil, Radio];
const LEAD = 0.5; // a little scroll before the strip moves, so the first scene can play

export function Story() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const dist = useRef(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  // Vertical scroll drives the horizontal strip.
  const toPos = (p: number) => p * (N - 1 + LEAD) - LEAD;
  const x = useTransform(scrollYProgress, (p) => (-Math.max(0, toPos(p)) / (N - 1)) * dist.current);
  const [pos, setPos] = useState(-LEAD);
  useMotionValueEvent(scrollYProgress, "change", (p) => setPos(toPos(p)));

  useLayoutEffect(() => {
    const measure = () => {
      if (row.current) dist.current = row.current.scrollWidth - row.current.clientWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    return () => ro.disconnect();
  }, []);

  const c = Math.max(0, Math.min(N - 1, Math.round(pos)));

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const p = (Math.max(0, Math.min(N - 1, i)) + LEAD) / (N - 1 + LEAD);
    window.scrollTo({ top: top + span * p, behavior: "smooth" });
  };

  return (
    <SectionShell id={story.id} path={story.path} md={sectionMarkdown.story()} band="cobalt">
      <Container className="pt-20 md:pt-28">
        <PathMarker path={story.path} id={story.id} />
      </Container>

      <div ref={track} className="relative" style={{ height: `${(N + LEAD) * 90}svh` }}>
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col overflow-hidden pb-6 pt-8 md:pt-10">
          {/* Centered headline, stays put while the strip moves */}
          <div className="relative mx-auto px-5 text-center">
            <h2 className="font-display text-[clamp(32px,4.6vw,64px)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
              {story.title[0]}
              <br />
              <span className="text-butter">{story.title[1]}</span>
            </h2>
            <p className="mt-3 hidden text-[15px] text-ink/75 sm:block md:text-[17px]">{story.sub}</p>
            <span className="absolute -right-52 -top-2 hidden lg:block">
              <Sticker tone="white" rotate={8} className="text-fail">
                429 Too Many Requests
              </Sticker>
            </span>
          </div>

          {/* Strip: timeline rail + slides, moving together */}
          <div ref={row} className="mt-5 min-h-0 flex-1 overflow-hidden md:mt-10">
            <motion.div style={{ x }} className="flex w-max gap-16 pl-5 pr-[10vw] md:gap-24 md:pl-[max(24px,calc((100vw-1192px)/2))]">
              {story.chapters.map((ch, i) => (
                <Slide key={ch.title} i={i} pos={pos} active={i === c} onJump={jump} />
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <Container className="mt-3 flex items-center justify-center gap-3">
            <RoundButton label="Previous chapter" onClick={() => jump(c - 1)}>
              <ArrowLeft size={18} strokeWidth={2} />
            </RoundButton>
            <span className="min-w-[64px] text-center font-mono text-[13px] text-ink">
              {c + 1} / {N}
            </span>
            <RoundButton label="Next chapter" onClick={() => jump(c + 1)}>
              <ArrowRight size={18} strokeWidth={2} />
            </RoundButton>
          </Container>
        </div>
      </div>
    </SectionShell>
  );
}

function Slide({ i, pos, active, onJump }: { i: number; pos: number; active: boolean; onJump: (i: number) => void }) {
  const ch = story.chapters[i];
  const Icon = ICONS[i];
  const lp = Math.max(0, Math.min(1, pos - i + 1));
  const fill = Math.max(0, Math.min(1, pos - i));
  const reached = pos >= i - 0.05;
  return (
    <article aria-label={`Chapter ${i + 1} of ${N}: ${ch.title}`} className="relative w-[84vw] shrink-0 md:w-[min(1080px,80vw)]">
      {/* Rail stop: label on top, dot centered on the rail, segment to the next dot */}
      <div className="relative mb-5 h-[44px] md:mb-8">
        {i < N - 1 && (
          <span aria-hidden className="absolute left-[9px] top-[32px] h-[2px] w-[calc(100%+4rem)] -translate-y-1/2 bg-white/25 md:w-[calc(100%+6rem)]">
            <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${fill})` }} />
          </span>
        )}
        <button
          type="button"
          onClick={() => onJump(i)}
          className="group absolute left-0 top-0 h-[44px] w-[220px] cursor-pointer text-left"
          aria-label={`Go to ${story.stops[i]}`}
        >
          <span className={cn("t-mono-xs absolute left-0 top-0 block whitespace-nowrap leading-4 transition-colors", active ? "font-semibold text-ink" : "text-ink/60 group-hover:text-ink")}>
            {story.stops[i]} <span className="text-ink/50">· {ch.time.split(" ")[1]}</span>
          </span>
          <span
            className={cn(
              "absolute left-0 top-[32px] block h-[18px] w-[18px] -translate-y-1/2 rounded-full border-2 border-white transition-all duration-300",
              reached ? "bg-white" : "bg-blue",
              active && "ring-[6px] ring-white/25",
            )}
          />
        </button>
      </div>

      <div className={cn("grid gap-6 transition-opacity duration-500 lg:grid-cols-12 lg:items-center lg:gap-12", active ? "opacity-100" : "opacity-35")}>
        <div className="lg:col-span-4">
          <p className="flex items-center gap-3">
            <span className="tone-light grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-[10px] border-2 border-ink bg-butter text-ink shadow-[3px_3px_0_0_var(--ink)]">
              <Icon size={18} strokeWidth={2} aria-hidden />
            </span>
            <span className="font-display text-[18px] font-medium text-ink/85 md:text-[20px]">{story.features[i]}</span>
          </p>
          <h3 className="mt-3 font-display text-[24px] md:mt-5 font-medium leading-[1.06] tracking-[-0.03em] text-ink md:text-[38px] lg:text-[42px]">{ch.title}</h3>
          <p className="mt-2 line-clamp-2 max-w-[28rem] text-[14.5px] leading-relaxed text-ink/80 md:mt-4 md:line-clamp-none md:text-[16.5px]">{ch.body}</p>
        </div>
        <div className="relative lg:col-span-8">
          <div className="tone-light relative h-[min(34svh,440px)] overflow-hidden rounded-[18px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--ink)] md:h-[min(46svh,460px)]">
            <div className="flex h-11 items-center justify-between border-b-2 border-ink bg-canvas px-4">
              <span className="t-mono-xs text-slate">acme.dev · {ch.time}</span>
              <StatusPill c={i} />
            </div>
            <div className="relative h-[calc(100%-44px)] overflow-hidden p-4 md:p-6">
              <Scene c={i} lp={lp} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="tone-light grid h-12 w-12 cursor-pointer place-items-center rounded-full border-2 border-ink bg-surface text-ink shadow-[3px_3px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-butter active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
    >
      {children}
    </button>
  );
}

function StatusPill({ c }: { c: number }) {
  const tone = STATUS_TONE[c];
  return (
    <span
      className={cn(
        "t-mono-xs inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium transition-colors duration-300",
        tone === "pass" && "bg-pass-soft text-pass",
        tone === "amber" && "bg-amber-soft text-amber",
        tone === "fail" && "bg-fail-soft text-fail",
        tone === "blue" && "bg-blue-soft text-blue",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", tone !== "pass" && "animate-pulse")} />
      docs {story.status[c]}
    </span>
  );
}

const on = (lp: number, at: number) => lp >= at;
const show = (visible: boolean) => cn("transition-all duration-500 ease-[var(--ease-snap)]", visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0");
const typedBy = (text: string, lp: number, from: number, to: number) =>
  text.slice(0, Math.round(text.length * Math.max(0, Math.min(1, (lp - from) / (to - from)))));

function Scene({ c, lp }: { c: number; lp: number }) {
  if (c === 0) return <ShipScene lp={lp} />;
  if (c === 1) return <StaleScene lp={lp} />;
  if (c === 2) return <AgentScene lp={lp} />;
  if (c === 3) return <FixScene lp={lp} />;
  return <SyncScene lp={lp} />;
}

/* 1. Code ships */
function ShipScene({ lp }: { lp: number }) {
  return (
    <div className="flex h-full flex-col justify-start md:justify-center gap-5">
      <div className="rounded-[5px] border border-line">
        <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5">
          <span className="flex items-center gap-2 font-mono text-[12.5px] text-ink">
            <GitMerge size={14} strokeWidth={1.5} className="text-blue" aria-hidden /> acme/api · main
          </span>
          <span className={cn("t-mono-xs rounded-full bg-pass-soft px-2 py-0.5 text-pass", show(on(lp, 0.2)))}>merged</span>
        </div>
        <div className="p-4">
          <p className="font-display text-[17px] font-semibold text-ink md:text-[19px]">{story.commit.title}</p>
          <div className="mt-3 overflow-hidden rounded-[4px] border border-line font-mono text-[13px] leading-[1.9]">
            <div className="bg-fail-soft px-3 text-fail">- {story.commit.from}</div>
            <div className="bg-pass-soft px-3 text-pass">+ {story.commit.to}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "CI", at: 0.3 },
          { label: "deployed", at: 0.5 },
          { label: "changelog", at: 0.7 },
        ].map((s) => (
          <div key={s.label} className={cn("flex items-center gap-2 rounded-[4px] border border-line px-3 py-2.5", show(on(lp, s.at)))}>
            <CircleCheck size={15} strokeWidth={1.5} className="text-pass" aria-hidden />
            <span className="font-mono text-[12.5px] text-ink">{s.label}</span>
          </div>
        ))}
      </div>
      <p className={cn("t-mono-xs text-slate", show(on(lp, 0.8)))}>production now allows 1,000 requests per minute</p>
    </div>
  );
}

/* 2. Docs drift */
function StaleScene({ lp }: { lp: number }) {
  return (
    <div className="flex h-full flex-col justify-start md:justify-center gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Big label="production says" value="1,000" tone="ink" />
        <Big label="your docs say" value="100" tone="amber" />
      </div>
      <ul className="space-y-2.5">
        {story.staleSpots.map((s, i) => (
          <li key={s.where} className={cn("flex items-center justify-between gap-3 rounded-[4px] border border-line px-3.5 py-2.5", show(on(lp, 0.15 + i * 0.22)))}>
            <span className="font-mono text-[12px] text-slate">{s.where}</span>
            <span className="flex items-center gap-2">
              <span className="rounded-[2px] bg-amber-soft px-1.5 font-mono text-[12.5px] text-ink underline decoration-amber decoration-dotted underline-offset-4">
                {s.text}
              </span>
              <span className="t-mono-xs text-amber">stale</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Big({ label, value, tone }: { label: string; value: string; tone: "ink" | "amber" }) {
  return (
    <div className="border-l-2 border-line pl-4">
      <p className="t-mono-xs text-slate">{label}</p>
      <p className={cn("mt-1 font-display text-[44px] font-medium leading-none tracking-[-0.04em] md:text-[64px]", tone === "amber" ? "text-amber" : "text-ink")}>
        {value}
      </p>
      <p className="t-mono-xs mt-1 text-slate">requests / min</p>
    </div>
  );
}

/* 3. The agent answers from stale sources */
function AgentScene({ lp }: { lp: number }) {
  const line1 = `Install it with ${stale.install}, then pass your key to the client.`;
  const line2 = `The API allows ${stale.rateLimit} per key.`;
  const t1 = typedBy(line1, lp, 0.15, 0.5);
  const t2 = typedBy(line2, lp, 0.5, 0.75);
  return (
    <div className="flex h-full flex-col justify-start md:justify-center gap-5">
      <div className="flex justify-end">
        <p className="max-w-[88%] rounded-panel bg-surface-muted px-4 py-2.5 text-[15px] text-ink md:text-[16px]">{why.question}</p>
      </div>
      <div>
        <p className="t-mono-xs mb-2 flex items-center gap-1.5 text-slate">
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-ink" /> coding agent
        </p>
        <p className="min-h-[3.4em] text-[16px] leading-[1.7] text-ink-2 md:text-[18px]">
          <Highlight text={t1} needle={stale.install} />
          {t2 && " "}
          <Highlight text={t2} needle={stale.rateLimit} />
          {lp < 0.75 && <span className="caret ml-0.5 text-blue" aria-hidden />}
        </p>
        <div className={cn("mt-4 inline-flex items-center gap-2 rounded-sq border border-amber/30 bg-amber-soft px-2.5 py-1.5 font-mono text-[12.5px] text-amber", show(on(lp, 0.8)))}>
          <TriangleAlert size={13} strokeWidth={1.5} aria-hidden />
          <span className="text-slate">source</span> {stale.source}
        </div>
      </div>
    </div>
  );
}

function Highlight({ text, needle }: { text: string; needle: string }): ReactNode {
  const full = text.indexOf(needle);
  if (full === -1) return text;
  return (
    <>
      {text.slice(0, full)}
      <span className="rounded-[2px] bg-amber-soft px-1 font-mono text-[0.88em] text-ink underline decoration-amber decoration-dotted underline-offset-4">{needle}</span>
      {text.slice(full + needle.length)}
    </>
  );
}

/* 4. One sentence fixes it */
function FixScene({ lp }: { lp: number }) {
  const prompt = typedBy(keepCurrent.prompt, lp, 0.05, 0.35);
  return (
    <div className="flex h-full flex-col justify-start md:justify-center gap-4">
      <div className="flex justify-end">
        <p className="min-h-[2.6em] max-w-[92%] rounded-panel bg-surface-muted px-4 py-2.5 text-[15px] text-ink md:text-[16px]">
          {prompt}
          {lp < 0.35 && <span className="caret ml-0.5 text-blue" aria-hidden />}
        </p>
      </div>
      <div className={cn("flex items-center gap-2 font-mono text-[12.5px]", show(on(lp, 0.4)))}>
        {on(lp, 0.55) ? <Check size={14} strokeWidth={2} className="text-pass" aria-hidden /> : <LoaderCircle size={14} strokeWidth={1.5} className="animate-spin text-slate" aria-hidden />}
        <span className="truncate text-ink">{keepCurrent.tool}</span>
        <span className="text-slate">{on(lp, 0.55) ? "3 pages found" : "searching"}</span>
      </div>
      <div className="space-y-2">
        {story.staleSpots.map((s, i) => (
          <div key={s.where} className={cn("overflow-hidden rounded-[4px] border border-line", show(on(lp, 0.55 + i * 0.12)))}>
            <div className="border-b border-line bg-canvas px-3 py-1 font-mono text-[11.5px] text-slate">{s.where}</div>
            <div className="font-mono text-[12.5px] leading-[1.8]">
              <div className="bg-fail-soft px-3 text-fail">- {s.text}</div>
              <div className="bg-pass-soft px-3 text-pass">+ {s.text.replace("100", "1,000")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 5. Every surface updates, the next answer is right */
function SyncScene({ lp }: { lp: number }) {
  return (
    <div className="flex h-full flex-col justify-start md:justify-center gap-5">
      <ul className="grid grid-cols-2 gap-2.5">
        {keepCurrent.targets.map((t, i) => {
          const ok = on(lp, 0.08 + i * 0.12);
          return (
            <li key={t.name} className={cn("flex items-center justify-between gap-2 rounded-[4px] border px-3 py-2.5 transition-colors duration-300", ok ? "border-pass/30 bg-pass-soft" : "border-line")}>
              <span className="min-w-0">
                <span className="block font-display text-[14.5px] font-medium text-ink">{t.name}</span>
                <span className="block truncate font-mono text-[11px] text-slate">{t.at}</span>
              </span>
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300", ok ? "scale-100 border-pass bg-pass text-on-blue" : "scale-90 border-line-strong text-transparent")}>
                <Check size={13} strokeWidth={2.25} aria-hidden />
              </span>
            </li>
          );
        })}
      </ul>
      <div className={cn("rounded-[5px] border border-line p-4", show(on(lp, 0.6)))}>
        <p className="t-mono-xs mb-2 flex items-center gap-1.5 text-slate">
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-ink" /> coding agent, next request
        </p>
        <p className="text-[15.5px] leading-[1.7] text-ink-2 md:text-[17px]">
          Install it with <span className="rounded-[2px] bg-blue-soft px-1 font-mono text-[0.88em] text-blue">{current.install}</span>. The API allows{" "}
          <span className="rounded-[2px] bg-blue-soft px-1 font-mono text-[0.88em] text-blue">{current.rateLimit}</span> per key.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-sq border border-blue/25 bg-blue-soft px-2.5 py-1 font-mono text-[12px] text-blue">
          <CircleCheck size={13} strokeWidth={1.5} aria-hidden /> <span className="text-slate">source</span> {current.source}
        </div>
      </div>
      <p className={cn("font-mono text-[13px] font-medium text-ink", show(on(lp, 0.82)))}>{keepCurrent.final}</p>
    </div>
  );
}
