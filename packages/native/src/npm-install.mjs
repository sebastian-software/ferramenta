/* eslint-disable max-params, complexity -- The bounded subprocess diagnostic preserves the original install error and safe output tails. */
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { command } from "./process.mjs";

const NPM_OUTPUT_TAIL_BYTES = 64 * 1024;
const NPM_DIAGNOSTIC_TAIL_CHARS = 2048;

function outputTail() {
  let bytes = Buffer.alloc(0);
  let truncated = false;
  return {
    add(chunk) {
      const incoming = Buffer.from(chunk);
      if (incoming.length >= NPM_OUTPUT_TAIL_BYTES) {
        bytes = Buffer.from(incoming.subarray(-NPM_OUTPUT_TAIL_BYTES));
        truncated = true;
      } else if (bytes.length + incoming.length > NPM_OUTPUT_TAIL_BYTES) {
        bytes = Buffer.concat([
          bytes.subarray(bytes.length + incoming.length - NPM_OUTPUT_TAIL_BYTES),
          incoming,
        ]);
        truncated = true;
      } else {
        bytes = Buffer.concat([bytes, incoming]);
      }
    },
    get text() {
      return bytes.toString("utf8");
    },
    get truncated() {
      return truncated;
    },
  };
}

function afterFirstLine(value) {
  const newline = value.indexOf("\n");
  return newline === -1 ? "" : value.slice(newline + 1);
}

function safeDiagnosticTail(value, truncated = false) {
  let output = [...String(value ?? "")]
    .map((character) => {
      const code = character.codePointAt(0);
      if (code === 13) return "\n";
      return (code < 32 && code !== 9 && code !== 10) || code === 127 ? "?" : character;
    })
    .join("");
  // A cut may have discarded a credential key while retaining its value.
  // Never display the first line after either the byte or character cut.
  if (truncated) output = afterFirstLine(output);
  const redacted = output
    .replaceAll(/\bBearer\s+[^\s"']+/gi, "Bearer [redacted]")
    .replaceAll(/(https?:\/\/)[^\s/@]+@/gi, "$1[redacted]@")
    .replaceAll(/([?&](?:token|auth|key|password)=)[^&#\s]+/gi, "$1[redacted]")
    .replaceAll(
      /^.*(?:_authToken|_auth\s*[=:]|Authorization\s*:|npm_token|NODE_AUTH_TOKEN|password\s*[=:]).*$/gim,
      "[redacted credential line]",
    );
  if (!redacted) return truncated ? "[earlier output and partial line omitted]" : "(empty)";
  if (redacted.length <= NPM_DIAGNOSTIC_TAIL_CHARS)
    return `${truncated ? "[earlier output omitted]\n" : ""}${redacted}`;
  const clipped = redacted.slice(-NPM_DIAGNOSTIC_TAIL_CHARS);
  const completeLines = afterFirstLine(clipped);
  return `[earlier output omitted]\n${completeLines || "[partial line omitted]"}`;
}

function captureCommand(spawnImpl, command, args, options) {
  return new Promise((resolve) => {
    const stdout = outputTail();
    const stderr = outputTail();
    let child;
    try {
      child = spawnImpl(command, args, options);
    } catch (error) {
      resolve({ status: null, signal: null, error, stdout, stderr });
      return;
    }
    let spawnError = null;
    child.stdout?.on("data", (chunk) => stdout.add(chunk));
    child.stderr?.on("data", (chunk) => stderr.add(chunk));
    child.on("error", (error) => {
      spawnError = error;
    });
    child.on("close", (status, signal) => {
      resolve({ status, signal, error: spawnError, stdout, stderr });
    });
  });
}

/** Install an exact public package and retain bounded diagnostics only on failure. */
export async function runPublicNpmInstall({
  packageName,
  version,
  cwd,
  npmCommand = process.platform === "win32" ? "npm.cmd" : "npm",
  spawnImpl = spawn,
  nodeVersion = process.version,
}) {
  const options = {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  };
  const args = [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    `${packageName}@${version}`,
  ];
  const result = await captureCommand(spawnImpl, npmCommand, args, options);
  if (result.status === 0 && !result.error && !result.signal) return;

  let npmVersion = "unavailable";
  const probe = await captureCommand(spawnImpl, npmCommand, ["--version"], options);
  const output = probe.stdout.text.trim();
  if (
    probe.status === 0 &&
    !probe.stdout.truncated &&
    // eslint-disable-next-line security/detect-unsafe-regex -- The version probe is bounded to 64 KiB.
    /^\d+\.\d+\.\d+(?:[-+][0-9a-z.-]+)?$/i.test(output)
  )
    npmVersion = output;

  const spawnError = result.error
    ? safeDiagnosticTail(`${result.error.code ?? result.error.name}: ${result.error.message}`)
    : "none";
  throw new Error(
    `public npm install failed for ${packageName}@${version} (Node ${nodeVersion}, npm ${npmVersion}; exit status ${result.status ?? "none"}; signal ${result.signal ?? "none"}; spawn error ${spawnError})\n` +
      `stdout tail:\n${safeDiagnosticTail(result.stdout.text, result.stdout.truncated)}\n` +
      `stderr tail:\n${safeDiagnosticTail(result.stderr.text, result.stderr.truncated)}`,
  );
}

/** Install a public package and let the product assert its own API or assets. */
export async function withPublicConsumer({ packageName, version }, verify) {
  const directory = await mkdtemp(path.join(tmpdir(), "ferramenta-public-consumer-"));
  try {
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ private: true, type: "module" }),
    );
    await runPublicNpmInstall({
      packageName,
      version,
      cwd: directory,
      npmCommand: process.platform === "win32" ? "npm.cmd" : "npm",
    });
    const run = (program, args, options = {}) =>
      command(program, args, { cwd: directory, ...options });
    await verify({
      directory,
      run,
      installed: path.join(directory, "node_modules", ...packageName.split("/")),
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
