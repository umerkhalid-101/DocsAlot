import { brandByName } from "@/content/brands";
import { cn } from "@/lib/cn";

/** Official brand mark for a tool, drawn from its 24x24 path. `mono` uses the current text color. */
export function BrandLogo({ name, size = 16, mono = false, className }: { name: string; size?: number; mono?: boolean; className?: string }) {
  const brand = brandByName(name);
  if (!brand) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={cn("shrink-0", className)} style={{ fill: mono ? "currentColor" : brand.hex }}>
      <path d={brand.path} fillRule="evenodd" />
    </svg>
  );
}

/** The mark on a small white tile, so dark logos stay visible on dark bands. */
export function BrandTile({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  return (
    <span className={cn("tone-light grid shrink-0 place-items-center rounded-[7px] border-2 border-ink/15 bg-surface", className)} style={{ width: size + 12, height: size + 12 }}>
      <BrandLogo name={name} size={size} />
    </span>
  );
}
