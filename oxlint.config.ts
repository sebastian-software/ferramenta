import { getOxlintConfig } from "eslint-config-setup";
import { defineConfig, type OxlintConfig } from "oxlint";

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- getOxlintConfig() is not yet typed against oxlint's own OxlintConfig
const config = getOxlintConfig({ react: true, node: true }) as OxlintConfig;

config.ignorePatterns = ["**/dist/**", "**/build/**", "coverage/**", "node_modules/**"];

// Same deliberate overrides as eslint.config.ts, see the comments there.
config.overrides = [
  ...(config.overrides ?? []),
  {
    files: ["packages/family/src/family.ts"],
    rules: { "max-lines": ["error", { max: 400, skipBlankLines: true, skipComments: true }] },
  },
  {
    files: ["app/**/*.tsx", "examples/*/app/**/*.tsx"],
    rules: {
      complexity: "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
    },
  },
];

export default defineConfig(config);
