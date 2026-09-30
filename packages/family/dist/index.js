export { CodePanel } from "./CodePanel.js";
export { EvidenceFigures } from "./EvidenceFigures.js";
/**
 * The full entry: the registry, the chrome, and the landing kit. It imports nothing but React —
 * a docs site's theme toggle is a slot (`SiteHeader`'s `themeToggle`), not an
 * `ardo/ui` import — so it loads in a bare Node process as well as in a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `ferramenta-family/registry` instead: the same data
 * without React.
 */
export { displayName, family, FAMILY_SITE, familyTiers, isEngine, isSuccessor, leadsToRepo, relatedTools, relationsOf, runsOnTools, STATUS_MEANING, STATUS_ORDER, toolHref, WORKSHOP, } from "./family.js";
export { FamilyLinks } from "./FamilyLinks.js";
export { Icon } from "./Icon.js";
export { ClosingAction, IronBand, Principles, ProjectHero, Section, WorkWithUs, } from "./Landing.js";
export { Ledger, Stamp, StampKey } from "./Ledger.js";
export { fetchFamilyFacts, fetchFamilyMetrics, fetchLiveRegistry, liveRequestFor, METRICS_URL, REGISTRY_ENDPOINTS, toolFacts, useFamilyFacts, useLiveRegistry, } from "./LiveRegistry.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs } from "./Mark.js";
export { HangingTag, Plate, PlateLight, Rivets } from "./Plate.js";
export { Count, FamilyDownloads, RegistryFacts, useToolFacts, } from "./RegistryFacts.js";
export { RepoNote } from "./RepoNote.js";
export { RunSample } from "./RunSample.js";
export { SiteFooter } from "./SiteFooter.js";
export { SiteHeader } from "./SiteHeader.js";
export { SiteMenu } from "./SiteMenu.js";
export { ApplicationsBand, EngineCatalog, } from "./ToolCatalog.js";
export { ToolSwitcher } from "./ToolSwitcher.js";
