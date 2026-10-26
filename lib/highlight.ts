import "server-only";
import { codeToHtml, createCssVariablesTheme } from "shiki";

// Colors come from CSS variables in styles/globals.css, so the theme follows the tokens.
const theme = createCssVariablesTheme({ name: "docsalot", variablePrefix: "--shiki-", fontStyle: true });

export async function highlight(code: string, lang: "ts" | "bash" | "json" = "ts"): Promise<string> {
  return codeToHtml(code, { lang, theme });
}
