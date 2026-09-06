/**
 * The full entry: the registry plus the chrome. It imports nothing but React —
 * the theme toggle is a slot (`SiteHeader`'s `themeToggle`), not an `ardo/ui`
 * import — so it loads in a bare Node process as well as in a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `@ferramenta/family/registry` instead: the same data
 * without React.
 */
export { family, FAMILY_SITE, type FamilyGroup, familyGroups, type FamilyRole, type FamilyStatus, type FamilyTool, isEngine, } from "./family.js";
export { FamilyLinks, type FamilyLinksProps } from "./FamilyLinks.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { SiteFooter, type SiteFooterProps } from "./SiteFooter.js";
export { SiteHeader, type SiteHeaderProps } from "./SiteHeader.js";
