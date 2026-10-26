import { ArrowUpRight, FileText } from "lucide-react";
import { footer } from "@/content/site";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { LogoMark } from "@/components/ui/Logo";
import { ProductHuntBadges } from "@/components/ui/ProductHuntBadges";
import { Container } from "@/components/ui/primitives";
import { SectionShell } from "@/components/view/SectionShell";
import { ViewSwitch } from "@/components/view/ViewSwitch";

const agentFiles = [
  { label: "/llms.txt", href: "/llms.txt" },
  { label: "/index.md", href: "/index.md" },
];

export function Footer() {
  return (
    <SectionShell
      as="footer"
      band="ink"
      id={footer.id}
      path={footer.path}
      md={sectionMarkdown.footer()}
      machineClassName="md:pt-16 pt-12 pb-28"
      label="Footer"
      machineExtra={
        <div className="chrome mt-8">
          <ViewSwitch />
        </div>
      }
    >
      <Container className="pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <LogoMark className="h-11 w-11" />
            <p className="mt-6 max-w-[22ch] font-display text-[26px] font-medium leading-[1.15] tracking-[-0.025em] text-ink md:text-[30px]">
              Docs that <span className="text-butter">compound</span>, not accumulate.
            </p>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-slate">Documentation infrastructure for founders, developer tools and API teams.</p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {footer.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full border-2 border-line-strong px-3.5 py-1.5 font-mono text-[12.5px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-canvas"
                  >
                    {s.label}
                    <ArrowUpRight size={12} strokeWidth={2} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="t-mono-xs mr-1 text-slate">for agents</span>
              {agentFiles.map((f) => (
                <a
                  key={f.href}
                  href={f.href}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border-2 border-blue/50 bg-blue-soft px-2.5 py-1 font-mono text-[12px] text-blue transition-colors hover:border-blue"
                >
                  <FileText size={12} strokeWidth={2} aria-hidden />
                  {f.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {footer.groups.map((g) => (
              <div key={g.title}>
                <p className="mb-4 font-display text-[14px] font-semibold text-ink">{g.title}</p>
                <ul className="space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[14.5px] text-slate underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-blue"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </Container>

      {/* Product Hunt */}
      <Container className="mt-16">
        <div className="flex flex-col gap-4 border-t-2 border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-[15px] font-semibold text-ink">Loved on Product Hunt</p>
          <ProductHuntBadges />
        </div>
      </Container>

      {/* Giant wordmark */}
      <div className="relative mt-20 overflow-hidden md:mt-28">
        <Container>
          <div className="relative">
            <p
              aria-hidden
              className="select-none whitespace-nowrap font-display text-[clamp(84px,19vw,280px)] font-semibold leading-[0.78] tracking-[-0.065em] text-ink"
            >
              Docs<span className="text-blue">Alot</span>
            </p>
          </div>
        </Container>
      </div>

      <Container className="pb-24 md:pb-10">
        <div className="mt-8 flex flex-col gap-4 border-t-2 border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="t-mono-xs text-slate">{footer.copyright}</p>
          <div className="chrome flex items-center gap-3">
            <span className="t-mono-xs text-slate">view this page as</span>
            <ViewSwitch />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}
