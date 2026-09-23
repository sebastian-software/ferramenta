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
export {
  family,
  FAMILY_SITE,
  type FamilyGroup,
  familyGroups,
  type FamilyRole,
  type FamilyStatus,
  type FamilyTool,
  isEngine,
  PIPELINE,
  type PipelineEnd,
  relatedTools,
} from "./family.js";
export { FamilyLinks, type FamilyLinksProps } from "./FamilyLinks.js";
export { Fasteners } from "./Fasteners.js";
export {
  ClosingAction,
  type ClosingActionProps,
  IronBand,
  type IronBandProps,
  type IronBandRow,
  ProjectHero,
  type ProjectHeroProps,
  Section,
  type SectionProps,
} from "./Landing.js";
export { Ledger, type LedgerEntry, Stamp, type StampProps } from "./Ledger.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { PipelineAssembly, type PipelineAssemblyProps } from "./PipelineAssembly.js";
export { SiteFooter, type SiteFooterProps } from "./SiteFooter.js";
export { SiteHeader, type SiteHeaderProps } from "./SiteHeader.js";
export { ToolSwitcher, type ToolSwitcherProps } from "./ToolSwitcher.js";
