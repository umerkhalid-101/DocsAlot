"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Check, CircleCheck, Inbox } from "lucide-react";
import { useRef } from "react";
import { current } from "@/content/demo";
import { stories } from "@/content/site";
import { cn } from "@/lib/cn";
import { typed, usePlayhead } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, PathMarker, SectionTitle } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

type Item = (typeof stories.items)[number];

export function Stories() {
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start start", "end end"] });
  const n = stories.items.length;

  return (
    <SectionShell id={stories.id} path={stories.path} md={sectionMarkdown.stories()} band="butter">
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={stories.path} id={stories.id} />
        <div className="mt-10 flex flex-col gap-6 md:mt-14 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle lines={stories.title} />
          <p className="t-path max-w-[32ch] lg:text-right">{stories.note}</p>
        </div>

        <div ref={list} className="relative mt-14 md:mt-20">
          {stories.items.map((it, i) => (
            <Card key={it.id} item={it} i={i} n={n} progress={scrollYProgress} />
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

function Card({ item, i, n, progress }: { item: Item; i: number; n: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.045]);
  const dark = i === 1;
  return (
    <div className={cn("relative", i < n - 1 ? "h-[92vh] md:h-[86vh]" : "")}>
      <motion.article
        style={{ scale, top: `calc(5.5rem + ${i * 28}px)` }}
        className={cn(
          "sticky grid origin-top gap-8 rounded-[18px] border-2 border-ink p-6 shadow-[6px_6px_0_0_var(--ink)] md:grid-cols-2 md:gap-10 md:p-10",
          dark ? "bg-blue text-m-ink" : i === 0 ? "bg-surface" : "bg-sky",
        )}
      >
        <div className="flex flex-col">
          <p className={cn("t-mono-xs flex items-center gap-2", dark ? "text-m-dim" : "text-slate")}>
            <span className={cn("rounded-[2px] px-1.5 py-0.5 font-medium", dark ? "bg-m-ink/15 text-m-ink" : "bg-blue-soft text-blue")}>{item.who}</span>
            example scenario
          </p>
          <h3
            className={cn(
              "mt-5 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[48px]",
              dark ? "text-m-ink" : "text-ink",
            )}
          >
            {item.name}
          </h3>
          <p className={cn("mt-5 max-w-[32rem] text-[16px] leading-relaxed md:text-[18px]", dark ? "text-m-ink/80" : "text-ink-2")}>{item.body}</p>
          <p className={cn("mt-auto flex items-center gap-2.5 pt-8 font-mono text-[13px]", dark ? "text-m-ink" : "text-ink")}>
            <span aria-hidden className={cn("h-2 w-2", dark ? "bg-m-ink" : "bg-blue")} />
            {item.outcome}
          </p>
        </div>
        <div className="min-h-[300px] md:min-h-[380px]">
          {item.id === "founder" && <FounderScene />}
          {item.id === "api" && <ApiScene />}
          {item.id === "support" && <SupportScene />}
        </div>
      </motion.article>
    </div>
  );
}

const appear = (v: boolean) => cn("transition-all duration-500 ease-[var(--ease-snap)]", v ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");

/* Founder: repo to reviewed docs */
const founderPages = ["quickstart", "authentication", "api reference", "errors", "llms.txt", "skill.md"];
function FounderScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = usePlayhead(ref, 6200, { amount: 0.4 });
  const cmd = typed("docsalot skills install", t, 200, 30);
  const ask = typed("create docs for my project", t, 1300, 30);
  return (
    <div ref={ref} className="flex h-full flex-col rounded-[12px] border-2 border-ink bg-m-canvas p-5 font-mono text-[13px] leading-[1.9] text-m-ink">
      <p className="t-mono-xs mb-3 text-m-dim">~/acme · zsh</p>
      <p>
        <span className="text-m-dim">$ </span>
        {cmd}
      </p>
      {t > 1100 && <p className="text-m-pass">  ✓ skill installed</p>}
      {t > 1300 && (
        <p>
          <span className="text-m-blue">agent › </span>
          {ask}
        </p>
      )}
      <ul className="mt-3 grid grid-cols-2 gap-x-4">
        {founderPages.map((pg, i) => {
          const done = t > 2400 + i * 450;
          return (
            <li key={pg} className={cn("flex items-center gap-2", appear(t > 2200 + i * 450))}>
              {done ? <Check size={13} strokeWidth={2} className="text-m-pass" aria-hidden /> : <span className="h-1.5 w-1.5 bg-m-dim" aria-hidden />}
              <span className={done ? "text-m-ink" : "text-m-dim"}>{pg}</span>
            </li>
          );
        })}
      </ul>
      <p className={cn("mt-auto border-t border-m-line pt-3 text-m-pass", appear(t > 5400))}>  ✓ 12 pages ready for review</p>
    </div>
  );
}

/* API company: one spec, four surfaces */
const spec = `openapi: 3.1.0
paths:
  /v1/payments:
    post: createPayment
  /v1/payments/{id}:
    get: getPayment
  /v1/refunds:
    post: createRefund`;
const apiSurfaces = ["API reference", "SDK snippets", "llms.txt", "MCP tools"];
function ApiScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = usePlayhead(ref, 5200, { amount: 0.4 });
  return (
    <div ref={ref} className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
      <pre className="overflow-hidden rounded-[6px] border border-m-line bg-m-surface p-4 font-mono text-[12px] leading-[1.7] text-m-ink">
        <span className="text-m-dim">openapi.yaml</span>
        {"\n"}
        {spec}
      </pre>
      <div className="grid grid-cols-2 gap-2">
        {apiSurfaces.map((s, i) => {
          const lit = t > 700 + i * 500;
          return (
            <div
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-[4px] border px-3 py-2 font-mono text-[12px] transition-all duration-300",
                lit ? "border-m-blue/50 bg-m-blue/10 text-m-ink" : "border-m-line text-m-dim",
              )}
            >
              <ArrowRight size={12} strokeWidth={1.5} className={lit ? "text-m-blue" : ""} aria-hidden />
              {s}
            </div>
          );
        })}
      </div>
      <div className={cn("self-end rounded-[4px] border border-m-line p-3 font-mono text-[12px] leading-[1.7]", appear(t > 3000))}>
        <p className="text-m-blue">&gt; search_docs({`{ "query": "refund" }`})</p>
        <p className="text-m-ink">
          &lt; /api/refunds <span className="text-m-dim">· createRefund · POST /v1/refunds</span>
        </p>
      </div>
    </div>
  );
}

/* Support: ticket answered from the same source */
function SupportScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = usePlayhead(ref, 5600, { amount: 0.4 });
  const reply = typed(`Hi Sam, each API key can make ${current.rateLimit}. Requests over the limit return 429, so retry with backoff.`, t, 1200, 22);
  return (
    <div ref={ref} className="flex h-full flex-col gap-4">
      <div className="rounded-[12px] border-2 border-ink bg-surface p-4">
        <p className="t-mono-xs flex items-center gap-1.5 text-slate">
          <Inbox size={12} strokeWidth={1.5} aria-hidden /> new ticket · help center
        </p>
        <p className="mt-2 font-display text-[16px] font-semibold text-ink">What is the API rate limit now?</p>
        <p className="mt-1 text-[14px] text-slate">Saw 429s after upgrading. Is it still 100 a minute?</p>
      </div>
      <div className={cn("relative flex-1 rounded-[12px] border-2 border-blue bg-surface p-4", appear(t > 900))}>
        <p className="t-mono-xs text-blue">suggested reply · from your docs</p>
        <p className="mt-2 min-h-[4.8em] text-[15px] leading-relaxed text-ink-2">
          {reply}
          {t < 4300 && t > 1200 && <span className="caret ml-0.5 text-blue" aria-hidden />}
        </p>
        <div className={cn("mt-3 flex flex-wrap items-center gap-2", appear(t > 4400))}>
          <span className="inline-flex items-center gap-1.5 rounded-sq border border-blue/25 bg-blue-soft px-2 py-1 font-mono text-[11.5px] text-blue">
            <CircleCheck size={12} strokeWidth={1.5} aria-hidden /> help.acme.dev/limits
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-sq bg-pass-soft px-2 py-1 font-mono text-[11.5px] text-pass">
            <Check size={12} strokeWidth={2} aria-hidden /> macro matches docs
          </span>
        </div>
      </div>
    </div>
  );
}
