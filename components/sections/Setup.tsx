"use client";

import { RotateCcw } from "lucide-react";
import { useRef } from "react";
import { setup } from "@/content/site";
import { cn } from "@/lib/cn";
import { typed, usePlayhead } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { CopyChip } from "@/components/ui/CopyChip";
import { Container, Grid, PathMarker, SectionTitle, TextLink } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

const TYPE_MS = 34;

// Build a schedule: typed lines take time, output lines land after a short pause.
const schedule = (() => {
  let at = 500;
  return setup.terminal.map((l) => {
    const typedLine = l.kind === "cmd" || l.kind === "agent";
    const start = at + (typedLine ? 350 : l.kind === "ok" ? 520 : 380);
    const end = start + (typedLine ? l.text.length * TYPE_MS : 0);
    at = end + (typedLine ? 260 : 0);
    return { ...l, start, end, typed: typedLine };
  });
})();
const TOTAL = schedule[schedule.length - 1].end + 600;

export function Setup() {
  return (
    <SectionShell id={setup.id} path={setup.path} md={sectionMarkdown.setup()} band="ink">
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={setup.path} id={setup.id} />
        <Grid className="mt-10 gap-y-12 md:mt-14">
          <div className="col-span-12 lg:col-span-5">
            <SectionTitle lines={setup.title} />
            <p className="t-body-lg mt-6 max-w-[28rem]">{setup.body}</p>
            <div className="mt-9 grid max-w-[26rem] grid-cols-1 gap-2.5">
              {setup.commands.map((c) => (
                <CopyChip key={c} text={c} tooltip="Copied" />
              ))}
              <CopyChip text={setup.prompt} prefix="agent ›" label={setup.copyPrompt} tooltip="Prompt copied. Paste it into your agent." className="mt-2" />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {setup.links.map((l) => (
                <TextLink key={l.label} href={l.href}>
                  {l.label}
                </TextLink>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:pl-6">
            <Terminal />
          </div>
        </Grid>
      </Container>
    </SectionShell>
  );
}

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, done, play } = usePlayhead(ref, TOTAL, { amount: 0.5 });
  const activeIdx = schedule.findIndex((l) => t < l.end || t < l.start);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[16px] border-2 border-ink bg-m-canvas shadow-[6px_6px_0_0_var(--blue)]">
      <div className="flex h-10 items-center justify-between border-b border-m-line px-4">
        <span className="t-mono-xs text-m-dim">~/acme · zsh</span>
        <button
          type="button"
          onClick={play}
          disabled={!done}
          className="t-mono-xs inline-flex cursor-pointer items-center gap-1.5 text-m-dim hover:text-m-ink disabled:cursor-default disabled:opacity-0"
        >
          <RotateCcw size={11} strokeWidth={1.5} aria-hidden /> replay
        </button>
      </div>
      <div className="h-[360px] overflow-hidden px-5 py-5 font-mono text-[13px] leading-[1.85] md:h-[380px] md:text-[13.5px]" aria-label="Terminal session">
        {schedule.map((l, i) => {
          if (t < l.start) return null;
          const text = l.typed ? typed(l.text, t, l.start, TYPE_MS) : l.text;
          const caret = i === activeIdx && l.typed;
          return (
            <div key={i} className="whitespace-pre-wrap break-words">
              {l.kind === "cmd" && <span className="text-m-dim">$ </span>}
              {l.kind === "agent" && <span className="text-m-blue">agent › </span>}
              {l.kind === "ok" && <span className="text-m-pass">  ✓ </span>}
              {l.kind === "out" && <span>  </span>}
              <span className={cn(l.kind === "out" ? "text-m-dim" : l.kind === "agent" ? "text-m-ink" : "text-m-ink")}>{text}</span>
              {caret && <span className="caret ml-0.5 text-m-blue" aria-hidden />}
            </div>
          );
        })}
        {done && (
          <div>
            <span className="text-m-dim">$ </span>
            <span className="caret text-m-dim" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
