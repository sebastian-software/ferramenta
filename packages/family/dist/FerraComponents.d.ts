import { type ComponentPropsWithoutRef } from "react";
import type { FerraActionProps, FerraBarsProps, FerraCodeProps, FerraEngineCatalogProps, FerraFooterProps, FerraHeaderProps, FerraHeroProps, FerraInstrumentProps, FerraLogoProps, FerraMarkProps, FerraSectionProps, FerraTableProps } from "./FerraTypes.js";
/** One authored light scheme; the stylesheet has no global reset. */
export declare function FerraPage({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export declare function FerraMark({ product, label, size, className }: FerraMarkProps): import("react").JSX.Element;
export declare function FerraLogo({ product, className, ...props }: FerraLogoProps): import("react").JSX.Element;
export declare function FerraInstrument({ product, label, className }: FerraInstrumentProps): import("react").JSX.Element;
export declare function FerraHeader({ product, home, nav, navLabel, actions, }: FerraHeaderProps): import("react").JSX.Element;
export declare function FerraFooter({ product, home, children }: FerraFooterProps): import("react").JSX.Element;
/** Place before the footer; original outside brands belong on a flat, light ground. */
export declare function FerraWorkshop({ id, className, }?: Pick<ComponentPropsWithoutRef<"section">, "className" | "id">): import("react").JSX.Element;
export declare function FerraHero({ product, title, what, children, actions, art }: FerraHeroProps): import("react").JSX.Element;
export declare function FerraSection({ title, label, intro, surface, children, className, id, ...props }: FerraSectionProps): import("react").JSX.Element;
export declare function FerraColumns({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export declare function FerraAction({ variant, className, children, ...props }: FerraActionProps): import("react").JSX.Element;
/** Registry facts remain authoritative even when a preview overrides the destinations. */
export declare function FerraEngineCatalog({ hrefFor }: FerraEngineCatalogProps): import("react").JSX.Element;
/** Native children preserve the consumer's column and row header relationships. */
export declare function FerraTable({ caption, children }: FerraTableProps): import("react").JSX.Element;
export declare function FerraCode({ caption, file, children }: FerraCodeProps): import("react").JSX.Element;
/** A reading surface for the actual output of a worked example. */
export declare function FerraSpecimen({ caption, children }: FerraTableProps): import("react").JSX.Element;
export declare function FerraBars({ caption, items, children }: FerraBarsProps): import("react").JSX.Element;
