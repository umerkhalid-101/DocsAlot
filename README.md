# DocsAlot homepage concept

Redesign concept for docsalot.dev. One page, two renderings: flip **Human / Machine** in the nav (or press `M`, or open `/?view=machine`).

```bash
npm install
npm run dev        # http://localhost:3123
npm run build
```

- All copy lives in `content/site.ts`; demo data in `content/demo.ts` and `content/benchmark.ts`.
- `lib/toMarkdown.ts` serializes that content into the Machine view, `public/index.md` and `public/llms.txt` (written by `scripts/build-machine-files.ts` before dev and build).
- Design tokens live in `styles/globals.css`; components use them through Tailwind, with no hex values.
