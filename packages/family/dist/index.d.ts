export { CodePanel, type CodePanelProps } from "./CodePanel.js";
export { type EvidenceFigure, EvidenceFigures } from "./EvidenceFigures.js";
/**
 * The full entry: the registry, the chrome, and the landing kit. It imports nothing but React —
 * the theme toggle is a slot (`SiteHeader`'s `themeToggle`), not an `ardo/ui`
 * import — so it loads in a bare Node process as well as in a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `ferramenta-family/registry` instead: the same data
 * without React.
 */
export { byJob, displayName, family, FAMILY_SITE, type FamilyGroup, familyGroups, type FamilyLineage, type FamilyRole, type FamilyStatus, type FamilyTool, isEngine, isSuccessor, leadsToRepo, PIPELINE, type PipelineEnd, relatedTools, runsOnTools, STATUS_MEANING, STATUS_ORDER, toolHref, } from "./family.js";
export { FamilyLinks, type FamilyLinksProps } from "./FamilyLinks.js";
export { Fasteners } from "./Fasteners.js";
export { ClosingAction, type ClosingActionProps, IronBand, type IronBandProps, type IronBandRow, ProjectHero, type ProjectHeroProps, Section, type SectionProps, } from "./Landing.js";
export { Ledger, type LedgerEntry, Stamp, StampKey, type StampProps } from "./Ledger.js";
export { type FamilyFactsOptions, type FamilyMetrics, fetchFamilyFacts, fetchFamilyMetrics, fetchLiveRegistry, type LiveRegistryFacts, type LiveRegistryRequest, liveRequestFor, METRICS_URL, REGISTRY_ENDPOINTS, type RegistryEndpoints, type RegistrySnapshot, type RegistryStat, type ToolFacts, toolFacts, useFamilyFacts, useLiveRegistry, } from "./LiveRegistry.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { PipelineAssembly, type PipelineAssemblyProps } from "./PipelineAssembly.js";
export { Count, FamilyDownloads, RegistryFacts, type RegistryFactsProps, useToolFacts, } from "./RegistryFacts.js";
export { RepoNote } from "./RepoNote.js";
export { RunSample, type RunSampleProps } from "./RunSample.js";
export { SiteFooter, type SiteFooterProps } from "./SiteFooter.js";
export { SiteHeader, type SiteHeaderProps } from "./SiteHeader.js";
export { JobIndex, type JobIndexProps, Pegboard, type PegboardProps, ToolLedger, type ToolLedgerProps, } from "./ToolCatalog.js";
export { ToolSwitcher, type ToolSwitcherProps } from "./ToolSwitcher.js";
