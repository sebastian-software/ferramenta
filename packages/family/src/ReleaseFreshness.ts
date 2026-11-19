/* eslint-disable complexity, max-params -- Freshness compares independent optional observations. */
/* oxlint-disable eslint/complexity, eslint/max-params -- Freshness compares independent optional observations. */
import type { FamilyMetrics, LiveRegistryFacts, RegistrySnapshot } from "./LiveRegistry.js";

import { family } from "./family.js";

/** Merge GitHub observations independently of the registry snapshot's age. */
export function mergeReleaseFacts(
  base: Record<string, LiveRegistryFacts>,
  metrics: FamilyMetrics | null,
  snapshot: RegistrySnapshot,
  generatedAt: string | undefined,
): Record<string, LiveRegistryFacts> {
  const result: Record<string, LiveRegistryFacts> = {};
  for (const tool of family) {
    const { release: _release, ...rest } = base[tool.name] ?? {};
    const release = metrics?.facts[tool.name]?.release;
    const row = snapshot[tool.name];
    const observed =
      row?.releaseObservedAt ?? (row && Object.hasOwn(row, "release") ? generatedAt : undefined);
    const metricsTime = Date.parse(metrics?.generatedAt ?? "");
    const observedTime = Date.parse(observed ?? "");
    if (
      (metrics?.answered.releases || (metrics?.legacyReleases && release !== null)) &&
      release !== undefined &&
      (release !== null || Number.isFinite(metricsTime)) &&
      (observed === undefined ||
        (Number.isFinite(metricsTime) &&
          Number.isFinite(observedTime) &&
          metricsTime >= observedTime))
    ) {
      result[tool.name] = { ...rest, release };
    } else if (Object.keys(rest).length > 0) {
      result[tool.name] = rest;
    }
  }
  return result;
}
