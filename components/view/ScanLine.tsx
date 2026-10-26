"use client";

import { useView } from "./ViewProvider";

export function ScanLine() {
  const { scanRef } = useView();
  return (
    <div
      ref={scanRef}
      aria-hidden
      data-dir="down"
      className="group pointer-events-none fixed inset-x-0 top-0 z-[70] h-px opacity-0 will-change-transform"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-blue" />
      <div className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-transparent to-blue/25 group-data-[dir=up]:top-px group-data-[dir=up]:bg-gradient-to-t" />
      <div className="t-mono-xs absolute right-5 top-1.5 rounded-sq bg-blue px-1.5 py-0.5 text-on-blue group-data-[dir=up]:-top-6">
        <span className="group-data-[dir=up]:hidden">rendering for agents</span>
        <span className="hidden group-data-[dir=up]:inline">rendering for people</span>
      </div>
    </div>
  );
}
