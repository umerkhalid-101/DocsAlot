/* eslint-disable @next/next/no-img-element -- Product Hunt's embed badges are meant to be loaded from their API */
import { productHuntBadges } from "@/content/site";
import { cn } from "@/lib/cn";

export function ProductHuntBadges({ ids, className }: { ids?: string[]; className?: string }) {
  const list = ids ? productHuntBadges.filter((b) => ids.includes(b.id)) : productHuntBadges;
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {list.map((b) => (
        <li key={b.id}>
          <a href={b.href} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
            <img src={b.src} alt={b.alt} width={200} height={43} loading="lazy" className="h-[43px] w-[200px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
