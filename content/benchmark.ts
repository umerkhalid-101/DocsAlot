// The 7 real benchmark categories (22 checks) from docsalot.dev/benchmarks/docs.
// Pass counts and scores for "docs.acme.dev" are fictional demo data.

export type Category = {
  name: string;
  checks: number;
  before: number;
  after: number;
};

export const categories: Category[] = [
  { name: "Content discoverability", checks: 6, before: 3, after: 6 },
  { name: "Markdown availability", checks: 2, before: 0, after: 2 },
  { name: "Page size and truncation risk", checks: 4, before: 3, after: 4 },
  { name: "Content structure", checks: 3, before: 2, after: 3 },
  { name: "URL stability and redirects", checks: 2, before: 1, after: 2 },
  { name: "Observability and content health", checks: 3, before: 1, after: 2 },
  { name: "Authentication and access", checks: 2, before: 2, after: 2 },
];

export const totalChecks = categories.reduce((n, c) => n + c.checks, 0);

export const scores = { before: 41, after: 96 } as const;

export const failedChecks = [
  "No llms.txt found",
  "No markdown version of pages",
  "Key docs links redirect twice",
];

// Hard-coded from the live public leaderboard (docsalot.dev/benchmarks/docs), checked Oct 2026.
export const leaderboard = [
  { name: "Snowflake", domain: "docs.snowflake.com", score: 100, grade: "A+" },
  { name: "Fern", domain: "buildwithfern.com/learn", score: 98, grade: "A" },
  { name: "Runpod", domain: "docs.runpod.io", score: 98, grade: "A" },
  { name: "Merge", domain: "docs.merge.dev", score: 98, grade: "A" },
  { name: "Postman", domain: "learning.postman.com", score: 96, grade: "A" },
];

export const leaderboardNote = "274 docs benchmarked, Oct 2026";
