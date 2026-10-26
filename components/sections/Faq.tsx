"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { faq } from "@/content/site";
import { cn } from "@/lib/cn";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Container, Grid, PathMarker, SectionTitle } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SectionShell id={faq.id} path={faq.path} md={sectionMarkdown.faq()} band="sky">
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={faq.path} id={faq.id} />
        <Grid className="mt-10 gap-y-12 md:mt-14">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionTitle lines={faq.title} className="text-[clamp(34px,4.2vw,60px)]" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <ul className="border-b-2 border-ink/15">
              {faq.items.map((item, i) => {
                const isOpen = open === i;
                const id = `faq-${item.anchor.slice(1)}`;
                return (
                  <li key={item.anchor} id={item.anchor.slice(1)} className="border-t-2 border-ink/15">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={id}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 py-5 text-left md:grid-cols-[132px_1fr_auto] md:py-6"
                      >
                        <span className={cn("t-path pt-1.5 transition-colors md:order-none", isOpen ? "text-blue" : "group-hover:text-ink")}>{item.anchor}</span>
                        <span className="order-3 col-span-2 font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink md:order-none md:col-span-1 md:text-[21px]">
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "order-2 mt-0.5 grid h-8 w-8 place-items-center rounded-full border-2 transition-all duration-200 md:order-none",
                            isOpen ? "rotate-45 border-ink bg-butter text-ink shadow-[2px_2px_0_0_var(--ink)]" : "border-ink/30 bg-surface text-ink group-hover:border-ink",
                          )}
                        >
                          <Plus size={15} strokeWidth={1.5} aria-hidden />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={id}
                      role="region"
                      inert={!isOpen}
                      className={cn("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-snap)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-7 md:pl-[156px] md:pr-12">
                          <p className="t-body-lg text-ink-2">{item.a}</p>
                          <ul className="mt-4 space-y-1.5">
                            {item.bullets.map((b) => (
                              <li key={b} className="flex gap-3 text-[15.5px] text-slate">
                                <span className="mt-[11px] h-px w-3 shrink-0 bg-blue" aria-hidden />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Grid>
      </Container>
    </SectionShell>
  );
}
