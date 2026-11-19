import { family } from "./family.js";
/** Merge GitHub observations independently of the registry snapshot's age. */
export function mergeReleaseFacts(base, metrics, snapshot, generatedAt) {
    const result = {};
    for (const tool of family) {
        const { release: _release, ...rest } = base[tool.name] ?? {};
        const release = metrics?.facts[tool.name]?.release;
        const observed = snapshot[tool.name]?.releaseObservedAt ?? generatedAt;
        const metricsTime = Date.parse(metrics?.generatedAt ?? "");
        const observedTime = Date.parse(observed ?? "");
        if ((metrics?.answered.releases || (metrics?.legacyReleases && release !== null)) &&
            release !== undefined &&
            (observed === undefined ||
                (Number.isFinite(metricsTime) &&
                    Number.isFinite(observedTime) &&
                    metricsTime >= observedTime))) {
            result[tool.name] = { ...rest, release };
        }
        else if (Object.keys(rest).length > 0) {
            result[tool.name] = rest;
        }
    }
    return result;
}
