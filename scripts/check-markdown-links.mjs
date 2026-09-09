/**
 * Checks repository-relative Markdown links.
 *
 * Only repository-relative file paths are checked. External URLs and fragments
 * are left for the Markdown renderer and site build to validate. This check is
 * for links that a repository change can actually break, including links hidden
 * in nested documentation folders.
 */
/* eslint-disable security/detect-non-literal-fs-filename -- Every path is discovered beneath the repository root. */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKIPPED_DIRECTORIES = new Set([".git", ".pnpm-store", "build", "node_modules", "target"]);
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);

function collectMarkdownFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name))
        files.push(...collectMarkdownFiles(join(directory, entry.name)));
      continue;
    }
    if (entry.isFile() && MARKDOWN_EXTENSIONS.has(extname(entry.name)))
      files.push(join(directory, entry.name));
  }
  return files;
}

function withoutCode(source) {
  const lines = source.split("\n");
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s{0,3}(?:```|~~~)/u.test(line)) {
        inFence = !inFence;
        return "";
      }
      if (inFence) return "";
      return line.replaceAll(/`[^`\n]*`/g, (code) => " ".repeat(code.length));
    })
    .join("\n");
}

function linksIn(source) {
  const links = [];
  const markdown = withoutCode(source);
  // Markdown destinations permit optional titles and angle brackets; this
  // bounded scan intentionally does not attempt to implement the full grammar.
  // eslint-disable-next-line security/detect-unsafe-regex, regexp/no-super-linear-move -- The input is repository Markdown and the scan is bounded by link delimiters.
  const inline = /\[[^\]]+\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^)]*["'])?\s*\)/gu;
  for (const match of markdown.matchAll(inline)) links.push(match[1] ?? match[2]);

  const definitions = /^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gmu;
  for (const match of markdown.matchAll(definitions)) links.push(match[1] ?? match[2]);
  return links;
}

function decode(value, sourcePath) {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error(`${sourcePath}: link contains invalid percent encoding: ${value}`);
  }
}

function localTarget(link, sourcePath, repoRoot) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/iu.test(link)) return null;
  const decoded = decode(link, sourcePath);
  const hash = decoded.indexOf("#");
  const query = decoded.indexOf("?");
  const pathEnd =
    [hash, query].filter((index) => index !== -1).sort((a, b) => a - b)[0] ?? decoded.length;
  const pathPart = decoded.slice(0, pathEnd);
  if (pathPart === "") return null;
  const target = pathPart.startsWith("/")
    ? resolve(repoRoot, `.${pathPart}`)
    : resolve(dirname(sourcePath), pathPart);
  return { target };
}

function checkLink(link, sourcePath, repoRoot) {
  const displayPath = relative(repoRoot, sourcePath);
  let local;
  try {
    local = localTarget(link, sourcePath, repoRoot);
  } catch (error) {
    return error.message;
  }
  if (!local) return null;
  if (!existsSync(local.target))
    return `${displayPath}: ${link} does not resolve to ${relative(repoRoot, local.target)}`;
  return null;
}

export function checkMarkdownLinks(repoRoot) {
  return collectMarkdownFiles(repoRoot).flatMap((sourcePath) => {
    const source = readFileSync(sourcePath, "utf8");
    return linksIn(source)
      .map((link) => checkLink(link, sourcePath, repoRoot))
      .filter(Boolean);
  });
}

const isMain = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const failures = checkMarkdownLinks(repoRoot);
  if (failures.length > 0) {
    console.error("Markdown link check failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log("Markdown link check passed.");
}
