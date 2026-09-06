#!/usr/bin/env node
/**
 * CLI around lib/family-readme.mjs.
 *
 *   ferramenta-readme --current ferrocat                      # print the block
 *   ferramenta-readme --current ferrocat --variant registry
 *   ferramenta-readme --current ferrocat --write README.md
 *   ferramenta-readme --current ferrocat --check README.md    # exits 1 on drift
 */
import { readFile, writeFile } from "node:fs/promises";

import {
  findBlock,
  loadRegistry,
  normalize,
  render,
  START,
  upsert,
  VARIANTS,
} from "../lib/family-readme.mjs";

const VALUE_FLAGS = new Set(["--variant", "--current", "--write", "--check"]);

function readFlag(options, flag, value) {
  if (VALUE_FLAGS.has(flag)) {
    if (value === undefined || value.startsWith("--")) throw new Error(`${flag} needs a value`);
    options[flag.slice(2)] = value;
    return 1;
  }
  if (flag === "--help" || flag === "-h") {
    options.help = true;
    return 0;
  }
  throw new Error(`unknown argument: ${flag}`);
}

function parseArgs(argv) {
  const options = { variant: "github", current: null, write: null, check: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    index += readFlag(options, argv[index], argv[index + 1]);
  }
  if (!VARIANTS.includes(options.variant)) {
    throw new Error(`--variant must be one of ${VARIANTS.join(", ")}`);
  }
  if (options.write !== null && options.check !== null) {
    throw new Error("--write and --check are mutually exclusive");
  }
  return options;
}

const USAGE = [
  "Usage: ferramenta-readme [options]",
  "",
  "  --variant github|registry  block flavor (default: github)",
  "  --current <name>           highlight this tool as the current one",
  "  --write <README path>      insert or update the block in place",
  "  --check <README path>      exit 1 when the README block is out of date",
  "",
  "Without --write or --check the block is printed to stdout.",
].join("\n");

/** Returns the process exit code. */
async function check(path, block) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the README path is this CLI's argument; a fixed path would defeat the tool
  const readme = await readFile(path, "utf8");
  const existing = findBlock(readme);
  if (existing === null) {
    console.error(`${path}: no ${START} block — run with --write`);
    return 1;
  }
  if (normalize(existing.text) !== normalize(block)) {
    console.error(`${path}: family block is out of date — run with --write`);
    return 1;
  }
  console.log(`${path}: family block is up to date`);
  return 0;
}

async function write(path, block) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the README path is this CLI's argument; a fixed path would defeat the tool
  const readme = await readFile(path, "utf8");
  const result = upsert(readme, block);
  if (!result.changed) {
    console.log(`${path}: family block already up to date`);
    return;
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the README path is this CLI's argument; a fixed path would defeat the tool
  await writeFile(path, result.content);
  console.log(`${path}: family block written`);
}

/** Rejects a `--current` the registry does not know, so a typo is not silent. */
function unknownTool(registry, current) {
  const known = registry.family.map((tool) => tool.name);
  if (current === null || known.includes(current)) return false;
  console.error(`unknown tool: ${current} (known: ${known.join(", ")})`);
  return true;
}

async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return 0;
  }
  const registry = await loadRegistry();
  if (unknownTool(registry, options.current)) return 2;
  const block = render(registry, options);
  if (options.check !== null) return check(options.check, block);
  if (options.write !== null) {
    await write(options.write, block);
    return 0;
  }
  console.log(block);
  return 0;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  console.error(`\n${USAGE}`);
  process.exitCode = 2;
}
