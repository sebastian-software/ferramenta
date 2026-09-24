import { type FamilyTool } from "./family.js";
/**
 * The words a screen reader hears after a member's name when its link leads to
 * a repository instead of a site. Renders nothing for a member with a site.
 * Styled by `.fam-sr-only` in `chrome.css`.
 */
export declare function RepoNote({ tool }: {
    tool: FamilyTool;
}): import("react").JSX.Element | null;
