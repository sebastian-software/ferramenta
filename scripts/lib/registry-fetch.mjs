export const REGISTRY_TIMEOUT_MS = 15_000;
export const CRATES_IO_MIN_INTERVAL_MS = 1000;

const USER_AGENT =
  "ferramenta.dev stats refresh (https://github.com/sebastian-software/ferramenta)";

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function createCratesIoPacer(now, wait) {
  let nextAvailableAt = 0;
  let queue = Promise.resolve();

  return function pace(url) {
    if (!url.startsWith("https://crates.io/api/")) return Promise.resolve();
    const reservation = queue.then(async () => {
      const requestAt = Math.max(nextAvailableAt, now());
      nextAvailableAt = requestAt + CRATES_IO_MIN_INTERVAL_MS;
      const remaining = requestAt - now();
      if (remaining > 0) await wait(remaining);
    });
    queue = reservation.catch(() => {});
    return reservation;
  };
}

/** Create the shared request function used by the build-time registry refresh. */
export function createRegistryFetcher({
  request = globalThis.fetch,
  now = Date.now,
  wait = delay,
  timeoutSignal = AbortSignal.timeout,
} = {}) {
  const pace = createCratesIoPacer(now, wait);

  return async function fetchJson(url, headers = {}) {
    try {
      await pace(url);
      const response = await request(url, {
        signal: timeoutSignal(REGISTRY_TIMEOUT_MS),
        headers: { "user-agent": USER_AGENT, accept: "application/json", ...headers },
      });
      if (response.status === 404) return { ok: true, data: null };
      if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
      return { ok: true, data: await response.json() };
    } catch (error) {
      return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
  };
}
