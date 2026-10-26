"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MarkdownView } from "./MarkdownView";
import { useView } from "./ViewProvider";

/**
 * Every section renders twice: the designed page and the markdown an agent
 * reads. The active rendering sets the section's height; the other one sits
 * on top of it (absolutely positioned) so the scan line can reveal it in place.
 */
export function SectionShell({
  id,
  path,
  md,
  children,
  as: Tag = "section",
  className,
  machineClassName,
  banner,
  label,
  machineExtra,
  band,
}: {
  id: string;
  path: string;
  md: string;
  children: ReactNode;
  as?: "section" | "footer";
  className?: string;
  machineClassName?: string;
  banner?: string;
  label?: string;
  machineExtra?: ReactNode;
  /** full-bleed color sheet behind the human rendering */
  band?: "ink" | "cobalt" | "sky" | "butter";
}) {
  const { settled, scanning, registerLayer } = useView();
  const humanHidden = settled === "machine" && !scanning;
  const machineHidden = settled === "human" && !scanning;

  return (
    <Tag id={id} aria-label={label} data-shell className={cn("relative scroll-mt-20", band && `band band-${band}`, className)}>
      <div className="layer-human relative" inert={humanHidden}>
        {children}
      </div>
      <div
        ref={registerLayer}
        inert={machineHidden}
        className="layer-machine relative z-10 bg-m-canvas"
      >
        <div
          className={cn(
            "mx-auto grid max-w-[1240px] grid-cols-12 gap-x-6 px-5 pb-20 pt-24 md:px-6 md:pt-[152px]",
            machineClassName,
          )}
        >
          <div className="col-span-12 lg:col-span-2">
            <a href={`#${id}`} className="t-path text-m-dim hover:text-m-blue">
              {path === "/" ? "/index.md" : `${path}.md`}
            </a>
          </div>
          <div className="col-span-12 mt-4 max-w-[820px] lg:col-span-9 lg:mt-0">
            {banner && <p className="t-code mb-6 italic text-m-dim">{banner}</p>}
            <MarkdownView md={md} />
            {machineExtra}
          </div>
        </div>
      </div>
    </Tag>
  );
}
