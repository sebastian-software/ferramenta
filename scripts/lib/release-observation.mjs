/** Preserve the last actual GitHub answer when a refresh cannot resolve it. */
export function releaseObservation(previous, latest, { previousGeneratedAt, observedAt }) {
  if (latest.resolved) return { release: latest.value, releaseObservedAt: observedAt };
  if (!previous || !Object.hasOwn(previous, "release")) return {};
  const time = previous.releaseObservedAt ?? previousGeneratedAt;
  return { release: previous.release, ...(time ? { releaseObservedAt: time } : {}) };
}
