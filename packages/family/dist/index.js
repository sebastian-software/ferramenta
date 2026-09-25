export { CodePanel } from "./CodePanel.js";
export { EvidenceFigures } from "./EvidenceFigures.js";
/**
 * The full entry: the registry, the chrome, and the landing kit. It imports nothing but React —
 * the theme toggle is a slot (`SiteHeader`'s `themeToggle`), not an `ardo/ui`
 * import — so it loads in a bare Node process as well as in a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `ferramenta-family/registry` instead: the same data
 * without React.
 */
export { byJob, displayName, family, FAMILY_SITE, familyGroups, isEngine, isSuccessor, leadsToRepo, PIPELINE, relatedTools, runsOnTools, STATUS_MEANING, STATUS_ORDER, toolHref, } from "./family.js";
export { FamilyLinks } from "./FamilyLinks.js";
export { Fasteners } from "./Fasteners.js";
export { ClosingAction, IronBand, ProjectHero, Section, } from "./Landing.js";
export { Ledger, Stamp, StampKey } from "./Ledger.js";
export { fetchFamilyFacts, fetchFamilyMetrics, fetchLiveRegistry, liveRequestFor, METRICS_URL, REGISTRY_ENDPOINTS, toolFacts, useFamilyFacts, useLiveRegistry, } from "./LiveRegistry.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs } from "./Mark.js";
export { PipelineAssembly } from "./PipelineAssembly.js";
export { Count, FamilyDownloads, RegistryFacts, useToolFacts, } from "./RegistryFacts.js";
export { RepoNote } from "./RepoNote.js";
export { RunSample } from "./RunSample.js";
export { SiteFooter } from "./SiteFooter.js";
export { SiteHeader } from "./SiteHeader.js";
export { JobIndex, Pegboard, ToolLedger, } from "./ToolCatalog.js";
export { ToolSwitcher } from "./ToolSwitcher.js";
