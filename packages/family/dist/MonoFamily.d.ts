import type { ReactNode } from "react";
import { type FamilyTool } from "./family.js";
export type MonoEngineCatalogProps = {
    /** Where each engine leads; its own site, else its repository. */
    hrefFor?: (tool: FamilyTool) => string;
};
/** Every engine in the registry, in editorial order, each on its own plate. */
export declare function MonoEngineCatalog({ hrefFor }: MonoEngineCatalogProps): import("react").JSX.Element;
/** The applications, each on a light card under its own logo, in its own colors. */
export declare function MonoApplications(): import("react").JSX.Element;
/** The workshop's two brands, unchanged, on a light ground. */
export declare function MonoWorkshop({ children }: {
    children?: ReactNode;
}): import("react").JSX.Element;
