// Acme: one obviously fictional payments API that powers every demo on the page.

export const acme = {
  name: "Acme",
  domain: "acme.dev",
  docsUrl: "acme.dev/docs/quickstart",
  mcp: "mcp.docsalot.dev/acme",
} as const;

export const current = {
  install: "npm install @acme/sdk",
  envVar: "ACME_API_KEY",
  rateLimit: "1,000 requests per minute",
  rateLimitShort: "1,000 requests/min",
  source: "acme.dev/docs/quickstart",
} as const;

export const stale = {
  install: "npm install acme-sdk@1",
  rateLimit: "100 requests per minute",
  rateLimitShort: "100 requests/min",
  source: "community forum, 2023",
} as const;

export const quickstartCode = `import { Acme } from "@acme/sdk";

const acme = new Acme({ apiKey: process.env.ACME_API_KEY });

const payment = await acme.payments.create({ amount: 2500, currency: "usd" });
console.log(payment.status); // "succeeded"`;

export type QuickstartStep = {
  id: string;
  title: string;
  body: string;
  code?: string;
  lang?: "bash" | "ts";
};

export const quickstart = {
  title: "Quickstart",
  lede: "Install the Acme SDK, authenticate, and create your first payment in under five minutes.",
  breadcrumb: ["Docs", "Getting started"],
  steps: [
    { id: "install", title: "Install", body: "Add the SDK to your project.", code: current.install, lang: "bash" },
    {
      id: "authenticate",
      title: "Authenticate",
      body: "Set your secret key as an environment variable.",
      code: `export ${current.envVar}=sk_test_...`,
      lang: "bash",
    },
    {
      id: "first-request",
      title: "Make your first request",
      body: "Create a payment with the client.",
      code: quickstartCode,
      lang: "ts",
    },
  ] satisfies QuickstartStep[],
  rateLimits: {
    id: "rate-limits",
    title: "Rate limits",
    body: `Each API key can make ${current.rateLimit}. Requests over the limit return 429.`,
  },
  sidebar: [
    { group: "Getting started", items: ["Quickstart", "Authentication", "Rate limits"] },
    { group: "API", items: ["Payments", "Customers", "Webhooks", "Errors"] },
  ],
};

export const sources = [
  { name: "GitHub docs", format: "MDX", status: "Synced" },
  { name: "Help center", format: "HTML", status: "Mapped" },
  { name: "API reference", format: "OpenAPI", status: "Parsed" },
  { name: "Product notes", format: "Notion", status: "Queued" },
] as const;

export const llmsTxt = `# Acme
> Payments API for developers. Accept payments, manage customers, handle webhooks.

## Docs
- [Quickstart](https://acme.dev/docs/quickstart): install the SDK, first payment
- [Authentication](https://acme.dev/docs/authentication): API keys and scopes
- [Rate limits](https://acme.dev/docs/api/rate-limits): ${current.rateLimit}
- [API reference](https://acme.dev/docs/api): every endpoint, from OpenAPI`;

export const skillMd = `---
name: acme
description: Build and debug Acme payment integrations.
---
## When to use
Any task that touches Acme payments, customers or webhooks.
## Rules
- Install \`@acme/sdk\`. Never \`acme-sdk@1\`.`;

export const mcpCall = `> search_docs({ "query": "rate limit" })
< {
    "path": "/api/rate-limits",
    "title": "Rate limits",
    "snippet": "Each API key can make ${current.rateLimit}."
  }`;

export const apiBlock = {
  method: "GET",
  path: "/v1/payments/{id}",
  summary: "Retrieve a payment by its ID.",
  params: [
    { name: "id", type: "string", note: "required" },
    { name: "expand", type: "string[]", note: "optional" },
  ],
  curl: `curl https://api.acme.dev/v1/payments/pay_123 \\
  -H "Authorization: Bearer $ACME_API_KEY"`,
};

export const gaps = [
  "Install path missing from AI answers",
  "API examples drifted from product",
  "Support macros reference old limits",
];

export const chunks = [
  { anchor: "#install", label: "Install", target: "llms.txt" },
  { anchor: "#authenticate", label: "Authenticate", target: "skill.md" },
  { anchor: "#first-request", label: "First request", target: "mcp chunk" },
  { anchor: "#rate-limits", label: "Rate limits", target: "mcp chunk" },
];

export const docsTree = [
  { depth: 0, name: "acme-docs/" },
  { depth: 1, name: "quickstart.mdx" },
  { depth: 1, name: "authentication.mdx" },
  { depth: 1, name: "api/" },
  { depth: 2, name: "payments.mdx" },
  { depth: 2, name: "rate-limits.mdx" },
  { depth: 1, name: "help/" },
  { depth: 2, name: "refunds.html" },
  { depth: 1, name: "openapi.yaml" },
  { depth: 1, name: "CHANGELOG.md" },
];
