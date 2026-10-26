import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono, Work_Sans } from "next/font/google";
import { ConceptBadge } from "@/components/sections/Chrome";
import { MachineChip } from "@/components/view/MachineChip";
import { ScanLine } from "@/components/view/ScanLine";
import { ViewProvider } from "@/components/view/ViewProvider";
import { meta } from "@/content/site";
import "@/styles/globals.css";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: meta.title,
  description: meta.description,
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/index.md", "text/plain": "/llms.txt" },
  },
  openGraph: { title: meta.title, description: meta.description, type: "website" },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
};

export const viewport: Viewport = {
  themeColor: "#f9f8f5",
};

// Applies ?view=machine before first paint so there is no flash of the human page.
const preView = `try{var v=new URLSearchParams(location.search).get("view");if(v==="machine"){document.documentElement.dataset.view="machine";document.documentElement.dataset.chrome="machine"}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-view="human"
      data-chrome="human"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${workSans.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preView }} />
        <link rel="alternate" type="text/markdown" href="/index.md" />
      </head>
      <body>
        <ViewProvider>
          <a
            href="#main"
            className="sr-only z-[90] rounded-sq bg-blue px-3 py-2 text-on-blue focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
          >
            Skip to content
          </a>
          {children}
          <ScanLine />
          <MachineChip />
          <ConceptBadge />
        </ViewProvider>
      </body>
    </html>
  );
}
