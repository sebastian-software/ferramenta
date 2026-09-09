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

function skipWhitespace(markdown, start) {
  let cursor = start;
  while (/\s/u.test(markdown[cursor] ?? "")) cursor++;
  return cursor;
}

function angleDestination(markdown, start) {
  const end = markdown.indexOf(">", start + 1);
  return end === -1 ? null : { end, link: markdown.slice(start + 1, end) };
}

function destinationStep(character, parentheses) {
  if (character === "\\") return { advance: 2, parentheses, stop: false };
  if (character === "(") return { advance: 1, parentheses: parentheses + 1, stop: false };
  if (character === ")" && parentheses > 0)
    return { advance: 1, parentheses: parentheses - 1, stop: false };
  if (character === ")" || (/\s/u.test(character) && parentheses === 0))
    return { advance: 0, parentheses, stop: true };
  return { advance: 1, parentheses, stop: false };
}

function balancedDestination(markdown, start) {
  const destinationStart = start;
  let cursor = start;
  let parentheses = 0;
  while (cursor < markdown.length) {
    const step = destinationStep(markdown[cursor], parentheses);
    if (step.stop) return { end: cursor, link: markdown.slice(destinationStart, cursor) };
    cursor += step.advance;
    parentheses = step.parentheses;
  }
  return null;
}

function destinationAt(markdown, start) {
  const cursor = skipWhitespace(markdown, start);
  return markdown[cursor] === "<"
    ? angleDestination(markdown, cursor)
    : balancedDestination(markdown, cursor);
}

function inlineLinks(markdown) {
  const links = [];
  let cursor = 0;
  while (cursor < markdown.length) {
    const marker = markdown.indexOf("](", cursor);
    if (marker === -1) break;
    const destination = destinationAt(markdown, marker + 2);
    if (destination) {
      links.push(destination.link);
      cursor = destination.end + 1;
    } else {
      cursor = marker + 2;
    }
  }
  return links;
}

function linksIn(source) {
  const links = [];
  const markdown = withoutCode(source);
  links.push(...inlineLinks(markdown));

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
  const hash = link.indexOf("#");
  const query = link.indexOf("?");
  const pathEnd =
    [hash, query].filter((index) => index !== -1).sort((a, b) => a - b)[0] ?? link.length;
  const pathPart = decode(link.slice(0, pathEnd), sourcePath);
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
