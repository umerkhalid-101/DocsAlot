import { Check } from "lucide-react";
import { pricing } from "@/content/site";
import { cn } from "@/lib/cn";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Button, Container, Grid, PathMarker, SectionTitle, Sticker, Tag, TextLink } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";

export function Pricing() {
  return (
    <SectionShell id={pricing.id} path={pricing.path} md={sectionMarkdown.pricing()}>
      <Container className="py-24 md:py-[152px]">
        <PathMarker path={pricing.path} id={pricing.id} />
        <Grid className="mt-10 gap-y-6 md:mt-14">
          <div className="relative col-span-12 lg:col-span-7">
            <SectionTitle lines={pricing.title} />
            <Sticker tone="butter" rotate={-6} className="absolute -top-8 right-0 md:right-6">
              PH50 · 50% off 3 months
            </Sticker>
          </div>
          <p className="t-body-lg col-span-12 max-w-[28rem] self-end lg:col-span-5">{pricing.sub}</p>
        </Grid>

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-5">
          {pricing.plans.map((plan, i) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[16px] border-2 border-ink bg-surface shadow-[6px_6px_0_0_var(--ink)] transition-transform duration-300 hover:-translate-y-1",
                plan.featured && "md:-translate-y-3 md:hover:-translate-y-4",
              )}
            >
              <div className={cn("h-3 border-b-2 border-ink", i === 0 ? "bg-sky" : i === 1 ? "bg-blue" : "bg-butter")} aria-hidden />
              <div className="flex flex-1 flex-col p-6 md:p-7">
              <div className="flex items-center justify-between">
                <p className="t-panel">{plan.name}</p>
                {plan.tag && <Tag tone="blue">{plan.tag}</Tag>}
              </div>
              <p className="mt-2 min-h-[5em] text-[15px] leading-relaxed text-slate">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-[48px] font-medium leading-none tracking-[-0.035em] text-ink">{plan.price}</span>
                {plan.per && <span className="font-mono text-[13px] text-slate">{plan.per}</span>}
              </p>
              <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[15px] leading-snug text-ink-2">
                    <Check size={15} strokeWidth={1.5} className={cn("mt-[3px] shrink-0", plan.featured ? "text-blue" : "text-slate")} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button
                  href={plan.cta.href}
                  variant={plan.featured ? "primary" : "outline"}
                  external={"external" in plan.cta && plan.cta.external}
                  className="w-full"
                >
                  {plan.cta.label}
                </Button>
              </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-path flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-blue" aria-hidden />
            {pricing.launch}
          </p>
          <TextLink href={pricing.compare.href}>{pricing.compare.label}</TextLink>
        </div>
      </Container>
    </SectionShell>
  );
}
