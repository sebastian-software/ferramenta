const TAG = /<[a-z][\w:-]*\b[^>]*>/giu;
const ATTRIBUTE = /\s([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gu;
const CANONICAL_URL = "https://ferramenta.dev/";

function attribute(tag, name) {
  for (const match of tag.matchAll(ATTRIBUTE)) {
    if (match[1].toLowerCase() !== name) continue;
    return match[2] ?? match[3] ?? match[4];
  }
}

function decodedFragment(href) {
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
}

export function inspectRenderedPage(html) {
  const tags = [...html.matchAll(TAG)].map(([tag]) => tag);
  const ids = new Set(tags.map((tag) => attribute(tag, "id")).filter((id) => id !== undefined));
  const fragmentLinks = tags
    .filter((tag) => /^<a\b/iu.test(tag))
    .map((tag) => attribute(tag, "href"))
    .filter((href) => href?.startsWith("#") && href.length > 1)
    .map((href) => decodedFragment(href));
  const hasCanonical = tags.some(
    (tag) =>
      /^<link\b/iu.test(tag) &&
      attribute(tag, "rel")?.toLowerCase().split(/\s+/u).includes("canonical") &&
      attribute(tag, "href") === CANONICAL_URL,
  );

  return {
    fragmentCount: fragmentLinks.length,
    missingFragments: [...new Set(fragmentLinks.filter((id) => !ids.has(id)))],
    hasCanonical,
  };
}
