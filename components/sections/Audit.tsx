import { Lock } from "lucide-react";
import { audit } from "@/content/site";
import { sectionMarkdown } from "@/lib/toMarkdown";
import { Button, Container, PathMarker } from "@/components/ui/primitives";
import { MarkdownView } from "@/components/view/MarkdownView";
import { SectionShell } from "@/components/view/SectionShell";

export function Audit() {
  const md = sectionMarkdown.audit();
  return (
    <SectionShell id={audit.id} path={audit.path} md={md} band="cobalt">
      <Container className="pb-32 pt-24 md:pb-[180px] md:pt-[140px]">
        <PathMarker path={audit.path} id={audit.id} />
        <div className="relative mt-10 md:mt-14">
        <div className="tone-light relative grid grid-cols-1 overflow-hidden rounded-[14px] border-2 border-ink shadow-[8px_8px_0_0_var(--ink)] lg:grid-cols-2">
          <div className="bg-surface px-6 py-12 md:px-12 md:py-16">
            <h2 className="t-section text-[clamp(34px,3.9vw,56px)]">
              <span className="block">{audit.title[0]}</span>
              <span className="block text-slate">{audit.title[1]}</span>
            </h2>
            <p className="t-body-lg mt-6 max-w-[30rem]">{audit.sub}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={audit.primary.href} size="lg">
                {audit.primary.label}
              </Button>
              <Button href={audit.secondary.href} variant="outline" size="lg">
                {audit.secondary.label}
              </Button>
            </div>
            <p className="t-path mt-8">{audit.meta}</p>
          </div>

          <div className="relative bg-m-canvas px-6 py-12 md:px-12 md:py-16" aria-hidden>
            <p className="t-mono-xs mb-5 text-m-dim">
              <span className="text-m-pass">200</span> GET /audit.md · text/markdown
            </p>
            <MarkdownView md={md} />
          </div>

          {/* Locked divider */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-blue lg:block">
            <div className="t-mono-xs absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-sq border border-blue bg-surface px-2 py-1 text-[10.5px] font-medium text-blue shadow-frame">
              <Lock size={10} strokeWidth={1.75} />
              Human <span className="text-blue/40">|</span> Machine
            </div>
          </div>
        </div>
        </div>
      </Container>
    </SectionShell>
  );
}
