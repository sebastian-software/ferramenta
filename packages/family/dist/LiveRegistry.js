import { useEffect, useState } from "react";
import { family } from "./family.js";
export const REGISTRY_ENDPOINTS = {
    crates: "https://crates.io/api/v1",
    npmRegistry: "https://registry.npmjs.org",
    npmDownloads: "https://api.npmjs.org/downloads",
};
/** Parsed JSON, or null when the request failed or did not answer with 2xx. */
async function json(url) {
    try {
        const response = await fetch(url, { headers: { accept: "application/json" } });
        if (!response.ok)
            return null;
        const data = await response.json();
        return data;
    }
    catch {
        return null;
    }
}
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function textAt(record, key) {
    const value = record[key];
    return typeof value === "string" ? value : undefined;
}
function countAt(record, key) {
    const value = record[key];
    return typeof value === "number" ? value : undefined;
}
async function liveCrates(names, root) {
    const facts = {};
    if (names.length === 0)
        return facts;
    // One request for every crate: crates.io asks clients to keep their request rate low.
    const query = names.map((name) => `ids[]=${encodeURIComponent(name)}`).join("&");
    const answer = await json(`${root}/crates?${query}&per_page=${names.length}`);
    const crates = isRecord(answer) && Array.isArray(answer.crates) ? answer.crates : [];
    for (const crate of crates) {
        if (!isRecord(crate))
            continue;
        const id = textAt(crate, "id");
        const version = textAt(crate, "max_stable_version") ?? textAt(crate, "max_version");
        const downloads = countAt(crate, "downloads");
        if (id !== undefined && version !== undefined && downloads !== undefined) {
            facts[id] = { version, downloads };
        }
    }
    return facts;
}
async function liveNpm(names, endpoints) {
    const facts = {};
    if (names.length === 0)
        return facts;
    const list = names.map((name) => encodeURIComponent(name)).join(",");
    const points = await json(`${endpoints.npmDownloads}/point/last-month/${list}`);
    // The bulk endpoint answers a map for several names, a single point for one.
    const downloadsOf = (name) => {
        if (!isRecord(points))
            return;
        if (names.length === 1)
            return countAt(points, "downloads");
        const point = points[name];
        return isRecord(point) ? countAt(point, "downloads") : undefined;
    };
    const latest = await Promise.all(names.map(async (name) => json(`${endpoints.npmRegistry}/${encodeURIComponent(name)}/latest`)));
    for (const [index, name] of names.entries()) {
        const answer = latest[index];
        const version = isRecord(answer) ? textAt(answer, "version") : undefined;
        const lastMonth = downloadsOf(name);
        if (version !== undefined && lastMonth !== undefined)
            facts[name] = { version, lastMonth };
    }
    return facts;
}
/**
 * Fetches the current figures for the requested packages. Resolves with
 * whatever answered; a registry that did not answer simply leaves its
 * packages out, so the caller keeps the values it already shows.
 */
export async function fetchLiveRegistry(request, endpoints = REGISTRY_ENDPOINTS) {
    const [crates, npm] = await Promise.all([
        liveCrates(request.crates, endpoints.crates),
        liveNpm(request.npm, endpoints),
    ]);
    const facts = {};
    for (const [name, value] of Object.entries(crates))
        facts[name] = { crates: value };
    for (const [name, value] of Object.entries(npm))
        facts[name] = { ...facts[name], npm: value };
    return facts;
}
/*
 * What a page shows about a member's releases: the build-time snapshot, with
 * whatever answered live on top, and the registry entry's fallback version
 * last. `RegistryFacts` provides it to components; the policy lives here.
 */
/** True when a member has a real TypeScript/Node adapter on npm, not just a held name. */
function hasAdapter(stat) {
    return stat?.npm != null && stat.npm.placeholder !== true;
}
/**
 * The packages worth asking for live: every verified crate, and npm only for a
 * member without one — the crate's version is the one shown, so asking npm for
 * it too would be a request whose answer never reaches the page.
 */
export function liveRequestFor(snapshot) {
    const names = family.map((tool) => tool.name);
    return {
        crates: names.filter((name) => snapshot[name]?.crates != null),
        npm: names.filter((name) => snapshot[name]?.crates == null && hasAdapter(snapshot[name])),
    };
}
/** The facts for one member, from a snapshot and whatever answered live. */
export function toolFacts(tool, stat, live = {}) {
    const crates = stat?.crates == null ? null : { ...stat.crates, ...live.crates };
    const npm = hasAdapter(stat) ? { ...stat.npm, ...live.npm } : null;
    // The crate carries the version when there is one; an adapter-only member shows npm's.
    const release = crates ?? npm;
    return {
        version: release === null ? tool.version : release.version,
        crateDownloads: crates === null ? 0 : crates.downloads,
        onCrates: crates !== null,
        adapter: npm !== null,
    };
}
/**
 * The live figures for a page, after hydration. Returns an empty map during
 * prerender and until the registries answer, so a component renders its
 * build-time value first and swaps in the live one when it arrives.
 */
export function useLiveRegistry(request, endpoints = REGISTRY_ENDPOINTS) {
    const [facts, setFacts] = useState({});
    const key = JSON.stringify([request, endpoints]);
    useEffect(() => {
        let current = true;
        void fetchLiveRegistry(request, endpoints).then((live) => {
            if (current)
                setFacts(live);
        });
        return () => {
            current = false;
        };
        // Keyed on the request's value: the objects themselves are new on every render.
        // oxlint-disable-next-line react-hooks/exhaustive-deps -- `key` is their serialized value
    }, [key]);
    return facts;
}
