/**
 * The full entry: the registry plus the chrome. `SiteHeader` imports `ardo/ui`,
 * which is a bundler-only module (it imports CSS and a `virtual:` config), so
 * anything that loads this file needs a bundler.
 *
 * Registry-only consumers — a Node script, a build step, a site that renders
 * its own chrome — import `@ferramenta/family/registry` instead. Same data, no
 * React and no Ardo.
 */
export { family, FAMILY_SITE, familyGroups, isEngine, } from "./family.js";
export { FamilyLinks } from "./FamilyLinks.js";
export { MARK_DEFS } from "./mark-defs.js";
export { Mark, MarkDefs } from "./Mark.js";
export { SiteFooter } from "./SiteFooter.js";
export { SiteHeader } from "./SiteHeader.js";
