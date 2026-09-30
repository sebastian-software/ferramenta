/**
 * The tool the kit's sample pages are about. It is invented: the pages exist
 * to show what a family member's site looks like, and a real member's facts
 * and figures belong on its own site, where they stay current.
 *
 * It is deliberately not in the family registry, so nothing here reaches the
 * switcher, the footer, or a sibling's README.
 */
export const SAMPLE = {
  name: "ferrometro",
  title: "Ferrometro",
  what: "A units-of-measure engine in memory-safe Rust.",
  home: "/kit/tool",
  docs: "/kit/docs/getting-started",
  benchmarks: "/kit/docs/benchmarks",
  install: "cargo add ferrometro",
} as const;

/** The sample documentation's pages, in reading order: header links and sidebar read this. */
export const SAMPLE_DOCS = [
  { label: "Getting started", to: "/kit/docs/getting-started" },
  { label: "Configuration", to: "/kit/docs/configuration" },
  { label: "Benchmarks", to: "/kit/docs/benchmarks" },
] as const;

/** True for the pages that show the invented tool's own site. */
export function isSamplePath(pathname: string): boolean {
  return pathname.startsWith("/kit/tool") || pathname.startsWith("/kit/docs");
}

/** True for the sample documentation, which uses Ardo's docs layout. */
export function isSampleDocsPath(pathname: string): boolean {
  return pathname.startsWith("/kit/docs");
}
