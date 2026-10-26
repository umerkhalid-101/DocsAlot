import { LaunchBar, Nav } from "@/components/sections/Chrome";
import { CommandPalette } from "@/components/sections/DocsChrome";
import { Audit } from "@/components/sections/Audit";
import { Benchmark } from "@/components/sections/Benchmark";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { How } from "@/components/sections/How";
import { Pricing } from "@/components/sections/Pricing";
import { Setup } from "@/components/sections/Setup";
import { Sources } from "@/components/sections/Sources";
import { Stories } from "@/components/sections/Stories";
import { Story } from "@/components/sections/Story";
import { Surfaces } from "@/components/sections/Surfaces";
import { quickstart } from "@/content/demo";
import { highlight } from "@/lib/highlight";

function GuideLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="relative mx-auto h-full max-w-[1240px] px-5 md:px-6">
        <div className="relative h-full">
          <span className="absolute inset-y-0 left-0 w-px bg-line/60" />
          <span className="absolute inset-y-0 left-1/3 hidden w-px bg-line/35 lg:block" />
          <span className="absolute inset-y-0 left-2/3 hidden w-px bg-line/35 lg:block" />
          <span className="absolute inset-y-0 right-0 w-px bg-line/60" />
        </div>
      </div>
    </div>
  );
}

export default async function Page() {
  const codeHtml = Object.fromEntries(
    await Promise.all(
      quickstart.steps.map(
        async (s) =>
          [s.id, await highlight(s.code ?? "", s.lang ?? "ts")] as const,
      ),
    ),
  );

  return (
    <>
      <LaunchBar />
      <Nav />
      <CommandPalette />
      <main id="main" className="relative">
        <GuideLines />
        <div className="relative z-[1]">
          <Hero codeHtml={codeHtml} />
          <Sources />
          <Story />
          <How />
          <Surfaces />
          <Setup />
          <Benchmark />
          <Stories />
          <Pricing />
          <Faq />
          <Audit />
        </div>
      </main>
      <Footer />
    </>
  );
}
