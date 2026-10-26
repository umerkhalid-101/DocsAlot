"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { concept, docsNav, launchBar, nav } from "@/content/site";
import { ScrollProgress } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { CornerMarks } from "@/components/ui/primitives";
import { ViewSwitch } from "@/components/view/ViewSwitch";

/* ---------- Launch bar ---------- */

export function LaunchBar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("docsalot:launchbar") === "0") setOpen(false);
    } catch {
      /* storage can be unavailable */
    }
  }, []);
  if (!open) return null;
  return (
    <div className="relative z-[55] bg-ink text-on-blue">
      <div className="mx-auto flex min-h-9 max-w-[1240px] items-center justify-center gap-3 px-10 py-1.5 text-center text-[13px] leading-snug md:px-6">
        <span className="hidden h-1.5 w-1.5 shrink-0 bg-blue sm:block" aria-hidden />
        <p>
          <span className="opacity-90">{launchBar.text}</span>{" "}
          <a
            href={launchBar.cta.href}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap font-medium underline decoration-on-blue/40 underline-offset-4 hover:decoration-on-blue"
          >
            {launchBar.cta.label}
          </a>
        </p>
        <button
          type="button"
          aria-label="Dismiss launch announcement"
          onClick={() => {
            setOpen(false);
            try {
              window.sessionStorage.setItem("docsalot:launchbar", "0");
            } catch {
              /* storage can be unavailable */
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 opacity-70 hover:opacity-100"
        >
          <X size={14} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ---------- Nav ---------- */

type MenuId = "product" | "teams" | null;

export function Nav() {
  const [menu, setMenu] = useState<MenuId>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sheet, setSheet] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSheet(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const hover = (id: MenuId) => ({
    onMouseEnter: () => {
      window.clearTimeout(closeTimer.current);
      setMenu(id);
    },
    onMouseLeave: () => {
      closeTimer.current = window.setTimeout(() => setMenu(null), 140);
    },
  });

  return (
    <header
      ref={ref}
      className={cn(
        "chrome sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300",
        scrolled ? "border-[var(--c-line)]" : "border-transparent",
      )}
      style={{ background: "var(--c-bg)" }}
    >
      <ScrollProgress />
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 text-[var(--c-ink)] md:px-6">
        <a href="#top" aria-label="DocsAlot home" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <div {...hover("product")} className="relative">
            <MenuButton id="product" open={menu === "product"} onClick={() => setMenu(menu === "product" ? null : "product")}>
              {nav.product.label}
            </MenuButton>
            <Dropdown open={menu === "product"} id="product" wide>
              <div className="grid grid-cols-[1.15fr_1fr] gap-6">
                <div>
                  <p className="t-mono-xs mb-2 text-slate">/docs</p>
                  <ul className="space-y-0.5">
                    {nav.product.docs.map((d) => (
                      <li key={d.label}>
                        <a href={d.href} className="block rounded-sq px-2 py-2 hover:bg-surface-muted">
                          <span className="block font-display text-[14.5px] font-medium text-ink">{d.label}</span>
                          <span className="block text-[13.5px] leading-snug text-slate">{d.note}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l border-line pl-6">
                  <p className="t-mono-xs mb-2 text-slate">/features</p>
                  <ul>
                    {nav.product.features.map((f) => (
                      <li key={f.label}>
                        <a href={f.href} className="block rounded-sq px-2 py-1.5 text-[14px] text-ink-2 hover:bg-surface-muted hover:text-blue">
                          {f.label}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a href={nav.product.all.href} className="mt-1 block px-2 py-1.5 font-mono text-[12.5px] text-blue hover:underline">
                        {nav.product.all.label}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Dropdown>
          </div>

          <div {...hover("teams")} className="relative">
            <MenuButton id="teams" open={menu === "teams"} onClick={() => setMenu(menu === "teams" ? null : "teams")}>
              {nav.teams.label}
            </MenuButton>
            <Dropdown open={menu === "teams"} id="teams">
              <p className="t-mono-xs mb-2 text-slate">/for</p>
              <ul className="space-y-0.5">
                {nav.teams.items.map((d) => (
                  <li key={d.label}>
                    <a href={d.href} className="block rounded-sq px-2 py-2 hover:bg-surface-muted">
                      <span className="block font-display text-[14.5px] font-medium text-ink">{d.label}</span>
                      <span className="block text-[13.5px] leading-snug text-slate">{d.note}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href={nav.teams.all.href} className="mt-2 block px-2 py-1.5 font-mono text-[12.5px] text-blue hover:underline">
                {nav.teams.all.label}
              </a>
            </Dropdown>
          </div>

          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-sq px-3 py-2 font-display text-[14.5px] font-medium text-[var(--c-ink)] transition-colors hover:bg-[var(--c-hover)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          <ViewSwitch hint />
          <a
            href={nav.signIn.href}
            className="hidden font-display text-[14.5px] font-medium text-[var(--c-ink)] hover:text-blue lg:block"
          >
            {nav.signIn.label}
          </a>
          <a
            href={nav.try.href}
            className="hidden h-9 items-center rounded-sq bg-blue px-3.5 font-display text-[14.5px] font-medium text-on-blue transition-colors hover:bg-blue-deep md:inline-flex"
          >
            {nav.try.label}
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={sheet}
            aria-controls="mobile-sheet"
            onClick={() => setSheet(true)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-sq border border-[var(--c-line)] lg:hidden"
          >
            <Menu size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>

      <MobileSheet open={sheet} onClose={() => setSheet(false)} />
    </header>
  );
}

function MenuButton({ id, open, onClick, children }: { id: string; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`menu-${id}`}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1 rounded-sq px-3 py-2 font-display text-[14.5px] font-medium text-[var(--c-ink)] transition-colors hover:bg-[var(--c-hover)]"
    >
      {children}
      <ChevronDown size={14} strokeWidth={1.5} className={cn("transition-transform duration-200", open && "rotate-180")} aria-hidden />
    </button>
  );
}

function Dropdown({ open, id, wide, children }: { open: boolean; id: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div
      id={`menu-${id}`}
      inert={!open}
      className={cn(
        "absolute left-0 top-full pt-3 transition-all duration-200 ease-[var(--ease-snap)]",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
      )}
    >
      <div className={cn("relative rounded-panel border border-line bg-surface p-4 shadow-pop", wide ? "w-[620px]" : "w-[340px]")}>
        <CornerMarks />
        {children}
      </div>
    </div>
  );
}

function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      id="mobile-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={cn(
        "fixed inset-0 z-[80] overflow-y-auto bg-canvas text-ink transition-all duration-300 ease-[var(--ease-snap)] lg:hidden",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Logo />
        <button type="button" aria-label="Close menu" onClick={onClose} className="grid h-9 w-9 cursor-pointer place-items-center rounded-sq border border-line">
          <X size={18} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <div className="space-y-8 px-5 py-8" onClick={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
        <SheetGroup title="/on-this-page" items={docsNav.flatMap((g) => g.items).map((i) => ({ label: i.label, href: `#${i.id}` }))} />
        <SheetGroup title="/product" items={[...nav.product.docs, nav.product.all]} />
        <SheetGroup title="/for" items={[...nav.teams.items, nav.teams.all]} />
        <SheetGroup title="/more" items={nav.links} />
        <div className="grid gap-3 pt-2">
          <a href={nav.try.href} className="inline-flex h-12 items-center justify-center rounded-sq bg-blue font-display font-medium text-on-blue">
            {nav.try.label}
          </a>
          <a href={nav.signIn.href} className="inline-flex h-12 items-center justify-center rounded-sq border border-line-strong font-display font-medium">
            {nav.signIn.label}
          </a>
        </div>
      </div>
    </div>
  );
}

function SheetGroup({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="t-path mb-2">{title}</p>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((i) => (
          <li key={i.label}>
            <a href={i.href} className="flex items-center justify-between py-3 font-display text-[17px] font-medium">
              {i.label.replace(/ →$/, "")}
              <ArrowUpRight size={16} strokeWidth={1.5} className="text-slate" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Concept badge ---------- */

export function ConceptBadge() {
  return (
    <a
      href={concept.href}
      target="_blank"
      rel="noreferrer"
      className="chrome group fixed bottom-3 left-3 z-50 inline-flex items-center gap-2 rounded-panel border border-[var(--c-line)] px-2.5 py-1.5 text-[var(--c-ink)] shadow-frame backdrop-blur-md md:bottom-5 md:left-5"
      style={{ background: "var(--c-bg)" }}
    >
      <CornerMarks size={4} />
      <span className="h-1.5 w-1.5 bg-blue" aria-hidden />
      <span className="t-mono-xs">{concept.label}</span>
      <ArrowUpRight size={12} strokeWidth={1.5} className="text-[var(--c-dim)] transition-transform group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden />
    </a>
  );
}
