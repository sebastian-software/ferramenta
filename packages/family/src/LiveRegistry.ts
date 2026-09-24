import { useEffect, useState } from "react";

/*
 * Live registry figures, fetched by the visitor's browser after the page has
 * rendered. The prerendered page already carries the figures from its last
 * deploy; this only brings them up to the minute. Every endpoint below answers
 * cross-origin requests, and a failed request changes nothing on the page.
 */

/** Where the figures come from. Swap in a caching mirror without touching a component. */
export type RegistryEndpoints = {
  /** crates.io API root: `GET {crates}/crates?ids[]=a&ids[]=b` */
  crates: string;
  /** npm registry root: `GET {npmRegistry}/<name>/latest` */
  npmRegistry: string;
  /** npm downloads API root: `GET {npmDownloads}/point/last-month/a,b` */
  npmDownloads: string;
};

export const REGISTRY_ENDPOINTS: RegistryEndpoints = {
  crates: "https://crates.io/api/v1",
  npmRegistry: "https://registry.npmjs.org",
  npmDownloads: "https://api.npmjs.org/downloads",
};

/** The packages to look up. Pass only names the build verified as the family's own. */
export type LiveRegistryRequest = { crates: string[]; npm: string[] };

export type LiveRegistryFacts = {
  crates?: { version: string; downloads: number };
  npm?: { version: string; lastMonth: number };
};

/** Parsed JSON, or null when the request failed or did not answer with 2xx. */
async function json(url: string): Promise<unknown> {
  try {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return data;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function textAt(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function countAt(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

async function liveCrates(names: string[], root: string) {
  const facts: Record<string, LiveRegistryFacts["crates"]> = {};
  if (names.length === 0) return facts;
  // One request for every crate: crates.io asks clients to keep their request rate low.
  const query = names.map((name) => `ids[]=${encodeURIComponent(name)}`).join("&");
  const answer = await json(`${root}/crates?${query}&per_page=${names.length}`);
  const crates =
    isRecord(answer) && Array.isArray(answer.crates) ? (answer.crates as unknown[]) : [];
  for (const crate of crates) {
    if (!isRecord(crate)) continue;
    const id = textAt(crate, "id");
    const version = textAt(crate, "max_stable_version") ?? textAt(crate, "max_version");
    const downloads = countAt(crate, "downloads");
    if (id !== undefined && version !== undefined && downloads !== undefined) {
      facts[id] = { version, downloads };
    }
  }
  return facts;
}

async function liveNpm(names: string[], endpoints: RegistryEndpoints) {
  const facts: Record<string, LiveRegistryFacts["npm"]> = {};
  if (names.length === 0) return facts;
  const list = names.map((name) => encodeURIComponent(name)).join(",");
  const points = await json(`${endpoints.npmDownloads}/point/last-month/${list}`);
  // The bulk endpoint answers a map for several names, a single point for one.
  const downloadsOf = (name: string): number | undefined => {
    if (!isRecord(points)) return;
    if (names.length === 1) return countAt(points, "downloads");
    const point = points[name];
    return isRecord(point) ? countAt(point, "downloads") : undefined;
  };
  const latest = await Promise.all(
    names.map(async (name) => json(`${endpoints.npmRegistry}/${encodeURIComponent(name)}/latest`)),
  );
  for (const [index, name] of names.entries()) {
    const answer = latest[index];
    const version = isRecord(answer) ? textAt(answer, "version") : undefined;
    const lastMonth = downloadsOf(name);
    if (version !== undefined && lastMonth !== undefined) facts[name] = { version, lastMonth };
  }
  return facts;
}

/**
 * Fetches the current figures for the requested packages. Resolves with
 * whatever answered; a registry that did not answer simply leaves its
 * packages out, so the caller keeps the values it already shows.
 */
export async function fetchLiveRegistry(
  request: LiveRegistryRequest,
  endpoints: RegistryEndpoints = REGISTRY_ENDPOINTS,
): Promise<Record<string, LiveRegistryFacts>> {
  const [crates, npm] = await Promise.all([
    liveCrates(request.crates, endpoints.crates),
    liveNpm(request.npm, endpoints),
  ]);
  const facts: Record<string, LiveRegistryFacts> = {};
  for (const [name, value] of Object.entries(crates)) facts[name] = { crates: value };
  for (const [name, value] of Object.entries(npm)) facts[name] = { ...facts[name], npm: value };
  return facts;
}

/**
 * The live figures for a page, after hydration. Returns an empty map during
 * prerender and until the registries answer, so a component renders its
 * build-time value first and swaps in the live one when it arrives.
 */
export function useLiveRegistry(
  request: LiveRegistryRequest,
  endpoints: RegistryEndpoints = REGISTRY_ENDPOINTS,
): Record<string, LiveRegistryFacts> {
  const [facts, setFacts] = useState<Record<string, LiveRegistryFacts>>({});
  const key = JSON.stringify([request, endpoints]);
  useEffect(() => {
    let current = true;
    void fetchLiveRegistry(request, endpoints).then((live) => {
      if (current) setFacts(live);
    });
    return () => {
      current = false;
    };
    // Keyed on the request's value: the objects themselves are new on every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- `key` is their serialized value
  }, [key]);
  return facts;
}
