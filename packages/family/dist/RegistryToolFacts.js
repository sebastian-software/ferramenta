/** True when a member has a real TypeScript/Node adapter on npm, not just a held name. */
export function hasAdapter(stat) {
    return stat?.npm != null && stat.npm.placeholder !== true;
}
/** A snapshot entry made from live facts alone, for a site that has no snapshot. */
function statFromLive(live) {
    if (live.crates === undefined && live.npm === undefined && live.release === undefined)
        return null;
    return { crates: live.crates ?? null, npm: live.npm ?? null, release: live.release ?? null };
}
/** A public release version, falling back to the registry's development version. */
function shippedVersion(tool, registry, release) {
    return (registry ?? release)?.version ?? tool.version;
}
/** Merge a published member's verified snapshot with newer live facts. */
function publishedFacts(tool, snapshotStat, live) {
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
/**
 * Facts for one member. Unpublished names never acquire a release or download
 * count from a same-named package in a stale snapshot or metrics response.
 */
export function toolFacts(tool, snapshotStat, live = {}) {
    if (tool.unpublished) {
        return { version: tool.version, crateDownloads: 0, onCrates: false, adapter: false };
    }
    return publishedFacts(tool, snapshotStat, live);
}
