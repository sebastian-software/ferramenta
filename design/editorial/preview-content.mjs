import {
  EditorialBars,
  EditorialCode,
  EditorialColumns,
  EditorialSpecimen,
  EditorialTable,
} from "ferramenta-family/editorial";
import { createElement as h } from "react";

export const slug = (value) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replace(/-$/u, "");
export const paragraph = (text) => h("p", { key: text }, text.replaceAll(/\s+/gu, " ").trim());
const code = (caption, text, file) => h(EditorialCode, { caption, file }, text.trim());
const specimen = (caption, ...children) => h(EditorialSpecimen, { caption }, ...children);
const columns = (...children) => h(EditorialColumns, null, ...children);

/** The approved copy has headings outside code fences; source examples keep their own headings. */
export function parseCopy(text) {
  const lines = text.split("\n");
  const sections = [];
  let fenced = false;
  for (const line of lines) {
    if (line.startsWith("```")) fenced = !fenced;
    if (!fenced && line.startsWith("## ")) {
      sections.push({ title: line.slice(3), lines: [] });
    } else if (sections.length > 0) {
      sections.at(-1).lines.push(line);
    }
  }
  return sections.map(({ title, lines: body }) => {
    const raw = body.join("\n").split("\n---\n\nSource documents:")[0];
    const margin = raw.match(/^Margin introduction: (.+?)\. (.+)$/mu);
    return { title, raw, label: margin?.[1], intro: margin?.[2], id: slug(title) };
  });
}

export function tableFromCopy(text, caption) {
  const rows = text
    .split("\n")
    .filter((line) => line.includes(" | "))
    .map((line) =>
      line
        .replace(/^Table: /u, "")
        .trim()
        .replaceAll(/^\||\|$/gu, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((row) => !row.every((cell) => /^[-: ]+$/u.test(cell)));
  if (rows.length < 2) return null;
  return h(
    EditorialTable,
    { caption },
    h("thead", null, h("tr", null, ...rows[0].map((cell) => h("th", { scope: "col" }, cell)))),
    h(
      "tbody",
      null,
      ...rows
        .slice(1)
        .map((row) =>
          h(
            "tr",
            null,
            ...row.map((cell, index) =>
              h(index === 0 ? "th" : "td", index === 0 ? { scope: "row" } : {}, cell),
            ),
          ),
        ),
    ),
  );
}

function isDirection(line) {
  return /^(?:Margin introduction:|Actions:|Navigation:|Footer:|Links?:|Side notes|API notebook|Source documents:|Ferromark ·|Ferroni ·|Start with Rust ·|Inspect correctness ·|Read the measurements|Choose your rendering policy$|Explore rendering and metadata$|Explore syntax and compatibility$|Understand the scanner ·|Inspect compatibility ·|Read the complete benchmarks$|Read the untrusted-input guide$|Raw data ·|Raw measurements ·)/u.test(
    line,
  );
}

function proseBlock(raw, caption) {
  const text = raw
    .split("\n")
    .filter((line) => !isDirection(line))
    .join("\n")
    .trim();
  if (text.length === 0) return null;
  if (text.includes(" | ")) return tableFromCopy(text, caption);
  const fields = text.split("\n");
  if (fields.length > 1 && fields.every((line) => line.includes(": ")))
    return specimen(
      caption,
      h(
        "dl",
        null,
        ...fields.flatMap((line) => {
          const split = line.indexOf(": ");
          return [h("dt", null, line.slice(0, split)), h("dd", null, line.slice(split + 2))];
        }),
      ),
    );
  if (
    /^(?:cargo |npm |Rust: cargo |Node\.js: npm |Install the command-line tool: cargo )/u.test(text)
  ) {
    return code(
      "Install",
      text.replace(/^(?:Rust: |Node\.js: |Install the command-line tool: )/u, ""),
    );
  }
  if (/^(?:fn main|use ferroni::)/u.test(text)) return code("Rust example", text, "main.rs");
  return paragraph(text);
}

export function bodyBlocks(raw, caption = "The documented contract") {
  return raw.split("```").flatMap((part, index) => {
    if (index % 2 === 1) {
      const [language, ...lines] = part.split("\n");
      return [code(language === "markdown" ? "Markdown input" : "Code", lines.join("\n"))];
    }
    return part
      .split(/\n\s*\n/u)
      .map((text) => proseBlock(text, caption))
      .filter(Boolean);
  });
}

/** Exact worked specimens from the approved source copy, rendered as native text. */
const examples = {
  ferromark: () =>
    columns(
      code("Markdown input", "# Release notes\n\n- Clear structure\n- Useful metadata", ".md"),
      specimen(
        "Rendered output",
        h("h3", null, "Release notes"),
        h("ul", null, h("li", null, "Clear structure"), h("li", null, "Useful metadata")),
      ),
    ),
  ferroni: () =>
    columns(
      code("Pattern and source", "(?<=item-)\\d+\n\nitem-104 item-208"),
      specimen(
        "Matches",
        h("p", null, "item-", h("mark", null, "104"), " item-", h("mark", null, "208")),
        paragraph("The lookbehind checks the prefix; the match contains the digits."),
      ),
    ),
  ferriki: () =>
    columns(
      code("Source", "const answer = 42;"),
      specimen(
        "Highlighted output",
        h("code", null, h("strong", null, "const"), " answer = ", h("mark", null, "42"), ";"),
        paragraph("A grammar identifies scopes; a theme decides how those scopes look."),
      ),
    ),
  ferrolex: () =>
    columns(
      code("Plain word list", "precision\ndurable", "words.txt"),
      specimen(
        "Exact word-list recognition",
        h(
          "dl",
          null,
          h("dt", null, "precision"),
          h("dd", null, "Recognized"),
          h("dt", null, "precison"),
          h("dd", null, "Not recognized"),
        ),
        paragraph("Plain word lists use exact matching, including casing, by default."),
      ),
    ),
  ferrocat: () =>
    columns(
      code("PO entry", 'msgctxt "button"\nmsgid "Open"\nmsgstr "Ouvrir"', ".po"),
      specimen(
        "Identity and value",
        h(
          "dl",
          null,
          h("dt", null, "Context"),
          h("dd", null, "button"),
          h("dt", null, "Source"),
          h("dd", null, "Open"),
          h("dt", null, "Translation"),
          h("dd", null, "Ouvrir"),
        ),
      ),
    ),
  ferralk: () =>
    columns(
      code("File tree", "src/\n  lib.rs\n  generated/\n    cache.rs\ntests/\n  spec.rs"),
      specimen(
        "Selection",
        h(
          "dl",
          null,
          h("dt", null, "Include"),
          h("dd", null, h("code", null, "src/**/*.rs")),
          h("dt", null, "Exclude"),
          h("dd", null, h("code", null, "**/generated/**")),
          h("dt", null, "Result"),
          h("dd", null, h("code", null, "src/lib.rs")),
        ),
      ),
    ),
  ferrugo: () =>
    columns(
      code(
        "Render a bounded preview",
        "ferrugo render report.pdf --max-edge 256 --output preview.png",
      ),
      specimen(
        "Output contract",
        paragraph("report.pdf becomes preview.png."),
        paragraph(
          "The maximum edge is 256 pixels. Resource limits and unsupported cases remain explicit.",
        ),
      ),
    ),
};

function relativeBars(raw, caption) {
  const entries = raw
    .split("\n")
    .map((line) => line.match(/^([^:\r\n]+): ([0-9.]+)×$/u))
    .filter(Boolean);
  if (entries.length === 0) return null;
  return h(EditorialBars, {
    caption,
    items: entries.map(([, label, value], index) => ({
      id: slug(label),
      label,
      value: Number(value),
      displayValue: `${value}×`,
      highlight: index === 0,
    })),
  });
}

export function renderSection(product, section, { index, home }) {
  if (home && index === 0) return [examples[product]()];
  if (product === "ferromark" && section.title === "Speed, with the conditions attached") {
    const conditions = section.raw.slice(section.raw.indexOf("Measured September"));
    return [
      relativeBars(section.raw, "Fresh throughput, relative to Ferromark v2; higher is faster"),
      ...bodyBlocks(conditions),
    ];
  }
  if (product === "ferromark" && section.title === "One document, distinct outputs") {
    const source = section.raw
      .split("Markdown source:\n")[1]
      .split("\nOutput responsibilities:")[0];
    return [
      code("Markdown source", source),
      ...bodyBlocks(section.raw.split("Output responsibilities:\n")[1]),
    ];
  }
  if (["Your first match", "Render your first document"].includes(section.title)) {
    const marker = section.title === "Your first match" ? "Match:" : "Output:";
    const [source, result] = section.raw.split(marker);
    return [code("Rust example", source, "main.rs"), code("Result", `${marker}\n${result}`)];
  }
  if (section.title === "Use the scanner") return [code("Scan a line", section.raw, "main.rs")];
  return bodyBlocks(section.raw, section.title);
}
