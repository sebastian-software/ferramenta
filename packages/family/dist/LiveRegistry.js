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
/** A snapshot entry made from live facts alone, for a site that has no snapshot. */
function statFromLive(live) {
    if (live.crates === undefined && live.npm === undefined && live.release === undefined)
        return null;
    return { crates: live.crates ?? null, npm: live.npm ?? null, release: live.release ?? null };
}
/**
 * The version a member shows: the crate's when there is one, else the npm
 * adapter's, else — for a Git-only member — its latest GitHub release. The
 * registry's own value is the last resort.
 */
function shippedVersion(tool, registry, release) {
    return (registry ?? release)?.version ?? tool.version;
}
/**
 * The facts for one member, from a snapshot and whatever answered live. With
 * a snapshot entry, live values only refresh what the build verified; without
 * one, the live facts stand on their own (the metrics service filters by owner).
 */
export function toolFacts(tool, snapshotStat, live = {}) {
    const stat = snapshotStat ?? statFromLive(live);
    const crates = stat?.crates == null ? null : { ...stat.crates, ...live.crates };
    const npm = hasAdapter(stat) ? { ...stat.npm, ...live.npm } : null;
    return {
        version: shippedVersion(tool, crates ?? npm, live.release ?? stat?.release),
        crateDownloads: crates === null ? 0 : crates.downloads,
        onCrates: crates !== null,
        adapter: npm !== null,
    };
}
/*
 * The workshop's metrics service (github.com/sebastian-software/oss-metrics):
 * one cached, CORS-open document with every project of the organization,
 * filtered by owner at the source, so a same-named package someone else
 * published cannot appear. One request instead of one per registry, and it
 * needs no snapshot, so a sibling site gets live figures too.
 */
export const METRICS_URL = "https://metrics.sebastian-software.com/v1/metrics.json";
function metricsEntry(section, name) {
    const entry = isRecord(section) ? section[name] : undefined;
    return isRecord(entry) ? entry : {};
}
/** A member's crate and npm package from the metrics document, as live facts. */
function metricsFacts(doc, name) {
    const crate = metricsEntry(doc.crates, name);
    const pkg = metricsEntry(doc.npm, name);
    const facts = {};
    const version = textAt(crate, "version");
    const downloads = countAt(crate, "downloads");
    if (version !== undefined && downloads !== undefined)
        facts.crates = { version, downloads };
    const npmVersion = textAt(pkg, "version");
    const lastMonth = countAt(pkg, "monthlyDownloads");
    if (npmVersion !== undefined && lastMonth !== undefined) {
        facts.npm = { version: npmVersion, lastMonth };
    }
    const repo = metricsEntry(doc.github, name);
    const release = isRecord(repo.release) ? textAt(repo.release, "version") : undefined;
    if (release !== undefined)
        facts.release = { version: release };
    return facts;
}
/** The family's facts from the metrics document, or null when it did not answer usefully. */
export async function fetchFamilyMetrics(url = METRICS_URL) {
    const doc = await json(url);
    if (!isRecord(doc) || doc.schema !== 1 || !isRecord(doc.sources))
        return null;
    const facts = {};
    for (const { name } of family) {
        const member = metricsFacts(doc, name);
        if (Object.keys(member).length > 0)
            facts[name] = member;
    }
    return {
        facts,
        answered: { crates: doc.sources.crates === "ok", npm: doc.sources.npm === "ok" },
    };
}
/**
 * Live facts for the family: the metrics service first; for a registry it did
 * not answer (down, or not deployed yet), the registries directly, for the
 * packages the snapshot verified. Whatever answers nowhere keeps its build value.
 */
export async function fetchFamilyFacts(snapshot, { endpoints = REGISTRY_ENDPOINTS, metrics = METRICS_URL } = {}) {
    const fromMetrics = metrics === false ? null : await fetchFamilyMetrics(metrics);
    const direct = unanswered(liveRequestFor(snapshot), fromMetrics);
    const fromRegistries = direct.crates.length + direct.npm.length > 0 ? await fetchLiveRegistry(direct, endpoints) : {};
    return mergeFacts(fromMetrics?.facts ?? {}, fromRegistries);
}
/** What still needs a direct registry request: the registries the metrics service did not answer. */
function unanswered(request, metrics) {
    return {
        crates: metrics?.answered.crates === true ? [] : request.crates,
        npm: metrics?.answered.npm === true ? [] : request.npm,
    };
}
function mergeFacts(base, extra) {
    const facts = { ...base };
    for (const [name, value] of Object.entries(extra))
        facts[name] = { ...facts[name], ...value };
    return facts;
}
/** `fetchFamilyFacts` after hydration: empty during prerender and until something answers. */
export function useFamilyFacts(snapshot, options = {}) {
    const [facts, setFacts] = useState({});
    const key = JSON.stringify([snapshot, options]);
    useEffect(() => {
        let current = true;
        void fetchFamilyFacts(snapshot, options).then((live) => {
            if (current)
                setFacts(live);
        });
        return () => {
            current = false;
        };
        // Keyed on the inputs' value: the objects themselves may be new on every render.
        // oxlint-disable-next-line react-hooks/exhaustive-deps -- `key` is their serialized value
    }, [key]);
    return facts;
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
