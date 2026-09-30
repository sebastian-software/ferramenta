/**
 * Serves a built static site the way GitHub Pages does: a directory answers
 * with its `index.html`, a path without its trailing slash is redirected to
 * the one with it, anything else is a 404. No SPA fallback: a review must see
 * the prerendered page, not the client router's rescue of a wrong URL.
 */
/* eslint-disable security/detect-non-literal-fs-filename -- every path is resolved beneath the served root and checked against it */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";

const TYPES = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

/** The file a request path names under `root`, or what to answer instead. */
export function resolveRequest(root, requestPath) {
  const path = normalize(decodeURIComponent(requestPath.split("?")[0]));
  const file = join(root, path);
  if (file !== root && !file.startsWith(root + sep)) return { status: 403 };
  if (!existsSync(file)) return { status: 404 };
  if (!statSync(file).isDirectory()) return { status: 200, file };
  if (!path.endsWith("/")) return { status: 301, location: `${path}/` };
  const index = join(file, "index.html");
  return existsSync(index) ? { status: 200, file: index } : { status: 404 };
}

/** Starts the server on a free port; resolves to its origin and a `close` function. */
export function serveStatic(root) {
  const server = createServer((request, response) => {
    const answer = resolveRequest(root, request.url ?? "/");
    if (answer.status === 301) {
      response.writeHead(301, { location: answer.location }).end();
      return;
    }
    if (answer.status !== 200) {
      response.writeHead(answer.status).end();
      return;
    }
    response.writeHead(200, {
      "content-type": TYPES[extname(answer.file)] ?? "application/octet-stream",
    });
    createReadStream(answer.file).pipe(response);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ origin: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}
