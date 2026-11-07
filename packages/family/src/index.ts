/**
 * The root entry: the registry, its live release facts, the line-icon sprite
 * and the comparison types. It imports nothing but React, so it loads in a
 * bare Node process as well as in a bundler. The page system is
 * `ferramenta-family/monografie`, which exports all of this too; this entry
 * stays for sites and scripts that import from the package root.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `ferramenta-family/registry` instead: the same data
 * without React.
 */
export type {
  ComparisonCell,
  ComparisonMark,
  ComparisonRow,
  ComparisonTableProps,
  Contender,
  MeasuredProps,
  MeasuredRow,
} from "./comparison-types.js";
export {
  displayName,
  family,
  FAMILY_SITE,
  type FamilyBrand,
  type FamilyLineage,
  type FamilyRegistry,
  type FamilyRelation,
  type FamilyRole,
  type FamilyStatus,
  familyTiers,
  type FamilyTool,
  isEngine,
  isSuccessor,
  leadsToRepo,
  packageName,
  plannedRunsOnTools,
  relatedTools,
  relationsOf,
  runsOnTools,
  STATUS_MEANING,
  STATUS_ORDER,
  toolHref,
  whatLabel,
  WORKSHOP,
} from "./family.js";
export {
  type FamilyFactsOptions,
  type FamilyMetrics,
  fetchFamilyFacts,
  fetchFamilyMetrics,
  fetchLiveRegistry,
  type LiveRegistryFacts,
  type LiveRegistryRequest,
  liveRequestFor,
  METRICS_URL,
  REGISTRY_ENDPOINTS,
  type RegistryEndpoints,
  type RegistrySnapshot,
  type RegistryStat,
  type ToolFacts,
  toolFacts,
  useFamilyFacts,
} from "./LiveRegistry.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { RegistryFacts, type RegistryFactsProps, useToolFacts } from "./RegistryFacts.js";
