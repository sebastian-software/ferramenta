import { createRequire } from "node:module";

// Standalone previews render the package's hooks with its own React instance.
// Ardo owns the production site's runtime and may use a different React patch.
const loadFamilyDependency = createRequire(import.meta.resolve("ferramenta-family/package.json"));
export const { createElement } = loadFamilyDependency("react");
export const { renderToStaticMarkup } = loadFamilyDependency("react-dom/server");
