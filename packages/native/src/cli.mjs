#!/usr/bin/env node
/* eslint-disable max-lines-per-function, max-statements, complexity, sonarjs/cognitive-complexity -- CLI dispatch keeps each checked command visible in one place. */
import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import { restoreNativeArtifacts, stageNativeArtifact } from "./artifacts.mjs";
import { verifyPackedConsumer } from "./consumer.mjs";
import { nativeMatrix } from "./matrix.mjs";
import { packRelease } from "./pack.mjs";
import { generatePackages, generateRuntime, verifyPlatform } from "./packages.mjs";
import { createReleaseSourceGate } from "./release-source.mjs";
import {
  createNativeRelease,
  packExtraPackages,
  rebaseConfig,
  resolveConfig,
  verifyReleaseMetadata,
} from "./release.mjs";

export async function runNativeCommand(configuration, argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      config: { type: "string" },
      check: { type: "boolean" },
      "all-targets": { type: "boolean" },
      target: { type: "string" },
      "package-tests": { type: "boolean" },
      directory: { type: "string" },
      "metadata-only": { type: "boolean" },
      root: { type: "string" },
      tag: { type: "string" },
    },
  });
  const [action, argument] = positionals;
  assert.ok(positionals.length <= 2, "Unexpected native tooling arguments");
  const config = values.root
    ? rebaseConfig(configuration, path.resolve(values.root))
    : resolveConfig(configuration);
  const sourceSha = process.env.NATIVE_SOURCE_SHA ?? process.env.RELEASE_SHA;
  switch (action) {
    case "source":
      await createReleaseSourceGate(config).run(argument);
      break;
    case "generate":
      await generatePackages(config, { check: values.check });
      await generateRuntime(config, { check: values.check });
      break;
    case "matrix": {
      const matrix = nativeMatrix();
      for (const entry of matrix.include) Object.assign(entry, config.matrix?.(entry));
      console.log(JSON.stringify(matrix));
      break;
    }
    case "platform": {
      const id = argument ?? values.target;
      const metadata = await verifyPlatform(config, id);
      console.log(metadata);
      break;
    }
    case "pack": {
      const directory = path.resolve(
        values.directory ?? path.join(config.workspaceDir, "artifacts"),
      );
      const result = await packRelease(config, {
        directory,
        allTargets: values["all-targets"],
        target: values.target,
      });
      if (values["all-targets"]) await packExtraPackages(config, directory);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case "consumer":
      await verifyPackedConsumer(config, undefined, {
        target: values.target,
        archiveDirectory: values.directory && path.resolve(values.directory),
        packageTests: values["package-tests"],
      });
      break;
    case "metadata": {
      if (values["metadata-only"]) assert.ok(values.tag, "--metadata-only requires --tag");
      const metadata = await verifyReleaseMetadata(config, {
        root: values.root && path.resolve(values.root),
        tag: values.tag,
        binaries: !values["metadata-only"],
      });
      console.log(
        `Verified ${config.name} ${metadata.version}${values["metadata-only"] ? " (metadata only)" : ""}`,
      );
      break;
    }
    case "stage": {
      const directory = await stageNativeArtifact(config, {
        id: argument,
        sourceSha,
        directory: path.resolve(values.directory ?? process.env.RUNNER_TEMP),
      });
      if (process.env.GITHUB_OUTPUT)
        await appendFile(process.env.GITHUB_OUTPUT, `directory=${directory}\n`);
      console.log(directory);
      break;
    }
    case "restore":
      await restoreNativeArtifacts(config, {
        sourceSha,
        directory: path.resolve(
          values.directory ?? path.join(config.workspaceDir, "native-artifacts"),
        ),
      });
      break;
    case "publish":
      await createNativeRelease(config).publish({
        phase: argument,
        sourceSha,
        releaseTag: process.env.NATIVE_RELEASE_TAG ?? process.env.RELEASE_TAG,
        recovery: process.env.GITHUB_EVENT_NAME === "workflow_dispatch",
        directory: values.directory && path.resolve(values.directory),
      });
      break;
    case "verify-public":
      await createNativeRelease(config).verify();
      break;
    default:
      throw new Error(`Unknown native command: ${action}`);
  }
}

if (process.argv[1] === import.meta.filename) {
  try {
    const { values } = parseArgs({
      strict: false,
      allowPositionals: true,
      options: { config: { type: "string" } },
    });
    const filename = path.resolve(values.config ?? "native-npm.config.mjs");
    const { default: config } = await import(pathToFileURL(filename));
    await runNativeCommand(config, process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
