import type { ReactNode } from "react";
export type SiteFooterProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its own entry is
     * de-emphasized, and the lockup links to the family site instead of this
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
};
/** Steel-plate footer: lockup, family columns from the registry, company links. */
export declare function SiteFooter({ current, legal, line, }?: SiteFooterProps): import("react").JSX.Element;
