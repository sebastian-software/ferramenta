import { type ReactNode } from "react";
import { type FamilyTool } from "./family.js";
export type EngineCatalogProps = {
    /** A member whose own site this is: it is left out of the catalog. */
    current?: string;
    /** The engines to show. Defaults to every engine in the registry, in catalog order. */
    tools?: FamilyTool[];
};
/**
 * The engine catalog: one row per engine, each with its name plate. Every
 * engine works on its own; where two fit together, the row says so.
 */
export declare function EngineCatalog({ current, tools }?: EngineCatalogProps): import("react").JSX.Element;
export type ApplicationsBandProps = {
    id?: string;
    title?: ReactNode;
    intro?: ReactNode;
    /** A member whose own site this is: it is left out. */
    current?: string;
};
/**
 * The applications, each on a light card under its own logo and color: the
 * one place the family shows a brand that is not its own. An application that
 * runs on family engines leads and names them; one that stands alone is from
 * the same workshop, and says no more than that.
 */
export declare function ApplicationsBand({ current, id, intro, title, }?: ApplicationsBandProps): import("react").JSX.Element | null;
