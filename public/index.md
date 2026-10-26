<!-- generated from the same source as the human page -->

# Your docs have two readers now. DocsAlot writes for both.

> For developer tools, API companies and SaaS teams

DocsAlot turns scattered help articles, API references and product notes into one source of truth. People get docs they trust. Agents get docs they can actually read.

[Try DocsAlot](https://docsalot.dev/editor) · [Book a demo](https://cal.com/faizan-khan-18shuq/30min)

```bash
$ npm install -g docsalot-cli
```

- Free hosted MCP server
- llms.txt and skill.md included
- No per-seat pricing

![Split reader: the Acme quickstart page, typeset for a person on the left and served as markdown to an agent on the right.](acme.dev/docs/quickstart)

_Same page. Same source. Two readers._

## Connect once. Keep docs current across the places your team already works. {#connect}

DocsAlot pulls from code, support, product notes and API schemas, then publishes one maintained docs layer for humans and agents. Your hosted docs, llms.txt, skill.md and MCP tools stay tied to the same source.

[Connect your docs](https://docsalot.dev/editor) · [Run an AI audit](https://docsalot.dev/tools/docsagent-score)

| Source | Brings in | Status |
| --- | --- | --- |
| GitHub | READMEs and MDX | synced |
| OpenAPI | API schemas | parsed |
| Notion | product notes | synced |
| Intercom | help center | mapped |
| Zendesk | support macros | mapped |
| Confluence | internal docs | synced |

**Publishes:** Hosted docs, llms.txt, skill.md, MCP tools

**Read by:** ChatGPT, Claude, Cursor, Codex

## A rate limit changes. Watch who finds out. {#story}

### Tue 16:02 · Acme ships a new rate limit.

Engineering raises the API limit from 100 to 1,000 requests per minute. The code is live. The changelog is merged.

status: in sync

### Tue 16:03 · The docs don't know yet.

The API reference, a help-center macro and an old forum answer still say 100. Nobody gets paged for stale docs.

status: drifting

### Tue 16:40 · An agent answers first.

A developer asks their coding agent how to integrate. It can't fetch clean docs, so it cites a 2023 forum post. Wrong package, wrong limit.

status: wrong answer

### Tue 16:41 · You ask DocsAlot to fix it.

One sentence to Claude or Codex. DocsAlot finds every page that mentions the limit, drafts the change and shows you the diff.

status: fixing

### Tue 16:42 · Every reader gets the new version.

Hosted docs, llms.txt, skill.md and MCP update together. The next agent answer cites your quickstart.

status: in sync

```diff
- RATE_LIMIT = 100
+ RATE_LIMIT = 1_000
```

| Where | Stale text |
| --- | --- |
| docs / api / rate-limits | 100 requests/min |
| help center / macro | up to 100 requests/min |
| forum / 2023 | limit is 100 per minute |

## Three steps. From scattered to agent-ready. {#how}

1. **Connect your docs stack.** Bring in GitHub docs, help-center articles, API references, READMEs, changelogs and product notes.
2. **Package it for agents.** DocsAlot creates stable anchors, clean markdown, llms.txt, skill.md and MCP-ready chunks from the same source.
3. **Publish and keep current.** Ship good-looking hosted docs, review diffs, and see what AI tools can actually find before onboarding breaks.

| Source | Format | Status |
| --- | --- | --- |
| GitHub docs | MDX | Synced |
| Help center | HTML | Mapped |
| API reference | OpenAPI | Parsed |
| Product notes | Notion | Synced |

| Anchor | Section | Packaged into |
| --- | --- | --- |
| `#install` | Install | llms.txt |
| `#authenticate` | Authenticate | skill.md |
| `#first-request` | First request | mcp chunk |
| `#rate-limits` | Rate limits | mcp chunk |

## One source. Every surface people and agents look for. {#surfaces}

- **Hosted docs** `/quickstart`: A polished docs site for quickstarts, guides, API references and support flows.
- **API reference** `/api/authentication`: OpenAPI, auth, SDK notes and runnable snippets developers trust on first read.
- **llms.txt** `/llms.txt`: A compact map that tells ChatGPT, Claude and Cursor where your real docs live.
- **skill.md** `/skill.md`: A packaged guide agents load with tasks, examples and your product rules.
- **Hosted MCP** `mcp.docsalot.dev/acme`: search_docs, get_page and run_example, hosted for you. No infra to wire.
- **AI visibility audit** `/benchmark`: See which docs agents can cite, where answers drift, and what to fix next.

### llms.txt

```markdown
# Acme
> Payments API for developers. Accept payments, manage customers, handle webhooks.

## Docs
- [Quickstart](https://acme.dev/docs/quickstart): install the SDK, first payment
- [Authentication](https://acme.dev/docs/authentication): API keys and scopes
- [Rate limits](https://acme.dev/docs/api/rate-limits): 1,000 requests per minute
- [API reference](https://acme.dev/docs/api): every endpoint, from OpenAPI
```

### skill.md

```markdown
---
name: acme
description: Build and debug Acme payment integrations.
---
## When to use
Any task that touches Acme payments, customers or webhooks.
## Rules
- Install `@acme/sdk`. Never `acme-sdk@1`.
```

### Hosted MCP

```json
> search_docs({ "query": "rate limit" })
< {
    "path": "/api/rate-limits",
    "title": "Rate limits",
    "snippet": "Each API key can make 1,000 requests per minute."
  }
```

### API reference

```bash
GET /v1/payments/{id}

curl https://api.acme.dev/v1/payments/pay_123 \
  -H "Authorization: Bearer $ACME_API_KEY"
```

## Install the CLI. Then just ask your agent. {#setup}

Follow the guided onboarding, or give your coding agent the DocsAlot skill and let it write your first docs straight from the repo.

```bash
$ npm install -g docsalot-cli
$ docsalot --version
$ docsalot skills install
```

Prompt for your agent: `use docsalot cli to create docs for my project`

[Follow onboarding](https://docsalot.dev/editor) · [Read CLI docs](https://docsalot-docs.docsalot.dev/cli/install-and-auth)

## Before an agent reads your docs, check the benchmark. {#benchmark}

A public benchmark that tests whether an agent can find the right page, fetch clean text, follow the instructions and recover when docs get fuzzy. Informed by the open AFDocs spec.

### Demo run: docs.acme.dev

| Category | Checks | Before | With DocsAlot |
| --- | --- | --- | --- |
| Content discoverability | 6 | 3/6 | 6/6 |
| Markdown availability | 2 | 0/2 | 2/2 |
| Page size and truncation risk | 4 | 3/4 | 4/4 |
| Content structure | 3 | 2/3 | 3/3 |
| URL stability and redirects | 2 | 1/2 | 2/2 |
| Observability and content health | 3 | 1/3 | 2/3 |
| Authentication and access | 2 | 2/2 | 2/2 |

**Score:** 41 / 100 before, 96 / 100 with DocsAlot (22 checks, demo data)

Failed checks: No llms.txt found; No markdown version of pages; Key docs links redirect twice

### From the public leaderboard

| Docs | Domain | Score |
| --- | --- | --- |
| Snowflake | docs.snowflake.com | 100 |
| Fern | buildwithfern.com/learn | 98 |
| Runpod | docs.runpod.io | 98 |
| Merge | docs.merge.dev | 98 |
| Postman | learning.postman.com | 96 |

_274 docs benchmarked, Oct 2026_

[Run it on your docs](https://docsalot.dev/benchmarks/docs) · [Explore the leaderboard](https://docsalot.dev/benchmarks/docs)

## Three teams. One source of truth. {#stories}

_Example scenarios built on the fictional Acme. Not customer quotes._

### Founder: Docs shipped before launch day.

A two-person team installs the CLI, gives their coding agent the DocsAlot skill, and reviews a quickstart, API reference and llms.txt before the Product Hunt post goes out.

**Outcome:** 12 pages from one repo, reviewed in an afternoon

### API company: OpenAPI in. Answers out.

The OpenAPI spec becomes reference pages, runnable snippets and a hosted MCP server. Agents call search_docs instead of guessing endpoints.

**Outcome:** 1 spec, 4 surfaces, no infra to run

### Support team: The same ticket, answered once.

Help-center articles move from Zendesk into one tree. When the product changes, support asks for the update in plain English and every macro follows.

**Outcome:** Macros, docs and agents say the same thing

## Simple pricing for docs that maintain themselves. {#pricing}

Every plan includes hosted docs, llms.txt, skill.md and AI-ready publishing. No per-seat charge for collaborators.

### Startup: $39 / month

For solo founders and small SaaS teams launching one public docs site with MCP.

- 1 public docs site with startup traffic capacity
- Hosted MCP endpoint
- AI help-center updates
- Basic source integrations
- llms.txt and skill.md exports
- No per-seat charge for collaborators

[Start with Startup](https://docsalot.dev/signin?callbackUrl=%2Fpricing%3FcheckoutPlan%3Dstartup%26checkoutReturnPath%3D%252F)

### Team: $99 / month (most teams)

For teams running production docs and MCP traffic on their domain.

- Everything in Startup
- Custom domain and subfolder hosting
- Private docs and authenticated help centers
- 250 included AI messages per month
- Five included languages
- Preview, review and publish workflows

[Start with Team](https://docsalot.dev/signin?callbackUrl=%2Fpricing%3FcheckoutPlan%3Dteam%26checkoutReturnPath%3D%252F)

### Enterprise: Custom

For teams that want migration help, controls, audits and a scoped AI onboarding program.

- Everything in Team
- Done-for-you docs migration
- Self-correcting docs and drift checks
- SDK generation and maintenance
- SSO, custom integrations, priority support
- AI visibility audits and benchmark reviews

[Book onboarding call](https://cal.com/faizan-khan-18shuq/30min)

Product Hunt launch: 50% off the first 3 months with code PH50.

[Compare every feature](https://docsalot.dev/pricing)

## Questions technical buyers ask first. {#faq}

### What is llms.txt and why do I need it? {#llms-txt}

llms.txt is an emerging standard: a compact table of contents at your site root that gives LLMs a canonical map of your docs. When someone asks ChatGPT, Claude or a coding agent about your product, it routes them to your real pages instead of stale snippets.

- Lists canonical docs paths and summaries
- Prioritizes quickstarts, guides and API references
- Gives agents a stable starting point for answers

### What's different about DocsAlot's MCP server? {#mcp}

Every DocsAlot project gets a hosted MCP endpoint at mcp.docsalot.dev/yourco. Your team wires no infrastructure: the server reads from the same maintained docs you publish for people.

- search_docs for retrieval
- get_page for exact source text
- run_example for guided examples and snippets

### Do you support migration from Intercom, Zendesk or Notion? {#migration}

Yes. The done-for-you Docs Pack imports support articles, internal notes, READMEs, raw markdown, Confluence spaces and Google Docs into a clean DocsAlot tree, scoped around your sources, volume and launch date.

- Normalize messy content into a navigable structure
- Preserve support knowledge and product context
- Review the final IA with your team before launch

### Is this just a CMS? {#cms}

No. A CMS publishes pages. DocsAlot publishes a full AI onboarding surface: human-readable docs, llms.txt, skill.md, hosted MCP tools and audit signals that show where AI answers still drift.

- One source for humans and agents
- Agent-readable exports generated from the same docs
- Visibility checks so teams can fix what agents miss

### Can I host on my own domain? {#custom-domain}

Yes. Team and Enterprise customers can host on a subdomain of their choice, such as docs.yourco.com. SSL is automatic, and the agent-facing outputs stay attached to the same published docs.

- Custom docs subdomain
- Automatic SSL
- Same source for hosted docs, llms.txt and MCP

### What does the free AI visibility audit include? {#ai-audit}

We run your domain through the checks we use internally: whether it has llms.txt, whether the IA is agent-legible, whether MCP-style retrieval would work, and which high-intent prompts your docs currently miss.

- A 4 to 6 page report with practical fixes
- Prompt and citation gaps agents struggle with
- Recommendations you can ship with or without DocsAlot

## Your docs are already being read. Make sure it's the right version. {#audit}

Get a free AI visibility audit: a 4 to 6 page report on what agents can find, cite and miss, with fixes you can ship with or without DocsAlot.

[Request AI audit](mailto:faizank@docsalot.dev) · [Try DocsAlot](https://docsalot.dev/editor)

48h turnaround · no credit card · migration help available

---

**DocsAlot.** Documentation infrastructure for founders who want docs that compound, not accumulate.

**Company:** [Pricing](https://docsalot.dev/pricing) · [Docs benchmark](https://docsalot.dev/benchmarks) · [Changelog](https://docsalot.dev/changelog) · [Terms of Service](https://docsalot.dev/terms-and-conditions) · [Privacy Policy](https://docsalot.dev/privacy-policy) · [Support](mailto:faizank@docsalot.dev)

**Resources:** [Help Center](https://docs.docsalot.dev) · [API docs](https://docs.docsalot.dev/api-reference/index) · [docsalot-cli](https://docs.docsalot.dev/cli/index) · [Components](https://docs.docsalot.dev/components/accordion) · [Affiliate programme](https://docs.docsalot.dev/partners/affiliates) · [Hey AI, learn about us](https://docsalot.dev/llms.txt) · [All tools](https://docsalot.dev/tools)

**Compare:** [vs Mintlify](https://docsalot.dev/compare/the-top-mintlify-alternative) · [vs GitBook](https://docsalot.dev/compare/the-top-gitbook-alternative) · [vs Docusaurus](https://docsalot.dev/compare/the-top-docusaurus-alternative) · [vs Fumadocs](https://docsalot.dev/compare/the-top-fumadocs-alternative) · [vs Starlight](https://docsalot.dev/compare/the-top-starlight-alternative) · [All comparisons](https://docsalot.dev/compare)

**Features:** [AI-readable docs](https://docsalot.dev/features/ai-readable-documentation) · [API docs automation](https://docsalot.dev/features/api-docs-automation) · [CLIs for your SaaS](https://docsalot.dev/features/clis-for-your-saas) · [MCP for your SaaS](https://docsalot.dev/features/hosted-mcp-for-documentation) · [SDKs for your SaaS](https://docsalot.dev/features/sdks-for-your-saas) · [All features](https://docsalot.dev/features)

**For teams:** [Founders](https://docsalot.dev/for/founders) · [Developer tools](https://docsalot.dev/for/developer-tools) · [API companies](https://docsalot.dev/for/api-companies) · [SaaS + agents](https://docsalot.dev/for/saas-companies) · [Support teams](https://docsalot.dev/for/support-teams) · [All team pages](https://docsalot.dev/for)

[GitHub](https://github.com/slashml/) · [LinkedIn](https://www.linkedin.com/in/eff-kay/) · [X](https://x.com/faizan10114) · [Discord](https://discord.gg/Dp6EpTv4BU)

© 2026 DocsAlot. All rights reserved.
