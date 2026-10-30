import { getEslintConfig } from "eslint-config-setup";

// React site plus Node-side build scripts (scripts/ and Ardo config).
const config = await getEslintConfig({ react: true, node: true, oxlint: true });

config.unshift({
  ignores: [
    "**/dist/**",
    "**/build/**",
    "coverage/**",
    "node_modules/**",
    "pnpm-lock.yaml",
    "**/*.json",
    "**/*.md",
    // The isolated reference has its own Ardo dependency tree. Lint it explicitly
    // with --no-ignore after preparing it with pnpm docs:ferromark build.
    "examples/ferromark-docs/**",
  ],
});

// Deliberate overrides on top of the org config.
config.push(
  {
    // This fixture runs in scratch projects that declare their own React dependencies.
    files: ["scripts/consumer-check.mjs"],
    rules: { "import/no-extraneous-dependencies": "off" },
  },
  {
    // Native tooling resolves only reviewed product configuration and generated target paths.
    files: ["packages/native/**/*.mjs"],
    rules: {
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-require": "off",
    },
  },
  {
    // Keep the complete family and workshop registry together as its records grow.
    files: ["packages/family/src/family.ts"],
    rules: { "max-lines": ["error", { max: 400, skipBlankLines: true, skipComments: true }] },
  },
  {
    // The page is one long, flat composition of the design system's sections
    // (DESIGN.md); splitting it into helper components to satisfy a line budget
    // would hide the document structure the comp is reviewed against.
    files: ["app/**/*.tsx", "examples/*/app/**/*.tsx"],
    rules: {
      complexity: "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      // Route modules export `meta` and `handle` next to the component.
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Tests build their fixtures under `mkdtemp`; the rule is about paths that
    // reach the filesystem from untrusted input, which a temp directory is not.
    // Both layouts: package tests in `test/`, script tests beside their script.
    files: ["**/test/**/*.mjs", "**/*.test.mjs"],
    rules: { "security/detect-non-literal-fs-filename": "off" },
  },
);

export default config;
