import { jsx as _jsx } from "react/jsx-runtime";
import { leadsToRepo } from "./family.js";
/**
 * The words a screen reader hears after a member's name when its link leads to
 * a repository instead of a site. Renders nothing for a member with a site.
 * Styled by `.fam-sr-only` in `chrome.css`.
 */
export function RepoNote({ tool }) {
    return leadsToRepo(tool) ? _jsx("span", { className: "fam-sr-only", children: " (GitHub repository)" }) : null;
}
