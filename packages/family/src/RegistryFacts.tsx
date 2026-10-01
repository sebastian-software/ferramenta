import { createContext, type ReactNode, use, useMemo } from "react";

import type { FamilyTool } from "./family.js";

import {
  type LiveRegistryFacts,
  type RegistryEndpoints,
  type RegistrySnapshot,
  type ToolFacts,
  toolFacts,
  useFamilyFacts,
} from "./LiveRegistry.js";

/*
 * A member's registry figures on a page: the snapshot the site's build
 * fetched, brought up to the minute by the visitor's browser. Components read
 * them through `useToolFacts`, so every site applies the same merge policy
 * (`toolFacts` in LiveRegistry.ts) instead of writing its own.
 */

type FactsState = { snapshot: RegistrySnapshot; live: Record<string, LiveRegistryFacts> };

const NO_SNAPSHOT: RegistrySnapshot = {};

const FactsContext = createContext<FactsState>({ snapshot: NO_SNAPSHOT, live: {} });

export type RegistryFactsProps = {
  /**
   * The build-time snapshot, prerendered before anything live answers. Optional:
   * without one the page renders the registry's fallback versions first, then
   * whatever the metrics service answers.
   */
  snapshot?: RegistrySnapshot;
  /** Snapshot generation time; older metrics responses are ignored. */
  snapshotGeneratedAt?: string;
  /** The metrics document (`METRICS_URL` by default); `false` asks the registries directly. */
  metrics?: false | string;
  /** The registries asked directly for what the metrics service did not answer. */
  endpoints?: RegistryEndpoints;
  children: ReactNode;
};

/**
 * Provides registry figures to everything below it that shows a release: the
 * snapshot during prerender, live values after hydration.
 */
export function RegistryFacts({
  children,
  endpoints,
  metrics,
  snapshot = NO_SNAPSHOT,
  snapshotGeneratedAt,
}: RegistryFactsProps) {
  const live = useFamilyFacts(snapshot, { endpoints, metrics, snapshotGeneratedAt });
  const value = useMemo(() => ({ snapshot, live }), [snapshot, live]);
  return <FactsContext value={value}>{children}</FactsContext>;
}

/** A member's facts inside `RegistryFacts`; the fallback version outside it. */
export function useToolFacts(tool: FamilyTool): ToolFacts {
  const { live, snapshot } = use(FactsContext);
  return toolFacts(tool, snapshot[tool.name], live[tool.name]);
}
