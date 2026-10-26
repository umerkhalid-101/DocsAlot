// A small hand-written serializer: content/*.ts in, markdown out.
// Used by the Machine view, public/index.md and public/llms.txt, so they never drift.

import * as site from "@/content/site";
import { categories, failedChecks, leaderboard, leaderboardNote, scores, totalChecks } from "@/content/benchmark";
import { acme, apiBlock, chunks, llmsTxt, mcpCall, quickstart, skillMd, sources as demoSources } from "@/content/demo";

const ORIGIN = "https://docsalot.dev";

const link = (l: { label: string; href: string }) => `[${l.label.replace(/ →$/, "")}](${abs(l.href)})`;
const abs = (href: string) => (href.startsWith("#") ? `${ORIGIN}/${href}` : href.startsWith("mailto:") ? href.split("?")[0] : href);
const h2 = (lines: string[], id: string) => `## ${lines.join(" ")} {#${id}}`;
const fence = (body: string, lang = "") => "```" + lang + "\n" + body + "\n```";
const table = (head: string[], rows: (string | number)[][]) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const join = (...blocks: (string | false | undefined)[]) => blocks.filter(Boolean).join("\n\n");

export const quickstartMarkdown = (): string =>
  join(
    `# ${quickstart.title}`,
    `> ${quickstart.lede}`,
    ...quickstart.steps.map((s) => join(`## ${s.title} {#${s.id}}`, s.body, s.code && fence(s.code, s.lang))),
    `## ${quickstart.rateLimits.title} {#${quickstart.rateLimits.id}}`,
    quickstart.rateLimits.body,
  );

export type SectionKey =
  | "hero"
  | "sources"
  | "story"
  | "stories"
  | "how"
  | "surfaces"
  | "keepCurrent"
  | "setup"
  | "benchmark"
  | "pricing"
  | "faq"
  | "audit"
  | "footer";

export const sectionMarkdown: Record<SectionKey, () => string> = {
  hero: () => {
    const h = site.hero;
    return join(
      `# ${h.title.join(" ")}`,
      `> ${h.kicker}`,
      h.sub,
      `${link(h.primary)} · ${link(h.secondary)}`,
      fence(`$ ${h.install}`, "bash"),
      h.proof.map((p) => `- ${p}`).join("\n"),
      `![${h.readerAlt}](${acme.docsUrl})`,
      `_${h.caption}_`,
    );
  },

  sources: () => {
    const s = site.sources;
    return join(
      h2(s.title, s.id),
      s.body,
      `${link(s.primary)} · ${link(s.secondary)}`,
      table(
        ["Source", "Brings in", "Status"],
        s.integrations.map((i) => [i.name, i.kind, i.status]),
      ),
      `**Publishes:** ${s.outputs.join(", ")}`,
      `**${s.to.label}:** ${s.to.items.join(", ")}`,
    );
  },

  story: () => {
    const s = site.story;
    return join(
      h2(s.title, s.id),
      ...s.chapters.map((c, i) => `### ${c.time} · ${c.title}\n\n${c.body}\n\nstatus: ${s.status[i]}`),
      fence(`- ${s.commit.from}\n+ ${s.commit.to}`, "diff"),
      table(["Where", "Stale text"], s.staleSpots.map((x) => [x.where, x.text])),
    );
  },

  stories: () => {
    const s = site.stories;
    return join(
      h2(s.title, s.id),
      `_${s.note}_`,
      ...s.items.map((i) => join(`### ${i.who}: ${i.name}`, i.body, `**Outcome:** ${i.outcome}`)),
    );
  },

  how: () => {
    const h = site.how;
    return join(
      h2(h.title, h.id),
      h.steps.map((s, i) => `${i + 1}. **${s.title}** ${s.body}`).join("\n"),
      table(
        ["Source", "Format", "Status"],
        demoSources.map((s) => [s.name, s.format, s.status === "Queued" ? "Synced" : s.status]),
      ),
      table(
        ["Anchor", "Section", "Packaged into"],
        chunks.map((c) => [`\`${c.anchor}\``, c.label, c.target]),
      ),
    );
  },

  surfaces: () => {
    const s = site.surfaces;
    return join(
      h2(s.title, s.id),
      s.items.map((i) => `- **${i.name}** \`${i.at}\`: ${i.body}`).join("\n"),
      "### llms.txt",
      fence(llmsTxt, "markdown"),
      "### skill.md",
      fence(skillMd, "markdown"),
      "### Hosted MCP",
      fence(mcpCall, "json"),
      "### API reference",
      fence(`${apiBlock.method} ${apiBlock.path}\n\n${apiBlock.curl}`, "bash"),
    );
  },

  keepCurrent: () => {
    const k = site.keepCurrent;
    return join(
      h2(k.title, k.id),
      k.body,
      `> **User:** ${k.prompt}`,
      fence(k.tool, "ts"),
      ...k.diff.map((d) => `\`${d.file}\`\n\n${fence(d.lines.map((l) => `${l.op} ${l.text}`).join("\n"), "diff")}`),
      table(
        ["Surface", "URL", "Status"],
        k.targets.map((t) => [t.name, t.at, "updated"]),
      ),
      `**${k.final}**`,
      `_${k.note}_`,
    );
  },

  setup: () => {
    const s = site.setup;
    return join(
      h2(s.title, s.id),
      s.body,
      fence(s.commands.map((c) => `$ ${c}`).join("\n"), "bash"),
      `Prompt for your agent: \`${s.prompt}\``,
      s.links.map(link).join(" · "),
    );
  },

  benchmark: () => {
    const b = site.benchmark;
    return join(
      h2(b.title, b.id),
      b.body,
      `### Demo run: ${b.url}`,
      table(
        ["Category", "Checks", "Before", "With DocsAlot"],
        categories.map((c) => [c.name, c.checks, `${c.before}/${c.checks}`, `${c.after}/${c.checks}`]),
      ),
      `**Score:** ${scores.before} / 100 before, ${scores.after} / 100 with DocsAlot (${totalChecks} checks, demo data)`,
      `Failed checks: ${failedChecks.join("; ")}`,
      `### ${b.leaderboardTitle}`,
      table(
        ["Docs", "Domain", "Score"],
        leaderboard.map((r) => [r.name, r.domain, r.score]),
      ),
      `_${leaderboardNote}_`,
      `${link(b.cta)} · ${link(b.leaderboardCta)}`,
    );
  },

  pricing: () => {
    const p = site.pricing;
    return join(
      h2(p.title, p.id),
      p.sub,
      ...p.plans.map((plan) =>
        join(
          `### ${plan.name}: ${plan.price}${plan.per ? ` ${plan.per}` : ""}${plan.featured ? " (most teams)" : ""}`,
          plan.blurb,
          plan.features.map((f) => `- ${f}`).join("\n"),
          link(plan.cta),
        ),
      ),
      p.launch,
      link(p.compare),
    );
  },

  faq: () => {
    const f = site.faq;
    return join(
      h2(f.title, f.id),
      ...f.items.map((i) => join(`### ${i.q} {${i.anchor}}`, i.a, i.bullets.map((b) => `- ${b}`).join("\n"))),
    );
  },

  audit: () => {
    const a = site.audit;
    return join(h2(a.title, a.id), a.sub, `${link(a.primary)} · ${link(a.secondary)}`, a.meta);
  },

  footer: () => {
    const f = site.footer;
    return join(
      "---",
      `**DocsAlot.** ${f.tagline}`,
      ...f.groups.map((g) => `**${g.title}:** ${g.links.map(link).join(" · ")}`),
      f.social.map(link).join(" · "),
      f.copyright,
    );
  },
};

export const sectionOrder: SectionKey[] = [
  "hero",
  "sources",
  "story",
  "how",
  "surfaces",
  "setup",
  "benchmark",
  "stories",
  "pricing",
  "faq",
  "audit",
  "footer",
];

export const pageMarkdown = (): string =>
  [site.machine.banner, ...sectionOrder.map((k) => sectionMarkdown[k]())].join("\n\n") + "\n";

export const llmsTxtForConcept = (): string =>
  [
    "# DocsAlot",
    "",
    `> ${site.meta.description}`,
    "",
    "DocsAlot is documentation infrastructure for startups. One maintained source publishes hosted docs for people and the surfaces agents look for: llms.txt, skill.md, clean markdown, stable anchors and a hosted MCP server at mcp.docsalot.dev/yourco with search_docs, get_page and run_example.",
    "",
    "## Homepage",
    `- [Homepage as markdown](/index.md): the full homepage, generated from the same source as the designed page`,
    ...site.sectionsForLlms().map((s) => `- [${s.title}](/#${s.id}): ${s.summary}`),
    "",
    "## Product",
    `- [Try DocsAlot](${site.links.try}): start in the editor`,
    `- [Docs benchmark](${site.links.benchmark}): public benchmark of how agent-readable docs are, informed by AFDocs`,
    `- [Free hosted MCP server](${ORIGIN}/features/hosted-mcp-for-documentation): search_docs, get_page and run_example over your docs`,
    `- [CLI docs](${site.links.cliDocs}): install docsalot-cli and the DocsAlot skill`,
    `- [Pricing](${site.links.pricing}): Startup $39/month, Team $99/month, Enterprise custom, no per-seat charge`,
    "",
    "## Optional",
    `- [Book a demo](${site.links.demo}): 30 minutes with the founder`,
    `- [Blog](${site.links.blog})`,
    "",
  ].join("\n");
