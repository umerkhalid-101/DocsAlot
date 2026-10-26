// Writes public/index.md and public/llms.txt from the same source as the human page.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { llmsTxtForConcept, pageMarkdown } from "../lib/toMarkdown";

const pub = join(process.cwd(), "public");
writeFileSync(join(pub, "index.md"), pageMarkdown());
writeFileSync(join(pub, "llms.txt"), llmsTxtForConcept());
console.log("machine files: public/index.md, public/llms.txt");
