/**
 * The `ferramenta-family` README block, rendered from the family registry.
 *
 * The block is generated, never hand-copied: `src/family.ts` is the single
 * source of truth (ADR-0001), so a job string or a new member changes in one
 * place and every README follows. It reaches a README as an mdtheme frame
 * (`markdown/<name>/`, written by `scripts/native-theme.mjs`). The company
 * footer is not rendered here: that is the standards-owned outer theme.
 */

/** The family's two tiers (ADR-0008), in the order the block lists them. */
const TIER_LABELS = {
  engines: "Engines",
  applications: "Applications",
};

const LOGO =
  "https://raw.githubusercontent.com/sebastian-software/ferramenta/main/app/assets/brand/logo-light.svg";

/**
 * The registry, from its source: Node strips the types (24 and up, this
 * repository's floor), and this only ever runs inside this repository. `base`
 * exists so the tests can point at a fixture package.
 */
export function loadRegistry(base = import.meta.url) {
  return import(new URL("../src/family.ts", base).href);
}

const link = (tool) => `[${tool.name}](${tool.docs ?? tool.repo})`;

function table(tools) {
  return [
    "| Tool | Job |",
    "| --- | --- |",
    ...tools.map((tool) => `| ${link(tool)} | ${tool.job} |`),
  ].join("\n");
}

function heading(registry, text, level) {
  const mark = `<img src="${LOGO}" width="24" height="24" alt="" />`;
  return `${"#".repeat(level)} <a href="${registry.FAMILY_SITE}">${mark} ${text}</a>`;
}

/**
 * The block: a heading with the family's mark, then a table per tier. With a
 * member's `name`, its README's block ("More from Ferramenta", without its own
 * row). With `null`, the family site's own README: the whole family under one
 * heading. An unknown name is a registry error, not an empty block.
 */
export function familyBlock(registry, current) {
  const tiers = registry.familyTiers(current ?? undefined);
  const sections = Object.entries(TIER_LABELS)
    .filter(([tier]) => tiers[tier].length > 0)
    .map(([tier, label]) => `**${label}**\n\n${table(tiers[tier])}`);
  const head =
    current === null
      ? [heading(registry, "The family", 2)]
      : [
          heading(registry, "More from Ferramenta", 3),
          "",
          `[Ferramenta](${registry.FAMILY_SITE}) — A family of Rust tools.`,
        ];
  return [...head, "", sections.join("\n\n")].join("\n");
}

/**
 * A theme directory's frame files. A member gets a header naming the family
 * and the block as its footer; the family site (`current === null`) gets the
 * footer only, it does not introduce itself as part of itself.
 */
export function nativeFrame(registry, current) {
  const footer = `${familyBlock(registry, current)}\n`;
  if (current === null) return { footer };
  return {
    header: `Part of [Ferramenta](${registry.FAMILY_SITE}), a family of Rust tools.\n`,
    footer,
  };
}
