"use client";

import { CornerDownLeft, FileText, Hash, Search, SquareTerminal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { docsChrome, docsNav, faq, links, nav, surfaces } from "@/content/site";
import { cn } from "@/lib/cn";
import { pageMarkdown } from "@/lib/toMarkdown";
import { useView } from "@/components/view/ViewProvider";

const allItems = docsNav.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));

export const openSearch = () => window.dispatchEvent(new Event("docsalot:search"));

/* ---------- ⌘K search ---------- */

type Result = { key: string; label: string; hint: string; kind: "section" | "link" | "action"; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const { toggle } = useView();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("docsalot:search", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("docsalot:search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      window.setTimeout(() => input.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.href = href;
    };
    const all: Result[] = [
      ...allItems.map((i) => ({ key: i.id, label: i.label, hint: `${i.group} · ${i.path}`, kind: "section" as const, run: go(`#${i.id}`) })),
      ...surfaces.items.map((s) => ({ key: `s-${s.id}`, label: s.name, hint: s.at, kind: "section" as const, run: go("#surfaces") })),
      ...faq.items.map((f) => ({ key: f.anchor, label: f.q, hint: `FAQ · ${f.anchor}`, kind: "section" as const, run: go(f.anchor) })),
      ...nav.product.docs.map((d) => ({ key: d.label, label: d.label, hint: "docsalot.dev", kind: "link" as const, run: go(d.href) })),
      { key: "try", label: "Try DocsAlot", hint: "Open the editor", kind: "link", run: go(links.try) },
      {
        key: "machine",
        label: "Toggle Human / Machine view",
        hint: "M",
        kind: "action",
        run: () => {
          setOpen(false);
          toggle();
        },
      },
      {
        key: "copy",
        label: "Copy page as markdown",
        hint: "for your agent",
        kind: "action",
        run: () => {
          setOpen(false);
          navigator.clipboard.writeText(pageMarkdown()).catch(() => {});
        },
      },
    ];
    const needle = q.trim().toLowerCase();
    if (!needle) return all.filter((r) => r.kind !== "section" || allItems.some((i) => i.id === r.key));
    return all.filter((r) => `${r.label} ${r.hint}`.toLowerCase().includes(needle)).slice(0, 10);
  }, [q, toggle]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    }
    if (e.key === "Enter") results[sel]?.run();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search this page"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-[560px] overflow-hidden rounded-panel border border-line bg-surface shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} strokeWidth={1.5} className="text-slate" aria-hidden />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search sections, FAQs, surfaces"
            aria-label="Search"
            className="h-12 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-slate/70"
          />
          <kbd className="t-mono-xs rounded-[2px] border border-line px-1.5 text-slate">esc</kbd>
        </div>
        <ul role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[14px] text-slate">{docsChrome.searchEmpty}</li>}
          {results.map((r, i) => (
            <li key={r.key} role="option" aria-selected={i === sel}>
              <button
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={r.run}
                className={cn("flex w-full cursor-pointer items-center gap-3 rounded-sq px-3 py-2.5 text-left", i === sel ? "bg-blue-soft" : "")}
              >
                {r.kind === "action" ? (
                  <SquareTerminal size={15} strokeWidth={1.5} className="shrink-0 text-slate" aria-hidden />
                ) : r.kind === "link" ? (
                  <FileText size={15} strokeWidth={1.5} className="shrink-0 text-slate" aria-hidden />
                ) : (
                  <Hash size={15} strokeWidth={1.5} className="shrink-0 text-slate" aria-hidden />
                )}
                <span className={cn("min-w-0 flex-1 truncate text-[14.5px]", i === sel ? "text-blue" : "text-ink")}>{r.label}</span>
                <span className="t-mono-xs shrink-0 text-slate">{r.hint}</span>
                {i === sel && <CornerDownLeft size={13} strokeWidth={1.5} className="shrink-0 text-blue" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
        <div className="t-mono-xs flex items-center gap-4 border-t border-line px-4 py-2 text-slate">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>M machine view</span>
        </div>
      </div>
    </div>
  );
}
