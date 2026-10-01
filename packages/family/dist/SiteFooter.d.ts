import type { ReactNode } from "react";
export type SiteFooterProps = {
    /**
     * The family member this site belongs to, e.g. "ferroni". Its own entry is
     * omitted, and the lockup links to the family site instead of this
     * site's root. Leave it out on ferramenta.dev itself.
     */
    current?: string;
    /** The small print under the columns. */
    legal?: ReactNode;
    /**
     * The element to render. `"footer"` (the default) is the contentinfo
     * landmark. Pass `"div"` when the host already provides one, or when the
     * chrome is shown as a specimen (the kit), so the page does not end up with
     * two. The classes, and therefore the styling, are the same either way.
     */
    as?: "div" | "footer";
    /**
     * The family columns. `"full"` (the default) lists every member with the
     * registry's `job`; `"short"` with its `shortJob`; `"none"` drops the
     * columns, for a page that is itself the family's index (ferramenta.dev).
     */
    members?: "full" | "none" | "short";
};
/** The dark footer: lockup, the two tiers from the registry, the workshop's links. */
export declare function SiteFooter({ as, current, legal, members, }?: SiteFooterProps): import("react").JSX.Element;
