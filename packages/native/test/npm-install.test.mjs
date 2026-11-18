/* cspell:ignore userconfig */

/* eslint-disable max-lines-per-function, max-statements -- Keep each registry fixture and its cleanup together. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { runPublicNpmInstall } from "../src/npm-install.mjs";
import { command } from "../src/process.mjs";

// Exercise npm itself: the wrapper redirects only the intended public registry
// to a local stand-in, while npm still reads a competing user configuration.
for (const packageName of ["registry-proof", "@proof/registry-proof"]) {
  test(`installs the requested ${packageName} version despite registry overrides`, async () => {
    const root = await mkdtemp(path.join(tmpdir(), "npm registry proof-"));
    const requests = [];
    const server = http.createServer(async (request, response) => {
      requests.push({ url: request.url, authorization: request.headers.authorization });
      if (request.url === "/package.tgz") {
        response.end(await readFile(path.join(root, "package.tgz")));
        return;
      }
      const registry = `http://127.0.0.1:${server.address().port}`;
      response.setHeader("content-type", "application/json");
      response.end(
        JSON.stringify({
          name: packageName,
          "dist-tags": { latest: "2.0.0" },
          versions: {
            "1.0.0": {
              name: packageName,
              version: "1.0.0",
              dist: { tarball: `${registry}/package.tgz` },
            },
            "2.0.0": {
              name: packageName,
              version: "2.0.0",
              dist: { tarball: `${registry}/wrong.tgz` },
            },
          },
        }),
      );
    });
    try {
      await new Promise((resolve) => {
        server.listen(0, "127.0.0.1", resolve);
      });
      await writeFile(
        path.join(root, "package.json"),
        JSON.stringify({ name: packageName, version: "1.0.0" }),
      );
      const packed = command("npm", ["pack", "--ignore-scripts", "--pack-destination", root], {
        cwd: root,
      });
      const tarball = await readFile(path.join(root, packed.stdout.trim()));
      await writeFile(path.join(root, "package.tgz"), tarball);
      const consumer = path.join(root, "consumer");
      const { mkdir } = await import("node:fs/promises");
      await mkdir(consumer);
      await writeFile(path.join(consumer, "package.json"), JSON.stringify({ private: true }));
      const config = path.join(root, "user.npmrc");
      const configText =
        "registry=http://127.0.0.1:1/\n@proof:registry=http://127.0.0.1:1/\n//127.0.0.1:1/:_authToken=private-test-token\n";
      await writeFile(config, configText);
      const localRegistry = `http://127.0.0.1:${server.address().port}/`;
      await runPublicNpmInstall({
        packageName,
        version: "1.0.0",
        cwd: consumer,
        spawnImpl(command, args, options) {
          return spawn(
            command,
            args.map((arg) => arg.replace("https://registry.npmjs.org/", localRegistry)),
            {
              ...options,
              env: {
                ...process.env,
                npm_config_userconfig: config,
                npm_config_cache: path.join(root, "cache"),
                npm_config_registry: "http://127.0.0.1:1/",
              },
            },
          );
        },
      });
      const installed = JSON.parse(
        await readFile(
          path.join(consumer, "node_modules", ...packageName.split("/"), "package.json"),
          "utf8",
        ),
      );
      assert.equal(installed.version, "1.0.0");
      assert.ok(requests.some(({ url }) => url === "/package.tgz"));
      assert.ok(requests.every(({ authorization }) => authorization === undefined));
      assert.equal(await readFile(config, "utf8"), configText);
    } finally {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      await rm(root, { recursive: true, force: true });
    }
  });
}
