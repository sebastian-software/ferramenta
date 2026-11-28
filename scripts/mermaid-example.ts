import { render } from "@ferrigura/core";
import { highlightCode } from "ardo/vite";

/** Pass only the rendered examples to the browser, with both built from the same source. */
export const mermaidExample = {
  name: "ferramenta:mermaid-example",
  enforce: "pre" as const,
  async transform(source: string, id: string) {
    if (!id.endsWith("/app/data/review.mmd")) return;

    const html = await highlightCode(source, "mermaid", { theme: "github-light-default" });
    if (!html.includes('<span style="color:')) {
      throw new Error("Ardo returned the homepage Mermaid example without syntax highlighting.");
    }

    const svg = render(
      source,
      { themeVariables: { fontSize: "20px" } },
      { colorScheme: "light", id: "review-diagram" },
    );
    return `export default ${JSON.stringify({ html, svg })};`;
  },
};
