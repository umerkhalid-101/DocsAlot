// Every piece of homepage copy lives here. The human page and the machine view
// (plus public/index.md and public/llms.txt) are both rendered from this file.

import { current, stale } from "./demo";

const live = "https://docsalot.dev";

export const links = {
  home: live,
  try: `${live}/editor`,
  signin: `${live}/signin?callbackUrl=/editor`,
  demo: "https://cal.com/faizan-khan-18shuq/30min",
  audit:
    "mailto:faizank@docsalot.dev?subject=DocsAlot%20AI%20Visibility%20Audit%20Request&body=Company%3A%0AWebsite%3A%0AWhat%20you%20want%20reviewed%3A%0A",
  benchmark: `${live}/benchmarks/docs`,
  leaderboard: `${live}/benchmarks`,
  productHunt: "https://www.producthunt.com/products/docsalot-2",
  cliDocs: "https://docsalot-docs.docsalot.dev/cli/install-and-auth",
  pricing: `${live}/pricing`,
  startup: `${live}/signin?callbackUrl=%2Fpricing%3FcheckoutPlan%3Dstartup%26checkoutReturnPath%3D%252F`,
  team: `${live}/signin?callbackUrl=%2Fpricing%3FcheckoutPlan%3Dteam%26checkoutReturnPath%3D%252F`,
  blog: `${live}/blog`,
  tools: `${live}/tools`,
  concept: "https://umerkhalid.co",
};

export type Link = { label: string; href: string; external?: boolean };
export type NavItem = { label: string; href: string; note?: string };

export const launchBar = {
  text: "DocsAlot is live on Product Hunt. 50% off your first 3 months with code PH50.",
  cta: { label: "Upvote →", href: links.productHunt, external: true } satisfies Link,
};

export const nav = {
  product: {
    label: "Product",
    docs: [
      { label: "Help Center", href: "https://docsalot-docs.docsalot.dev/quickstart", note: "Hosted onboarding docs for humans and support workflows." },
      { label: "API Docs", href: "https://docsalot-docs.docsalot.dev/api-reference/index", note: "Developer-facing reference, examples and playground flows." },
      { label: "Docs Benchmark", href: `${live}/benchmarks/docs`, note: "How documentation performs for AI readability and discovery." },
      { label: "Components", href: "https://docsalot-docs.docsalot.dev/components/accordion", note: "Reusable docs patterns, examples and implementation guidance." },
    ] satisfies NavItem[],
    features: [
      { label: "AI-readable docs", href: `${live}/features/ai-readable-documentation` },
      { label: "GitHub docs automation", href: `${live}/features/github-docs-automation` },
      { label: "API docs automation", href: `${live}/features/api-docs-automation` },
      { label: "Free hosted MCP server", href: `${live}/features/hosted-mcp-for-documentation` },
      { label: "MCP publishing readiness", href: `${live}/features/mcp-publishing-readiness` },
      { label: "llms.txt for docs", href: `${live}/features/llms-txt-for-docs` },
      { label: "CLIs for your SaaS", href: `${live}/features/clis-for-your-saas` },
      { label: "SDKs for your SaaS", href: `${live}/features/sdks-for-your-saas` },
      { label: "Help center + developer docs", href: `${live}/features/help-center-and-developer-docs` },
    ] satisfies NavItem[],
    all: { label: "All features →", href: `${live}/features` },
  },
  teams: {
    label: "For teams",
    items: [
      { label: "Founders", href: `${live}/for/founders`, note: "Documentation for founders." },
      { label: "Developer tools", href: `${live}/for/developer-tools`, note: "Documentation for developer-tools companies." },
      { label: "API companies", href: `${live}/for/api-companies`, note: "Documentation for API companies." },
      { label: "SaaS + agents", href: `${live}/for/saas-companies`, note: "For SaaS teams building for agent adoption." },
      { label: "Support teams", href: `${live}/for/support-teams`, note: "Documentation for support teams." },
    ] satisfies NavItem[],
    all: { label: "All team pages →", href: `${live}/for` },
  },
  links: [
    { label: "Pricing", href: "#pricing" },
    { label: "Benchmark", href: "#benchmark" },
    { label: "Blog", href: links.blog },
  ] satisfies Link[],
  signIn: { label: "Sign in", href: links.signin } satisfies Link,
  try: { label: "Try DocsAlot →", href: links.try } satisfies Link,
};

export const hero = {
  id: "top",
  path: "/",
  kicker: "For developer tools, API companies and SaaS teams",
  title: ["Your docs have two readers now.", "DocsAlot writes for both."],
  sub: "DocsAlot turns scattered help articles, API references and product notes into one source of truth. People get docs they trust. Agents get docs they can actually read.",
  primary: { label: "Try DocsAlot →", href: links.try } satisfies Link,
  secondary: { label: "Book a demo", href: links.demo, external: true } satisfies Link,
  install: "npm install -g docsalot-cli",
  installTooltip: "Copied. Your agent takes it from here.",
  proof: ["Free hosted MCP server", "llms.txt and skill.md included", "No per-seat pricing"],
  readerAlt:
    "Split reader: the Acme quickstart page, typeset for a person on the left and served as markdown to an agent on the right.",
  caption: "Same page. Same source. Two readers.",
};

export const sources = {
  id: "connect",
  path: "/connect",
  title: ["Connect once.", "Keep docs current across the places your team already works."],
  body: "DocsAlot pulls from code, support, product notes and API schemas, then publishes one maintained docs layer for humans and agents. Your hosted docs, llms.txt, skill.md and MCP tools stay tied to the same source.",
  primary: { label: "Connect your docs →", href: links.try } satisfies Link,
  secondary: { label: "Run an AI audit", href: `${live}/tools/docsagent-score` } satisfies Link,
  hub: { name: "DocsAlot", note: "one maintained docs layer" },
  integrations: [
    { name: "GitHub", kind: "READMEs and MDX", status: "synced" },
    { name: "OpenAPI", kind: "API schemas", status: "parsed" },
    { name: "Notion", kind: "product notes", status: "synced" },
    { name: "Intercom", kind: "help center", status: "mapped" },
    { name: "Zendesk", kind: "support macros", status: "mapped" },
    { name: "Confluence", kind: "internal docs", status: "synced" },
  ],
  outputs: ["Hosted docs", "llms.txt", "skill.md", "MCP tools"],
  from: { label: "Pulls from", items: ["GitHub", "OpenAPI", "Notion", "Intercom", "Zendesk", "Confluence"] },
  to: { label: "Read by", items: ["ChatGPT", "Claude", "Cursor", "Codex"] },
};

export type Span = { text: string; kind?: "code" | "stale" | "fresh" };
export type Answer = { lines: Span[][]; source: string };

export const why = {
  id: "why",
  path: "/why",
  title: ["Ask an agent about your product.", "See who it believes."],
  body: "Coding agents, AI search and support bots read your docs before any human asks for help. If the right page is hard to find or fetch, they answer from whatever they can find.",
  question: "How do I install the Acme SDK and what's the rate limit?",
  toggle: ["Before DocsAlot", "After DocsAlot"] as const,
  before: {
    lines: [
      [{ text: "Install the SDK with " }, { text: stale.install, kind: "stale" }, { text: ", then pass your key to the client." }],
      [{ text: "The API allows " }, { text: stale.rateLimit, kind: "stale" }, { text: " per key." }],
    ],
    source: stale.source,
  } as Answer,
  after: {
    lines: [
      [{ text: "Install the SDK with " }, { text: current.install, kind: "fresh" }, { text: ", then set " }, { text: "ACME_API_KEY", kind: "code" }, { text: "." }],
      [{ text: "The API allows " }, { text: current.rateLimit, kind: "fresh" }, { text: " per key." }],
    ],
    source: current.source,
  } as Answer,
  payoff: ["Your docs are already being read by agents.", "Make sure they read the right version."],
};

export const how = {
  id: "how",
  path: "/how",
  title: ["Three steps.", "From scattered to agent-ready."],
  sub: "No migration project. No new CMS to learn. Point DocsAlot at what you already have.",
  steps: [
    {
      tag: "Connect",
      title: "Connect your docs stack.",
      body: "Bring in GitHub docs, help-center articles, API references, READMEs, changelogs and product notes.",
      alt: "Files from GitHub, the help center, OpenAPI and Notion dropping into one acme-docs folder.",
    },
    {
      tag: "Package",
      title: "Package it for agents.",
      body: "DocsAlot creates stable anchors, clean markdown, llms.txt, skill.md and MCP-ready chunks from the same source.",
      alt: "One docs page splitting into anchored chunks for llms.txt, skill.md and MCP.",
    },
    {
      tag: "Publish",
      title: "Publish and keep current.",
      body: "Ship good-looking hosted docs, review diffs, and see what AI tools can actually find before onboarding breaks.",
      alt: "A live docs page with 3 onboarding gaps resolving to 0.",
    },
  ],
};

export type SurfaceId = "hosted" | "api" | "llms" | "skill" | "mcp" | "audit";

export const surfaces = {
  id: "surfaces",
  path: "/surfaces",
  title: ["One source.", "Every surface people and agents look for."],
  sourceLabel: "Source",
  items: [
    { id: "hosted", name: "Hosted docs", at: "/quickstart", body: "A polished docs site for quickstarts, guides, API references and support flows." },
    { id: "api", name: "API reference", at: "/api/authentication", body: "OpenAPI, auth, SDK notes and runnable snippets developers trust on first read." },
    { id: "llms", name: "llms.txt", at: "/llms.txt", body: "A compact map that tells ChatGPT, Claude and Cursor where your real docs live." },
    { id: "skill", name: "skill.md", at: "/skill.md", body: "A packaged guide agents load with tasks, examples and your product rules." },
    { id: "mcp", name: "Hosted MCP", at: "mcp.docsalot.dev/acme", body: "search_docs, get_page and run_example, hosted for you. No infra to wire." },
    { id: "audit", name: "AI visibility audit", at: "/benchmark", body: "See which docs agents can cite, where answers drift, and what to fix next." },
  ] satisfies { id: SurfaceId; name: string; at: string; body: string }[],
};

export const keepCurrent = {
  id: "keep-current",
  path: "/keep-current",
  title: ["Docs that keep up.", "Just ask."],
  body: "Maintain your help center by asking Claude or Codex. DocsAlot drafts the change, shows you the diff, and publishes it to every surface at once.",
  prompt: "Our rate limit is now 1,000 requests per minute. Update the docs.",
  tool: 'docsalot.update_page("/api/rate-limits")',
  diff: [
    {
      file: "/api/rate-limits",
      lines: [
        { op: " ", text: "## Rate limits" },
        { op: "-", text: stale.rateLimitShort },
        { op: "+", text: current.rateLimitShort },
        { op: " ", text: "Requests over the limit return 429." },
      ],
    },
    {
      file: "/support/macros/rate-limit-reply",
      lines: [
        { op: "-", text: `"You can send up to ${stale.rateLimitShort}."` },
        { op: "+", text: `"You can send up to ${current.rateLimitShort}."` },
      ],
    },
  ] as { file: string; lines: { op: " " | "-" | "+"; text: string }[] }[],
  publish: "Publish",
  published: "Published",
  targets: [
    { name: "Hosted docs", at: "acme.dev/docs/api/rate-limits" },
    { name: "llms.txt", at: "acme.dev/llms.txt" },
    { name: "skill.md", at: "acme.dev/skill.md" },
    { name: "MCP", at: "mcp.docsalot.dev/acme" },
  ],
  final: "1 edit. 4 surfaces. 0 drift.",
  note: "Every change goes through preview, review and publish. Nothing ships without you.",
  replay: "Play again",
};

export const setup = {
  id: "setup",
  path: "/setup",
  title: ["Install the CLI.", "Then just ask your agent."],
  body: "Follow the guided onboarding, or give your coding agent the DocsAlot skill and let it write your first docs straight from the repo.",
  commands: ["npm install -g docsalot-cli", "docsalot --version", "docsalot skills install"],
  prompt: "use docsalot cli to create docs for my project",
  copyPrompt: "Copy prompt",
  terminal: [
    { kind: "cmd", text: "npm install -g docsalot-cli" },
    { kind: "out", text: "added 1 package in 2s" },
    { kind: "cmd", text: "docsalot skills install" },
    { kind: "ok", text: "skill installed for your agent" },
    { kind: "agent", text: "use docsalot cli to create docs for my project" },
    { kind: "out", text: "reading repo … README.md  src/  openapi.yaml  CHANGELOG.md" },
    { kind: "out", text: "drafting … quickstart  authentication  api reference  errors" },
    { kind: "out", text: "packaging … llms.txt  skill.md  mcp chunks" },
    { kind: "ok", text: "12 pages ready for review" },
  ] as { kind: "cmd" | "out" | "ok" | "agent"; text: string }[],
  links: [
    { label: "Follow onboarding →", href: links.try },
    { label: "Read CLI docs", href: links.cliDocs },
  ] satisfies Link[],
};

export const benchmark = {
  id: "benchmark",
  path: "/benchmark",
  title: ["Before an agent reads your docs,", "check the benchmark."],
  body: "A public benchmark that tests whether an agent can find the right page, fetch clean text, follow the instructions and recover when docs get fuzzy. Informed by the open AFDocs spec.",
  url: "docs.acme.dev",
  run: "Run benchmark",
  withDocsAlot: "With DocsAlot",
  demoNote: "Demo run. Get your real score on the live benchmark.",
  cta: { label: "Run it on your docs →", href: links.benchmark } satisfies Link,
  leaderboardTitle: "From the public leaderboard",
  leaderboardCta: { label: "Explore the leaderboard →", href: links.benchmark } satisfies Link,
};

export const pricing = {
  id: "pricing",
  path: "/pricing",
  title: ["Simple pricing for docs", "that maintain themselves."],
  sub: "Every plan includes hosted docs, llms.txt, skill.md and AI-ready publishing. No per-seat charge for collaborators.",
  plans: [
    {
      name: "Startup",
      price: "$39",
      per: "/ month",
      blurb: "For solo founders and small SaaS teams launching one public docs site with MCP.",
      features: [
        "1 public docs site with startup traffic capacity",
        "Hosted MCP endpoint",
        "AI help-center updates",
        "Basic source integrations",
        "llms.txt and skill.md exports",
        "No per-seat charge for collaborators",
      ],
      cta: { label: "Start with Startup", href: links.startup } satisfies Link,
      featured: false,
    },
    {
      name: "Team",
      price: "$99",
      per: "/ month",
      blurb: "For teams running production docs and MCP traffic on their domain.",
      features: [
        "Everything in Startup",
        "Custom domain and subfolder hosting",
        "Private docs and authenticated help centers",
        "250 included AI messages per month",
        "Five included languages",
        "Preview, review and publish workflows",
      ],
      cta: { label: "Start with Team →", href: links.team } satisfies Link,
      featured: true,
      tag: "Most teams",
    },
    {
      name: "Enterprise",
      price: "Custom",
      per: "",
      blurb: "For teams that want migration help, controls, audits and a scoped AI onboarding program.",
      features: [
        "Everything in Team",
        "Done-for-you docs migration",
        "Self-correcting docs and drift checks",
        "SDK generation and maintenance",
        "SSO, custom integrations, priority support",
        "AI visibility audits and benchmark reviews",
      ],
      cta: { label: "Book onboarding call", href: links.demo, external: true } satisfies Link,
      featured: false,
    },
  ],
  launch: "Product Hunt launch: 50% off the first 3 months with code PH50.",
  compare: { label: "Compare every feature →", href: links.pricing } satisfies Link,
};

export const faq = {
  id: "faq",
  path: "/faq",
  title: ["Questions technical buyers", "ask first."],
  items: [
    {
      anchor: "#llms-txt",
      q: "What is llms.txt and why do I need it?",
      a: "llms.txt is an emerging standard: a compact table of contents at your site root that gives LLMs a canonical map of your docs. When someone asks ChatGPT, Claude or a coding agent about your product, it routes them to your real pages instead of stale snippets.",
      bullets: ["Lists canonical docs paths and summaries", "Prioritizes quickstarts, guides and API references", "Gives agents a stable starting point for answers"],
    },
    {
      anchor: "#mcp",
      q: "What's different about DocsAlot's MCP server?",
      a: "Every DocsAlot project gets a hosted MCP endpoint at mcp.docsalot.dev/yourco. Your team wires no infrastructure: the server reads from the same maintained docs you publish for people.",
      bullets: ["search_docs for retrieval", "get_page for exact source text", "run_example for guided examples and snippets"],
    },
    {
      anchor: "#migration",
      q: "Do you support migration from Intercom, Zendesk or Notion?",
      a: "Yes. The done-for-you Docs Pack imports support articles, internal notes, READMEs, raw markdown, Confluence spaces and Google Docs into a clean DocsAlot tree, scoped around your sources, volume and launch date.",
      bullets: ["Normalize messy content into a navigable structure", "Preserve support knowledge and product context", "Review the final IA with your team before launch"],
    },
    {
      anchor: "#cms",
      q: "Is this just a CMS?",
      a: "No. A CMS publishes pages. DocsAlot publishes a full AI onboarding surface: human-readable docs, llms.txt, skill.md, hosted MCP tools and audit signals that show where AI answers still drift.",
      bullets: ["One source for humans and agents", "Agent-readable exports generated from the same docs", "Visibility checks so teams can fix what agents miss"],
    },
    {
      anchor: "#custom-domain",
      q: "Can I host on my own domain?",
      a: "Yes. Team and Enterprise customers can host on a subdomain of their choice, such as docs.yourco.com. SSL is automatic, and the agent-facing outputs stay attached to the same published docs.",
      bullets: ["Custom docs subdomain", "Automatic SSL", "Same source for hosted docs, llms.txt and MCP"],
    },
    {
      anchor: "#ai-audit",
      q: "What does the free AI visibility audit include?",
      a: "We run your domain through the checks we use internally: whether it has llms.txt, whether the IA is agent-legible, whether MCP-style retrieval would work, and which high-intent prompts your docs currently miss.",
      bullets: ["A 4 to 6 page report with practical fixes", "Prompt and citation gaps agents struggle with", "Recommendations you can ship with or without DocsAlot"],
    },
  ],
};

export const audit = {
  id: "audit",
  path: "/audit",
  title: ["Your docs are already being read.", "Make sure it's the right version."],
  sub: "Get a free AI visibility audit: a 4 to 6 page report on what agents can find, cite and miss, with fixes you can ship with or without DocsAlot.",
  primary: { label: "Request AI audit →", href: links.audit } satisfies Link,
  secondary: { label: "Try DocsAlot", href: links.try } satisfies Link,
  meta: "48h turnaround · no credit card · migration help available",
};

export const footer = {
  id: "footer",
  path: "/footer",
  tagline: "Documentation infrastructure for founders who want docs that compound, not accumulate.",
  groups: [
    {
      title: "Company",
      links: [
        { label: "Pricing", href: `${live}/pricing` },
        { label: "Docs benchmark", href: `${live}/benchmarks` },
        { label: "Changelog", href: `${live}/changelog` },
        { label: "Terms of Service", href: `${live}/terms-and-conditions` },
        { label: "Privacy Policy", href: `${live}/privacy-policy` },
        { label: "Support", href: "mailto:faizank@docsalot.dev" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "https://docs.docsalot.dev" },
        { label: "API docs", href: "https://docs.docsalot.dev/api-reference/index" },
        { label: "docsalot-cli", href: "https://docs.docsalot.dev/cli/index" },
        { label: "Components", href: "https://docs.docsalot.dev/components/accordion" },
        { label: "Affiliate programme", href: "https://docs.docsalot.dev/partners/affiliates" },
        { label: "Hey AI, learn about us", href: `${live}/llms.txt` },
        { label: "All tools →", href: `${live}/tools` },
      ],
    },
    {
      title: "Compare",
      links: [
        { label: "vs Mintlify", href: `${live}/compare/the-top-mintlify-alternative` },
        { label: "vs GitBook", href: `${live}/compare/the-top-gitbook-alternative` },
        { label: "vs Docusaurus", href: `${live}/compare/the-top-docusaurus-alternative` },
        { label: "vs Fumadocs", href: `${live}/compare/the-top-fumadocs-alternative` },
        { label: "vs Starlight", href: `${live}/compare/the-top-starlight-alternative` },
        { label: "All comparisons →", href: `${live}/compare` },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "AI-readable docs", href: `${live}/features/ai-readable-documentation` },
        { label: "API docs automation", href: `${live}/features/api-docs-automation` },
        { label: "CLIs for your SaaS", href: `${live}/features/clis-for-your-saas` },
        { label: "MCP for your SaaS", href: `${live}/features/hosted-mcp-for-documentation` },
        { label: "SDKs for your SaaS", href: `${live}/features/sdks-for-your-saas` },
        { label: "All features →", href: `${live}/features` },
      ],
    },
    {
      title: "For teams",
      links: [
        { label: "Founders", href: `${live}/for/founders` },
        { label: "Developer tools", href: `${live}/for/developer-tools` },
        { label: "API companies", href: `${live}/for/api-companies` },
        { label: "SaaS + agents", href: `${live}/for/saas-companies` },
        { label: "Support teams", href: `${live}/for/support-teams` },
        { label: "All team pages →", href: `${live}/for` },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  social: [
    { label: "GitHub", href: "https://github.com/slashml/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/eff-kay/" },
    { label: "X", href: "https://x.com/faizan10114" },
    { label: "Discord", href: "https://discord.gg/Dp6EpTv4BU" },
  ] satisfies Link[],
  copyright: "© 2026 DocsAlot. All rights reserved.",
  coffee: "built in a coffee shop",
};

export const machine = {
  banner: "<!-- generated from the same source as the human page -->",
  chip: "This is what ChatGPT, Claude and Cursor read.",
  copy: "Copy as markdown",
  copied: "Copied",
  announceMachine: "Machine view, showing the page as agents read it",
  announceHuman: "Human view, showing the designed page",
  flipMe: "flip me",
};

export const concept = {
  label: "Redesign concept by Umar Khalid",
  href: links.concept,
};

export const meta = {
  title: "DocsAlot: docs for people and agents",
  description:
    "DocsAlot turns scattered help articles, API references and product notes into one source of truth: hosted docs for people, plus llms.txt, skill.md, clean markdown and a free hosted MCP server for agents.",
  url: "https://docsalot.dev",
};

export const sectionsForLlms = () => [
  { id: story.id, title: story.title.join(" "), summary: story.chapters.map((c) => c.title).join(" ") },
  { id: how.id, title: how.title.join(" "), summary: how.steps.map((s) => s.title).join(" ") },
  { id: surfaces.id, title: surfaces.title.join(" "), summary: surfaces.items.map((s) => s.name).join(", ") },
  { id: stories.id, title: stories.title.join(" "), summary: stories.items.map((i) => `${i.who}: ${i.name}`).join(" ") },
  { id: setup.id, title: setup.title.join(" "), summary: setup.body },
  { id: benchmark.id, title: benchmark.title.join(" "), summary: benchmark.body },
  { id: pricing.id, title: pricing.title.join(" "), summary: pricing.sub },
  { id: faq.id, title: faq.title.join(" "), summary: faq.items.map((i) => i.q).join(" ") },
];

export type DocsNavItem = { id: string; label: string; path: string };

export const docsNav: { group: string; items: DocsNavItem[] }[] = [
  {
    group: "Getting started",
    items: [
      { id: "top", label: "Overview", path: "/" },
      { id: "connect", label: "Connect once", path: "/connect" },
      { id: "story", label: "The story", path: "/story" },
      { id: "how", label: "How it works", path: "/how" },
    ],
  },
  {
    group: "Product",
    items: [
      { id: "surfaces", label: "Output surfaces", path: "/surfaces" },
      { id: "setup", label: "Agentic setup", path: "/setup" },
      { id: "stories", label: "Team stories", path: "/stories" },
    ],
  },
  {
    group: "Proof",
    items: [{ id: "benchmark", label: "Docs benchmark", path: "/benchmark" }],
  },
  {
    group: "Plans",
    items: [
      { id: "pricing", label: "Pricing", path: "/pricing" },
      { id: "faq", label: "FAQ", path: "/faq" },
      { id: "audit", label: "Free AI audit", path: "/audit" },
    ],
  },
];

export const docsChrome = {
  space: "DocsAlot",
  version: "Homepage",
  search: "Search this page",
  searchEmpty: "No matches. Try “mcp” or “pricing”.",
  copyPage: "Copy page",
  viewMarkdown: "View as markdown",
  lastUpdated: "Last updated Oct 2026",
  helpful: "Docs for people. Markdown for agents. Same page.",
  next: { label: "Try DocsAlot", note: "Connect your docs stack in the editor", href: links.try },
};

export const story = {
  id: "story",
  path: "/story",
  title: ["A rate limit changes.", "Watch who finds out."],
  sub: "One product change. Five moments in the life of your docs.",
  stops: ["Shipped in code", "Docs drift", "An agent answers", "Fixed by asking", "Every surface updated"],
  features: ["Changelog", "Drift check", "Agent answer", "Ask to edit", "Publish everywhere"],
  chapters: [
    {
      time: "Tue 16:02",
      title: "Acme ships a new rate limit.",
      body: "Engineering raises the API limit from 100 to 1,000 requests per minute. The code is live. The changelog is merged.",
    },
    {
      time: "Tue 16:03",
      title: "The docs don't know yet.",
      body: "The API reference, a help-center macro and an old forum answer still say 100. Nobody gets paged for stale docs.",
    },
    {
      time: "Tue 16:40",
      title: "An agent answers first.",
      body: "A developer asks their coding agent how to integrate. It can't fetch clean docs, so it cites a 2023 forum post. Wrong package, wrong limit.",
    },
    {
      time: "Tue 16:41",
      title: "You ask DocsAlot to fix it.",
      body: "One sentence to Claude or Codex. DocsAlot finds every page that mentions the limit, drafts the change and shows you the diff.",
    },
    {
      time: "Tue 16:42",
      title: "Every reader gets the new version.",
      body: "Hosted docs, llms.txt, skill.md and MCP update together. The next agent answer cites your quickstart.",
    },
  ],
  status: ["in sync", "drifting", "wrong answer", "fixing", "in sync"],
  commit: { title: "feat(api): raise default rate limit", from: "RATE_LIMIT = 100", to: "RATE_LIMIT = 1_000" },
  staleSpots: [
    { where: "docs / api / rate-limits", text: "100 requests/min" },
    { where: "help center / macro", text: "up to 100 requests/min" },
    { where: "forum / 2023", text: "limit is 100 per minute" },
  ],
};

export const stories = {
  id: "stories",
  path: "/stories",
  title: ["Three teams.", "One source of truth."],
  note: "Example scenarios built on the fictional Acme. Not customer quotes.",
  items: [
    {
      id: "founder",
      who: "Founder",
      name: "Docs shipped before launch day.",
      body: "A two-person team installs the CLI, gives their coding agent the DocsAlot skill, and reviews a quickstart, API reference and llms.txt before the Product Hunt post goes out.",
      outcome: "12 pages from one repo, reviewed in an afternoon",
    },
    {
      id: "api",
      who: "API company",
      name: "OpenAPI in. Answers out.",
      body: "The OpenAPI spec becomes reference pages, runnable snippets and a hosted MCP server. Agents call search_docs instead of guessing endpoints.",
      outcome: "1 spec, 4 surfaces, no infra to run",
    },
    {
      id: "support",
      who: "Support team",
      name: "The same ticket, answered once.",
      body: "Help-center articles move from Zendesk into one tree. When the product changes, support asks for the update in plain English and every macro follows.",
      outcome: "Macros, docs and agents say the same thing",
    },
  ],
};

// Fictional agent requests to the Acme demo docs, shown in the traffic ticker.
export const traffic = {
  label: "agent traffic on acme.dev, simulated",
  rowA: [
    { method: "GET", path: "/llms.txt", status: 200, agent: "claude" },
    { method: "GET", path: "/docs/quickstart.md", status: 200, agent: "chatgpt" },
    { method: "TOOL", path: "search_docs(\"rate limit\")", status: 200, agent: "cursor" },
    { method: "GET", path: "/skill.md", status: 200, agent: "codex" },
    { method: "GET", path: "/docs/api/refunds.md", status: 200, agent: "claude" },
    { method: "TOOL", path: "get_page(\"/webhooks\")", status: 200, agent: "chatgpt" },
  ],
  rowB: [
    { method: "GET", path: "/docs/authentication.md", status: 200, agent: "cursor" },
    { method: "TOOL", path: "run_example(\"create-payment\")", status: 200, agent: "codex" },
    { method: "GET", path: "/docs/errors.md", status: 200, agent: "chatgpt" },
    { method: "GET", path: "/sitemap.xml", status: 200, agent: "claude" },
    { method: "TOOL", path: "search_docs(\"webhook retries\")", status: 200, agent: "cursor" },
    { method: "GET", path: "/docs/api/rate-limits.md", status: 200, agent: "codex" },
  ],
};

// Official Product Hunt embed badges, as shown on docsalot.dev.
export const productHuntBadges = [
  {
    id: "featured",
    alt: "DocsAlot MCP Connector, featured on Product Hunt",
    src: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1264719&theme=light",
    href: "https://www.producthunt.com/products/docsalot-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-docsalot-mcp-connector",
  },
  {
    id: "top-post",
    alt: "DocsAlot, top post on Product Hunt",
    src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1185912&theme=light&period=daily",
    href: "https://www.producthunt.com/products/docsalot-2?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-docsalot",
  },
  {
    id: "visual-editor",
    alt: "DocsAlot Visual Editor, top post on Product Hunt",
    src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1241597&theme=neutral&period=daily",
    href: "https://www.producthunt.com/products/docsalot-2?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-docsalot-visual-editor-2",
  },
  {
    id: "topic-week",
    alt: "DocsAlot, top post of the week in its topic on Product Hunt",
    src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=1185912&theme=light&period=weekly&topic_id=237",
    href: "https://www.producthunt.com/products/docsalot-2?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_campaign=badge-docsalot",
  },
];
