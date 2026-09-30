const LOCATION = /<loc>(?<loc>[^<]+)<\/loc>/u;

/** The path an entry's `<loc>` names, or undefined for an entry without one. */
function pathOf(entry) {
  const loc = LOCATION.exec(entry)?.groups.loc;
  return loc === undefined ? undefined : new URL(loc).pathname;
}

/**
 * Splits a sitemap into its parts, in order: a run of lines outside any entry,
 * or one whole `<url>` entry. It reads line by line, as Ardo writes the file:
 * `<url>` and `</url>` each on a line of their own.
 */
function parts(xml) {
  const result = [];
  let entry = null;
  for (const line of xml.split("\n")) {
    if (line.trim() === "<url>") entry = [];
    if (entry === null) {
      result.push({ lines: [line] });
      continue;
    }
    entry.push(line);
    if (line.trim() === "</url>") {
      result.push({ lines: entry, path: pathOf(entry.join("\n")) });
      entry = null;
    }
  }
  return result;
}

/**
 * Removes every `<url>` entry whose path is one of `prefixes` or lies under
 * one from a sitemap. Returns the pruned XML and the paths it removed.
 */
export function pruneSitemap(xml, prefixes) {
  const isHidden = (path) =>
    path !== undefined &&
    prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  const all = parts(xml);
  return {
    xml: all
      .filter((part) => !isHidden(part.path))
      .flatMap((part) => part.lines)
      .join("\n"),
    removed: all.filter((part) => isHidden(part.path)).map((part) => part.path),
  };
}
