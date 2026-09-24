import { type FamilyTool, leadsToRepo } from "./family.js";

/**
 * The words a screen reader hears after a member's name when its link leads to
 * a repository instead of a site. Renders nothing for a member with a site.
 * Styled by `.fam-sr-only` in `chrome.css`.
 */
export function RepoNote({ tool }: { tool: FamilyTool }) {
  return leadsToRepo(tool) ? <span className="fam-sr-only"> (GitHub repository)</span> : null;
}
