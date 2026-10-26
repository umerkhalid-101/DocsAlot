"use client";

import { motion, useInView, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { easeSnap } from "@/lib/motion";

/** Each line slides up out of its own mask, one after another. */
export function SectionTitle({ lines, className, as = "h2" }: { lines: string[]; className?: string; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag ref={ref} className={cn("t-section", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block", i > 0 && "text-slate")}
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 0.9, ease: easeSnap, delay: i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Scan-in: content is revealed top to bottom, like the machine view's scan line. */
export function Reveal({ children, className, delay = 0, y = 18 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, clipPath: "inset(0 0 100% 0)" }}
      animate={inView ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" } : undefined}
      transition={{ duration: 0.8, ease: easeSnap, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Thin cobalt line under the nav showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 });
  return <motion.div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-blue" style={{ scaleX }} />;
}

const GLYPHS = "#/_<>{}[]=+*01";

/** Text that decodes from machine glyphs into words when it scrolls into view. */
export function Decode({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 1 });
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const dur = 650;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const settled = Math.floor(p * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (i < settled || ch === " " ? ch : GLYPHS[(i * 7 + Math.floor(now / 40)) % GLYPHS.length]))
          .join(""),
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/** A tilted label slapped onto the page; pops in when it scrolls into view. */
export function Sticker({
  children,
  tone = "butter",
  rotate = -6,
  className,
  delay = 0.2,
}: {
  children: ReactNode;
  tone?: "butter" | "sky" | "ink" | "white" | "cobalt";
  rotate?: number;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  return (
    <motion.span
      ref={ref}
      aria-hidden
      initial={{ scale: 0.4, opacity: 0, rotate: rotate - 14 }}
      animate={inView ? { scale: 1, opacity: 1, rotate } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 16, delay }}
      className={cn(
        "sticker tone-light pointer-events-auto inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-ink px-3.5 py-1.5 font-display text-[14px] font-semibold tracking-[-0.01em] shadow-[3px_3px_0_0_var(--ink)] md:text-[15px]",
        tone === "butter" && "bg-butter text-ink",
        tone === "sky" && "bg-sky text-ink",
        tone === "white" && "bg-surface text-ink",
        tone === "ink" && "bg-ink text-on-blue",
        tone === "cobalt" && "bg-blue text-on-blue",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
