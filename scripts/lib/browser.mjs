/**
 * A headless Chromium driven over the DevTools protocol, with nothing but
 * Node: the browser is started with a debugging port, and the protocol is
 * spoken over Node's own WebSocket. Enough for a review: open a page at a
 * viewport, run a script in it, press keys, click, take a screenshot.
 */
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LISTENING = /DevTools listening on (?<url>ws:\/\/\S+)/u;

/** Resolves to the browser's DevTools URL once it announces it on stderr. */
function debuggerUrl(browser) {
  return new Promise((resolve, reject) => {
    let output = "";
    browser.stderr.on("data", (chunk) => {
      output += chunk;
      const match = LISTENING.exec(output);
      if (match) resolve(match.groups.url);
    });
    browser.once("exit", () => reject(new Error(`the browser exited early:\n${output}`)));
  });
}

/** A protocol connection: `send(method, params, sessionId)` resolves to the result. */
function connect(url) {
  const socket = new WebSocket(url);
  const waiting = new Map();
  const listeners = new Set();
  let next = 0;
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const pending = waiting.get(message.id);
    if (pending === undefined) {
      for (const listener of listeners) listener(message);
      return;
    }
    waiting.delete(message.id);
    if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
    else pending.resolve(message.result);
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      next += 1;
      waiting.set(next, { method, resolve, reject });
      socket.send(JSON.stringify({ id: next, method, params, sessionId }));
    });
  const opened = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error("cannot reach the browser")), {
      once: true,
    });
  });
  return { send, opened, listeners, close: () => socket.close() };
}

/** Resolves when the page has fired the named protocol event. */
function eventOnce(connection, sessionId, method) {
  return new Promise((resolve) => {
    const listener = (message) => {
      if (message.sessionId !== sessionId || message.method !== method) return;
      connection.listeners.delete(listener);
      resolve(message.params);
    };
    connection.listeners.add(listener);
  });
}

/** What a review does with one tab. */
function pageApi(connection, sessionId) {
  const send = (method, params) => connection.send(method, params, sessionId);
  const evaluate = async (expression) => {
    const { exceptionDetails, result } = await send("Runtime.evaluate", {
      awaitPromise: true,
      expression,
      returnByValue: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? "page error");
    return result.value;
  };
  return {
    evaluate,
    async viewport(width, height) {
      await send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: 1,
        height,
        mobile: width < 768,
        width,
      });
    },
    async media(features) {
      await send("Emulation.setEmulatedMedia", {
        features: Object.entries(features).map(([name, value]) => ({ name, value })),
      });
    },
    async open(url) {
      const loaded = eventOnce(connection, sessionId, "Page.loadEventFired");
      await send("Page.navigate", { url });
      await loaded;
      // Fonts, then hydration: the page is what a visitor sees once both are done.
      await evaluate("document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 700)))");
    },
    async press(key, code = key) {
      const event = { code, key, windowsVirtualKeyCode: key === "Tab" ? 9 : 27 };
      await send("Input.dispatchKeyEvent", { ...event, type: "keyDown" });
      await send("Input.dispatchKeyEvent", { ...event, type: "keyUp" });
    },
    async move(x, y) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    },
    async click(x, y) {
      const event = { button: "left", clickCount: 1, x, y };
      await send("Input.dispatchMouseEvent", { ...event, type: "mousePressed" });
      await send("Input.dispatchMouseEvent", { ...event, type: "mouseReleased" });
    },
    /** A PNG of the viewport, or of the whole page from its top. */
    async screenshot({ fullPage = false } = {}) {
      const params = { captureBeyondViewport: fullPage, format: "png" };
      if (fullPage) {
        const { cssContentSize } = await send("Page.getLayoutMetrics");
        params.clip = {
          height: cssContentSize.height,
          scale: 1,
          width: cssContentSize.width,
          x: 0,
          y: 0,
        };
      }
      const { data } = await send("Page.captureScreenshot", params);
      return Buffer.from(data, "base64");
    },
  };
}

/** Starts the browser; resolves to `{ page, close }` with one tab ready. */
export async function launchBrowser(executable) {
  const profile = await mkdtemp(join(tmpdir(), "review-browser-"));
  const browser = spawn(
    executable,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const connection = connect(await debuggerUrl(browser));
  await connection.opened;
  const { targetId } = await connection.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await connection.send("Target.attachToTarget", { flatten: true, targetId });
  await connection.send("Page.enable", {}, sessionId);
  await connection.send("Runtime.enable", {}, sessionId);
  return {
    page: pageApi(connection, sessionId),
    async close() {
      connection.close();
      // The profile can only go once the browser has let go of it.
      const exited = new Promise((resolve) => {
        browser.once("exit", resolve);
      });
      browser.kill();
      await exited;
      await rm(profile, { force: true, maxRetries: 5, recursive: true, retryDelay: 200 });
    },
  };
}
