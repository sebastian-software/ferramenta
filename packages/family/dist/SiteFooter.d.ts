import type { ReactNode } from "react";
export type SiteFooterProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its own entry is
     * omitted, and the lockup links to the family site instead of this
     * site's root. Leave it out on ferramenta.dev itself.
     */
    current?: string;
    /**
     * Which line the site belongs to. "family" (the default) lists the family
     * members; "company" is for the tools that share the workshop but not the
     * engines — they carry the company links alone (decision D2 of the 2026-09
     * family audit).
     */
    line?: "company" | "family";
    /** The small print under the columns. */
    legal?: ReactNode;
    /**
     * The element to render. `"footer"` (the default) is the contentinfo
     * landmark. Pass `"div"` when the host already provides one — an Ardo site
     * rendering this inside `<ArdoFooter>` — so the page does not end up with
     * two. The classes, and therefore the styling, are the same either way.
     */
    as?: "div" | "footer";
    /**
     * The job line under each member: `"full"` (the default) is the registry's
     * `job`; `"short"` is its `shortJob`, for the family site, where the page
     * above already carries every full job and the footer only has to point.
     */
    jobs?: "full" | "short";
};
/** Steel-plate footer: lockup, family columns from the registry, company links. */
export declare function SiteFooter({ as, current, jobs, legal, line, }?: SiteFooterProps): import("react").JSX.Element;
