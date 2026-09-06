/**
 * The full entry: the registry plus the chrome. `SiteHeader` imports `ardo/ui`,
 * which is a bundler-only module (it imports CSS and a `virtual:` config), so
 * anything that loads this file needs a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `@ferramenta/family/registry` instead. Same data, no
 * React and no Ardo.
 */
export { family, FAMILY_SITE, type FamilyGroup, familyGroups, type FamilyRole, type FamilyStatus, type FamilyTool, isEngine, } from "./family.js";
export { FamilyLinks, type FamilyLinksProps } from "./FamilyLinks.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs, type MarkProps } from "./Mark.js";
export { SiteFooter, type SiteFooterProps } from "./SiteFooter.js";
export { SiteHeader, type SiteHeaderProps } from "./SiteHeader.js";
