"use client";

import { motion } from "motion/react";
import { hero, machine } from "@/content/site";
import { easeScan, easeSnap } from "@/lib/motion";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CopyChip } from "@/components/ui/CopyChip";
import { ProductHuntBadges } from "@/components/ui/ProductHuntBadges";
import { Button, Container, Grid, Sticker } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";
import { SplitReader } from "./SplitReader";

const rise = (delay: number) => ({
  initial: { y: "108%" },
  animate: { y: "0%" },
  transition: { duration: 1, ease: easeSnap, delay },
});

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeSnap, delay },
});

const tags = [
  { text: "GET /docs/quickstart.md · 200", pos: "-top-4 left-28", dot: "bg-pass", brand: "Cursor" },
  { text: "cited by Claude · #install", pos: "top-[30%] -right-8", dot: "bg-blue", brand: "Claude" },
  { text: "llms.txt fetched by ChatGPT", pos: "bottom-24 -left-10", dot: "bg-blue", brand: "ChatGPT" },
  { text: "mcp · search_docs(\"rate limit\")", pos: "bottom-28 -right-6", dot: "bg-ink", brand: "Codex" },
];

export function Hero({ codeHtml }: { codeHtml: Record<string, string> }) {
  const words = hero.title[0].split(" ");
  return (
    <SectionShell id={hero.id} path={hero.path} md={sectionMarkdown.hero()} banner={machine.banner} machineClassName="md:pt-24" label="Introduction">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="beam absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent via-blue/[0.025] to-transparent">
          <div className="absolute inset-x-0 top-1/2 h-px bg-blue/10" />
        </div>
      </div>
      <Container className="relative pb-24 pt-14 md:pb-36 md:pt-24">
        <motion.p {...fade(0)} className="flex items-center gap-2.5 font-display text-[15px] font-medium text-slate">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-blue/50" />
            <span className="relative h-2 w-2 rounded-full bg-blue" />
          </span>
          {hero.kicker}
        </motion.p>

        <div className="relative">
        <span className="absolute -top-10 right-0 hidden md:block">
          <Sticker tone="butter" rotate={-7} delay={1.3}>
            <span className="h-2 w-2 rounded-full bg-blue" /> now with 2 readers
          </Sticker>
        </span>
        <h1 className="mt-6 font-display text-[clamp(44px,7.4vw,108px)] font-medium leading-[0.96] tracking-[-0.045em] text-ink">
          <span className="sr-only">{hero.title.join(" ")}</span>
          <span aria-hidden className="block">
            {words.map((w, i) => (
              <span key={i} className={`inline-block overflow-hidden pb-[0.06em] align-bottom ${i < words.length - 1 ? "mr-[0.24em]" : ""}`}>
                <motion.span className={`inline-block ${w === "two" || w === "readers" ? "text-blue" : ""}`} {...rise(0.08 + i * 0.07)}>
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.22em] pr-4 pt-2">
            <motion.span className="inline-block text-slate" {...rise(0.55)}>
              DocsAlot writes for{" "}
              <span className="relative inline-block -rotate-2 rounded-[14px] border-[3px] border-ink bg-butter px-[0.14em] text-ink shadow-[6px_6px_0_0_var(--ink)]">
                both.
              </span>
            </motion.span>
          </span>
        </h1>
        </div>

        <Grid className="mt-10 items-end gap-y-8 md:mt-14">
          <motion.p {...fade(0.8)} className="t-body-lg col-span-12 max-w-[36rem] lg:col-span-6">
            {hero.sub}
          </motion.p>
          <motion.div {...fade(0.95)} className="col-span-12 flex flex-col gap-4 lg:col-span-6 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <Button href={hero.primary.href} size="lg">
                {hero.primary.label}
              </Button>
              <Button href={hero.secondary.href} variant="outline" size="lg" external>
                {hero.secondary.label}
              </Button>
            </div>
            <CopyChip text={hero.install} tooltip={hero.installTooltip} label="Copy" />
          </motion.div>
        </Grid>

        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeScan, delay: 1.05 }}
        >
          <div className="relative">
            {tags.map((t, i) => (
              <motion.span
                key={t.text}
                aria-hidden
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: easeSnap, delay: 2.1 + i * 0.25 }}
                className={`absolute z-30 hidden lg:block ${t.pos}`}
              >
                <span
                  className="float-y flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[11.5px] text-ink shadow-pop"
                  style={{ animationDelay: `${i * -1.3}s` }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                  <BrandLogo name={t.brand} size={14} />
                  {t.text}
                </span>
              </motion.span>
            ))}
            <SplitReader codeHtml={codeHtml} caption={hero.caption} />
          </div>
        </motion.div>

        <motion.div {...fade(1.5)} className="mt-12 flex justify-center">
          <ProductHuntBadges ids={["featured", "top-post", "topic-week"]} className="justify-center" />
        </motion.div>

        <motion.ul {...fade(1.4)} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14.5px] text-slate">
          {hero.proof.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span aria-hidden className="h-1 w-1 bg-blue" />
              {p}
            </li>
          ))}
        </motion.ul>
      </Container>
    </SectionShell>
  );
}
